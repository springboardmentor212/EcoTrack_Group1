import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ForgotPassword.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')

    // Backend API will be connected here later
    console.log('Email submitted:', email)

    alert('OTP request submitted successfully!')
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <Link to="/login" className="back-link">
          ← Back to Login
        </Link>

        <h1>Forgot Password?</h1>

        <p className="description">
          Enter your registered email address to receive a 6-digit
          verification code.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit">
            Send OTP
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword