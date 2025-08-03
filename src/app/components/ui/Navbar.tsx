'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Home, User, LogIn, LogOut, UserPlus, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); 
  };

  const navLinks = (
    <>
      {isAuthenticated ? (
        <>
          <Link href="/" className="nav-link"><Home size={20} /> <span>Home</span></Link>
          <Link href={`/profile/${user?.id}`} className="nav-link"><User size={20} /> <span>Profile</span></Link>
          <button onClick={handleLogout} className="nav-link text-red-500 w-full justify-start">
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className="nav-link"><LogIn size={20} /> <span>Login</span></Link>
          <Link href="/register" className="nav-link"><UserPlus size={20} /> <span>Register</span></Link>
        </>
      )}
    </>
  );

  return (
    // ✨ The <header> is now the root element, making it full-width.
    // It's sticky to the very top of the page.
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* The <nav> is now centered inside the full-width header */}
      <nav className="container mx-auto max-w-7xl px-4 flex justify-between items-center py-3">
        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          LinkedIn Mini
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-md text-slate-700 hover:bg-slate-100"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col p-4 space-y-1">
            {navLinks}
          </div>
        </div>
      )}
    </header>
  );
}