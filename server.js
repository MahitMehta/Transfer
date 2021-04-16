const express = require('express')
const app = express()
const payment = require('./routes/payment')
const path = require('path')

app.use(express.static(path.join(__dirname, 'client/build')))
app.use("/api/payment", payment);

app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, "/client/build", "index.html"))
})

const PORT = process.env.PORT || 5000
app.listen(PORT)