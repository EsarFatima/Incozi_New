import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 text-white">
      <div className="container-custom py-12">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">INCOZI</h3>
            <p className="text-dark-400 text-sm">
              Professional consultation platform connecting service seekers with qualified business consultants.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-dark-400 text-sm">
              <li><Link to="/services" className="hover:text-primary-400 transition-colors">Bookkeeping</Link></li>
              <li><Link to="/services" className="hover:text-primary-400 transition-colors">Tax Compliance</Link></li>
              <li><Link to="/services" className="hover:text-primary-400 transition-colors">Consultation</Link></li>
              <li><Link to="/services" className="hover:text-primary-400 transition-colors">Incorporation</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-dark-400 text-sm">
              <li><a href="#about" className="hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#blog" className="hover:text-primary-400 transition-colors">Blog</a></li>
              <li><a href="#contact" className="hover:text-primary-400 transition-colors">Contact</a></li>
              <li><a href="#careers" className="hover:text-primary-400 transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-dark-400 text-sm">
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><a href="#cookie" className="hover:text-primary-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-dark-400 text-sm">
              © {currentYear} INCOZI. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#facebook" className="text-dark-400 hover:text-primary-400 transition-colors">
                f
              </a>
              <a href="#twitter" className="text-dark-400 hover:text-primary-400 transition-colors">
                𝕏
              </a>
              <a href="#linkedin" className="text-dark-400 hover:text-primary-400 transition-colors">
                in
              </a>
              <a href="#instagram" className="text-dark-400 hover:text-primary-400 transition-colors">
                📷
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
