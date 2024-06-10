// import React, { useState } from "react";
// import { Container, Nav, Navbar } from "react-bootstrap";
// import { useLocation, Link } from "react-router-dom";
// import log from "../components/img/log.png";
// import { LinkContainer } from "react-router-bootstrap";

// const Header = () => {
//   const [toggle, setToggle] = useState(false);
//   const onhandleToggle = () => {
//     setToggle(!toggle);
//   };
//   //assigning location variable
//   const location = useLocation();

//   //destructuring pathname from location
//   const { pathname } = location;

//   //Javascript split method to get the name of the path in array
//   const splitLocation = pathname.split("/");

//   return (
//     <>
//       <header>
//         <Navbar
//           collapseOnSelect
//           fixed="top"
//           expand="sm"
//           bg="dark"
//           variant="dark"
//           className="header navbar-dark fixed-top no-pad-bot navbar-expand-lg  bg-primary"
//         >
//           <Container className="container-wrapper">
//             <Navbar.Toggle
//               aria-controls="responsive-navbar-nav"
//               onClick={onhandleToggle}
//             ></Navbar.Toggle>
//             <Navbar.Collapse id="responsive-navbar-nav">
//               <Nav>
//                 <div className="leftsidenav-links navbar-nav  navbar-collapse">
//                   <Nav.Item>
//                     <LinkContainer to="/" activeClassName="">
//                       <Nav.Link
//                         eventKey={1}
//                         onClick={onhandleToggle}
//                         to="/"
//                         className={
//                           splitLocation[1] === "" || splitLocation[1] === "home"
//                             ? "nav-link pagelink-mob short-link-mob active  no-hover"
//                             : "nav-link pagelink-mob short-link-mob"
//                         }
//                       >
//                         Home
//                       </Nav.Link>
//                     </LinkContainer>
//                   </Nav.Item>
//                   <Nav.Item>
//                     <LinkContainer to="/about" activeClassName="">
//                       <Nav.Link
//                         eventKey={2}
//                         onClick={onhandleToggle}
//                         to="/about"
//                         className={
//                           splitLocation[1] === "about"
//                             ? "nav-link med-mob pagelink-mob  active"
//                             : "nav-link med-mob pagelink-mob"
//                         }
//                       >
//                         About Us
//                       </Nav.Link>
//                     </LinkContainer>
//                   </Nav.Item>
//                   <Nav.Item>
//                     <LinkContainer to="/wing" activeClassName="">
//                       <Nav.Link
//                         eventKey={3}
//                         onClick={onhandleToggle}
//                         to="/wing"
//                         className={
//                           splitLocation[1] === "wing"
//                             ? "nav-link short-link-mob pagelink-mob active"
//                             : "nav-link pagelink-mob short-link-mob"
//                         }
//                       >
//                         Wings
//                       </Nav.Link>
//                     </LinkContainer>
//                   </Nav.Item>
//                   <Nav.Item>
//                     <LinkContainer to="/event" activeClassName="">
//                       <Nav.Link
//                         eventKey={4}
//                         onClick={onhandleToggle}
//                         to="/event"
//                         className={
//                           splitLocation[1] === "event"
//                             ? "nav-link short-link-mob pagelink-mob active"
//                             : "nav-link pagelink-mob short-link-mob"
//                         }
//                       >
//                         Events
//                       </Nav.Link>
//                     </LinkContainer>
//                   </Nav.Item>
//                 </div>
//                 <a className="navbar-brand" href="/">
//                   <img
//                     src={log}
//                     alt="Vcat_Logo"
//                     style={{ width: "90px", height: "90px" }}
//                   />
//                 </a>
//                 <div className="rightsidenav-links navbar-nav  navbar-collapse">
//                   {/* <Nav.Item>
//                                         <LinkContainer to="/" activeClassName="">
//                                             <Link to="/" disable className={splitLocation[1] === "connect" ? "disable nav-link pagelink-mob med-mob " : "nav-link med-mob pagelink-mob"} >Connect</Link>

//                                         </LinkContainer>
//                                     </Nav.Item> */}
//                   <Nav.Item>
//                     <LinkContainer to="/resource" activeClassName="">
//                       <Nav.Link
//                         eventKey={5}
//                         onClick={onhandleToggle}
//                         to="/resource"
//                         className={
//                           splitLocation[1] === "resource"
//                             ? "nav-link pagelink-mob active"
//                             : "nav-link pagelink-mob"
//                         }
//                       >
//                         Resources
//                       </Nav.Link>
//                     </LinkContainer>
//                   </Nav.Item>
//                   <Nav.Item>
//                     <LinkContainer to="/contact" activeClassName="">
//                       <Nav.Link
//                         eventKey={6}
//                         onClick={onhandleToggle}
//                         to="/contact"
//                         className={
//                           splitLocation[1] === "contact"
//                             ? "nav-link pagelink-mob med-mob active"
//                             : "nav-link  med-mob pagelink-mob"
//                         }
//                       >
//                         Contact
//                       </Nav.Link>
//                     </LinkContainer>
//                   </Nav.Item>
//                   <Nav.Item>
//                     <LinkContainer to="/admin2/" activeClassName="">
//                       <Nav.Link
//                         eventKey={7}
//                         onClick={onhandleToggle}
//                         to="/admin2/"
//                         className={
//                           splitLocation[1] === "admin2"
//                             ? "nav-link pagelink-mob short-link-mob active "
//                             : "nav-link short-link-mob pagelink-mob"
//                         }
//                       >
//                         Login
//                       </Nav.Link>
//                     </LinkContainer>
//                   </Nav.Item>
//                   {/* </div> */}
//                 </div>
//               </Nav>
//             </Navbar.Collapse>
//           </Container>
//         </Navbar>
//       </header>
//     </>
//   );
// };

// export default Header;

import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import log from "../components/img/log.png";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
  const [toggle, setToggle] = useState(false);
  const onhandleToggle = () => {
    setToggle(!toggle);
  };
  //assigning location variable
  const location = useLocation();

  //destructuring pathname from location
  const { pathname } = location;

  //Javascript split method to get the name of the path in array
  const splitLocation = pathname.split("/");

  console.log("splitLocation_header", splitLocation);

  return (
    <>
      <header>
        <Navbar
          collapseOnSelect
          fixed="top"
          expand="sm"
          bg="dark"
          variant="dark"
          className="header navbar-dark fixed-top no-pad-bot navbar-expand-lg  bg-primary"
        >
          <Container className="container-wrapper">
            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              // onSelect={() => setToggle(false)}
              onClick={onhandleToggle}
            ></Navbar.Toggle>
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav>
                <div className="leftsidenav-links navbar-nav  navbar-collapse">
                  <Nav.Item>
                    <LinkContainer to="/" activeClassName="">
                      <Nav.Link
                        active={false}
                        eventKey={1}
                        to="/"
                        className={
                          splitLocation[1] === "" || splitLocation[1] === "home"
                            ? "nav-link pagelink-mob short-link-mob active  no-hover"
                            : "nav-link pagelink-mob short-link-mob"
                        }
                        // onClick={() => setToggle(false)}
                      >
                        Home
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                  <Nav.Item>
                    <LinkContainer to="/about" activeClassName="">
                      <Nav.Link
                        active={false}
                        eventKey={2}
                        to="/about"
                        className={
                          splitLocation[1] === "about"
                            ? "nav-link med-mob pagelink-mob  active"
                            : "nav-link med-mob pagelink-mob"
                        }
                      >
                        About Us
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                  <Nav.Item>
                    <LinkContainer to="/wing" activeClassName="">
                      <Nav.Link
                        active={false}
                        eventKey={3}
                        to="/wing"
                        className={
                          splitLocation[1] === "wing"
                            ? "nav-link short-link-mob pagelink-mob active"
                            : "nav-link pagelink-mob short-link-mob"
                        }
                      >
                        Wings
                        {/* <div className="dropdown " >
                                                <DropdownButton
                                                    alignRight
                                                    // onSelect={this.handleSelect}
                                                    title={wing.title}
                                                    id="dropdown-menu-align-right"
                                                >
                                                    {wingsData.map((wing, i) => {
                                                        return (
                                                            <Dropdown.Item key={i} eventKey={i} className="dropdown-item" value={wing.name}>{wing.title}
                                                            </Dropdown.Item>

                                                        );
                                                    })}
                                                </DropdownButton>
                                            </div> */}
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                  {/* <Nav.Item>
                    <LinkContainer to="/new_event" activeClassName="">
                      <Link
                        to="/new_event"
                        className={
                          splitLocation[1] === "new_event"
                            ? "nav-link short-link-mob pagelink-mob active"
                            : "nav-link pagelink-mob short-link-mob"
                        }
                      >
                        Events
                      </Link>
                    </LinkContainer>
                  </Nav.Item> */}
                  <Nav.Item>
                    <LinkContainer to="/event" activeClassName="">
                      <Nav.Link
                        active={false}
                        eventKey={4}
                        to="/event"
                        className={
                          splitLocation[1] === "event"
                            ? "nav-link short-link-mob pagelink-mob active"
                            : "nav-link pagelink-mob short-link-mob"
                        }
                      >
                        Events
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                </div>
                <a className="navbar-brand" href="/">
                  <img
                    src={log}
                    alt="Vcat_Logo"
                    style={{
                      width: "80px",
                      height: "80px",
                      marginLeft: "10px",
                    }}
                  />
                </a>
                {/* <a className="navbar-brand" href="/"><img src={log} alt="Vcat_Logo" style={{width:'100px',height:'100px'}}/></a> */}
                <div className="rightsidenav-links navbar-nav  navbar-collapse">
                  {/* <Nav.Item>
                                        <LinkContainer to="/" activeClassName="">
                                            <Link to="/" disable className={splitLocation[1] === "connect" ? "disable nav-link pagelink-mob med-mob " : "nav-link med-mob pagelink-mob"} >Connect</Link>

                                        </LinkContainer>
                                    </Nav.Item> */}
                  <Nav.Item>
                    <LinkContainer to="/gallery" activeClassName="">
                      <Nav.Link
                        active={false}
                        eventKey={5}
                        to="/gallery"
                        className={
                          splitLocation[1] === "gallery"
                            ? "nav-link pagelink-mob active"
                            : "nav-link pagelink-mob"
                        }
                      >
                        Gallery
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                  <Nav.Item>
                    <LinkContainer to="/resource" activeClassName="">
                      <Nav.Link
                        active={false}
                        eventKey={6}
                        to="/resource"
                        className={
                          splitLocation[1] === "resource"
                            ? "nav-link pagelink-mob active"
                            : "nav-link pagelink-mob"
                        }
                      >
                        Resources
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                  <Nav.Item>
                    <LinkContainer to="/contact">
                      <Nav.Link
                        active={false}
                        eventKey={7}
                        to="/contact"
                        className={
                          splitLocation[1] === "contact"
                            ? "nav-link pagelink-mob med-mob active"
                            : "nav-link  med-mob pagelink-mob"
                        }
                      >
                        Contact
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                  <Nav.Item>
                    {/* <LinkContainer to="https://vcat.co.in/admin"  activeClassName="" style={{ }}> */}
                    <a
                      href="https://admin.vcat.co.in/"
                      target="_blank"
                      rel="noreferrer"
                      className={
                        splitLocation[1] === "login"
                          ? "nav-link pagelink-mob short-link-mob active "
                          : "nav-link short-link-mob pagelink-mob"
                      }
                    >
                      Login
                    </a>

                    {/* </LinkContainer> */}
                  </Nav.Item>
                  {/* </div> */}
                </div>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
};

export default Header;
