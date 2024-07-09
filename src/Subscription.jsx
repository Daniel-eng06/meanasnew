import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const Subscription = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState(""); // State for feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    setSuccess(""); // Reset success state

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!feedback) {
      setError("Please enter your feedback.");
      return;
    }

    try {
      await addDoc(collection(db, "subscriptions"), {
        email,
        feedback, // Save feedback to Firestore
      });
      setEmail(""); // Reset the input field
      setFeedback(""); // Reset the feedback field
      setSuccess("You have successfully subscribed and your feedback has been received!");
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    console.error("Subscription error:", error);
    setError("An error occurred while subscribing. Please try again later.");
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubscribe}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Your feedback"
          required
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
};

export default Subscription;
