export function renderMarkdown(payload, args) {
  if (Array.isArray(payload.content)) {
    return renderListMarkdown(payload, args);
  }

  return renderEntryMarkdown(payload, args, '# Traffic Log');
}

function renderListMarkdown(page, args) {
  const lines = [
    '# Traffic Logs',
    '',
    `- totalElements: ${page.totalElements}`,
    `- totalPages: ${page.totalPages}`,
    `- pageNumber: ${page.pageNumber}`,
    `- pageSize: ${page.pageSize}`
  ];

  if (page.content.length === 0) {
    lines.push('', 'No matching traffic logs.');
    return lines.join('\n');
  }

  page.content.forEach((entry, index) => {
    lines.push(
      '',
      renderEntryMarkdown(entry, args, `## ${index + 1}. ${entry.method} ${entry.path} -> ${entry.status}`)
    );
  });

  return lines.join('\n');
}

function renderEntryMarkdown(entry, args, title) {
  const lines = [
    title,
    '',
    `- correlationId: ${entry.correlationId}`,
    `- timestamp: ${entry.timestamp}`,
    `- clientSessionId: ${entry.clientSessionId}`,
    `- durationMs: ${entry.durationMs}`,
    `- requestContentType: ${entry.requestContentType}`,
    `- responseContentType: ${entry.responseContentType}`,
    `- requestBodyTruncated: ${entry.requestBodyTruncated}`,
    `- responseBodyTruncated: ${entry.responseBodyTruncated}`
  ];

  if (args.showHeaders) {
    lines.push('- requestHeaders:', fencedJson(entry.requestHeaders));
    lines.push('- responseHeaders:', fencedJson(entry.responseHeaders));
  }

  if (args.showBodies) {
    lines.push('- requestBody:', fencedJson(entry.requestBody));
    lines.push('- responseBody:', fencedJson(entry.responseBody));
  }

  return lines.join('\n');
}

function fencedJson(value) {
  return ['```json', JSON.stringify(value, null, 2), '```'].join('\n');
}
