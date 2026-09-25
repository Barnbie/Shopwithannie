import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import QuickViewModal from './QuickViewModal'
import { onImageError } from '../lib/imageFallback'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [showToast, setShowToast] = React.useState(false)
  const [showQuickView, setShowQuickView] = React.useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <Link className="product-img-link" to={`/product/${product.id}`}>
          <img
            className="product-img"
            src={product.image || '/images/shop.png'}
            alt={product.name}
            onError={onImageError}
          />
        </Link>
        <div className="product-card-actions">
          <button
            className="product-action-btn btn-cart"
            onClick={handleAddToCart}
            title="Add to Cart"
          >
            <i className="fas fa-shopping-bag"></i>
          </button>
          <button
            className="product-action-btn"
            onClick={() => setShowQuickView(true)}
            title="Quick View"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            className={`product-action-btn btn-wishlist ${isInWishlist(product.id) ? 'active' : ''}`}
            onClick={handleWishlist}
            title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
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
      {showToast && (
        <div className="toast show">
          Added to cart! <Link className="toast-cart-link" to="/cart">View Cart →</Link>
        </div>
      )}

      <QuickViewModal 
        product={product} 
        isOpen={showQuickView} 
        onClose={() => setShowQuickView(false)} 
      />
    </div>
  )
}

export default ProductCard
