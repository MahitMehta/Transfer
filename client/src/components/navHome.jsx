import React from 'react';
import Navbar from "react-bootstrap/Navbar";

// Bootstrap Components
import Nav from "react-bootstrap/Nav";

// Styles
import Styles from "../styles/styles.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";

const NavHome = () => {
    return (
        <Navbar bg="bg" expand="lg" className={Styles.navbar_home}>
                <Navbar.Brand href="/">QuickDepo</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link href="/login">Login</Nav.Link>
                        <Nav.Link href="/signup">Sign Up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
    )
}

export default NavHome;