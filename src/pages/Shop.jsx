import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import client, { urlFor } from '../lib/sanity'

const Shop = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const categoryFilter = searchParams.get('category')
  const searchQuery = searchParams.get('search')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        console.log('Fetching products from Sanity...')
        let query = '*[_type == "product"]'
        
        if (categoryFilter) {
          query += `[category->name == "${categoryFilter}" || category->title == "${categoryFilter}"]`
        }
        
        if (searchQuery) {
          query += `[name match "*${searchQuery}*"]`
        }
        
        query += '{_id, name, price, images, "category": coalesce(category->name, category->title), slug}'
        
        console.log('Query:', query)
        const data = await client.fetch(query)
        console.log('Products fetched:', data)

        setProducts(data.map(p => {
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
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryFilter, searchQuery])

  const categories = ['Hair Clips', 'Headbands', 'Scrunchies', 'Hair Pins', 'Head Bands & Durags', 'Silk Durags']

  return (
    <main>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem var(--px) 4rem' }}>
        <div className="shop-page-header">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
            {categoryFilter ? categoryFilter : searchQuery ? `Search: "${searchQuery}"` : 'Shop'}
          </h1>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              {loading ? 'Loading...' : `${products.length} products`}
            </p>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.href = '/shop'}
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', background: !categoryFilter && !searchQuery ? 'var(--gold2)' : 'var(--gold)' }}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => window.location.href = `/shop?category=${encodeURIComponent(cat)}`}
                  className="btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', background: categoryFilter === cat ? 'var(--gold2)' : 'var(--gold)' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            No products found. {categoryFilter || searchQuery ? 'Try a different filter or search term.' : 'Check back soon!'}
          </div>
        ) : (
          <div className="products-grid" style={{ marginTop: '1.5rem' }}>
            {products.map(product => (
              <ProductCard key={product._id} product={{ ...product, id: product._id }} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Shop
