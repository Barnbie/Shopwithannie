import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Categories from './pages/Categories'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import About from './pages/About'
import Contact from './pages/Contact'

const NotFound = () => (
  <main style={{ padding: 'calc(var(--nav-h) + 4rem) var(--px)', textAlign: 'center' }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h1>
    <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
      The page you are looking for does not exist.
    </p>
    <a href="/" className="btn-primary">Back to Home</a>
  </main>
)

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <Header />
          <main style={{ paddingTop: 'var(--nav-h)' }}>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <Footer />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
