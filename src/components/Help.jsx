import React from "react";
import Border from '../assets/border.png'
import '../styles/Help.css'

function Help() {
    const phoneNumber = '6288983266128'; // CS number
    const message = 'Halo, saya butuh bantuan dengan layanan Wariz Anda.'; // defualt message
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="help-container">
            <img src={Border} alt="border" className="help-border"/>
            <div className="help-content">
                <p>Jika Anda memiliki pertanyaan, seperti penghitungan atau pembagian<br></br>
                    waris, mengalami masalah lain, memerlukan bantuan, atau ingin<br></br>
                    melaporkan bug pada sistem kami, layanan ini siap membantu. Kami hadir<br></br>
                    untuk memastikan pengalaman Anda menjadi lebih mudah, jelas, dan<br></br>
                    sesuai dengan aturan yang berlaku.</p>
                {/* <div className="service"> */}
                <button onClick={() => window.open(whatsappLink, '_blank')} id="service-btn">Tanya Wariz</button>
                {/* </div> */}
            </div>
        </div>
    )
}

export default Help;