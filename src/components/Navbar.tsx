import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Home, BookOpen, Wrench, Users, User, LogIn, ChevronRight, Newspaper } from "lucide-react";

import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const isActive = (path) => location.pathname === path;

  const themeColors = {
    primary: '#9BBE82',
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/blog', label: 'Blog', icon: <Newspaper size={18} /> },
    { to: '/Resource', label: 'Resource', icon: <BookOpen size={18} /> },
    { to: '/tools', label: 'Tools', icon: <Wrench size={18} /> },
    { to: '/community', label: 'Community', icon: <Users size={18} /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'backdrop-blur-xl shadow-lg' : 'backdrop-blur-md'
    } ${theme === 'dark' ? 'bg-black/80 border-zinc-800' : 'bg-white/80 border-zinc-200'} border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9BBE82] to-[#7a9864] flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <img
                  src="https://res.cloudinary.com/ddx6avza4/image/upload/v1744129312/n_rz5riq.png"
                  alt="Logo"
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div className="flex flex-col">
              <span className="text-xl font-logo nuvibrainz-gradient">
  Nuvibrainz
</span>

                <span className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'} -mt-1`}>
                  "Fueling Brainzees For Future"
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${
                    isActive(link.to)
                      ? `bg-[${themeColors.primary}]/10 text-[${themeColors.primary}] font-semibold`
                      : `${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'} hover:${theme === 'dark' ? 'text-white' : 'text-black'} hover:bg-zinc-100/10`
                  }`}
                  style={{
                    backgroundColor: isActive(link.to) ? `${themeColors.primary}20` : '',
                    color: isActive(link.to) ? themeColors.primary : '',
                  }}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center ml-4 space-x-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <Link to="/profile">
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-1.5 ${theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'} rounded-lg`}
                    >
                      <div className={`w-7 h-7 rounded-full ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'} flex items-center justify-center`}>
                        <User size={14} />
                      </div>
                      <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-[#9BBE82] text-[#9BBE82] hover:bg-[#9BBE82] hover:text-white transition-colors duration-300 rounded-lg"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button className="bg-[#9BBE82] text-white hover:bg-[#8CAD75] flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all rounded-lg">
                    <LogIn size={16} />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className={`rounded-full ${theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden animate-in slide-in-from-top duration-300">
          <div className={`px-3 pt-3 pb-4 space-y-2 border-b ${theme === 'dark' ? 'bg-black/95 border-zinc-800' : 'bg-white/95 border-zinc-200'} backdrop-blur-xl`}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-[#9BBE82]/10 text-[#9BBE82] font-semibold'
                    : `${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'} hover:${theme === 'dark' ? 'text-white' : 'text-black'} hover:bg-zinc-100/10`
                }`}
                style={{
                  backgroundColor: isActive(link.to) ? `${themeColors.primary}15` : '',
                  color: isActive(link.to) ? themeColors.primary : '',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`${isActive(link.to) ? 'bg-[#9BBE82]/20' : theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'} p-2 rounded-lg`}>
                    {link.icon}
                  </div>
                  {link.label}
                </div>
                <ChevronRight size={18} className={theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'} />
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={closeMenu}>
                  <div className={`block px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${theme === 'dark' ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-black'} hover:bg-zinc-100/10`}>
                    <div className="flex items-center gap-3">
                      <div className={`${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'} p-2 rounded-lg`}>
                        <User size={18} />
                      </div>
                      Profile
                    </div>
                    <ChevronRight size={18} className={theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'} />
                  </div>
                </Link>
                <div className="pt-3 px-2">
                  <Button
                    variant="outline"
                    className="w-full border-[#9BBE82] text-[#9BBE82] hover:bg-[#9BBE82] hover:text-white mt-2 py-6 font-medium rounded-xl"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-3 px-2">
                <Link to="/login" onClick={closeMenu}>
                  <Button className="w-full bg-[#9BBE82] text-white hover:bg-[#8CAD75] flex items-center gap-2 justify-center py-6 font-medium shadow-sm rounded-xl">
                    <LogIn size={18} />
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;