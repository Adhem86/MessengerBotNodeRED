const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const RED = require('node-red');

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);

const settings = {
    httpAdminRoot: "/red",
    httpNodeRoot: "/api",
    userDir: "./.nodered",
    functionGlobalContext: {},
    port: process.env.PORT || 1880
};

RED.init(server, settings);
server.listen(settings.port);

RED.start();
console.log(`Node-RED running at http://localhost:${settings.port}/red`);

// Example route for Messenger Webhook
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = 'YOUR_VERIFY_TOKEN';
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

app.post('/webhook', (req, res) => {
    console.log('Received message:', req.body);
    res.sendStatus(200);
});
