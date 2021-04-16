import React, { useEffect, useState, useRef } from 'react';
import { Redirect } from "react-router-dom";
import firebase from "firebase/app";
import firestore from "firebase/firestore";
import auth from "firebase/auth";
import { gsap } from "gsap";

// Components
import NavUser from "./navUser";
import DepositMethod from "./depositMethod";

// Bootstrap Components
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";

// Styles
import Styles from "../styles/styles.module.scss";
import "bootstrap/dist/css/bootstrap.min.css"

// IMGS
import CryptoMethodSVG from "../img/crypto_method.svg";
import WalletMethodSVG from "../img/wallet_method.svg";

// <div>
//     <a class="donate-with-crypto"
//         href="https://commerce.coinbase.com/checkout/51730a31-f14b-427b-8fe3-1deb148ef0b5">
//         Deposite with Crypto
//     </a>
// <script src="https://commerce.coinbase.com/v1/checkout.js?version=201807">
// </script>
// </div>

const User = () => {
    const [ denied, setDenied ] = useState(false); 
    const [ userData, setUserData ] = useState({});
    const user = sessionStorage.getItem("user"); 
    const db = firebase.firestore();
    const auth = firebase.auth();

    const depositMethods = useRef();
    useEffect(() => {
        const depositMethodsArr = Array.from(depositMethods.current.children);
        depositMethodsArr.forEach((methodElement, idx) => {
            gsap.to(methodElement, {
                y: 0,
                opacity: 1,
                duration: 0.5
            }).delay(idx * 0.25)
        });
    }, [ depositMethods ]);

    useEffect(() => {
        if (!denied) {
            if (!user) {
                setDenied(true);
                return; 
            } 
        
            try {
                const { uid, email, pass } = JSON.parse(atob(user));
                auth.signInWithEmailAndPassword(email, pass)
                    .then(res => {
                        if (res.user.uid !== uid)
                            setDenied(true);
                        else {
                            const userDataPath = db.doc(`users/${uid}`)
                            userDataPath.get()
                                .then(data => {
                                    setUserData(data.data());
                                }).catch(() => setDenied(true));
                        }
                    })
                    .catch(() => {
                        setDenied(true);
                    });
            }
            catch {
                setDenied(true);
                return; 
            }
        }
    }, [ denied, user, auth, db ]);

    return !denied ? (
        <React.Fragment>
            <NavUser username={Object.keys(userData).length ? userData.username : ""} />
            <Jumbotron fluid style={{ margin: 0, position: "absolute", width: "100%", top: 0, zIndex: -1, paddingBottom: 44}}>
                <Container className={Styles.deposit_section}>
                    <h1>Deposit Methods</h1>
                    <p>
                        Easy! Choose a method most convient to you and simply deposit money.
                    </p>
                    <div className={Styles.deposit_methods} ref={depositMethods}>
                        <DepositMethod 
                            img={CryptoMethodSVG} 
                            title="Crypto"
                            description="Deposit using your Coinbase Wallet and various crypto's such as Bitcoin, Ethereum, Litecoin, and more."
                            redirect="crypto"
                            />
                        {/* <DepositMethod 
                            img={WalletMethodSVG} 
                            title="Skrill Wallet"
                            description="Deposit with your Skrill Wallet in addition to the possibility of depositing with various other methods."
                            redirect="crypto"
                             /> */}
                    </div>
                </Container>
            </Jumbotron>
        </React.Fragment>
    ) : <Redirect to="/" />
}

export default User; 