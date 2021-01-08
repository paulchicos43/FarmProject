const express = require('express');
const app = express();
const http = require('http');
let bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
app.use(bodyParser.urlencoded({ extended: false }));
app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    console.log(req);
    twiml.message("THE ROBOTS ARE COMING");
    res.writeHead(200, {'Content-Type' : 'text/xml' });
    res.end(twiml.toString());

});

http.createServer(app).listen(1337, () => {
     console.log("LISTENING");
});
