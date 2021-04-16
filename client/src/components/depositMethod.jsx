import React from 'react';

// Bootstrap Components
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

// Styles
import "bootstrap/dist/css/bootstrap.min.css"
import Styles from "../styles/styles.module.scss";

const DepositMethod = ({ img, title, description, redirect }) => {
    return (
        <Card style={{ width: '18rem', padding: "5px", opacity: 0, transform: "translateY(150px)" }}>
            <Card.Img variant="top" src={ img } style={{ maxHeight: "150px" }}/>
            <Card.Body>
                <Card.Title>{ title } </Card.Title>
                <Card.Text className={Styles.description}>{ description }</Card.Text>
                <Button variant="primary" href={`/user/${redirect}`}>Deposit Now</Button>
            </Card.Body>
        </Card>
    )
}

export default DepositMethod;