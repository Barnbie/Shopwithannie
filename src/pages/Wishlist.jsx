import React from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import QuickViewModal from '../components/QuickViewModal'

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [showToast, setShowToast] = React.useState(null)
  const [quickViewProduct, setQuickViewProduct] = React.useState(null)

  const handleAddToCart = (product) => {
    addToCart(product)
    setShowToast(product.id)
    setTimeout(() => setShowToast(null), 3000)
  }

  if (wishlist.length === 0) {
    return (
      <main>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem var(--px) 4rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Your <em style={{ fontStyle: 'italic', color: 'var(--gold2)' }}>Wishlist</em>
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Your wishlist is empty</p>
          <Link to="/shop" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem var(--px) 4rem' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '2rem' }}>
          Your <em style={{ fontStyle: 'italic', color: 'var(--gold2)' }}>Wishlist</em>
        </h1>

        <div className="products-grid">
          {wishlist.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-img-wrap">
                <Link className="product-img-link" to={`/product/${product.id}`}>
                  <img
                    className="product-img"
                    src={product.image || '/images/shop.png'}
                    alt={product.name}
                  />
                </Link>
                <div className="product-card-actions">
                  <button
                    className="product-action-btn btn-cart"
                    onClick={() => handleAddToCart(product)}
                    title="Add to Cart"
                  >
                    <i className="fas fa-shopping-bag"></i>
                  </button>
                  <button
                    className="product-action-btn"
                    onClick={() => setQuickViewProduct(product)}
                    title="Quick View"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="product-action-btn btn-wishlist active"
                    onClick={() => removeFromWishlist(product.id)}
                    title="Remove from Wishlist"
                  >
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
              </div>
              <div className="product-info">
                <Link to={`/product/${product.id}`}>
                  <p className="product-name">{product.name}</p>
                </Link>
                <p className="product-price">₦{product.price.toLocaleString()}</p>
              </div>
              {showToast === product.id && (
                <div className="toast show">
                  Added to cart! <Link className="toast-cart-link" to="/cart">View Cart →</Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          isOpen={!!quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}
    </main>
  )
}

export default Wishlist
