// import React from 'react';
// import { FaFacebookF } from "react-icons/fa";
// import { FaInstagram } from "react-icons/fa";
// import { FaTwitter } from "react-icons/fa";
// import { FaLinkedinIn } from "react-icons/fa";
// import { FaYoutube } from "react-icons/fa";
// import { IconContext } from "react-icons";
// import { Nav } from 'react-bootstrap';
// import { useLocation, Link } from "react-router-dom";
// import { LinkContainer } from 'react-router-bootstrap';

// const Footer = () => {
//     //assigning location variable
//     const location = useLocation();

//     //destructuring pathname from location
//     const { pathname } = location;

//     //Javascript split method to get the name of the path in array
//     const splitLocation = pathname.split("/");

//     return (
//         <div className="container-fluid footer">
//             <div className="row container-wrapper">
//                 <div className="footer-bodycontent  dflex">
//                     <div className=''>
//                         <h2 >VCAT</h2>

//                         <IconContext.Provider value={{ color: "#8986B8", className: "global-class-name" }}>
//                             <div className="social-medialinks">

//                                 <a href="/"><FaFacebookF /></a>
//                                 <a href="/"><FaInstagram /></a>
//                                 <a href="/"><FaTwitter /></a>
//                                 <a href="/"><FaLinkedinIn /></a>
//                                 <a href="/"><FaYoutube /></a>
//                             </div>

//                         </IconContext.Provider>
//                     </div>
//                     <div className="footerbody-links">
//                         <div className="container-fluid">
//                             <div className="row links-section">
//                                 <div className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-4 quick-link-main"   >
//                                     <h4>QUICK LINKS</h4>
//                                     <Nav className="quick-links">
//                                         <ul className="footer-links">
//                                             <Nav.Item>
//                                                 <LinkContainer to="/" activeClassName="">
//                                                     <Link to="/" className={splitLocation[1] === "" || splitLocation[1] === "home" ? "nav-link wht fnt-size pagelink  active short-link" : "nav-link wht fnt-size pagelink  short-link"} >Home</Link>

//                                                 </LinkContainer>
//                                             </Nav.Item>
//                                             <Nav.Item>
//                                                 <LinkContainer to="/about" activeClassName="">
//                                                     <Link to="/about" className={splitLocation[1] === "about" ? "nav-link wht fnt-size pagelink  active  " : "nav-link wht fnt-size  pagelink "} >About Us</Link></LinkContainer>
//                                             </Nav.Item>
//                                             <Nav.Item>
//                                                 <LinkContainer to="/wing" activeClassName="">
//                                                     <Link to="/wing" className={splitLocation[1] === "wing" ? "nav-link wht fnt-size pagelink short-link active " : "nav-link wht fnt-size pagelink short-link"} >Wings</Link>

//                                                 </LinkContainer>
//                                             </Nav.Item>
//                                             <Nav.Item>
//                                                 <LinkContainer to="/event" activeClassName="">
//                                                     <Link to="/event" className={splitLocation[1] === "event" ? "nav-link wht fnt-size pagelink short-link active " : "nav-link wht fnt-size pagelink short-link"} >Events</Link>

//                                                 </LinkContainer>
//                                             </Nav.Item>

//                                             <Nav.Item>
//                                                 <LinkContainer to="/connect" activeClassName="">
//                                                     <Link to="/connect" className={splitLocation[1] === "connect" ? "nav-link wht fnt-size pagelink med active " : "nav-link wht fnt-size pagelink med"} >Connect</Link>

//                                                 </LinkContainer>
//                                             </Nav.Item>
//                                             <Nav.Item>
//                                                 <LinkContainer to="/resource" activeClassName="">
//                                                     <Link to="/resource" className={splitLocation[1] === "resource" ? "nav-link wht fnt-size pagelink res active" : "nav-link wht fnt-size res pagelink"} >Resources</Link>

//                                                 </LinkContainer>
//                                             </Nav.Item>
//                                             <Nav.Item>
//                                                 <LinkContainer to="/contact" activeClassName="">
//                                                     <Link to="/contact" className={splitLocation[1] === "contact" ? "nav-link wht fnt-size pagelink long  active" : "nav-link wht fnt-size long pagelink"} >Contact Us</Link>

//                                                 </LinkContainer>
//                                             </Nav.Item>

//                                         </ul>
//                                     </Nav>
//                                 </div>
//                                 <div className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-4 contact-links">
//                                     <h4><i className="bi bi-phone-fill"></i> Contact Us</h4>
//                                     <Nav>
//                                         <div className="quick-links">
//                                             <ul className="navbar-nav">
//                                                 <li className="nav-item">
//                                                     <a className="nav-link wht fnt-size footer-mail" href="mailto:vcat@gmail.com">info@vcat.co.in</a>
//                                                 </li>
//                                                 <li className="nav-item highlited">
//                                                     <a className="nav-link wht fnt-size footer-phone" href="tel:+919876509876"> +91 86608 69426</a>
//                                                     {/* <a className="nav-link wht fnt-size footer-phone" href="tel:+919876598765">+91 98765 98765</a> */}
//                                                 </li>
//                                                 <li className="nav-item">
//                                                     <a className="nav-link wht fnt-size footer-web" href="www.vcat.com">www.vcat.co.in</a>
//                                                 </li>
//                                             </ul>
//                                         </div>
//                                     </Nav>
//                                 </div>
//                                 <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 visit-us">
//                                     <h4><i className="bi bi-geo-alt-fill"></i> VISIT US</h4>
//                                     <div className="map-links">
//                                         <a className="nav-link no-hover wht fnt-size no-pad-add" target="_blank" href="https://www.google.com/maps/place/SRI+VASAVI+CA+CHARITABLE+TRUST/@12.93913,77.583863,15z/data=!4m5!3m4!1s0x0:0x17885d4063866260!8m2!3d12.9391299!4d77.5838629?hl=en" rel="noreferrer">
//                                             <p className='mb-0 ' style={{fontSize:'0.9rem'}}>SRI VASAVI CA CHARITABLE TRUST </p>
//                                             <p  style={{fontSize:'0.9rem'}}>No.9 Ground Floor, 9th Main, 2nd Block Jayanagar, Bengaluru - 560011, Karnataka, India</p>
//                                         </a>
//                                         <iframe title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.510763888547!2d77.58167421526967!3d12.939135119089736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae154da35d5821%3A0x17885d4063866260!2sSRI%20VASAVI%20CA%20CHARITABLE%20TRUST!5e0!3m2!1sen!2sin!4v1628657720855!5m2!1sen!2sin"
//                                             width="100%" height="200" allowFullScreen="" loading="lazy"></iframe>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <p className='copyright copyright-web-link' > Copyright © {new Date().getUTCFullYear()} | Developed by <a className="" rel="noreferrer" target="_blank" href="https://kpdigiteers.com/">KP Digiteers</a>.</p>
//             </div>
//         </div>
//     )

// }

// export default Footer

import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { IconContext } from "react-icons";
import { Nav } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

const Footer = () => {
  //assigning location variable
  const location = useLocation();

  //destructuring pathname from location
  const { pathname } = location;

  //Javascript split method to get the name of the path in array
  const splitLocation = pathname.split("/");

  console.log("splitLocation_footer", splitLocation);

  return (
    <div className="container-fluid footer">
      <div className="row container-wrapper">
        <div className="footer-bodycontent  dflex">
          <div className="">
            <h2>VCAT</h2>

            <IconContext.Provider
              value={{ color: "#8986B8", className: "global-class-name" }}
            >
              <div className="social-medialinks">
                <a href="/">
                  <FaFacebookF />
                </a>
                <a href="/">
                  <FaInstagram />
                </a>
                <a href="/">
                  <FaTwitter />
                </a>
                <a href="/">
                  <FaLinkedinIn />
                </a>
                <a href="/">
                  <FaYoutube />
                </a>
              </div>
            </IconContext.Provider>
          </div>
          <div className="footerbody-links">
            <div className="container-fluid">
              <div className="row links-section">
                <div className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-4 quick-link-main">
                  <h4>QUICK LINKS</h4>
                  <Nav className="quick-links">
                    <ul className="footer-links">
                      <Nav.Item>
                        <LinkContainer to="/" activeClassName="">
                          <Nav.Link
                            eventKey={1}
                            to="/"
                            active={false}
                            is
                            className={
                              splitLocation[1] === "" ||
                              splitLocation[1] === "home"
                                ? "nav-link wht fnt-size pagelink  active short-link"
                                : "nav-link wht fnt-size pagelink  short-link"
                            }
                          >
                            Home
                          </Nav.Link>
                        </LinkContainer>
                      </Nav.Item>
                      <Nav.Item>
                        <LinkContainer to="/about" activeClassName="">
                          <Nav.Link
                            to="/about"
                            active={false}
                            eventKey={2}
                            className={
                              splitLocation[1] === "about"
                                ? "nav-link wht fnt-size pagelink  active  "
                                : "nav-link wht fnt-size  pagelink "
                            }
                          >
                            About Us
                          </Nav.Link>
                        </LinkContainer>
                      </Nav.Item>
                      <Nav.Item>
                        <LinkContainer to="/wing" activeClassName="">
                          <Nav.Link
                            to="/wing"
                            eventKey={3}
                            className={
                              splitLocation[1] === "wing"
                                ? "nav-link wht fnt-size pagelink short-link active "
                                : "nav-link wht fnt-size pagelink short-link"
                            }
                          >
                            Wings
                          </Nav.Link>
                        </LinkContainer>
                      </Nav.Item>
                      <Nav.Item>
                        <LinkContainer to="/event" activeClassName="">
                          <Nav.Link
                            to="/event"
                            active={false}
                            eventKey={4}
                            className={
                              splitLocation[1] === "event"
                                ? "nav-link wht fnt-size pagelink short-link active "
                                : "nav-link wht fnt-size pagelink short-link"
                            }
                          >
                            Events
                          </Nav.Link>
                        </LinkContainer>
                      </Nav.Item>
                      <Nav.Item>
                        <LinkContainer to="/gallery" activeClassName="">
                          <Nav.Link
                            to="/gallery"
                            active={false}
                            eventKey={5}
                            className={
                              splitLocation[1] === "gallery"
                                ? "nav-link wht fnt-size pagelink short-link active "
                                : "nav-link wht fnt-size pagelink short-link"
                            }
                          >
                            Gallery
                          </Nav.Link>
                        </LinkContainer>
                      </Nav.Item>

                      {/* <Nav.Item>
                                                <LinkContainer to="/connect" activeClassName="">
                                                    <Link to="/connect" className={splitLocation[1] === "connect" ? "nav-link wht fnt-size pagelink med active " : "nav-link wht fnt-size pagelink med"} >Connect</Link>

                                                </LinkContainer>
                                            </Nav.Item> */}
                      <Nav.Item>
                        <LinkContainer to="/resource" activeClassName="">
                          <Nav.Link
                            to="/resource"
                            active={false}
                            eventKey={6}
                            className={
                              splitLocation[1] === "resource"
                                ? "nav-link wht fnt-size pagelink res active"
                                : "nav-link wht fnt-size res pagelink"
                            }
                          >
                            Resources
                          </Nav.Link>
                        </LinkContainer>
                      </Nav.Item>
                      <Nav.Item>
                        <LinkContainer to="/contact">
                          <Nav.Link
                            to="/contact"
                            active={false}
                            eventKey={7}
                            className={
                              splitLocation[1] === "contact"
                                ? "nav-link wht fnt-size pagelink long active"
                                : "nav-link wht fnt-size long pagelink"
                            }
                          >
                            Contact Us
                          </Nav.Link>
                        </LinkContainer>
                      </Nav.Item>
                      <Nav.Item>
                        {/* <LinkContainer > */}
                        <a
                          href="https://admin.vcat.co.in/"
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#fff" }}
                          className={
                            splitLocation[1] === "login"
                              ? " fnt-size nav-link pagelink-mob short-link-mob active "
                              : "nav-link short-link-mob fnt-size pagelink-mob"
                          }
                        >
                          Login
                        </a>
                        {/* </LinkContainer> */}
                      </Nav.Item>
                    </ul>
                  </Nav>
                </div>
                <div className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-4 contact-links">
                  <h4>
                    <i className="bi bi-phone-fill"></i> Contact Us
                  </h4>
                  <Nav>
                    <div className="quick-links">
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <a
                            className="nav-link wht fnt-size footer-mail"
                            href="mailto:vcat@gmail.com"
                          >
                            info@vcat.co.in
                          </a>
                        </li>
                        <li className="nav-item highlited">
                          <a
                            className="nav-link wht fnt-size footer-phone"
                            href="tel:+919876509876"
                          >
                            {" "}
                            +918660869426
                          </a>
                          {/* <a className="nav-link wht fnt-size footer-phone" href="tel:+919876598765">+91 98765 98765</a> */}
                        </li>
                        <li className="nav-item">
                          <LinkContainer to="/" activeClassName="">
                            <Link to="/" className="nav-link wht fnt-size">
                              www.vcat.co.in
                            </Link>
                          </LinkContainer>
                        </li>
                      </ul>
                    </div>
                  </Nav>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 visit-us">
                  <h4>
                    <i className="bi bi-geo-alt-fill"></i> VISIT US
                  </h4>
                  <div className="map-links">
                    <a
                      className="nav-link no-hover wht fnt-size no-pad-add"
                      target="_blank"
                      href="https://www.google.com/maps/place/SRI+VASAVI+CA+CHARITABLE+TRUST/@12.93913,77.583863,15z/data=!4m5!3m4!1s0x0:0x17885d4063866260!8m2!3d12.9391299!4d77.5838629?hl=en"
                      rel="noreferrer"
                    >
                      <p className="mb-0 " style={{ fontSize: "0.9rem" }}>
                        SRI VASAVI CA CHARITABLE TRUST{" "}
                      </p>
                      <p style={{ fontSize: "0.9rem" }}>
                        No.9 Ground Floor, 9th Main, 2nd Block Jayanagar,
                        Bengaluru - 560011, Karnataka, India
                      </p>
                    </a>
                    <iframe
                      title="map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.510763888547!2d77.58167421526967!3d12.939135119089736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae154da35d5821%3A0x17885d4063866260!2sSRI%20VASAVI%20CA%20CHARITABLE%20TRUST!5e0!3m2!1sen!2sin!4v1628657720855!5m2!1sen!2sin"
                      width="100%"
                      height="200"
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="copyright copyright-web-link">
          {" "}
          Copyright © {new Date().getUTCFullYear()} | Developed by{" "}
          <a
            className=""
            rel="noreferrer"
            target="_blank"
            href="https://kpdigiteers.com/"
          >
            KP Digiteers
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Footer;
