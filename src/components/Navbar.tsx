'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const navLinks = [
    { href: "/matches", label: "Matches" },
    { href: "/predict", label: "Predictions" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-primary-500 hover:text-primary-400 transition-colors"
        >
          NFE
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-primary-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button className="ml-4 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors">
            Settings
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

     {/* Mobile Menu */}
<div
  className={`md:hidden transition-all duration-300 ease-in-out ${
    isMobileMenuOpen ? "block" : "hidden"
  }`}
>
  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
    {navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => setIsMobileMenuOpen(false)} // Close menu on selection
        className={`block px-3 py-2 rounded-md text-base font-medium ${
          pathname.startsWith(link.href)
            ? "bg-gray-900 text-white"
            : "text-gray-300 hover:text-white hover:bg-gray-700"
        }`}
      >
        {link.label}
      </Link>
    ))}
    <button
      onClick={() => setIsMobileMenuOpen(false)} // Close menu on button click
      className="block w-full text-left bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
    >
      Settings
    </button>
  </div>
</div>
    </nav>
  );
};

export default Navbar;
