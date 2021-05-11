const { https } = require('firebase-functions');
const { default: next } = require('next');

const server = next({
  dev: false,
  conf: { distDir: '.next' },
});

const nextjsHandle = server.getRequestHandler();

exports.nextServer = https.onRequest((req, res) => {
  return server.prepare().then(() => nextjsHandle(req, res));
});
