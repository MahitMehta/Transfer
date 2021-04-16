const express = require('express')
const app = express()
const payment = require('./routes/payment')
const path = require('path')

app.use(function(req, _, next) {
    req.rawBody = '';
    req.setEncoding('utf8');

    req.on('data', function(chunk) { 
        req.rawBody += chunk;
    });

    req.on('end', function() {
        next();
    });
});
app.use(express.bodyParser());

app.use(express.static(path.join(__dirname, 'client/build')))
app.use("/api/payment", payment);

app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, "/client/build", "index.html"))
})

const PORT = process.env.PORT || 5000
app.listen(PORT)