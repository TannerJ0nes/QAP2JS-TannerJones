const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

function createLogFiles() {
    const currentDate = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(`specific_route_logs_${currentDate}.txt`, '');
}

function initializeLogging() {
    const currentDate = new Date().toISOString().slice(0, 10);
    if (!fs.existsSync(`specific_route_logs_${currentDate}.txt`)) {
        createLogFiles();
    }
}

initializeLogging();

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/styles.css') {
        const cssPath = path.join(__dirname, 'views', 'styles.css');
        fs.readFile(cssPath, 'utf-8', (err, data) => {
            if (err) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end('File Not Found');
            } else {
                response.writeHead(200, { 'Content-Type': 'text/css' });
                response.end(data);
            }
        });
    } else {
        let filePath = './views' + (pathname === '/' ? '/index.html' : pathname + '.html');
        if (pathname === '/about') {
            myEmitter.emit('specific_route_accessed', pathname);
        } else if (pathname !== '/') {
            myEmitter.emit('non_home_route_accessed', pathname);
        }

        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end('Page Not Found');
                myEmitter.emit('http_status', 404);
                myEmitter.emit('error_warning', 'File not found: ' + filePath);
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data);
                myEmitter.emit('http_status', 200);
                myEmitter.emit('file_read_success', filePath);
            }
        });
    }
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

myEmitter.on('specific_route_accessed', (route) => {
    const logMessage = `Specific route accessed: ${route}\n`;
    console.log(logMessage);
    fs.appendFileSync(`specific_route_logs_${new Date().toISOString().slice(0, 10)}.txt`, logMessage);
});

myEmitter.on('non_home_route_accessed', (route) => {
    const logMessage = `Non-home route accessed: ${route}\n`;
    console.log(logMessage);
    fs.appendFileSync(`non_home_route_logs_${new Date().toISOString().slice(0, 10)}.txt`, logMessage);
});

myEmitter.on('http_status', (statusCode) => {
    const logMessage = `HTTP Status Code: ${statusCode}\n`;
    console.log(logMessage);
    fs.appendFileSync(`http_status_logs_${new Date().toISOString().slice(0, 10)}.txt`, logMessage);
});

myEmitter.on('error_warning', (message) => {
    const logMessage = `Error/Warning: ${message}\n`;
    console.log(logMessage);
    fs.appendFileSync(`error_warning_logs_${new Date().toISOString().slice(0, 10)}.txt`, logMessage);
});

myEmitter.on('file_read_success', (filePath) => {
    const logMessage = `File read successfully: ${filePath}\n`;
    console.log(logMessage);
    fs.appendFileSync(`file_read_logs_${new Date().toISOString().slice(0, 10)}.txt`, logMessage);
});
