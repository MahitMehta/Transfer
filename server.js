const express = require('express')
const app = express()
const payment = require('./routes/payment')
const path = require('path')
const bodyParser = require('body-parser');

var rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}
app.use(bodyParser.json({ verify: rawBodySaver, extended: true }));

app.use(express.static(path.join(__dirname, 'client/build')))
app.use("/api/payment", payment);

app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, "/client/build", "index.html"))
})

const PORT = process.env.PORT || 5000
app.listen(PORT)