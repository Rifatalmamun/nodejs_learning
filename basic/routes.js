const fs = require('fs');

const requestHandler = (req, res) =>{
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
        return req.on('end',() => {
            console.log('step1111111111111');
            
            const parseBody = Buffer.concat(body).toString();
            const rawMessage = parseBody.split('=')[1];
            const message = rawMessage.replace('+',' ');
            
            fs.writeFile('message.txt',message, (err)=>{
                res.statusCode = 302;
                res.setHeader('Location','/');
                return res.end();
            });
        })
    }
    console.log('step222222222');
    res.setHeader('Content-Type','text/html');
    res.write('<html>');
    res.write('<head><title>Hello node.js</title></head>');
    res.write('<body><h1>Hello node.js</h1></body>');
    res.write('</html>');
    res.end();
}

module.exports = {
    handler: requestHandler
};

// another way of exports

// module.exports.handler = requestHandler;
// module.exports.someText = 'hello from node.js'; 

// another way of exports

// exports.handler = requestHandler;
// exports.someText = 'hello from node.js'; 