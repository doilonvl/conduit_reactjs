import React, { useState, useEffect } from 'react';
import { Row, Container, Col, Navbar, Nav } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import "../Header/Header CSS/Header.css";

const Header = () => {
    const [activeLink, setActiveLink] = useState('Home');
    const [currEmail, setCurrEmail] = useState("");
    const [currUsername, setCurrUsername] = useState("");
    const nav = useNavigate()
    const handleNavLinkClick = (link) => {
        setActiveLink(link);
    };
    const handleLogout = () => {
        localStorage.removeItem("currEmail");
        localStorage.removeItem("currUsername");
        localStorage.removeItem("currToken");
        localStorage.removeItem("currPassword");
        nav("/")
        window.location.reload();
    };
    useEffect(() => {
        setCurrEmail(localStorage.getItem("currEmail"));
    }, [localStorage.getItem("currEmail")]);
    useEffect(() => {
        setCurrUsername(localStorage.getItem("currUsername"));
    }, [localStorage.getItem("currUsername")]);

    return (
        <>
        <Navbar bg="light" expand="lg" className="d-lg-none">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {currUsername == null ? (<div>
                        <NavLink
                            to="/login"
                            className={`text-decoration Sign-in ${activeLink === 'Signin' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('Signin')}
                        >
                            Sign in
                        </NavLink>
                        <br/><NavLink
                            to="/register"
                            className={`text-decoration Sign-up ${activeLink === 'Signup' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('Signup')}
                        >
                            Sign up
                        </NavLink>
                    </div>) : (<div>
                        <NavLink
                            to="/editor/"
                            className={`text-decoration Sign-in ${activeLink === 'Signin' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('')}
                        >
                            <i className="bi bi-pencil-square"></i>
                            &nbsp;New Article

                        </NavLink>
                        <br/><NavLink
                            to="/settings"
                            className={`text-decoration Sign-up ${activeLink === 'Signup' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('')}
                        >
                            <i className="bi bi-gear-wide"></i>
                            &nbsp;Settings
                        </NavLink>
                        <br/><NavLink
                            to={'/@' + currUsername}
                            className={`text-decoration Sign-up ${activeLink === 'Signup' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('')}
                        >
                            <img src="https://api.realworld.io/images/smiley-cyrus.jpeg" className='user-pic' />{currUsername}
                        </NavLink>
                    </div>)}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
         <nav className='padding-header d-none d-lg-block'>
            <Row fluid="true">
                <Col xs={2}></Col>
                <Col xs={2} >
                    <NavLink
                        to="/home"
                        className={` Font-color text-decoration Home ${activeLink === 'Home' ? 'active' : ''}`}
                        onClick={() => handleNavLinkClick('Home')}
                    >
                        conduit
                    </NavLink>
                </Col>
                <Col xs={4}></Col>
                <Col xs={4} className='flex '>
                    <NavLink
                        to="/home"
                        className={`text-decoration Home ${activeLink === 'Home' ? 'active' : ''}`}
                        onClick={() => handleNavLinkClick('Home')}
                    >
                        Home
                    </NavLink>
                    {currUsername == null ? (<div>
                        <NavLink
                            to="/login"
                            className={`text-decoration Sign-in ${activeLink === 'Signin' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('Signin')}
                        >
                            Sign in
                        </NavLink>
                        <NavLink
                            to="/register"
                            className={`text-decoration Sign-up ${activeLink === 'Signup' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('Signup')}
                        >
                            Sign up
                        </NavLink>
                    </div>) : (<div>
                        <NavLink
                            to="/editor/"
                            className={`text-decoration Sign-in ${activeLink === 'Signin' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('')}
                        >
                            <i className="bi bi-pencil-square"></i>
                            &nbsp;New Article

                        </NavLink>
                        <NavLink
                            to="/settings"
                            className={`text-decoration Sign-up ${activeLink === 'Signup' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('')}
                        >
                            <i className="bi bi-gear-wide"></i>
                            &nbsp;Settings
                        </NavLink>
                        <NavLink
                            to={'/@' + currUsername}
                            className={`text-decoration Sign-up ${activeLink === 'Signup' ? 'active' : ''}`}
                            onClick={() => handleNavLinkClick('')}
                        >
                            <img src="https://api.realworld.io/images/smiley-cyrus.jpeg" className='user-pic' />{currUsername}
                        </NavLink>
                    </div>)}

                </Col>
            </Row>
        </nav>
        </>
       
    );
};


export default Header;
