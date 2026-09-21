import Link from "next/link";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-about">
          <Link href="/" className="footer-logo">
            Anime Explorer
          </Link>

          <p>
            Discover your next favorite anime,
            explore new stories, and find amazing
            characters.
          </p>
        </div>


        <div className="footer-links">

          <h3>Quick Links</h3>

          <Link href="/">Home</Link>

          <Link href="/anime">Anime</Link>

          <Link href="/search">Search</Link>

        </div>


        <div className="footer-links">

          <h3>Explore</h3>

          <Link href="/anime">All Anime</Link>

          <Link href="/search">Search Anime</Link>

        </div>

      </div>


      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Anime Explorer.
          All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;