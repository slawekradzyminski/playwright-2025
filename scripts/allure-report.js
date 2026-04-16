#!/usr/bin/env node

const { rmSync } = require('node:fs');
const { spawnSync } = require('node:child_process');

const testScript = process.argv[2] ?? 'test';
const testArgs = process.argv.slice(3);
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function runNpmScript(script, args = []) {
  const commandArgs = ['run', script];

  if (args.length > 0) {
    commandArgs.push('--', ...args);
  }

  console.log(`\n> ${npmCommand} ${commandArgs.join(' ')}`);

  const result = spawnSync(npmCommand, commandArgs, {
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    console.error(result.error.message);
    return 1;
  }

  if (result.signal) {
    console.error(`${script} stopped with signal ${result.signal}`);
    return 1;
  }

  return result.status ?? 0;
}

rmSync('allure-results', { recursive: true, force: true });
rmSync('allure-report', { recursive: true, force: true });

const testStatus = runNpmScript(testScript, testArgs);
const generateStatus = runNpmScript('allure:generate');

if (generateStatus !== 0) {
  process.exit(generateStatus);
}

const openStatus = runNpmScript('allure:open');

process.exit(testStatus || openStatus);
