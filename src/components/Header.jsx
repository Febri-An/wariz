import React from "react";
import image from '../assets/wariz2.png'
import '../styles/Header.css'

function Header() {
    return (
        <div className="header">
            <img src={image} alt="Wariz logo" />
        </div>
    )
}

export default Header;