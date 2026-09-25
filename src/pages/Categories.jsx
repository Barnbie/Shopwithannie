import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import client, { urlFor } from '../lib/sanity'
import { onImageError } from '../lib/imageFallback'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const query = '*[_type == "category"]{_id, name, title, image, images}'
        const data = await client.fetch(query)

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

        setCategories(mapped)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <main>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem var(--px) 4rem' }}>
        <div className="shop-page-header">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
            All Categories
          </h1>
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)', marginTop: '2rem' }}>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p style={{ color: 'var(--muted)', marginTop: '2rem' }}>No categories found yet.</p>
        ) : (
          <div className="categories-grid" style={{ marginTop: '2rem' }}>
            {categories.map(category => (
              <Link key={category.id} className="category-card" to={`/shop?category=${category.name}`}>
                <img src={category.image} alt={category.name} onError={onImageError} />
                <div className="category-overlay">
                  <span className="category-label">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Categories
