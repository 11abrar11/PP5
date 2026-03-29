import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * dev.js Shim
 * This file allows running 'node dev' to start the development server,
 * which is helpful if your environment's "Run" button is hardcoded to that command.
 */
console.log('Starting development server via dev.js shim...');

const child = spawn('npx', ['tsx', 'server/index.ts'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
  env: { 
    ...process.env, 
    NODE_ENV: 'development' 
  }
});

child.on('close', (code) => {
  process.exit(code ?? 0);
});
