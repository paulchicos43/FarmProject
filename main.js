const Gpio = require('onoff').Gpio;
const express = require('express');
const app = express();
let circuit = new Gpio(17, 'in', 'falling'); //Pin 17 on the Raspberry Pi
const accountSID = 'AC2ee647c42188dcd2ec3ed303df98de64';
const authToken = '1f92c60ef1e4cbdf07b383d109953250';
const client = require('twilio')(accountSID, authToken);
let bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * When we get a change in value, we send the text.
 */
circuit.watch((error, value) => {
    if(error) {
        console.error('Something went wrong.');
        return;
    }
    console.log("HELLOOOOO");
});

/**
 * Sends a message to a target number using Twilio.
 */
const sendMessage = () => {
    client.messages
    .create({ body: 'ALERT FROM TWILIO', from: '+18722597471', to: '+17087104981' })
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.log(error);
    });
    return;
}

/**
 * Webhook for reply messages from device.
 * 
 * POST /sms the text with the data in req.params.body
 */
app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    console.log(req);
    twiml.message("THE ROBOTS ARE COMING");
    res.writeHead(200, {'Content-Type' : 'text/xml' });
    res.end(twiml.toString());

});

/**
 * Present for testing purposes. Sends a message on CTRL + C
 */
process.on('SIGINT', () => {
     sendMessage();
})


/**
 * Opens a web server on port 1337
 */
const server = app.listen(1337, () => {
    console.log("LISTENING");
});

/**
 * Shutdown function for the web server. Closes the connections gracefully.
 */
const shutDown = () => {
    server.close(() => {
        console.log("Shutting down the server.");
        process.exit(0);
    })
}

/**
 * On CTRL + Z, close the server gracefully.
 */
process.on('SIGTSTP', () => {
    shutDown();
})