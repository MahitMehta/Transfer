import React, { useState, useRef, useEffect } from "react";
import { Redirect } from "react-router-dom";

// Components 
import NavUser from "./navUser";

// Bootstrap Components 
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import Styles from "../styles/styles.module.scss";

// IMGS
import BTCSVG from "../img/btc.svg";
import ETHSVG from "../img/eth.svg";
import LTCSVG from "../img/ltc.svg";
import USDCSVG from "../img/usdc.svg";


const Crypto = () => {
    const [ invoiceRes, setInvoiceRes ] = useState({}); 
    const [ userData, setUserData ] = useState({});
    const [ err, setErr ] = useState(false);

    const createInvoice = async (amount, currency, uid) => {
        const encryptedUid = btoa(uid);
        const endpoint = "/api/payment/crypto/create-charge";
        const invoiceResponse = await fetch(`${endpoint}?amount=${amount}&currency=${currency}&id=${encryptedUid}`)
            .then(res => res.json())
            .then(data => data)
            .catch(_ => { 
                return {} 
            });
        return await invoiceResponse; 
    }
    
    const depositAmount = useRef();
    const depositCurrency = useRef();

    const queryInvoice = () => {
        const depositUserAmount = depositAmount.current.value; 
        const depositUserCurrency = depositCurrency.current.value;
        const uid = userData.uid; 

        if (!depositUserAmount || depositUserCurrency === "Choose") {
            return 
        }

        createInvoice(depositUserAmount, depositUserCurrency, uid)
        .then(res => {
            setInvoiceRes(res);
        })
    }

    useEffect(() => {
        const userDataRetrieved = JSON.parse(atob(sessionStorage.getItem("user")));
        if (!userDataRetrieved || !Object.keys(userDataRetrieved).length) {
            console.log("No Userdata Detected. Redirect User");
            setErr(true);
        }
        if (!Object.keys(userDataRetrieved).length || err)
            setUserData(userDataRetrieved);
    }, [err])

    return !err ? (
        <React.Fragment>
            <NavUser />
            <section className={Styles.form_section} style={{ position: "absolute", top: "50px"}}>
                <Form className={Styles.form_wrapper}>
                    <h2>Coinbase Gateway</h2>
                    <p>Deposit using popular cryptos and other various payment methods.</p>
                    <Form.Group>
                        <Form.Label>Deposit Amount</Form.Label>
                        <Form.Control ref={depositAmount} type="number" placeholder="ex. $10" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Deposit Currency</Form.Label>
                        <div className={Styles.crypto_coin_div}>
                            <img src={BTCSVG} alt="Crypto Coin" />
                            <img src={ETHSVG} alt="Crypto Coin" />
                            <img src={LTCSVG} alt="Crypto Coin" />
                            <img src={USDCSVG} alt="Crypto Coin" />
                        </div>
                        <Form.Control ref={depositCurrency} as="select">
                            <option>Choose</option>
                            <option>BTC</option>
                            <option>ETH</option>
                            <option>LTC</option>
                            <option>USDC</option>
                        </Form.Control>
                    </Form.Group>
                    {
                        Object.keys(invoiceRes).length ? (
                            <React.Fragment>
                                <Alert variant="success">
                                    Complete Your Deposit by Clicking the Payment Button Below.
                                </Alert>
                                <Alert variant="success">
                                    <b>Note:</b> The Admin Will Receive a Confirmation via Whatsapp Upon Success.
                                </Alert>
                            </React.Fragment>
                        ) : ""
                    }
                    <Button onClick={queryInvoice}>Create Invoice</Button>
                    {
                        Object.keys(invoiceRes).length ? (
                            <Button style={{ margin: "0px 10px" }} 
                                    href={invoiceRes.hosted_url}
                                    >Payment</Button>
                        ) : ""
                    }
                </Form>
            </section>
        </React.Fragment>
    ) : <Redirect to="/" />
}

export default Crypto;