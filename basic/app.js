const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res) => {
    const url = req.url;
    const method = req.method;


    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Hello node.js</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"/><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }

    if(url === '/message' && method === 'POST'){
        const body = [];
        req.on('data',(chunk) => {
            console.log('chunk: ', chunk);
            body.push(chunk);
        })
        req.on('end',() => {
            const parseBody = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];
            const temp = message.replace('+',' ');
            
            console.log('temp data: ', temp);
            fs.writeFileSync('message.txt',temp);
        })
        res.setHeader('Location','/');
        return res.end();
    }

    res.setHeader('Content-Type','text/html');
    res.write('<html>');
    res.write('<head><title>Hello node.js</title></head>');
    res.write('<body><h1>Hello node.js</h1></body>');
    res.write('</html>');
    res.end();
});

server.listen(3005);