import React from 'react'
import { Link } from "react-router-dom";
import { SignupForm } from "@wasp/auth/forms/Signup";

const SignupPage = ({ toggleSignupOverlay, signupOverlayVisible }) => {
  return (
    <>
      <div className={`overlay ${signupOverlayVisible ? "visible" : ""}`}>
        <div className="overlay-content">
          <SignupForm />
          <Link to="/" className="close-overlay" onClick={toggleSignupOverlay}>
            Close
          </Link>
        </div>
      </div>

      <br />
      <span>
        I already have an account (<Link to="/login">go to login</Link>).
      </span>
    </>
  );
};

export default SignupPage;
