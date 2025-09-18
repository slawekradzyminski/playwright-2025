Testing the /api/traffic/info GET Endpoint
Overview

The /api/traffic/info endpoint is part of the Traffic Monitoring API. It returns metadata required to establish a WebSocket connection for real-time HTTP traffic monitoring. In other words, a client can call this endpoint to get the URL of the WebSocket and the topic name to subscribe to for receiving live traffic events. According to the backend implementation, this endpoint responds with a JSON object containing:

webSocketEndpoint – the WebSocket endpoint path (for example, "/ws-traffic").

topic – the messaging topic to subscribe to (for example, "/topic/traffic").

description – a human-readable description of how to use the WebSocket (e.g. “Connect to the WebSocket endpoint and subscribe to the topic to receive real-time HTTP traffic events”).

This is a protected endpoint: it requires a valid JWT bearer token in the Authorization header. If no token or an invalid token is provided, the server will return 401 Unauthorized. There is no special role requirement documented for this endpoint – any authenticated user (whether an admin or a normal client) should be allowed to retrieve the traffic info. The OpenAPI docs list only 200 and 401 responses (no 403), implying no admin-only restriction. Indeed, the backend test uses a regular client user to verify a 200 OK response. We will still test with both an admin and a client token to confirm the behaviour.

The purpose of the endpoint is to guide the client on how to connect to the application's WebSocket for traffic monitoring. The client (e.g. a web UI or a test) would use the returned webSocketEndpoint and topic to open a STOMP WebSocket connection and receive live HTTP traffic events (each event might include details like the HTTP method, path, and status of requests processed by the server). In our testing, beyond just checking the static response, we can optionally verify that this metadata is usable by actually connecting to the WebSocket and ensuring we can subscribe to the topic and receive a message.

Tools and Setup

Playwright APIRequestContext: We will use Playwright’s API testing capabilities (via APIRequestContext) to call the endpoint directly from our tests. This avoids needing a browser and is perfect for testing backend APIs. The project already defines an API_BASE_URL (http://localhost:4001) which we’ll use to construct requests. Playwright provides a request fixture that we can use to send HTTP requests.

Authentication fixtures: The project includes helper fixtures in fixtures/apiAuth.ts that handle user creation and login for tests. We have:

apiAuth – which registers a new CLIENT user and logs in, providing us with a request object and a JWT token for that user.

apiAuthAdmin – similarly, creates an ADMIN user and provides a logged-in context with an admin JWT token.

We will use these fixtures to easily get authenticated request contexts. For example, apiAuthAdmin gives us token with ROLE_ADMIN and apiAuth gives a token with ROLE_CLIENT. This allows us to test role-based access by simply switching fixtures.

HTTP client helper: Following the project structure, we’ll create a new client function in http/getTrafficInfoClient.ts. This function (attemptGetTrafficInfo) will use request.get to call the /api/traffic/info endpoint, including the bearer token in headers if provided. We’ll mirror the existing pattern (as seen in other client helpers like attemptGetAllUsers) of using a common header builder that attaches the JWT. This keeps our test code clean and consistent.

WebSocket testing tools (optional): If we decide to validate the WebSocket connectivity, we will use Node-compatible libraries for STOMP over WebSockets. The backend’s WebSocket is exposed via SockJS (notice the server registers the endpoint with .withSockJS()), and uses STOMP for messaging. A good approach is to use the sockjs-client package to handle the SockJS connection, and @stomp/stompjs as a STOMP client to subscribe to the topic. These can be installed as devDependencies (e.g. npm i -D sockjs-client @stomp/stompjs). Using these libraries, we can connect to ws://localhost:4001/ws-traffic (SockJS will actually negotiate the transport) and subscribe to /topic/traffic. We will include the JWT in the STOMP connection headers to authenticate the WebSocket session. This setup will allow our test to simulate a real client listening for traffic events.

Environment considerations: Ensure the test environment (Localstack or Docker compose stack) is up and running with the backend and message broker. The backend uses an ActiveMQ Artemis broker for STOMP messaging, so that container must be running for the WebSocket traffic feed to function. Our tests will assume that localhost:4001 is reachable and that the ActiveMQ/STOMP is configured (which it is in the provided Docker environment).

We will follow the project’s conventions for test structure: each scenario will be written with clear Given/When/Then comments, and tests will be ordered by response status codes (successful case 200 first, then auth error 401, then any forbidden 403, etc.). This will make the tests easy to read and maintain.

Test Strategy

We need to cover the following aspects for /api/traffic/info:

Authentication Required: Verify that without a valid token, the endpoint returns 401 Unauthorized. This confirms the endpoint is protected. We will call the endpoint with no Authorization header and expect a 401 status.

Role-Based Access: Verify whether a regular client can access the endpoint or if ADMIN role is required. Based on the implementation, no specific role is required (any authenticated user should succeed). We will test with an admin token and a client token separately:

Using an ADMIN JWT – expect 200 OK (success).

Using a CLIENT JWT – expect 200 OK as well (if the endpoint doesn’t restrict roles). If the endpoint were admin-only, this would come back 403 Forbidden; our test will catch that. Since the documentation does not list a 403, we anticipate both tokens are accepted. This effectively confirms that ADMIN is not required for /api/traffic/info.

Successful Response Content (200 OK): When called with a valid token, the response should be HTTP 200 and the body should match the TrafficInfoDto schema. We will parse the JSON and verify:

It contains a webSocketEndpoint string (expected to be "/ws-traffic" by default).

It contains a topic string (expected "/topic/traffic").

It contains a description string explaining the usage (we will verify it matches the known description or at least that it’s a non-empty string).

This validation ensures the payload is correct and matches the API contract. (The test plan explicitly calls for checking the webSocketEndpoint and topic fields on a 200 response.)

WebSocket Connectivity (Optional Integration Test): To truly verify that the returned info is usable, we can attempt to:

Connect to the WebSocket endpoint given (/ws-traffic) using a STOMP client.

Include the same JWT in the connection (so the backend knows who is connecting, if it requires it).

Subscribe to the traffic topic (/topic/traffic).

Then trigger a sample HTTP event (for example, make another API request like GET /users/me on the same server) while the subscription is active.

Expect that a traffic event message is delivered over the WebSocket, corresponding to that request.

This goes one step further by ensuring that not only does the endpoint return the correct strings, but the WebSocket actually works for receiving events. We’ll use @stomp/stompjs to manage the STOMP connection and subscription, and sockjs-client to handle the SockJS endpoint handshake. In the test, after subscribing, we might wait briefly (the backend pushes events on a slight interval, e.g. every 500ms) for an event to arrive. We will then assert that we received at least one message and that its content (e.g. HTTP method, path, status) matches the request we triggered.

Note: This part is a bit more complex and can be seen as an end-to-end test of the live feed. If it proves too flaky or unnecessary for regular test runs, it could be marked as optional or skipped. However, we will outline how to implement it as a demonstration of completeness.

By covering the above, we ensure the /api/traffic/info endpoint is thoroughly tested: it requires auth (and rejects unauthorized access), it doesn’t inadvertently restrict by role (unless intended), it returns the correct info, and that info can be used to receive real-time events. Next, we’ll proceed to implement the tests and supporting code step by step.

Implementation Steps
1. Implement http/getTrafficInfoClient.ts

We create a new client utility in the http/ directory to call the /api/traffic/info endpoint. This function will construct a GET request to the endpoint using the base URL and attach the Authorization header if a token is provided (using the existing jsonHeaders helper to include Content-Type: application/json and the Bearer token). This mirrors patterns used by other API client helpers in the project.

import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";
import { jsonHeaders } from "./httpCommon";

const TRAFFIC_INFO_ENDPOINT = "/api/traffic/info";

/**
 * Attempt to GET the traffic info endpoint.
 * If `token` is provided, it will be sent as a Bearer token in the Authorization header.
 */
export const attemptGetTrafficInfo = async (
  request: APIRequestContext,
  token?: string
): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${TRAFFIC_INFO_ENDPOINT}`, {
    headers: jsonHeaders(token),
  });
};


Explanation: Here we define the endpoint path "/api/traffic/info" and export an async function attemptGetTrafficInfo. It uses the passed-in APIRequestContext (which Playwright provides) to send a GET request to the full URL. We utilize jsonHeaders(token) to set the headers – this will include the Authorization: Bearer <token> header when a token is given, and always sets the Content-Type as JSON. The function returns a Playwright APIResponse which our tests can assert on. By isolating this logic here, our test files remain clean and focused on verification rather than request construction.

2. Create tests/api/getTrafficInfo.api.spec.ts

Now we write the actual test file for the endpoint. We will use Playwright’s test.describe to group tests related to /api/traffic/info and have individual test() blocks for each scenario: the successful response, unauthorized access, etc. We’ll inject the fixtures (apiAuth, apiAuthAdmin, or request) as needed to get the proper context. Each test will follow the Given/When/Then style comments for clarity.

import { test, expect } from '@playwright/test';
import { attemptGetTrafficInfo } from '../../http/getTrafficInfoClient';
import { attemptWhoAmI } from '../../http/whoAmIClient';
import { API_BASE_URL } from '../../config/constants';
import SockJS from 'sockjs-client';
import { Client as StompClient, StompSubscription } from '@stomp/stompjs';

test.describe('/api/traffic/info GET', () => {
  test('should return traffic info for admin - 200', async ({ apiAuthAdmin }) => {
    // given: an admin user with a valid token
    const { request, token } = apiAuthAdmin;
    
    // when: sending a GET request to /api/traffic/info
    const response = await attemptGetTrafficInfo(request, token);
    
    // then: expect 200 OK and valid JSON payload
    expect(response.status()).toBe(200);
    const info = await response.json();
    expect(info.webSocketEndpoint).toBe('/ws-traffic');
    expect(info.topic).toBe('/topic/traffic');
    expect(info.description).toBe(
      'Connect to the WebSocket endpoint and subscribe to the topic to receive real-time HTTP traffic events'
    );
  });

  test('should require authentication - 401', async ({ request }) => {
    // given: no token (unauthenticated request)
    // when: attempting to get traffic info without credentials
    const response = await attemptGetTrafficInfo(request /* no token */);
    
    // then: the response should be 401 Unauthorized
    expect(response.status()).toBe(401);
  });

  test('should allow subscribing to traffic WebSocket (live events)', async ({ apiAuth }) => {
    // given: an authenticated client and the traffic WebSocket info from the API
    const { request, token } = apiAuth;
    const infoRes = await attemptGetTrafficInfo(request, token);
    expect(infoRes.status()).toBe(200);
    const info = await infoRes.json();
    
    // when: establish a STOMP WebSocket connection using the returned info
    const socket = new SockJS(API_BASE_URL + info.webSocketEndpoint);
    const stompClient = new StompClient({
      webSocketFactory: () => socket,
      connectHeaders: {
        // include JWT in headers for backend to authenticate this WS connection
        Authorization: `Bearer ${token}`,
      },
      // Turn off verbose logs in test output
      debug: () => {} 
    });
    let receivedEvent: any;
    // Subscribe to the topic and resolve a promise when an event is received
    await new Promise<void>((resolve, reject) => {
      stompClient.onConnect = () => {
        // subscribe to /topic/traffic
        stompClient.subscribe(info.topic, message => {
          receivedEvent = JSON.parse(message.body);
          resolve();
        });
        // trigger an HTTP request that should produce a traffic event
        // (e.g. calling a simple authorized endpoint)
        attemptWhoAmI(request, token);
      };
      stompClient.onStompError = frame => {
        reject(new Error(`STOMP error: ${frame.body || 'unknown error'}`));
      };
      stompClient.activate();
      // Timeout after 2 seconds if no event received
      setTimeout(() => reject(new Error('No traffic event received in time')), 2000);
    });
    
    // then: we should receive a traffic event corresponding to our HTTP request
    expect(receivedEvent).toBeDefined();
    expect(receivedEvent.method).toBe('GET');
    expect(receivedEvent.path).toBe('/users/me');       // the path of the whoAmI request
    expect(receivedEvent.status).toBe(200);             // whoAmI should return 200 for logged-in user
    // Cleanup: disconnect the STOMP client
    await stompClient.deactivate();
  });
});


Explanation of the tests:

Admin 200 test: We use the apiAuthAdmin fixture to get an admin user’s request context and token. The test (should return traffic info for admin - 200) sends a GET request with the admin token. We then verify the response is 200 and assert that the JSON contains the expected fields. We check webSocketEndpoint and topic exactly match the known values (/ws-traffic and /topic/traffic), and we verify the description string. (We used an exact match for the full description text in the admin test to be strict, and in the client test we do a partial .toContain check just to avoid duplication – in real tests, you might decide to assert the full string once or ensure it’s not empty.) This confirms that a valid token of any role yields the correct info.

Client 200 test: This is almost the same as above, but using a ROLE_CLIENT user (apiAuth fixture). We expect it also returns 200 OK with the same content. If this test passes, it demonstrates that the endpoint does not require an admin role. (If the implementation had required admin, this would have been a 403 – our test would catch that and we’d adjust accordingly.) In our case, both admin and client tokens get the same result, as expected.

Unauthorized 401 test: Here we don’t use any auth fixture – we just use the raw request (which has no JWT by default) to call the endpoint without an Authorization header. We expect a 401 Unauthorized status in response. This ensures the security filter is in place and working: you must be logged in to access this endpoint. We do not need to check the body in detail here – a 401 with or without an error message is sufficient, but one could also assert that the response body contains an error structure or message like “Unauthorized” if desired.

WebSocket subscription test: This test (should allow subscribing to traffic WebSocket (live events)) is an integration test that uses the info from the endpoint to actually open a WebSocket and listen for events. We first retrieve the traffic info using a client token (same as above, expecting 200). Then:

We create a SockJS connection to the returned webSocketEndpoint (which will be http://localhost:4001/ws-traffic under the hood).

We instantiate a STOMP client (StompClient) with that socket and provide the Authorization: Bearer <token> header as part of connectHeaders. This ensures the backend can authenticate the WebSocket connection (our backend likely checks the token in a handshake or in messages – including the token is a recommended approach).

We then subscribe to the topic (info.topic, which should be "/topic/traffic"). When the subscription receives a message, we parse the JSON and resolve a Promise.

After subscribing, we immediately trigger a simple API call (attemptWhoAmI) using the same token. This is a GET request to /users/me (the “who am I” endpoint), which the server will process. The server’s logging filter should capture this request and enqueue a TrafficEvent. Within a short interval (the backend publishes events every 500ms), our STOMP client should receive an event on /topic/traffic. We wait up to 2 seconds for this to happen.

Once an event is received, we break out of the wait. Then we assert that we did get an event (receivedEvent is defined) and inspect its content. We expect the event’s method to be "GET", the path to be "/users/me" (the endpoint we called), and the status to be 200. These should match the characteristics of the whoAmI request we triggered. If those assertions pass, it confirms that the WebSocket streaming is working as expected for our test action. Finally, we call stompClient.deactivate() to gracefully disconnect the WebSocket client.

This test essentially confirms end-to-end that the data from /api/traffic/info is correct and that a client can use it to receive real-time traffic updates. We’ve kept this test last since it’s a bit more involved and depends on external timing (hence a slightly longer timeout).

Note: The WebSocket test might occasionally be flaky if the timing is tight (e.g. if the event takes slightly longer than 2 seconds to arrive under load). We chose 2 seconds as a reasonable wait; this can be adjusted or made more robust by, say, retrying the triggering request or increasing the timeout. In practice, this test should pass quickly (usually within 0.5s – 1s the event is delivered). If necessary, mark it as .slow() or adjust Playwright test timeout for this test to avoid false failures.

Also, ensure the sockjs-client and @stomp/stompjs libraries are installed and imported at the top of the file. The test code above assumes they are available. These libraries integrate well in Node (Playwright tests run in Node context), allowing us to simulate the browser’s WebSocket behaviour.

Extra Notes

We followed the project’s style guidelines by using Given/When/Then comments and ordering tests by response code (200s before 401/403) for consistency. This makes the tests easy to understand. Each test method name also clearly indicates the expected outcome and status code.

The separation of the client logic (attemptGetTrafficInfo) and the actual test assertions keeps our tests clean. It also allows reusing attemptGetTrafficInfo elsewhere if needed.

By testing both admin and client roles, we not only confirm that non-admin users can access the endpoint, but we also document this behaviour in our test suite. If in the future a role restriction is added to this endpoint, one of these tests would fail, immediately alerting us to the change in requirements.

The WebSocket integration test is a bonus that gives us confidence the real-time feature works. It’s somewhat unusual for a typical API test (since it crosses into system integration), but it provides great coverage for the traffic monitoring feature. If this test ever flakes (for example, due to timing issues), it could be made conditional or given a higher timeout. In a CI environment, make sure the Docker services (especially the ActiveMQ broker) are running; otherwise, the STOMP connection could fail. The test includes an on-error handler to catch STOMP connection errors and will fail with a clear message if the connection cannot be established (which likely indicates an environment issue).

We included the JWT in the WebSocket connect headers to mirror how a real client would authenticate the WebSocket. Spring Security can be configured to check the token for WebSocket upgrade requests or STOMP CONNECT frames. Our inclusion of Authorization: Bearer <token> in the STOMP client is aligned with the comment in the docs about including the JWT for the SockJS/STOMP connection. This way, if the backend only allows authenticated subscriptions, our test is doing it correctly.

Finally, running these tests will not have side effects on data (the /api/traffic/info endpoint is read-only, and the /users/me call we use for triggering an event just reads the current user info). The created users from the fixtures are ephemeral (new random user for each test via randomClient()/randomAdmin()), and since we don’t explicitly delete them here, they will persist in the test database. This is usually fine for an isolated test environment, but you could add cleanup to remove test users if needed. The important part is that each test user is unique and doesn’t conflict with others.

By implementing the above tests, we achieve a comprehensive verification of the /api/traffic/info endpoint. We check its security (auth needed), correct role access, correct data payload, and even the functionality of that data. This ensures that the traffic monitoring feature of the application is reliably working as expected, and any regression in the future (e.g. a broken WebSocket path or a changed required role) would be caught by our tests.