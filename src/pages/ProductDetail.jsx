import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'
import client, { urlFor } from '../lib/sanity'
import { onImageError } from '../lib/imageFallback'

const getDescriptionText = (description) => {
  if (!description) return ''
  if (typeof description === 'string') return description
  if (Array.isArray(description)) {
    return description
      .map(block => {
        if (typeof block === 'string') return block
        if (block.children) {
          return block.children.map(child => {
            if (typeof child === 'string') return child
            if (child.text) return child.text
            return ''
          }).join('')
        }
        return ''
      })
      .join(' ')
  }
  return ''
}

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description')

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--card-border)', paddingTop: '2rem' }}>
      <div className="product-tabs-container" style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--card-border)', marginBottom: '2rem' }}>
        {[
          { id: 'description', label: 'Description' },
          { id: 'info', label: 'Additional Information' },
          { id: 'reviews', label: 'Reviews (0)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 0',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: activeTab === tab.id ? 'var(--text)' : 'var(--text2)',
              transition: 'all 0.3s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'description' && (
          <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--text2)' }}>
            {product.description || 'No description available.'}
          </div>
        )}
        {activeTab === 'info' && (
          <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--text2)' }}>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Premium quality materials</li>
              <li>Handcrafted with care</li>
              <li>Suitable for all hair types</li>
              <li>Durable and long-lasting</li>
            </ul>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div style={{ fontSize: '0.95rem', color: 'var(--text2)' }}>
            No reviews yet. Be the first to review this product!
          </div>
        )}
      </div>
    </div>
  )
}

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setActiveImage(0)
        const query = `*[_type == "product" && _id == $id][0]{
          _id,
          name,
          price,
          description,
          images,
          "category": coalesce(category->name, category->title),
          slug,
          stock
        }`
        const data = await client.fetch(query, { id })
        if (data) {
          const imageUrls = Array.isArray(data.images)
            ? data.images.map(img => urlFor(img).width(800).height(800).url()).filter(Boolean)
            : []
          const images = imageUrls.length > 0 ? imageUrls : ['/images/shop.png']
          const mainImageUrl = images[0]

          const cleanedProduct = {
            _id: data._id || '',
            name: data.name || '',
            price: typeof data.price === 'number' ? data.price : 0,
            description: getDescriptionText(data.description),
            image: mainImageUrl,
            images,
            category: typeof data.category === 'string' ? data.category : '',
            slug: data.slug ? (typeof data.slug === 'string' ? data.slug : data.slug.current || '') : '',
            stock: typeof data.stock === 'number' ? data.stock : 0
          }
          setProduct(cleanedProduct)

          if (cleanedProduct.category) {
            const relatedQuery = `*[_type == "product" && (category->name == $category || category->title == $category) && _id != $id][0...4]{_id, name, price, images, "category": coalesce(category->name, category->title), slug}`
            const relatedData = await client.fetch(relatedQuery, { category: cleanedProduct.category, id })
            setRelated(relatedData.map(p => {
              const firstImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null
              return {
                id: p._id,
                name: p.name || '',
                price: typeof p.price === 'number' ? p.price : 0,
                category: typeof p.category === 'string' ? p.category : '',
                image: firstImage ? urlFor(firstImage).width(400).height(500).url() || '/images/shop.png' : '/images/shop.png'
              }
            }))
          } else {
            setRelated([])
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({ ...product, id: product._id })
      }
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handleWishlist = () => {
    if (product) {
      if (isInWishlist(product._id)) {
        removeFromWishlist(product._id)
      } else {
        addToWishlist({ ...product, id: product._id })
      }
    }
  }

  if (loading) {
    return (
      <main style={{ padding: 'calc(var(--nav-h) + 2rem) var(--px)', textAlign: 'center' }}>
        Loading product...
      </main>
    )
  }

  if (!product) {
    return (
      <main style={{ padding: 'calc(var(--nav-h) + 2rem) var(--px)', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/shop" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          Back to Shop
        </Link>
      </main>
    )
  }

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image]

  return (
    <main>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem var(--px) 4rem' }}>
        {/* Product Image and Details Grid */}
        <div className="product-detail-grid" style={{ marginBottom: '3rem' }}>
          {/* Product Image + Gallery */}
          <div>
            <div className="product-gallery-main" style={{ position: 'relative' }}>
              <img
                src={galleryImages[activeImage] || '/images/shop.png'}
                alt={product.name}
                onError={onImageError}
              />
              <button
                style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  zIndex: 2
                }}
                onClick={() => window.history.back()}
              >
                ←
              </button>
            </div>

            {galleryImages.length > 1 && (
              <div className="product-gallery-thumbs">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    className={`product-gallery-thumb ${activeImage === index ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} onError={onImageError} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            {/* Category */}
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.75rem' }}>
              Categories: {product.category}
            </p>

            {/* Title */}
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
              {product.name}
            </h1>

            {/* Price */}
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '1.5rem' }}>
              ₦{product.price.toLocaleString()}
            </p>

            {/* Add to Wishlist */}
            <button
              onClick={handleWishlist}
              className={`wishlist-link-btn ${isInWishlist(product._id) ? 'active' : ''}`}
            >
              <i className="fas fa-heart"></i>
              {isInWishlist(product._id) ? 'Remove from' : 'Add to'} Wishlist
            </button>

            {/* Quantity Selector and Add to Cart */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--card-border)', borderRadius: '6px', overflow: 'hidden' }}>
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
                <span style={{ padding: '0 1rem', fontSize: '0.9rem', fontWeight: 500, borderLeft: '1px solid var(--card-border)', borderRight: '1px solid var(--card-border)' }}>{quantity}</span>
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
                style={{ flex: 1, padding: '0.75rem 1.5rem' }}
              >
                Add to Cart
              </button>
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <p style={{ fontSize: '0.8rem', color: product.stock > 0 ? 'var(--gold)' : '#d9534f', marginBottom: '1.5rem', fontWeight: 500 }}>
                {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
              </p>
            )}

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: '1.8' }}>
                <strong>Category:</strong> {product.category}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <ProductTabs product={product} />

        {/* Related Products */}
        {related.length > 0 && (
          <div className="related-products-section">
            <h2 className="section-title">
              You May Also <em>Like</em>
            </h2>
            <div className="products-grid">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {showToast && (
        <div className="toast show">
          Added to cart! <Link className="toast-cart-link" to="/cart">View Cart →</Link>
        </div>
      )}
    </main>
  )
}

export default ProductDetail
