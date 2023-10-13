const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    let filePath = path.join(__dirname, 'views', (pathname === '/' ? 'index.html' : pathname.slice(1) + '.html'));


    console.log('Request URL:', request.url);
    console.log('File Path:', filePath);

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('Page Not Found');
        } else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        }
    });
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
