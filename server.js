const express = require('express')
const app = express()
const payment = require('./routes/payment')

app.use(express.static(__dirname + "\\client\\build"))
app.use("/api/payment", payment);

app.get('*', (_, res) => {
    res.sendFile(__dirname + "\\client\\build\\index.html")
})

const PORT = process.env.PORT || 5000
app.listen(PORT)