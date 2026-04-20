import { fail } from './utils.mjs';

const DEFAULT_PAGE = '0';
const DEFAULT_SIZE = '10';

export function parseArgs(argv) {
  const args = {
    page: DEFAULT_PAGE,
    size: DEFAULT_SIZE,
    format: 'markdown',
    raw: false,
    showHeaders: false,
    showBodies: true,
    unsafeShowSecrets: false,
    maxStringLength: 500
  };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    switch (arg) {
      case '--session':
        args.clientSessionId = readValue(argv, ++index, arg);
        break;
      case '--method':
        args.method = readValue(argv, ++index, arg);
        break;
      case '--status':
        args.status = readValue(argv, ++index, arg);
        break;
      case '--path':
        args.pathContains = readValue(argv, ++index, arg);
        break;
      case '--text':
        args.text = readValue(argv, ++index, arg);
        break;
      case '--from':
        args.from = readValue(argv, ++index, arg);
        break;
      case '--to':
        args.to = readValue(argv, ++index, arg);
        break;
      case '--page':
        args.page = readValue(argv, ++index, arg);
        break;
      case '--size':
        args.size = readValue(argv, ++index, arg);
        break;
      case '--correlation-id':
        args.correlationId = readValue(argv, ++index, arg);
        break;
      case '--format':
        args.format = readValue(argv, ++index, arg);
        if (!['markdown', 'json'].includes(args.format)) {
          fail(`Unsupported --format value: ${args.format}`);
        }
        break;
      case '--max-string-length':
        args.maxStringLength = Number(readValue(argv, ++index, arg));
        if (!Number.isInteger(args.maxStringLength) || args.maxStringLength < 1) {
          fail('--max-string-length must be a positive integer.');
        }
        break;
      case '--show-headers':
        args.showHeaders = true;
        break;
      case '--show-bodies':
        args.showBodies = true;
        break;
      case '--no-bodies':
        args.showBodies = false;
        break;
      case '--raw':
        args.raw = true;
        break;
      case '--unsafe-show-secrets':
        args.unsafeShowSecrets = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        fail(`Unknown option: ${arg}`);
    }
  }

  return args;
}

function readValue(argv, index, flag) {
  const value = argv[index];

  if (!value || value.startsWith('--')) {
    fail(`${flag} requires a value.`);
  }

  return value;
}

function printHelp() {
  console.log(`Usage: npm run traffic:logs -- [options]

Options:
  --session <clientSessionId>       Filter by X-Client-Session-Id
  --method <method>                 Filter by HTTP method
  --status <number>                 Filter by response status
  --path <text>                     Filter by pathContains
  --text <text>                     Free-text search
  --from <ISO instant>              Start timestamp filter
  --to <ISO instant>                End timestamp filter
  --page <number>                   Page number, default 0
  --size <number>                   Page size, default 10
  --correlation-id <id>             Fetch one traffic log
  --format <markdown|json>          Output format, default markdown
  --show-headers                    Include redacted headers
  --no-bodies                       Omit request and response bodies
  --raw                             Alias for redacted JSON output
  --unsafe-show-secrets             Disable redaction
`);
}
