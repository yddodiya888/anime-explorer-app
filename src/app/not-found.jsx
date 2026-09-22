import Link from "next/link";

import "./not-found.css";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-content">

        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          Sorry, the page you are looking for does not exist.
        </p>

        <Link href="/" className="not-found-button">
          Go Home
        </Link>

      </div>
    </main>
  );
}