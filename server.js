// Import required modules
const http = require('http');
const url = require('url');

// Create an HTTP server
const server = http.createServer((request, response) => {
  // Parse the requested URL
  const parsedUrl = url.parse(request.url, true);
  
  // Implement routing logic
  switch (parsedUrl.pathname) {
    case '/about':
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('About Page');
      console.log('About page accessed');
      break;
    case '/contact':
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('Contact Page');
      console.log('Contact page accessed');
      break;
    case '/products':
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('Products Page');
      console.log('Products page accessed');
      break;
    case '/subscribe':
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('Subscribe Page');
      console.log('Subscribe page accessed');
      break;
    default:
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('Page Not Found');
      console.log('Page Not Found');
  }
});

// Set the server to listen on port 3000
server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
