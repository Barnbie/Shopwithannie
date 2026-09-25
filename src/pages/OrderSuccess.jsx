import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const OrderSuccess = () => {
  const location = useLocation()
  const orderId = location.state?.orderId || 'N/A'

  return (
    <main>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem var(--px)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', color: 'var(--gold)', marginBottom: '1rem' }}>
          <i className="fas fa-check-circle"></i>
        </div>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
          Order <em style={{ fontStyle: 'italic', color: 'var(--gold2)' }}>Confirmed</em>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: '1.8', marginBottom: '2rem' }}>
          Thank you for your order! We have received your order and will begin processing it right away.
        </p>
        
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Order Number</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)' }}>{orderId}</p>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: '1.7', marginBottom: '2rem' }}>
          A confirmation email has been sent to your email address with your order details. You can track your order status or contact us if you have any questions.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
          <a href="https://wa.me/message/LEDWQUIGLVF" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ background: 'transparent', border: '1.5px solid var(--gold)', color: 'var(--gold)' }}>
            Contact Support
          </a>
        </div>
      </div>
    </main>
  )
}

export default OrderSuccess
