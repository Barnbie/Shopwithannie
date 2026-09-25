import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <Link to="/" className="footer-logo">
              Shop With <em>Ani</em>
            </Link>
            <p className="footer-desc">
              Premium, affordable hair accessories that elevate your look. Based in Lagos & Awka — delivering to every state in Nigeria.
            </p>
            <div className="socials">
              <a href="https://www.instagram.com/shop_with.anii" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i> Instagram
              </a>
              <a href="https://wa.me/message/LEDWQUIGLVF" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i> WhatsApp
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Quick Links</h5>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/shop">Shop</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/terms">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Contact Us</h5>
            <div className="footer-contact-details">
              <div className="footer-contact-item">
                <i className="fas fa-phone-alt"></i>
                <span>+234 000 000 0000</span>
              </div>
              <div className="footer-contact-item">
                <i className="fas fa-envelope"></i>
                <span>hello@shopwithani.com</span>
              </div>
              <div className="footer-contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Lagos & Awka, Nigeria.<br />Nationwide delivery.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Shop With Ani. All rights reserved.</span>
          <span>Developed by <strong>LUMIEE WEB STUDIO</strong></span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
