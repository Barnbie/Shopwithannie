import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import client, { urlFor } from '../lib/sanity'
import { onImageError } from '../lib/imageFallback'

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Hair Clips', image: '/images/shop.png' },
  { id: 2, name: 'Headbands', image: '/images/shop.png' },
  { id: 3, name: 'Scrunchies', image: '/images/shop.png' },
  { id: 4, name: 'Hair Pins', image: '/images/shop.png' }
]

const Home = () => {
  const [bestSellers, setBestSellers] = useState([])
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const query = '*[_type == "product"] | order(_createdAt desc) [0...12]{_id, name, price, images, "category": coalesce(category->name, category->title), slug}'
        const data = await client.fetch(query)
        setBestSellers(data.map(p => {
          const firstImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null
          return {
            id: p._id,
            _id: p._id,
            name: p.name || '',
            price: typeof p.price === 'number' ? p.price : 0,
            category: typeof p.category === 'string' ? p.category : '',
            slug: p.slug ? (typeof p.slug === 'string' ? p.slug : p.slug.current || '') : '',
            image: firstImage ? urlFor(firstImage).width(400).height(500).url() || '/images/shop.png' : '/images/shop.png'
          }
        }))
      } catch (error) {
        console.error('Error fetching products:', error)
        setBestSellers([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    const fetchCategories = async () => {
      try {
        // Fetch actual category documents (not product data) - try multiple
        // likely field names at once (name/title, image/images) since we
        // don't yet know the exact schema; whichever one is real will have data.
        const query = '*[_type == "category"]{_id, name, title, image, images}'
        const data = await client.fetch(query)

        if (data.length > 0) {
          console.log('%cRAW CATEGORY DOCUMENTS FROM SANITY:', 'color: red; font-weight: bold; font-size: 14px;', data)
        }

        const mapped = data.map((c, idx) => {
          const displayName = c.name || c.title || ''
          let imgSource = null
          if (c.image) {
            imgSource = c.image
          } else if (Array.isArray(c.images) && c.images.length > 0) {
            imgSource = c.images[0]
          }
          const imgUrl = imgSource ? urlFor(imgSource).width(400).height(400).url() : null
          return {
            id: c._id || idx + 1,
            name: displayName,
            image: imgUrl || '/images/shop.png'
          }
        }).filter(c => c.name)

        // Home page only ever shows a max of 4 categories
        setCategories(mapped.length > 0 ? mapped.slice(0, 4) : DEFAULT_CATEGORIES)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories(DEFAULT_CATEGORIES)
      }
    }

    fetchCategories()
  }, [])

  const testimonials = [
    {
      stars: '★★★★★',
      text: 'I absolutely love my hair clips from Shop With Ani! The quality is amazing and delivery was super fast. Already placed my second order!',
      author: 'Chioma O., Lagos'
    },
    {
      stars: '★★★★★',
      text: 'Finally found a store with affordable, premium accessories. The packaging is so cute too. Will definitely recommend to my friends!',
      author: 'Adaeze N., Awka'
    },
    {
      stars: '★★★★★',
      text: 'The headbands are gorgeous and hold so well throughout the day. Excellent customer service when I had a question about my order too!',
      author: 'Blessing A., Abuja'
    }
  ]

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    console.log('Newsletter signup:', email)
    alert('Thank you for subscribing!')
    e.target.reset()
  }

  return (
    <>
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: 'url("/images/hero.png")' }}></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(4rem, 6vw, 4.5rem)', fontWeight: 700, color: 'var(--text2)', }}>
            Premium Hair 
          </h1>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(4rem, 6vw, 4.5rem)', fontWeight: 700, color: '#fff', marginBottom: '2rem' }}>
            <em style={{ fontStyle: 'italic', color: 'var(--gold2)' }}>Accessories</em>
          </h1>
          <div className="hero-btns">
            <Link to="/shop" className="btn-primary">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">
            Shop by <em>Category</em>
          </h2>
          <Link to="/categories" className="link-arrow">
            Browse All
          </Link>
        </div>
        <div className="categories-grid">
          {categories.map(category => (
            <Link key={category.id} className="category-card" to={`/shop?category=${category.name}`}>
              <img
                src={category.image}
                alt={category.name}
                onError={onImageError}
              />
              <div className="category-overlay">
                <span className="category-label">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">
            Best <em>Sellers</em>
          </h2>
          <Link to="/shop" className="link-arrow">
            View All
          </Link>
        </div>
        <div className="products-grid">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">What Our <em>Customers Say</em></h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-stars">{testimonial.stars}</div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <span className="testimonial-author">— {testimonial.author}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="newsletter-section">
        <h2>
          Stay in the <em style={{ color: 'var(--gold2)' }}>Loop</em>
        </h2>
        <p>Join our mailing list for exclusive offers, new arrivals, and styling tips.</p>
        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <input
            className="newsletter-input"
            type="email"
            name="email"
            placeholder="Enter your email address"
            required
          />
          <button className="btn-primary" type="submit">
            Subscribe
          </button>
        </form>
      </section>
    </>
  )
}

export default Home
