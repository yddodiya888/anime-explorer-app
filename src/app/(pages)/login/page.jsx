"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  // CHECK IF USER IS ALREADY LOGGED IN
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn === "true") {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "admin@example.com" && password === "123456") {
      localStorage.setItem("loggedIn", "true");

      window.dispatchEvent(new Event("loginStatusChanged"));

      // replace instead of push
      router.replace("/");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <main className="login-page">
      <div className="explore_more">
        <h1>
          Please, login for <br />
          exploring more anime
        </h1>
      </div>

      <div className="login-box">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit">Login</button>
        </form>
      </div>
    </main>
  );
}
