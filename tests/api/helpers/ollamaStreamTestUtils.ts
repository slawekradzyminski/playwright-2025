type OllamaGenerateStreamChunk = {
  model?: string;
  response?: string;
  thinking?: string;
  done?: boolean;
};

type OllamaToolCall = {
  function?: {
    name?: string;
    arguments?: unknown;
  };
};

type OllamaChatMessage = {
  role?: string;
  content?: string;
  thinking?: string;
  tool_calls?: OllamaToolCall[];
  tool_name?: string;
};

type OllamaChatStreamChunk = {
  model?: string;
  message?: OllamaChatMessage;
  done?: boolean;
};

const DATA_PREFIX = 'data:';

export const parseEventStream = <T>(responseText: string): T[] => {
  const events: string[] = [];
  const currentEventLines: string[] = [];

  for (const rawLine of responseText.split('\n')) {
    const trimmedLine = rawLine.trim();

    if (trimmedLine === '') {
      if (currentEventLines.length > 0) {
        events.push(currentEventLines.join('\n'));
        currentEventLines.length = 0;
      }
      continue;
    }

    if (trimmedLine.startsWith(DATA_PREFIX)) {
      currentEventLines.push(trimmedLine.slice(DATA_PREFIX.length).trimStart());
    }
  }

  if (currentEventLines.length > 0) {
    events.push(currentEventLines.join('\n'));
  }

  return events.filter((event) => event !== '[DONE]').map((event) => JSON.parse(event) as T);
};

export const collectGenerateResponse = (chunks: OllamaGenerateStreamChunk[]): string =>
  chunks
    .map((chunk) => chunk.response ?? '')
    .join('');

export const collectChatContent = (chunks: OllamaChatStreamChunk[]): string =>
  chunks
    .map((chunk) => chunk.message?.content ?? '')
    .join('');

export type { OllamaChatStreamChunk, OllamaGenerateStreamChunk, OllamaToolCall };
