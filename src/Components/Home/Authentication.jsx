import React, { useState, useEffect } from "react";
import { auth, db, analytics, googleProvider } from '../../firebase'; // Import the correct googleProvider instance
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Authentication.css";
import { logEvent } from "firebase/analytics";

const Authentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan || "Explorer Plan"; // default to Explorer Plan

  // Function to handle user authentication (sign up or sign in)
  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save the user details in Firestore under 'users' collection
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          plan: plan,
          signupDate: serverTimestamp()
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      // Navigate to the dashboard after successful authentication
      navigate("/Dashboard", { state: { plan: plan } });
    } catch (error) {
      handleError(error);
    }
  };

  // New function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider); // Use googleProvider from the import
      const user = result.user;

      // Check if the user is signing up for the first time
      if (result.additionalUserInfo.isNewUser) {
        // Save the user details in Firestore under 'users' collection
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          plan: plan,
          signupDate: serverTimestamp()
        });
      }

      // Navigate to the dashboard after successful authentication
      navigate("/Dashboard", { state: { plan: plan } });
    } catch (error) {
      handleError(error);
    }
  };

  // Function to handle errors during authentication
  const handleError = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        setError("This email is already in use. Please use a different email.");
        break;
      case "auth/invalid-email":
        setError("Invalid email format. Please enter a valid email address.");
        break;
      case "auth/weak-password":
        setError("Weak password. Password should be at least 6 characters long.");
        break;
      case "auth/user-not-found":
        setError("No user found with this email. Please sign up first.");
        break;
      case "auth/wrong-password":
        setError("Incorrect password. Please try again.");
        break;
      default:
        setError("An unexpected error occurred. Please try again later.");
    }
  };

  // Effect to monitor authentication state and redirect user if already signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is authenticated, redirect to Dashboard
        console.log("User is authenticated:", user);
        navigate("/Dashboard", { state: { plan: location.state?.plan } });
      } else {
        // If user is not authenticated, log the status
        console.log("No user is signed in.");
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [navigate, location.state]);

  const image = {
    MeanAsLogo: "NobgLogo.png",
    vid1: "Gradient 2.mp4",
  };

  // Function to handle link click events and log them in analytics
  const handleLinkClick = (linkAuth) => {
    logEvent(analytics, 'link_click', { link_auth: linkAuth });
  };

  return (
    <div className="auth">
      <video id="background-video" src={image.vid1} controls loop autoPlay muted />
      <Link className="meanaslogo" to="/">
        <img src={image.MeanAsLogo} alt="MeanAs Logo" />
      </Link>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleAuth} className="forms">
        <label className="labs">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
        />
        <label className="labs">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="#MeanAs.ai"
          required
        />
        <button  id='sign'
          type="submit" 
          onClick={() => handleLinkClick(isSignUp ? "Signup with Email" : "Signin with Email")}
        >
          {isSignUp ? "Signup with Email" : "Signin with Email"}
        </button>
      </form>
      <p id="or">OR</p>
      <button onClick={() => setIsSignUp(!isSignUp)} id='sign' >
        {isSignUp ? "Signin with Email" : "Signup with Email"}
      </button>
      {/* New Google Sign-In Button */}
      <button className="google-signin" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Authentication;
