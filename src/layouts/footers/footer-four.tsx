'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RightArrowTwo } from '@/components/svg';

const FOOTER_LINKS_LEFT = [
  { label: 'Home', href: '/' },
  { label: 'Booking', href: '/booking' },
  { label: 'Contact', href: '/contact' },
];
const FOOTER_LINKS_RIGHT = [
  { label: 'About', href: '/about-us' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
];

const SOCIAL = [
  { label: 'Facebook', href: 'https://www.facebook.com/BrightOneInc', icon: 'fa-brands fa-facebook-f' },
  { label: 'Instagram', href: 'https://www.instagram.com/brightoneinc', icon: 'fa-brands fa-instagram' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/brightoneInc/', icon: 'fa-brands fa-linkedin-in' },
];

export default function FooterFour() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: could wire to newsletter API later
    if (email.trim()) setEmail('');
  };

  return (
    <footer className="footer-three-col">
      <div className="footer-three-col__container">
        <div className="footer-three-col__grid">
          {/* Left column: Website map + Newsletter */}
          <div className="footer-three-col__left">
            <h4 className="footer-three-col__heading footer-three-col__heading--website-map">Website map</h4>
            <div className="footer-three-col__links-wrap">
              <ul className="footer-three-col__links">
                {FOOTER_LINKS_LEFT.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="footer-three-col__link font-size-16">{label}</Link>
                  </li>
                ))}
              </ul>
              <ul className="footer-three-col__links">
                {FOOTER_LINKS_RIGHT.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="footer-three-col__link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* <h4 className="footer-three-col__heading">Newsletter</h4>
            <form className="footer-newsletter" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="footer-newsletter__input"
                aria-label="Email for newsletter"
              />
              <button type="submit" className="footer-newsletter__btn" aria-label="Subscribe">
                <RightArrowTwo />
              </button>
            </form> */}
          </div>

          {/* Middle column: Tagline, brand, copyright */}
          <div className="footer-three-col__center">
            <p className="footer-three-col__tagline">
              Real estate Listing & Branding Media services.
            </p>
            <Link href="/" className="footer-three-col__brand-logo">
              <Image src="/logo-wo-shadow.png" alt="BrightOne Creative" width={260} height={68} style={{ height: 68, width: 'auto' }} />
            </Link>
            <p className="footer-three-col__copy">
              © {new Date().getFullYear()} BrightOne Creative Inc. All rights reserved.
            </p>
          </div>

          {/* Right column: Contact + Follow */}
          <div className="footer-three-col__right">
            <h4 className="footer-three-col__heading">Contact</h4>
            <div className="footer-three-col__contact">
              <p>Durham, ON</p>
              <p>P: (416) 419-9689</p>
              <p>
                <a href="mailto:contact@brightone.ca" className="footer-three-col__link">
                  E: contact@brightone.ca
                </a>
              </p>
            </div>
            <h4 className="footer-three-col__heading">Follow</h4>
            <div className="footer-three-col__social">
              {SOCIAL.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-three-col__social-link"
                  aria-label={label}
                >
                  <i className={icon} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
