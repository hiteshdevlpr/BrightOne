'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logo from '@/assets/images/Logo-final@0.5x.png';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Helper function to check if a link is active based on pathname
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    const handleScroll = () => {
      // Calculate 25vh in pixels
      const viewportHeight = window.innerHeight;
      const scrollThreshold = viewportHeight * 0.25; // 25vh
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black bg-opacity-50 backdrop-blur-sm' : 'bg-slate-950'
    }`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}>
          <div className="flex items-center">
            <Link href="/">
              <Image 
                src={logo.src} 
                alt="BrightOne" 
                width={250} 
                height={40} 
                className={`transition-all duration-300 ${
                  isScrolled 
                    ? 'w-32 sm:w-36 lg:w-40 xl:w-44' 
                    : 'w-40 sm:w-48 lg:w-56 xl:w-64'
                }`} 
              />
            </Link>
          </div>
          <div className={`hidden md:flex transition-all duration-300 ${
            isScrolled ? 'md:space-x-3 lg:space-x-4 xl:space-x-6' : 'md:space-x-4 lg:space-x-6 xl:space-x-8 2xl:space-x-8'
          }`}>
            <Link 
              href="/" 
              className={`text-shadow-lg text-white uppercase transition-all font-montserrat duration-300 rounded-md py-1 px-2 border-y-2 border-x-0  hover:border-white ${
                isScrolled ? 'text-xs lg:text-sm xl:text-base' : 'text-sm lg:text-base xl:text-lg 2xl:text-xl'
              } ${
                isActive('/') 
                  ? 'border-white' 
                  : ' border-transparent'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className={`uppercase text-white transition-all font-montserrat duration-300 rounded-md py-1 px-2 border-y-2 border-x-0  hover:border-white ${
                isScrolled ? 'text-xs lg:text-sm xl:text-base' : 'text-sm lg:text-base xl:text-lg 2xl:text-xl'
              } ${
                isActive('/services') 
                  ? 'border-white' 
                  : ' border-transparent'
              }`}
            >
              Services
            </Link>
            <Link 
              href="/portfolio" 
              className={`uppercase text-white transition-all font-montserrat duration-300 rounded-md py-1 px-2 border-y-2 border-x-0  hover:border-white ${
                isScrolled ? 'text-xs lg:text-sm xl:text-base' : 'text-sm lg:text-base xl:text-lg 2xl:text-xl'
              } ${
                isActive('/portfolio') 
                  ? 'border-white' 
                  : ' border-transparent'
              }`}
            >
              Portfolio
            </Link>
            <Link 
              href="/booking" 
              className={`uppercase text-white transition-all font-montserrat duration-300 rounded-md py-1 px-2 border-y-2 border-x-0  hover:border-white ${
                isScrolled ? 'text-xs lg:text-sm xl:text-base' : 'text-sm lg:text-base xl:text-lg 2xl:text-xl'
              } ${
                isActive('/booking') 
                  ? 'border-white' 
                  : ' border-transparent'
              }`}
            >
              Book Now
            </Link>
            <Link 
              href="/about" 
              className={`uppercase text-white transition-all font-montserrat duration-300 rounded-md py-1 px-2 border-y-2 border-x-0  hover:border-white ${
                isScrolled ? 'text-xs lg:text-sm xl:text-base' : 'text-sm lg:text-base xl:text-lg 2xl:text-xl'
              } ${
                isActive('/about') 
                  ? 'border-white' 
                  : ' border-transparent'
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`uppercase text-white transition-all font-montserrat duration-300 rounded-md py-1 px-2 border-y-2 border-x-0  hover:border-white ${
                isScrolled ? 'text-xs lg:text-sm xl:text-base' : 'text-sm lg:text-base xl:text-lg 2xl:text-xl'
              } ${
                isActive('/contact') 
                  ? 'border-white' 
                  : ' border-transparent'
              }`}
            >
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

