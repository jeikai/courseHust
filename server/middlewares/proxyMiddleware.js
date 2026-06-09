const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  target: 'http://example.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy': ''
  },
});

module.exports = proxy;
