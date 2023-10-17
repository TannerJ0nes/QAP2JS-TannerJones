const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

const logsDirectory = path.join(__dirname, 'logs');

function createLogFiles() {
    const currentDate = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(path.join(logsDirectory, `specific_route_logs_${currentDate}.txt`), '');
    fs.writeFileSync(path.join(logsDirectory, `non_home_route_logs_${currentDate}.txt`), '');
    fs.writeFileSync(path.join(logsDirectory, `http_status_logs_${currentDate}.txt`), '');
    fs.writeFileSync(path.join(logsDirectory, `error_warning_logs_${currentDate}.txt`), '');
    fs.writeFileSync(path.join(logsDirectory, `file_read_logs_${currentDate}.txt`), '');
}

function initializeLogging() {
    if (!fs.existsSync(logsDirectory)) {
        fs.mkdirSync(logsDirectory);
    }
    const currentDate = new Date().toISOString().slice(0, 10);
    if (!fs.existsSync(path.join(logsDirectory, `specific_route_logs_${currentDate}.txt`))) {
        createLogFiles();
    }
}

initializeLogging();

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/styles.css' || pathname.endsWith('.jpg')) {
        const filePath = path.join(__dirname, 'views', pathname);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end('File Not Found');
            } else {
                if (pathname.endsWith('.jpg')) {
                    response.writeHead(200, { 'Content-Type': 'image/jpeg' });
                } else {
                    response.writeHead(200, { 'Content-Type': 'text/css' });
                }
                response.end(data);
            }
        });
    } else {
        let filePath = path.join(__dirname, 'views', (pathname === '/' ? '/index.html' : pathname + '.html'));
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
    fs.appendFileSync(path.join(logsDirectory, `specific_route_logs_${new Date().toISOString().slice(0, 10)}.txt`), logMessage);
});

myEmitter.on('non_home_route_accessed', (route) => {
    const logMessage = `Non-home route accessed: ${route}\n`;
    console.log(logMessage);
    fs.appendFileSync(path.join(logsDirectory, `non_home_route_logs_${new Date().toISOString().slice(0, 10)}.txt`), logMessage);
});

myEmitter.on('http_status', (statusCode) => {
    const logMessage = `HTTP Status Code: ${statusCode}\n`;
    console.log(logMessage);
    fs.appendFileSync(path.join(logsDirectory, `http_status_logs_${new Date().toISOString().slice(0, 10)}.txt`), logMessage);
});

myEmitter.on('error_warning', (message) => {
    const logMessage = `Error/Warning: ${message}\n`;
    console.log(logMessage);
    fs.appendFileSync(path.join(logsDirectory, `error_warning_logs_${new Date().toISOString().slice(0, 10)}.txt`), logMessage);
});

myEmitter.on('file_read_success', (filePath) => {
    const logMessage = `File read successfully: ${filePath}\n`;
    console.log(logMessage);
    fs.appendFileSync(path.join(logsDirectory, `file_read_logs_${new Date().toISOString().slice(0, 10)}.txt`), logMessage);
});
