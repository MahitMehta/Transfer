import React, { useRef, useState } from 'react';
import NavHome from "./navHome";
import firebase from "firebase/app";
import auth from "firebase/auth";
import { Redirect } from "react-router-dom";

// Bootstrap Components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

// Styles
import Styles from "../styles/styles.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";

// Imgs 
// import CelebrateSVG from "../img/celebrate.svg";


const Login = () => { 
    const [ loginErr, setLoginErr ] = useState("");
    const [ loginMsg, setLoginMsg ] = useState("");
    const [ loggedIn, setLoggedIn ] = useState(false);
    
    const Email = useRef();
    const Pass = useRef();

    const auth = firebase.auth();

    const forgotPass = () => {
        const emailVal = Email.current.value;
        if (!emailVal) {
            setLoginErr("Invalid Email to Reset Password!");
            return; 
        }

        auth.sendPasswordResetEmail(emailVal)
            .then(() => {
                setLoginErr("");
                setLoginMsg(`Password Reset Link Sent to "${emailVal}"`)
            })
            .catch(() => {
                setLoginErr('Password Reset Failed');
            });
    }

    const loginUser = e => {
        e.preventDefault();

        const emailVal = Email.current.value;
        const passVal = Pass.current.value;

        if ( !emailVal || !passVal ) {
            setLoginErr("Please Fill Out all the Fields!");
            return; 
        }

        auth.signInWithEmailAndPassword(emailVal, passVal)
            .then(res => {
                setLoginErr("");
                setLoginMsg("");

                const user = { 
                    uid: res.user.uid,
                    email: emailVal,
                    pass: passVal,
                }

                const encryptedData = btoa(JSON.stringify(user));
                sessionStorage.setItem("user", encryptedData);
                setLoggedIn(true);

            }).catch(({ code }) => {
                console.log(code);
                switch(code) {
                    case 'auth/wrong-password': {
                        setLoginErr("Incorrect Password.");
                        return; 
                    }
                    case 'auth/user-not-found': {
                        setLoginErr("No Account Associated With The Email Entered Exists. ")
                        return; 
                    }
                    default : {
                        setLoginErr("Login Error! Try Again Later. ");
                        return; 
                    }
                }
            })
    }

    return !loggedIn ? (
        <React.Fragment>
            <NavHome />
            <section className={Styles.form_section}>
                {/* <img className={Styles.form_img} src={CelebrateSVG} alt="celebrate" /> */}
                <Form className={Styles.form_wrapper}>
                    <h1>Login</h1>
                    <p>Start Depositing Again With a Few Easy Steps.</p>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="example@gmail.com" ref={Email}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" ref={Pass}/>
                        <Form.Text className="text-muted" style={{ cursor: "pointer" }} onClick={forgotPass}>
                            Forgot Password?
                        </Form.Text>
                    </Form.Group>
                    { loginErr ? (
                        <Alert variant="danger">
                        { loginErr }
                        </Alert>
                    ) : "" } 
                    { loginMsg ? (
                        <Alert variant="success">
                        { loginMsg }
                        </Alert>
                    ) : "" } 
                    <Button variant="primary" type="submit" onClick={loginUser}>
                        Login
                    </Button>
                </Form>
            </section>
        </React.Fragment>
    ) : <Redirect to="/user" />
}

export default Login; 