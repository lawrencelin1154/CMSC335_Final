import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Favorites from './pages/Favorites';

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </>
  );
}
