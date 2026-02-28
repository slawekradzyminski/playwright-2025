import type { APIResponse } from '@playwright/test';
import type { ChatResponseDto, GenerateResponseDto } from '../../../types/ollama';

const parseJsonLines = (rawBody: string): unknown[] => {
  const parsed: unknown[] = [];
  const sseEvents = rawBody.split(/\r?\n\r?\n/);

  for (const eventBlock of sseEvents) {
    if (!eventBlock.trim()) {
      continue;
    }

    const dataLines = eventBlock
      .split(/\r?\n/)
      .filter((line) => line.trim().startsWith('data:'))
      .map((line) => line.replace(/^\s*data:\s?/, ''));

    if (dataLines.length > 0) {
      const payload = dataLines.join('\n').trim();
      if (!payload || payload === '[DONE]') {
        continue;
      }
      try {
        parsed.push(JSON.parse(payload));
        continue;
      } catch {
        // Ignore malformed event payload and continue scanning.
      }
    }

    // Fallback for NDJSON streams where each line is a standalone JSON object.
    for (const line of eventBlock.split(/\r?\n/)) {
      const candidate = line.trim();
      if (!candidate || candidate === '[DONE]') {
        continue;
      }
      try {
        parsed.push(JSON.parse(candidate));
      } catch {
        // Ignore non-JSON metadata lines.
      }
    }
  }

  return parsed;
};

const assertChunksParsed = (chunks: unknown[], rawBody: string): void => {
  if (chunks.length === 0) {
    throw new Error(`Unable to parse stream chunks. Raw response:\n${rawBody}`);
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const parseGenerateStream = async (
  response: APIResponse,
): Promise<{ chunks: GenerateResponseDto[]; responseText: string; thinkingText: string }> => {
  const rawBody = await response.text();
  const unknownChunks = parseJsonLines(rawBody);
  assertChunksParsed(unknownChunks, rawBody);

  const chunks = unknownChunks.filter((chunk): chunk is GenerateResponseDto => isRecord(chunk));
  const responseText = chunks
    .map((chunk) => (typeof chunk.response === 'string' ? chunk.response : ''))
    .join('');
  const thinkingText = chunks
    .map((chunk) => (typeof chunk.thinking === 'string' ? chunk.thinking : ''))
    .join('');

  return { chunks, responseText, thinkingText };
};

export const parseChatStream = async (
  response: APIResponse,
): Promise<{ chunks: ChatResponseDto[]; contentText: string; thinkingText: string }> => {
  const rawBody = await response.text();
  const unknownChunks = parseJsonLines(rawBody);
  assertChunksParsed(unknownChunks, rawBody);

  const chunks = unknownChunks.filter((chunk): chunk is ChatResponseDto => isRecord(chunk));
  const contentText = chunks
    .map((chunk) => (typeof chunk.message?.content === 'string' ? chunk.message.content : ''))
    .join('');
  const thinkingText = chunks
    .map((chunk) => (typeof chunk.message?.thinking === 'string' ? chunk.message.thinking : ''))
    .join('');

  return { chunks, contentText, thinkingText };
};
