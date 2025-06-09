import React from "react";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-50 text-gray-700 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div>
          <h2 className="text-xl font-bold text-blue-600">QuickDoc</h2>
          <p className="mt-2 text-sm">
            Your trusted partner in digital healthcare. Connect with doctors
            anytime, anywhere.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#how-it-works" className="hover:text-blue-600">
                How It Works
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-blue-600">
                Consultation Packages
              </a>
            </li>
            <li>
              <a href="#credits" className="hover:text-blue-600">
                Credit System
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-600">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-2">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" />
              cdileepkumar22@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500" />
              +91 8639288481
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook">
              <Facebook className="w-5 h-5 hover:text-blue-600" />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter className="w-5 h-5 hover:text-blue-600" />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram className="w-5 h-5 hover:text-blue-600" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t mt-10 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} QuickDoc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
