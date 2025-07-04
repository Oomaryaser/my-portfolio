// File: components/Home.jsx
"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

/* — Global Dark Styles — */
const GlobalCSS = () => (
  <Head>
    <link
      href="https://fonts.googleapis.com/css2?family=Beiruti:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <style
      dangerouslySetInnerHTML={{
        __html: `
          body {
            margin: 0;
            padding: 0;
            font-family: 'Beiruti', sans-serif;
            background: #121212;
            color: #e0e0e0;
            direction: rtl;
          }
          *, *::before, *::after {
            box-sizing: border-box;
          }
          a {
            text-decoration: none;
            color: inherit;
          }
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 3px;
          }
        `,
      }}
    />
  </Head>
);

/* — Header — */
function Header({ onMenu }) {
  const tabs = ['التصميم', 'معرضي'];
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-20 bg-[#1f1f1f]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-lg"
    >
      <span className="text-2xl font-bold truncate">مرئيات عمر</span>
      <div className="flex items-center space-x-4 space-x-reverse">
        <nav className="hidden md:flex space-x-6 space-x-reverse">
          {tabs.map((t) => (
            <a key={t} href="#" className="px-2 py-1 font-medium hover:text-white">
              {t}
            </a>
          ))}
        </nav>
        <button onClick={onMenu} className="md:hidden p-2">
          <FiMenu size={24} />
        </button>
      </div>
    </motion.header>
  );
}

/* — Mobile Menu — */
function MobileMenu({ isOpen, onClose }) {
  const tabs = ['التصميم', 'معرضي'];
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed inset-0 z-30 bg-[#121212]/95 p-6 flex flex-col space-y-4"
        >
          <button onClick={onClose} className="self-start p-2">
            <FiX size={24} />
          </button>
          {tabs.map((t) => (
            <a key={t} href="#" className="block py-3 text-xl font-medium">
              {t}
            </a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* — Slider with optional thin mode — */
function Slider({ slider, thin = false }) {
  const [slides, setSlides] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetch(`/api/slides/${slider}`)
      .then((r) => r.json())
      .then((d) => setSlides(Array.isArray(d) ? d : []));
  }, [slider]);

  useEffect(() => {
    if (slides.length < 2) return;
    const iv = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(iv);
  }, [slides]);

  // إخفاء السلايدر الكبير إذا ماكو صور؛ السلايدر الرفيع يبقى دومًا
  if (slides.length === 0 && !thin) return null;

  const wrapperClasses = thin
    ? 'w-full h-24 rounded-lg overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 relative'
    : 'w-full h-80 rounded-lg overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 relative';

  return (
    <div className="relative w-full">
      <div className={wrapperClasses}>
        {slides.map((s, i) => (
          <motion.a
            key={i}
            href={s.link || '#'}
            initial={{ opacity: 0 }}
            animate={{ opacity: idx === i ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img src={s.src} alt="" className="w-full h-full object-cover" />
          </motion.a>
        ))}
      </div>
      {!thin && slides.length > 0 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, i) => (
            <motion.span
              key={i}
              onClick={() => setIdx(i)}
              animate={{ scale: idx === i ? 1.3 : 1, opacity: idx === i ? 1 : 0.5 }}
              whileHover={{ scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="block w-2 h-2 bg-blue-500 rounded-full cursor-pointer"
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* — Section with Dark Cards — */
function Section({ title, items = [], loading }) {
  return (
    <div className="px-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-right">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 space-x-reverse pb-2">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-60 aspect-square bg-gray-700 animate-pulse rounded-lg"
                />
              ))
          : items.map((x) => (
              <a key={x.id} href={x.link} className="flex-shrink-0 w-60">
                <div className="w-full aspect-square bg-[#1f1f1f] rounded-lg overflow-hidden">
                  <img src={x.src} alt={x.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-2 text-sm text-gray-300 text-center">{x.name}</div>
              </a>
            ))}
      </div>
    </div>
  );
}

/* — Main Component — */
export default function Home() {
  const [skills, setSkills] = useState([]);
  const [logos, setLogos] = useState([]);
  const [ldS, setLdS] = useState(true);
  const [ldL, setLdL] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) =>
        setSkills(
          Array.isArray(d)
            ? d.map((c) => ({
                id: c.id,
                src: c.cover,
                name: c.name,
                link: `/gallery/${c.id}`,
              }))
            : []
        )
      )
      .finally(() => setLdS(false));

    fetch('/api/logo-categories')
      .then((r) => r.json())
      .then((d) =>
        setLogos(
          Array.isArray(d)
            ? d.map((c) => ({
                id: c.id,
                src: c.cover,
                name: c.name,
                link: `/logos/${c.id}`,
              }))
            : []
        )
      )
      .finally(() => setLdL(false));
  }, []);

  return (
    <div className="min-h-screen">
      <GlobalCSS />
      <Header onMenu={() => setMenuOpen(true)} />
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* السلايدر الكبير (h-48) */}
      <div className="mt-20 mb-4 px-6">
        <Slider slider="1" />
      </div>

      {/* السلايدر النحيف (h-24) */}
      <div className="mb-8 px-6">
        <Slider slider="2" thin />
      </div>

      {/* الأقسام */}
      <Section title="أقسام مهاراتي" items={skills} loading={ldS} />
      <Section title="شعارات بنيتها" items={logos} loading={ldL} />
    </div>
  );
}
