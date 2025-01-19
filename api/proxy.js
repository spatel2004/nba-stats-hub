import { createProxyMiddleware } from 'http-proxy-middleware';
const urlParams = new URLSearchParams(window.location.proxy);
const userInput = urlParams.get('userInput');

export default function handler(req, res) {
  const proxy = createProxyMiddleware({
    target: `http://rest.nbaapi.com/api/PlayerDataTotals/query?playerName=${userInput}&season=2025`, // Replace with your API's URL
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // Remove `/api` if needed
    },
  });

  return proxy(req, res); // Proxy the request to the API
}
