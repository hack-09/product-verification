// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm py-4 mt-6 border-t">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="mb-2 sm:mb-0">
          © {new Date().getFullYear()} Product Verification System. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-600">
            About
          </a>
          <a href="#" className="hover:text-blue-600">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-600">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
