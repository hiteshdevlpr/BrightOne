'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/Logo-final@0.25x.png';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black bg-opacity-50 backdrop-blur-sm' : 'bg-slate-950'
    }`}>
      <div className="mx-24 px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <Image src={logo.src} alt="BrightOne" width={300} height={40} className="w-200" />
            </Link>
          </div>
          <div className="hidden md:flex md:space-x-8 xl:space-x-16">
            <Link href="/" className="text-white text-shadow-lg uppercase 2xl:text-3xl xl:text-2xl md:text-xl text-2xl hover:text-blue-600 transition-colors">
              Home
            </Link>
            {/* <Link href="/services" className="text-white uppercase 2xl:text-3xl xl:text-2xl md:text-xl text-2xl hover:text-blue-600 transition-colors">
              Services
            </Link> */}
            {/* <Link href="/portfolio" className="text-white uppercase 2xl:text-3xl xl:text-2xl md:text-xl text-2xl hover:text-blue-600 transition-colors">
              Portfolio
            </Link> */}
            <Link href="/booking" className="text-white uppercase 2xl:text-3xl xl:text-2xl md:text-xl text-2xl hover:text-blue-600 transition-colors">
              Book Now
            </Link>
            <Link href="/about" className="text-white uppercase 2xl:text-3xl xl:text-2xl md:text-xl text-2xl hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-white 2xl:text-3xl xl:text-2xl md:text-xl text-2xl uppercase hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </div>
          <button className="btn-primary md:hidden">
            Menu
          </button>
        </div>
      </div>
    </nav>
  );
}

