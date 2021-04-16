const router = require('express').Router();
require('dotenv').config()

const twilioAccountSid = process.env.TRANSFER_TWILIO_API_SID
const twilioAuthToken = process.env.TRANSFER_TWILIO_AUTH_TOKEN
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken)

function sendSMS(message) {
    twilioClient.messages.create({
        to: "+17328220795",
        from: "+12064294522",
        body: message
    }).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err);
    })
    console.log("Sending SMS")
}

const { Client, resources, Webhook } = require('coinbase-commerce-node')
Client.init(process.env.TRANSFER_COINBASE_COMMERCE_APIKEY) 
const cors = require("cors")({ origin: "*" })


router.get('/crypto/create-charge', (req, res) => {
    const { amount, currency, id } = req.query

    const { Charge } = resources
    cors(req, res, async () => {
        const chargeData = {
            name: "Widget",
            description: "Deposit",
            local_price: {
                amount: amount, 
                currency: currency, 
            },
            pricing_type: 'fixed_price',
            metadata: {
                user: id
            }
        }

        const charge = await Charge.create(chargeData)
        res.send(charge)
    })
})

router.post('/crypto/charge-status', (req, res) => {
    const rawBody = req.rawBody
    const signature = req.headers['x-cc-webhook-signature']
    const webHookSecret = process.env.TRANSFER_COINBASE_WEBHOOK_SIGNATURE

    try {
        const event = Webhook.verifyEventBody(rawBody, signature, webHookSecret)

        if (event.type === "charge:confirmed") {
            console.log(event)
            const message = "A Deposit Using Coinbase Gateway Was Successful."
            sendSMS(message)
        }

        if (event.type === "charge:failed") {
            console.log(event)
            const message = "A Deposit Using Coinbase Gateway Was Unsuccessful."
            sendSMS(message)
        }

        res.sendStatus(200);
    }
    catch {
        console.log("Error")
        res.sendStatus(403)
    }
})

module.exports = router; 