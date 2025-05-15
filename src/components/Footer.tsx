import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          {/* Logo and Image */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="relative w-32 h-32">
              <Image
                src="/football.png"
                alt="Football Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-white">NFE Predictions</h2>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/matches" className="hover:text-primary transition-colors">
                    Matches
                  </Link>
                </li>
                <li>
                  <Link href="/predictions" className="hover:text-primary transition-colors">
                    Predictions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/how-it-works" className="hover:text-primary transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} NFE Predictions. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Twitter</span>
              {/* Replace with your icon */}
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>
            {/* Add other social icons similarly */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;