import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useLocation, Link } from "react-router-dom";
import logo from '../components/img/logo.png';
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => {
    //assigning location variable
    const location = useLocation();

    //destructuring pathname from location
    const { pathname } = location;

    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/");
    // console.log('loc==>', splitLocation[1]);
    return (
        <>
            <header>
                <Navbar collapseOnSelect fixed="top" expand="sm" bg="dark" variant="dark" className='header navbar-dark fixed-top navbar-expand-lg  bg-primary'>
                    <Container>
                        <Navbar.Toggle aria-controls='responsive-navbar-nav'></Navbar.Toggle>
                        <Navbar.Collapse id='responsive-navbar-nav'>
                            <Nav >
                                <div className='leftsidenav-links navbar-nav  navbar-collapse'>
                                </div>
                                <Link className="navbar-brand" to="/"><img src={logo} alt="Vcat_Logo" /></Link>

                                <div className="rightsidenav-links navbar-nav  navbar-collapse">
                                    <Nav.Item>
                                        <LinkContainer to="/">
                                            <Link className={splitLocation[1] === "" ? "nav-link pagelink-mob short-link-mob active " : "nav-link short-link-mob pagelink-mob"} >Login</Link>
                                        </LinkContainer>
                                    </Nav.Item>

                                </div>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        </>
    )
}

export default Header