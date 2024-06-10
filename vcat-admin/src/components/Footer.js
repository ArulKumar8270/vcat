import React from 'react';
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { IconContext } from "react-icons";
import { observer } from 'mobx-react';

const Footer = () => {

    return (
        <div className="container-fluid footer mt-auto" style={{ position: 'relative', bottom: 0, marginBottom: 0 }}>
            <div className="row wrapper dflex align-center p-1 admin_footer" >
                <div className="footer-bodycontent dflex col-4">
                    <div className=''>
                        <h2 style={{ textAlign: "center" }}>VCAT</h2>

                        <IconContext.Provider value={{ color: "#8986B8", className: "global-class-name" }}>
                            <div className="social-medialinks">
                                <a href="/"><FaFacebookF /></a>
                                <a href="/"><FaInstagram /></a>
                                <a href="/"><FaTwitter /></a>
                                <a href="/"><FaLinkedinIn /></a>
                                <a href="/"><FaYoutube /></a>
                            </div>
                        </IconContext.Provider>
                    </div>
                </div>
                <div className='col-6 copyright copyright-web-link'>
                    <p className='mb-0' > Copyright © {new Date().getUTCFullYear()} | Developed by <a target="_blank" style={{ color: "#fff" }} rel="noopener noreferrer" href="https://kpdigiteers.com/">KP Digiteers</a></p>
                </div>
                <div className='col-2'>
                </div>
            </div>
        </div>
    )

}

export default observer(Footer)
