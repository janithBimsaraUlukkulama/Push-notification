require('dotenv').config();
const express = require('express');
const webPush = require('web-push');
const SubscriptionModel = require('./subscriptionModel');
const mongoose = require('mongoose');
const app = express();
const port = 9000;
const DatabaseName = 'mydb';
const DatabaseURI = `mongodb://mongo_admin:admin_password@localhost:27017/${DatabaseName}?authSource=admin`;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

app.post('/subscribe', async (req, res, next) => {
    console.log(req.body);
    const newSubscription = await SubscriptionModel.create({ ...req.body });
    // return res.send ('hallo');
    const options = {
        vapidDetails: {
            subject: 'mailto:myemail@example.com',
            publicKey: process.env.PUBLIC_KEY,
            privateKey: process.env.PRIVATE_KEY,
        },
    };
    try {
        const res2 = await webPush.sendNotification(
            newSubscription,
            JSON.stringify({
                title: 'Hello from server',
                description: 'this message is coming from the server',
                image: 'https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg',
            }),
            options
        );
        console.log(res2);
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

mongoose
    .connect(DatabaseURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(db => {
        app.listen(port, () => console.log(`app running live on ${port}`));
    })
    .catch(err => console.log(err.message));