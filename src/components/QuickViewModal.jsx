import React from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { onImageError } from '../lib/imageFallback'

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [quantity, setQuantity] = React.useState(1)
  const [showToast, setShowToast] = React.useState(false)

  if (!isOpen || !product) return null

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...product, id: product._id || product.id })
    }
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleWishlist = () => {
    if (isInWishlist(product._id || product.id)) {
      removeFromWishlist(product._id || product.id)
    } else {
      addToWishlist(product)
    }
  }

  return createPortal(
    <>
      <div
        className="quick-view-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClose}
      />
      <div
        className="quick-view-modal"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '90vw',
          width: '600px',
          maxHeight: '85vh',
          overflowY: 'auto',
          zIndex: 9999,
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          alignItems: 'start'
        }}
        onClick={e => e.stopPropagation()}
      >
          <button
            onClick={onClose}
            aria-label="Close quick view"
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--card-border)',
              background: '#fff',
              color: 'var(--text2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              zIndex: 2
            }}
          >
            <i className="fas fa-times"></i>
          </button>

          {/* Image */}
          <div>
            <img
              src={product.image || '/images/shop.png'}
              alt={product.name}
              onError={onImageError}
              style={{
                width: '100%',
                borderRadius: 'var(--radius-lg)',
                objectFit: 'cover',
                background: 'var(--bg3)'
              }}
            />
          </div>

          {/* Details */}
          <div>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
              {product.category}
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.8rem' }}>
              {product.name}
            </h2>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold)', marginBottom: '1.5rem' }}>
              ₦{product.price?.toLocaleString ? product.price.toLocaleString() : product.price}
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--card-border)', borderRadius: '8px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    color: 'var(--text)'
                  }}
                >
                  −
                </button>
                <span style={{ padding: '0 1rem', fontSize: '0.9rem', fontWeight: 500 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    color: 'var(--text)'
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary"
                style={{ flex: 1, padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
              >
                Add to Cart
              </button>

              <button
                onClick={handleWishlist}
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--card-border)',
                  background: isInWishlist(product._id || product.id) ? 'var(--gold)' : 'transparent',
                  color: isInWishlist(product._id || product.id) ? '#fff' : 'var(--text2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  transition: 'all 0.25s'
                }}
              >
                <i className="fas fa-heart"></i>
              </button>
            </div>

            {product.stock !== undefined && (
              <p style={{ fontSize: '0.8rem', color: product.stock > 0 ? 'var(--gold)' : 'var(--muted)', marginBottom: '1.5rem' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            )}

            <div style={{ padding: '1.2rem', background: 'var(--bg2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h5 style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text)', fontWeight: 600, marginBottom: '0.5rem' }}>
                Product Features
              </h5>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: '1.6' }}>
                <li>Premium quality materials</li>
                <li>Handcrafted with care</li>
                <li>Suitable for all hair types</li>
              </ul>
            </div>
          </div>
        </div>

        {showToast && (
          <div className="toast show">
            Added to cart! ✓
          </div>
        )}
    </>,
    document.body
  )
}

export default QuickViewModal
