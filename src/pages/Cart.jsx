import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { onImageError } from '../lib/imageFallback'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <main>
        <div className="cart-wrap-empty">
          <h1 className="cart-title">
            Your <em>Cart</em>
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Your cart is empty</p>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="cart-page-wrap">
        <h1 className="cart-title">
          Your <em>Cart</em>
        </h1>

        <div className="cart-container">
          <div className="cart-items">
            {cart.map(item => (
              <div className="cart-line" key={item.id}>
                <img
                  className="cart-line-img"
                  src={item.image || '/images/shop.png'}
                  alt={item.name}
                  onError={onImageError}
                />
                <div className="cart-line-info">
                  <Link to={`/product/${item.id}`} className="cart-line-name">
                    {item.name}
                  </Link>
                  <p className="cart-line-category">{item.category || 'Hair Accessory'}</p>
                  <p className="cart-line-price-mobile">₦{item.price.toLocaleString()}</p>
                </div>

                <div className="cart-line-qty">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="cart-line-total">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>

                <button
                  className="cart-line-remove"
                  onClick={() => removeFromCart(item.id)}
                  title="Remove item"
                  aria-label="Remove item"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}

            <div className="cart-continue-row">
              <Link to="/shop" className="btn-primary btn-outline-gold">
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="checkout-summary">
            <h2 className="summary-title">Cart Totals</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₦{cartTotal.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-row summary-row-total">
              <span>Total</span>
              <span style={{ color: 'var(--gold)' }}>₦{cartTotal.toLocaleString()}</span>
            </div>

            <Link to="/checkout" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', textAlign: 'center' }}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Cart
