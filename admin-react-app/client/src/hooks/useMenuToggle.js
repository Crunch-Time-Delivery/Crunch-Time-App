import { useState, useRef, useEffect } from 'react';

export function useMenuToggle() {
  const dropdownRef = useRef();

  const toggleDropdown = () => {
    if (dropdownRef.current) {
      const style = dropdownRef.current.style;
      style.display = style.display === 'block' ? 'none' : 'block';
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        dropdownRef.current.style.display = 'none';
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return { dropdownRef, toggleDropdown };
}import { useRef, useEffect } from 'react';

export function useMenuToggle() {
  const dropdownRef = useRef();

  const toggleDropdown = () => {
    if (dropdownRef.current) {
      const style = dropdownRef.current.style;
      style.display = style.display === 'block' ? 'none' : 'block';
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        dropdownRef.current.style.display = 'none';
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return { dropdownRef, toggleDropdown };
}