import React, { useRef, useEffect } from "react";
import NavHome from "./navHome";
import { gsap } from "gsap";

// Bootstrap Components
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
// Imgs
import MoneyTransferSVG from "../img/transfer_money.svg";

// Styles
import Styles from "../styles/styles.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
    const jumbotron = useRef();
    useEffect(() => {
        const elements = Array.from(jumbotron.current.children);
        elements.forEach((element, idx) => {
            gsap.to(element, {
                y: -35, 
                duration: 0.50 + idx * 0.25,
                delay: 0.25 * idx,
                opacity: 1, 
            })
        });
    });

    return (
        <React.Fragment>
            <NavHome />
            <Jumbotron className={Styles.home_banner}>
                <div className={Styles.wrapper} ref={jumbotron}>
                    <h1>Deposit Effortlessly</h1>
                    <p>
                        Simply signup for free and begin depositing using various payment methods such as crypto and skrill wallet.
                    </p>
                    <p>
                        <Button variant="primary" href="/signup">Sign Up</Button>
                    </p>
                </div>
                <img className={Styles.money_transfer_img} src={MoneyTransferSVG} alt="Money Transfer" />
            </Jumbotron>
        </React.Fragment>
    )
}

export default Home; 