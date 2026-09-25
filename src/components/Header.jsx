import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const location = useLocation()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    document.body.style.overflow = isMobileMenuOpen ? '' : 'hidden'
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setTimeout(() => {
        const searchInput = document.querySelector('.search-bar-input')
        if (searchInput) searchInput.focus()
      }, 100)
    }
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ]

  return (
    <>
      <nav>
        <div className="nav-inner">
          <button className="hamburger" onClick={toggleMobileMenu} aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="nav-left">
            <ul className="nav-links">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className={location.pathname === link.path ? 'active' : ''}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link to="/" className="logo">
            Shop With <em>Ani</em>
          </Link>

          <div className="nav-right">
            <button className="nav-icon" onClick={toggleSearch} aria-label="Search">
              <i className="fas fa-search"></i>
            </button>
            <div className="cart-wrap">
              <Link to="/wishlist" className="nav-icon" aria-label="Wishlist">
                <i className="fas fa-heart"></i>
                {wishlistCount > 0 && (
                  <span className="cart-badge">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>
            <div className="cart-wrap">
              <Link to="/cart" className="nav-icon" aria-label="Cart">
                <i className="fas fa-shopping-bag"></i>
              </Link>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className={`search-bar ${isSearchOpen ? 'open' : ''}`}>
        <div className="search-bar-inner">
          <i className="fas fa-search search-bar-icon"></i>
          <input
            className="search-bar-input"
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
              }
            }}
          />
          <button className="search-bar-close" onClick={closeSearch} aria-label="Close search">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <ul className="mobile-nav-links">
            {navLinks.map(link => (
              <li key={link.path}>
                <Link to={link.path} onClick={toggleMobileMenu}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={toggleMobileMenu}
      ></div>
    </>
  )
}

export default Header
