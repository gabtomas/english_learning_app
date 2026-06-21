const { spawn } = require('child_process');
const path = require('path');

console.clear();
console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[35m%s\x1b[0m', '       🚀  Launching DevLingua Application  🚀         ');
console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log(`
🎨  Vite Frontend:   \x1b[32mhttp://localhost:5173\x1b[0m (Opening default browser...)
`);
console.log('\x1b[33m%s\x1b[0m', 'Starting dev server, please wait...\n');

// Start frontend with auto-open flag
const frontend = spawn('npm', ['run', 'dev', '--', '--open'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true,
});

// Clean up processes on exit/ctrl-c
const cleanExit = () => {
  console.log('\n\x1b[31m%s\x1b[0m', 'Shutting down DevLingua server...');
  try {
    frontend.kill('SIGINT');
  } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
