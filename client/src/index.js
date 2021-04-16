import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import firebase from "firebase/app";

// View Components
import Home from "./components/home";
import User from "./components/user";
import SignUp from "./components/signup";
import Login from "./components/login";
import Crypto from "./components/crypto";

const config = {
  apiKey: "AIzaSyD-6i13fP6SxD512DUWnAASA6S-lfzIUiI",
  authDomain: "transfer-webapp.firebaseapp.com",
  projectId: "transfer-webapp",
  storageBucket: "transfer-webapp.appspot.com",
  messagingSenderId: "781503790259",
  appId: "1:781503790259:web:41066dd544992a8c3844c6",
  measurementId: "G-0C6S67YZ99"
}

firebase.initializeApp(config);

document.title = "QuickDepo";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/user" component={User} />
        <Route exact path="/user/crypto" component={Crypto} />
        <Route exact path="/" component={Home} />
        <Redirect to="/" />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
