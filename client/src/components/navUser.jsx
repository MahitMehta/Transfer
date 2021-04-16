import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import firebase from "firebase/app";
import auth from "firebase/auth";

// Bootstrap Components
import Nav from "react-bootstrap/Nav";
// Styles
import "bootstrap/dist/css/bootstrap.min.css";

const NavUser = ({ username }) => {
    const auth = firebase.auth();

    return (
        <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">QuickDepo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
                <Nav.Link className="text-muted">{username}</Nav.Link>
                <Nav.Link href="/" onClick={() => {
                    sessionStorage.removeItem("user");
                    auth.signOut();
                }}>Log Out</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    )
}

export default NavUser; 