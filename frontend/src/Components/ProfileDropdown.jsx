// src/components/ProfileDropdown.jsx
import React, { useEffect, useRef, useState } from 'react';
import { LogOut, User, Settings } from 'lucide-react';

// In a real application, you would import the Link component from your routing library.
// import { Link } from 'react-router-dom';
const Link = ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>;

const menuItems = [
  {
    label: 'Profile',
    icon: User,
    href: '/profile',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export default function ProfileDropdown({ user, onLogout, isOpen, doctorName, closeDropdown }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemsRef = useRef([]);

  // Effect to handle keyboard navigation within the dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      const menuItems = itemsRef.current;
      if (!menuItems.length) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const newIndex = (activeIndex + 1) % menuItems.length;
        setActiveIndex(newIndex);
        menuItems[newIndex]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const newIndex = (activeIndex - 1 + menuItems.length) % menuItems.length;
        setActiveIndex(newIndex);
        menuItems[newIndex]?.focus();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (activeIndex !== -1) {
          menuItems[activeIndex]?.click();
          closeDropdown();
        }
      } else if (event.key === 'Tab') {
        closeDropdown();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeIndex, closeDropdown]);

  // Reset active index when dropdown is closed
  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
    }
  }, [isOpen]);

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
      className={`absolute right-0 mt-2 w-56 origin-top-right bg-gray-700/90 backdrop-blur-md rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition-all duration-200 ease-out ${
        isOpen
          ? 'transform opacity-100 scale-100'
          : 'transform opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="py-1" role="none">
        <div className="px-4 py-3 border-b border-gray-600">
          <p className="text-sm font-semibold text-gray-200 truncate">
            {user?.name ? `Dr. ${doctorName}` : doctorName}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {user?.email || 'email@example.com'}
          </p>
        </div>
        {menuItems.map((item, index) => (
          <Link
            key={item.label}
            to={item.href}
            role="menuitem"
            ref={(el) => (itemsRef.current[index] = el)}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white focus:bg-gray-600 focus:outline-none"
            onMouseEnter={() => setActiveIndex(index)}
          >
            <item.icon className="w-4 h-4 mr-3" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
        <button
          role="menuitem"
          onClick={onLogout}
          ref={(el) => (itemsRef.current[menuItems.length] = el)}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 border-t border-gray-600 focus:bg-red-500/20 focus:outline-none"
          onMouseEnter={() => setActiveIndex(menuItems.length)}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}