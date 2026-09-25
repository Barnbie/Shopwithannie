import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { onImageError } from '../lib/imageFallback'

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
]

const inputStyle = {
  width: '100%',
  border: '1.5px solid var(--card-border)',
  borderRadius: '8px',
  padding: '0.75rem 1rem',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontFamily: 'Jost, sans-serif',
  fontSize: '0.9rem',
  outline: 'none'
}

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    country: 'Nigeria',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Lagos',
    phone: '',
    sameBillingAddress: true,
    shippingMethod: 'free',
    paymentMethod: 'card',
    savePaymentInfo: false,
    addNote: false,
    notes: '',
    agreeTerms: false
  })
  const [showApartmentField, setShowApartmentField] = useState(false)
  const [showCoupon, setShowCoupon] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms and Conditions and Privacy Policy to continue.')
      return
    }

    setIsProcessing(true)

    try {
      const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

      if (!paystackPublicKey) {
        throw new Error('Payment system is not configured yet. Please contact support.')
      }

      if (typeof window.PaystackPop === 'undefined') {
        throw new Error('Payment system failed to load. Please refresh the page and try again.')
      }

      const reference = `SWA-${Date.now()}-${Math.floor(Math.random() * 1000000)}`

      const orderMetadata = {
        custom_fields: [
          { display_name: 'Customer Name', variable_name: 'customer_name', value: `${formData.firstName} ${formData.lastName}` },
          { display_name: 'Phone', variable_name: 'phone', value: formData.phone || 'N/A' },
          { display_name: 'Shipping Address', variable_name: 'shipping_address', value: `${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.state}, ${formData.country}` },
          { display_name: 'Payment Method', variable_name: 'payment_method', value: formData.paymentMethod === 'card' ? 'Debit/Credit Card' : 'Pay on Delivery' },
          { display_name: 'Order Note', variable_name: 'order_note', value: formData.addNote ? formData.notes : 'None' },
          { display_name: 'Items', variable_name: 'items', value: cart.map(item => `${item.name} x${item.quantity}`).join(', ') }
        ]
      }

      if (formData.paymentMethod === 'delivery') {
        // No online payment needed - record the order and confirm directly
        clearCart()
        navigate('/order-success', { state: { orderId: reference, paymentMethod: 'delivery' } })
        setIsProcessing(false)
        return
      }

      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: formData.email,
        amount: Math.round(cartTotal * 100), // Paystack expects amount in kobo
        currency: 'NGN',
        ref: reference,
        metadata: orderMetadata,
        callback: (response) => {
          clearCart()
          navigate('/order-success', { state: { orderId: response.reference, paymentMethod: 'card' } })
        },
        onClose: () => {
          setIsProcessing(false)
          setError('Payment was cancelled. Your cart items are still saved.')
        }
      })

      handler.openIframe()
    } catch (err) {
      setError(err.message)
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main>
        <div className="cart-wrap-empty">
          <h1 className="cart-title">
            Check<em>out</em>
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
      <div className="checkout-page-wrap">
        <h1 className="cart-title">
          Check<em>out</em>
        </h1>

        {error && (
          <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '8px', padding: '1rem', marginBottom: '2rem', color: '#c33' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="checkout-grid">
            <div>
              {/* Contact information */}
              <div className="checkout-card">
                <h2>Contact information</h2>
                <div className="checkout-field">
                  <label>Email address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Shipping address */}
              <div className="checkout-card">
                <h2>Shipping address</h2>

                <div className="checkout-field">
                  <label>Country/Region *</label>
                  <select name="country" value={formData.country} onChange={handleChange} style={inputStyle}>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="checkout-form-row checkout-field">
                  <div>
                    <label>First name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label>Last name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="checkout-field">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                  {!showApartmentField ? (
                    <button
                      type="button"
                      onClick={() => setShowApartmentField(true)}
                      className="link-arrow"
                      style={{ marginTop: '0.6rem', background: 'none', border: 'none', padding: 0 }}
                    >
                      + Add apartment, suite, etc.
                    </button>
                  ) : (
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                      placeholder="Apartment, suite, etc. (optional)"
                      style={{ ...inputStyle, marginTop: '0.6rem' }}
                    />
                  )}
                </div>

                <div className="checkout-form-row checkout-field">
                  <div>
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label>State *</label>
                    <select name="state" value={formData.state} onChange={handleChange} style={inputStyle}>
                      {NIGERIAN_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="checkout-field">
                  <label>Phone (optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <label className="checkout-checkbox-row">
                  <input
                    type="checkbox"
                    name="sameBillingAddress"
                    checked={formData.sameBillingAddress}
                    onChange={handleChange}
                  />
                  Use same address for billing
                </label>
              </div>

              {/* Shipping options */}
              <div className="checkout-card">
                <h2>Shipping options</h2>
                <label className={`checkout-radio-option ${formData.shippingMethod === 'free' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="free"
                    checked={formData.shippingMethod === 'free'}
                    onChange={handleChange}
                  />
                  <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text)' }}>Free shipping</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold)' }}>FREE</span>
                </label>
              </div>

              {/* Payment options */}
              <div className="checkout-card">
                <h2>Payment options</h2>
                <label className={`checkout-radio-option ${formData.paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text)' }}>Debit/Credit Cards</span>
                </label>

                {formData.paymentMethod === 'card' && (
                  <div style={{ marginLeft: '1.9rem', marginBottom: '0.9rem' }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                      Make payment using your debit and credit cards
                    </p>
                    <label className="checkout-checkbox-row" style={{ marginTop: 0 }}>
                      <input
                        type="checkbox"
                        name="savePaymentInfo"
                        checked={formData.savePaymentInfo}
                        onChange={handleChange}
                      />
                      Save payment information to my account for future purchases.
                    </label>
                  </div>
                )}

                <label className={`checkout-radio-option ${formData.paymentMethod === 'delivery' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="delivery"
                    checked={formData.paymentMethod === 'delivery'}
                    onChange={handleChange}
                  />
                  <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text)' }}>Pay on delivery</span>
                </label>

                <label className="checkout-checkbox-row">
                  <input
                    type="checkbox"
                    name="addNote"
                    checked={formData.addNote}
                    onChange={handleChange}
                  />
                  Add a note to your order
                </label>

                {formData.addNote && (
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any special instructions for your order..."
                    style={{ ...inputStyle, marginTop: '0.8rem', resize: 'vertical', minHeight: '80px' }}
                  />
                )}

                <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '1.2rem' }}>
                  By proceeding with your purchase you agree to our{' '}
                  <Link to="/terms" style={{ color: 'var(--gold2)', textDecoration: 'underline' }}>Terms and Conditions</Link>{' '}
                  and{' '}
                  <Link to="/privacy" style={{ color: 'var(--gold2)', textDecoration: 'underline' }}>Privacy Policy</Link>
                </p>

                <label className="checkout-checkbox-row">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  I agree to the Terms and Conditions and Privacy Policy *
                </label>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isProcessing}
                style={{ width: '100%', opacity: isProcessing ? 0.7 : 1 }}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>

            {/* Order summary */}
            <div className="checkout-card" style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1.5rem)' }}>
              <h2>Order summary</h2>

              <div style={{ marginBottom: '1rem' }}>
                {cart.map(item => (
                  <div className="order-summary-item" key={item.id}>
                    <img src={item.image || '/images/shop.png'} alt={item.name} onError={onImageError} />
                    <div className="info">
                      <strong>{item.name}</strong>
                      Quantity: {item.quantity} · ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowCoupon(!showCoupon)}
                className="link-arrow"
                style={{ background: 'none', border: 'none', padding: 0, marginBottom: showCoupon ? '0.8rem' : '1rem' }}
              >
                Add coupons
              </button>

              {showCoupon && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button type="button" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem' }}>
                    Apply
                  </button>
                </div>
              )}

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>{formData.shippingMethod === 'free' ? 'Free shipping' : 'Shipping'}</span>
                <span>FREE</span>
              </div>
              <div className="summary-row summary-row-total">
                <span>Total</span>
                <span style={{ color: 'var(--gold)' }}>₦{cartTotal.toLocaleString()}</span>
              </div>

              <Link to="/cart" style={{ display: 'block', textAlign: 'center', marginTop: '1.2rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                Return to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

export default Checkout
