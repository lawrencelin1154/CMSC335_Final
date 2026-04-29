import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">LeBron's Greatest Games</span>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/browse" className={({ isActive }) => isActive ? 'active' : ''}>Browse</NavLink>
        <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>My Catalog</NavLink>
      </div>
    </nav>
  );
}
