import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Spiritual Compass",
  description: "A mapping of belief — where do you sit on questions of the sacred?",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg text-primary font-sans font-light min-h-screen">
        <header className="border-b-2 border-primary px-10 py-[18px] flex items-baseline gap-6">
          <h1 className="font-serif text-[1.3rem] font-bold tracking-[0.02em]">
            The Spiritual Compass
          </h1>
          <span className="text-[0.8rem] text-muted tracking-[0.08em] uppercase">
            A mapping of belief
          </span>
        </header>

        {children}

        <footer className="border-t border-border px-10 py-4 text-[0.75rem] text-muted mt-20">
          The Spiritual Compass &nbsp;·&nbsp; Inspired by{" "}
          <a
            href="https://www.politicalcompass.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted"
          >
            The Political Compass
          </a>
        </footer>
      </body>
    </html>
  );
}
