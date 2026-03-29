import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * dev.js Shim
 * This file allows running 'node dev' to start the server.
 * - In development (default): Starts via 'tsx' for hot-reloading.
 * - In production: Starts the pre-built 'dist/index.cjs' bundle.
 */
const isProduction = process.env.NODE_ENV === 'production';
const command = isProduction ? 'node' : 'npx';
const args = isProduction ? ['dist/index.cjs'] : ['tsx', 'server/index.ts'];

console.log(`Starting ${isProduction ? 'production' : 'development'} server via dev.js shim...`);

const child = spawn(command, args, {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
  env: { 
    ...process.env, 
    NODE_ENV: isProduction ? 'production' : 'development' 
  }
});

child.on('close', (code) => {
  process.exit(code ?? 0);
});
