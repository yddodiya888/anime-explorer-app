import "./globals.css";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import Providers from "@/store/Providers";

import LoadingProvider from "@/components/LoadingProvider";
import PageLoader from "@/components/loader/PageLoader";

export const metadata = {
  title: "Anime Explorer",
  description: "Discover your next favorite anime",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LoadingProvider>
          <PageLoader />

          <Providers>
            <Navbar />

            {children}

            <Footer />
          </Providers>
        </LoadingProvider>
      </body>
    </html>
  );
}