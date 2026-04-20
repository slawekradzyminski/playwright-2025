export function fail(message) {
  console.error(message);
  process.exit(1);
}

export function parseJson(responseText) {
  try {
    return JSON.parse(responseText);
  } catch (error) {
    fail(`Traffic logs response was not valid JSON: ${error.message}`);
  }
}
