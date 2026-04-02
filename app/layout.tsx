import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Spiritual Compass",
  description: "A mapping of belief — where do you sit on questions of the sacred?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>The Spiritual Compass</h1>
          <span>A mapping of belief</span>
        </header>
        {children}
        <footer>
          The Spiritual Compass &nbsp;·&nbsp; Inspired by{" "}
          <a href="https://www.politicalcompass.org" target="_blank" rel="noopener noreferrer">
            The Political Compass
          </a>
        </footer>
      </body>
    </html>
  );
}
