import React from 'react'
import { Link } from 'react-router-dom'
import { LoginForm } from '@wasp/auth/forms/Login'

const LoginPage = ({ toggleOverlay, overlayVisible }) => {
  return (
    <>
      <br />
        <div className={`overlay ${overlayVisible ? 'visible' : ''}`}>
          <div className="overlay-content">
            <LoginForm />
            <Link to="/" className="close-overlay" onClick={toggleOverlay}>
              Close
            </Link>
          </div>
        </div>
      <span>
        I don't have an account yet (<Link to="/signup">go to signup</Link>).
      </span>
    </>
  )
}

export default LoginPage