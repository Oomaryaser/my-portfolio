// File: components/Gallery.jsx
"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { FiArrowRight } from "react-icons/fi";

/* ——— Global Styles ——— */
const GlobalCSS = () => (
  <Head>
    <link
      href="https://fonts.googleapis.com/css2?family=Beiruti:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <style
      dangerouslySetInnerHTML={{
        __html: `
        body{margin:0;padding:0;font-family:'Beiruti',sans-serif;background:#0a0a0a;color:#e0e0e0;direction:rtl}
        *{box-sizing:border-box}
        a{text-decoration:none;color:inherit}
        ::-webkit-scrollbar{width:8px}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,0.05)}
        ::-webkit-scrollbar-thumb{background:linear-gradient(45deg,#6366f1,#8b5cf6);border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:linear-gradient(45deg,#4f46e5,#7c3aed)}
      `,
      }}
    />
  </Head>
);

/* ——— Header ——— */
const Header = ({ title }) => (
  <motion.header
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-black/90 via-gray-900/90 to-black/90 backdrop-blur-xl px-6 py-5 flex items-center justify-between shadow-2xl border-b border-white/10"
  >
    <motion.h1
      className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent truncate"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {title}
    </motion.h1>
    <motion.a
      href="/"
      className="flex items-center gap-2 text-sm sm:text-base px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 transition-all duration-300 backdrop-blur-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      العودة <FiArrowRight size={18} className="mt-0.5" />
    </motion.a>
  </motion.header>
);

/* ——— Helpers ——— */
const skel =
  "rounded-2xl bg-gradient-to-br from-gray-800/50 via-gray-700/50 to-gray-800/50 bg-[length:200%_200%] animate-[shimmer_2s_ease-in-out_infinite] border border-gray-700/30";
const low = (src) =>
  src.startsWith("data:")
    ? src
    : `${src}${src.includes("?") ? "&" : "?"}w=480&q=40`;

/* ——— Gallery Page ——— */
export default function Gallery() {
  const { query } = useRouter();
  const { id } = query;

  const [cat, setCat] = useState(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const catRes = await fetch(`/api/categories/${id}`);
        setCat(await catRes.json());

        const imgRes = await fetch(`/api/categories/${id}/images`);
        const list = await imgRes.json();
        setImages(Array.isArray(list) ? list : []);
        setLoaded(Array.isArray(list) ? list.map(() => false) : []);
      } catch {
        setImages([]);
        setLoaded([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const markLoaded = (i) =>
    setLoaded((prev) => {
      const copy = [...prev];
      copy[i] = true;
      return copy;
    });

  /* ——— Motion variants ——— */
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <GlobalCSS />
      <Header title={cat ? cat.name : '...'} />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 sm:px-10 lg:px-16">
        {loading && (
          <div className="gallery-grid columns-3 gap-8 space-y-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`${skel} break-inside-avoid mb-8`} 
                style={{ height: `${Math.random() * 300 + 200}px` }}
              />
            ))}
          </div>
        )}

        {!loading && images.length > 0 && (
          <motion.section
            variants={container}
            initial="hidden"
            animate="visible"
            className="gallery-grid columns-3 gap-8 space-y-8"
          >
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                variants={item}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/30 backdrop-blur-sm break-inside-avoid mb-8"
              >
                {!loaded[i] && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_ease-in-out_infinite] rounded-2xl" />
                )}
                <div className="relative overflow-hidden rounded-2xl">
                  <motion.img
                    src={low(img.src)}
                    srcSet={`${img.src} 2x`}
                    alt=""
                    onLoad={() => markLoaded(i)}
                    className="w-full h-auto"
                    style={{
                      filter: loaded[i] ? "blur(0) brightness(1) contrast(1.05)" : "blur(20px) brightness(0.8)",
                    }}
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </motion.section>
        )}

        {!loading && images.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-32">
            <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 backdrop-blur-sm">
              <p className="text-xl text-gray-300 mb-2">لا توجد صور</p>
              <p className="text-sm text-gray-500">جرب الرجوع لاحقاً</p>
            </div>
          </motion.div>
        )}
      </main>

      <style jsx>{`
        @keyframes shimmer { 0%{background-position:200% 0;} 50%{background-position:0 0;} 100%{background-position:-200% 0;} }
        .gallery-grid > div:nth-child(3n+1) { transform: translateY(-24px); }
        .gallery-grid > div:nth-child(3n+2) { transform: translateY(0); }
        .gallery-grid > div:nth-child(3n)   { transform: translateY(24px); }
      `}</style>
    </div>
  );
}