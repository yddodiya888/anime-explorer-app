"use client";

import { useState } from "react";
import { useLoading } from "@/components/LoadingProvider";
import "./Contact.css";

export default function Contact() {
  const { loading, startLoading, stopLoading } = useLoading();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Please enter a subject.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    startLoading();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("CONTACT RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to send your message.");
      }

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setSuccessMessage("Your message has been sent successfully!");
    } catch (error) {
      console.error("CONTACT SUBMIT ERROR:", error);

      setErrorMessage(
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-header">
        <p className="contact-label">GET IN TOUCH</p>

        <h1>Contact Us</h1>

        <p className="contact-description">
          Have a question or feedback? Send us a message.
        </p>
      </section>

      <section className="contact-form-wrapper">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />

            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>

            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Enter subject"
              value={formData.subject}
              onChange={handleChange}
            />

            {errors.subject && <p className="form-error">{errors.subject}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>

            <textarea
              id="message"
              name="message"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              rows="5"
            />

            {errors.message && <p className="form-error">{errors.message}</p>}
          </div>

          {successMessage && (
            <div className="form-success">{successMessage}</div>
          )}

          {errorMessage && (
            <div className="form-submit-error">{errorMessage}</div>
          )}

          <button type="submit" className="contact-submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </main>
  );
}
