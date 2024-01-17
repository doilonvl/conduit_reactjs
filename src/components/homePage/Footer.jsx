import React from 'react';
import "../homePage/homePage.css/Footer.css"
const Footer = () => {
    return (
        <div className='fixed-bottom'>
            <div className='abc'>
                <a href="https://github.com/gothinkster/angularjs-realworld-example-app" target='_blank'>
                    <i className="bi bi-github margin-right"></i>
                    Fork on GitHub
                </a>
            </div>
        </div>
    );
};

export default Footer;