const express = require("express");
const app = express();
const webpush = require('web-push');
const cors = require("cors")

const port = 3000;

const apiKeys = {
    publicKey: 'BMWJSs6g7wIxiW-7ZjrM7ZgMKnqe15yeRthJ9HwTMayjE9CscYI5RmfheIIIPLOdtlm91Lono2nWO92zUh70vWQ',
    privateKey: '7Lp2peNwsn7iF_B7AM02xRIznDxwMgGvJXMXArR7ogk'
}

webpush.setVapidDetails(
    'mailto:dev.naveedrehmani@gmail.com',
    apiKeys.publicKey,
    apiKeys.privateKey
)

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world");
})

const subDatabse = [];

// here you can save the users subscription in the database for future push notifications.
// just to keep the flow simple we are going to use in memory array.
app.post("/save-subscription", (req, res) => {
    subDatabse.push(req.body);
    res.json({ status: "Success", message: "Subscription saved!" })
})

// this event triggers the push notification from server to your app.
app.get("/send-notification", (req, res) => {
    console.log(subDatabse[0], "Hello world");
    webpush.sendNotification(subDatabse[0], "Hello worlds");
    res.json({ "statue": "Success", "message": "Message sent to push service" });
})

app.listen(port, () => {
    console.log("Server running on port 3000!");
})