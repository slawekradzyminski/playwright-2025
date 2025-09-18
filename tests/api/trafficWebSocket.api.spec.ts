import { test, expect } from '../../fixtures/apiAuth';
import { attemptGetTrafficInfo } from '../../http/getTrafficInfoClient';
import { attemptWhoAmI } from '../../http/whoAmIClient';
import { API_BASE_URL } from '../../config/constants';
import type { TrafficInfoDto } from '../../types/traffic';
import SockJS from 'sockjs-client';
import { Client as StompClient, StompSubscription } from '@stomp/stompjs';

const WHOAMI_PATH = '/users/me';
const EVENT_TIMEOUT_MS = 5000;
const SUBSCRIBE_GRACE_MS = 150; // short delay to ensure subscription is registered

type TrafficEvent = {
  method: string;
  path: string;
  status: number;
  durationMs?: number;
  timestamp?: string;
};

async function connectAndSubscribe(
  endpoint: string,
  topic: string,
  token: string
): Promise<{ client: StompClient; subscription: StompSubscription; events: TrafficEvent[] }> {
  const socket = new SockJS(API_BASE_URL + endpoint);
  const client = new StompClient({
    webSocketFactory: () => socket,
    connectHeaders: { Authorization: `Bearer ${token}` },
    debug: () => {}, 
  });

  const events: TrafficEvent[] = [];

  const subscription = await new Promise<StompSubscription>((resolve, reject) => {
    client.onConnect = () => {
      try {
        const sub = client.subscribe(topic, (msg) => {
          try {
            events.push(JSON.parse(msg.body) as TrafficEvent);
          } catch {
            // ignore malformed frames
          }
        });
        resolve(sub);
      } catch (e) {
        reject(e);
      }
    };

    client.onStompError = (frame) => {
      reject(new Error(`STOMP error: ${frame.body || 'unknown error'}`));
    };

    client.activate();
  });

  return { client, subscription, events };
}

function waitForEvent(
  eventsRef: TrafficEvent[],
  predicate: (e: TrafficEvent) => boolean,
  timeoutMs: number
): Promise<TrafficEvent> {
  const found = eventsRef.find(predicate);
  if (found) return Promise.resolve(found);

  return new Promise<TrafficEvent>((resolve, reject) => {
    const started = Date.now();
    const interval = setInterval(() => {
      const match = eventsRef.find(predicate);
      if (match) {
        clearInterval(interval);
        resolve(match);
        return;
      }
      if (Date.now() - started > timeoutMs) {
        clearInterval(interval);
        reject(new Error('Timeout waiting for matching traffic event'));
      }
    }, 50);
  });
}

test.describe('WebSocket Traffic Monitoring Integration', () => {
  test('should receive whoAmI traffic event via WebSocket subscription', async ({ apiAuth }) => {
    // given
    const { request, token } = apiAuth;
    const infoResponse = await attemptGetTrafficInfo(request, token);
    expect(infoResponse.ok()).toBeTruthy();
    const info: TrafficInfoDto = await infoResponse.json();

    const { client, subscription, events } = await connectAndSubscribe(
      info.webSocketEndpoint,
      info.topic,
      token
    );

    try {
      // give the broker a brief moment to register the subscription
      await new Promise((r) => setTimeout(r, SUBSCRIBE_GRACE_MS));

      // when: trigger a simple authorised request that should appear in traffic stream
      await attemptWhoAmI(request, token);

      // then: assert we receive the specific whoAmI event (GET /users/me, 200)
      const whoAmIEvent = await waitForEvent(
        events,
        (e) => e.method === 'GET' && e.path === WHOAMI_PATH && e.status === 200,
        EVENT_TIMEOUT_MS
      );

      expect(typeof whoAmIEvent.method).toBe('string');
      expect(typeof whoAmIEvent.path).toBe('string');
      expect(typeof whoAmIEvent.status).toBe('number');

    } finally {
      subscription.unsubscribe();
      await client.deactivate();
    }
  });
});
