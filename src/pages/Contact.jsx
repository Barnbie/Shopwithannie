import React, { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('')

    try {
      const resendApiKey = import.meta.env.VITE_RESEND_API_KEY
      
      if (!resendApiKey) {
        throw new Error('Email service configuration error. Please contact support.')
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'Shop With Ani <hello@shopwithani.com>',
          to: 'hello@shopwithani.com',
          subject: `Contact Form: ${formData.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Message:</strong></p>
            <p>${formData.message}</p>
          `
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message. Please try again.')
      }

      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setSubmitStatus('error')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <div className="contact-wrap">
        <div className="contact-grid">
          <div className="contact-info">
            <h1>Get in <em>Touch</em></h1>
            <p>Have a question about an order, need help choosing the right accessory, or want to enquire about wholesale? We are here for you.</p>
            <div className="contact-details">
              <div className="contact-detail">
                <i className="fab fa-whatsapp"></i>
                <div>
                  <strong>WhatsApp</strong>
                  <span>
                    <a href="https://wa.me/message/LEDWQUIGLVF" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>
                      Click to chat
                    </a>
                  </span>
                </div>
              </div>
              <div className="contact-detail">
                <i className="fab fa-instagram"></i>
                <div>
                  <strong>Instagram</strong>
                  <span>
                    <a href="https://www.instagram.com/shop_with.anii" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>
                      @shop_with.anii
                    </a>
                  </span>
                </div>
              </div>
              <div className="contact-detail">
                <i className="fas fa-envelope"></i>
                <div>
                  <strong>Email</strong>
                  <span>hello@shopwithani.com</span>
                </div>
              </div>
              <div className="contact-detail">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Locations</strong>
                  <span>Lagos & Awka. Nationwide delivery.</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <a href="https://wa.me/message/LEDWQUIGLVF" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Chat on WhatsApp
              </a>
              <a href="https://www.instagram.com/shop_with.anii" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ background: 'transparent', border: '1.5px solid var(--gold)', color: 'var(--gold)' }}>
                Instagram DM
              </a>
            </div>
          </div>

          <div className="form-card">
            <h2>Send a <em>Message</em></h2>
            
            {submitStatus === 'success' && (
              <div style={{ background: '#efe', border: '1px solid #cfc', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#3c3' }}>
                Thank you for your message! We will get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#c33' }}>
                Failed to send message. Please try again or contact us directly via WhatsApp.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="5"
                className="form-input form-textarea"
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{ alignSelf: 'flex-start', opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Contact
