import React, { useRef, useState } from 'react';
import NavHome from "./navHome";
import firebase from "firebase/app";
import auth from "firebase/auth";
import firestore from "firebase/firestore";
import { Redirect } from "react-router-dom";

// Bootstrap Components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

// Styles
import Styles from "../styles/styles.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";

const SignUp = () => {
    const [ signUpErr, setSignUpErr] = useState("");
    const [ signedUp, setSignedUp ] = useState(false);

    const FirstName = useRef();
    const LastName = useRef();
    const Username = useRef();
    const PhoneNumber = useRef();
    const Email = useRef();
    const Pass = useRef();

    const auth = firebase.auth();
    const db = firebase.firestore();
    
    const signUpUser = e => {
        e.preventDefault();

        const firstNameVal = FirstName.current.value;
        const lastNameVal = LastName.current.value;
        const userNameVal = Username.current.value;
        const phoneNumberVal = PhoneNumber.current.value;
        const emailVal = Email.current.value;
        const passVal = Pass.current.value;

        const emailPattern = /^([A-z0-9.]+)@([A-z0-9]+)\.([A-z0-9.]+)$/;
        const minPassLen = 8; 

        if (!firstNameVal || !lastNameVal || !userNameVal || !emailVal || !passVal || !phoneNumberVal) {
            setSignUpErr("Please Fill Out All of the Fields!");
            return;
        }

        if (!emailPattern.test(emailVal)) {
            setSignUpErr("Email is Poorly Formatted!");
            return; 
        } 
        
        if (passVal.length < minPassLen) {
            setSignUpErr("Password is Required to be 8+ Characters!");
            return; 
        }

        const signUpError = () => {
            console.warn("Error setting data");
            const currentUser = auth.currentUser;
            currentUser.delete();
            setSignUpErr("Error Signing Up! Try Again Later.")
        }

        auth.createUserWithEmailAndPassword(emailVal, passVal)
            .then(res => {
                setSignUpErr(""); 
                const uid = res.user.uid;
                const firstLetter = userNameVal.charAt(0).toUpperCase();
                const namesPath = db.doc(`names/${firstLetter}/displayNames/${userNameVal}`)
                namesPath.get()
                .then(res => {
                    if (!res.exists) {
                        namesPath.set({
                            uid: uid
                        })
                        .then(() => {
                            const userPath = db.doc(`users/${uid}`);
                            userPath.set({
                                firstName: firstNameVal,
                                lastName: lastNameVal,
                                username: userNameVal,
                                phoneNumber: phoneNumberVal,
                                email: emailVal
                            })
                            .then(() => {
                                const user = { 
                                    uid: uid,
                                    email: emailVal,
                                    pass: passVal,
                                }
                
                                const encryptedData = btoa(JSON.stringify(user));
                                sessionStorage.setItem("user", encryptedData);

                                console.log("%cSigned Up Successfully!", "color:lightgreen");
                                setSignedUp(true);
                            }).catch(() => {
                                signUpError();
                            });
                        })
                        .catch(() => {
                            signUpError();
                        })
                    } else {
                        signUpError();
                        setSignUpErr("Username Exists! Try a Different One.")
                    }
                }).catch(() => {
                    signUpError();
                })
            }).catch(({ code }) => {
                switch(code) {
                    case "auth/email-already-in-use" : {
                        setSignUpErr("Account with this Email Already Exists!");
                        break;
                    }
                    default : {
                        setSignUpErr("Error Signing Up! Try Again Later.");
                    }
                }
            })
    }

    return !signedUp ? (
        <React.Fragment>
            <NavHome />
            <section className={Styles.form_section}>
                <Form className={Styles.form_wrapper}>
                    <h1>Sign Up</h1>
                    <p>Start Depositing Today With a Few Easy Steps.</p>
                    <Row className={Styles.adjacent_field_wrapper}>
                        <Col>
                        <Form.Control placeholder="First name" ref={FirstName}/>
                        </Col>
                        <Col>
                        <Form.Control placeholder="Last name" ref={LastName}/>
                        </Col>
                    </Row>
                    <Row className={Styles.adjacent_field_wrapper}>
                        <Col>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="ex. FuturisticDev" ref={Username} />
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group>
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="text" placeholder="ex. 732 929 1912" ref={PhoneNumber}/>
                        </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="example@gmail.com" ref={Email}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" ref={Pass}/>
                    </Form.Group>
                    { signUpErr ? (
                        <Alert variant="danger">
                        { signUpErr }
                        </Alert>
                    ) : "" }
                    <Button variant="primary" type="submit" onClick={signUpUser}>
                        Sign Up
                    </Button>
                </Form>
            </section>
        </React.Fragment>
    ) : <Redirect to="/user" />
}

export default SignUp;