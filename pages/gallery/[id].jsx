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
        body{margin:0;padding:0;font-family:'Beiruti',sans-serif;background:#121212;color:#e0e0e0;direction:rtl}
        *{box-sizing:border-box}
        a{text-decoration:none;color:inherit}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.25);border-radius:3px}
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
    transition={{ duration: 0.5 }}
    className="fixed top-0 inset-x-0 z-40 bg-[#1f1f1f]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-lg"
  >
    <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate">
      {title}
    </h1>
    <a
      href="/"
      className="flex items-center gap-1 text-sm sm:text-base hover:text-white transition-colors"
    >
      العودة <FiArrowRight size={18} className="mt-0.5" />
    </a>
  </motion.header>
);

/* ——— Helpers ——— */
const skel =
  "rounded-xl bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[loading_1.2s_ease-in-out_infinite]";
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
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div dir="rtl" className="flex flex-col min-h-screen bg-[#121212] text-[#e0e0e0]">
      <GlobalCSS />
      <Header title={cat ? cat.name : "..."} />

      <main className="flex-1 pt-28 pb-16 px-6 sm:px-10">
        {/* Skeleton */}
        {loading && (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`${skel} w-full h-60 mb-4 rounded-xl`} />
            ))}
          </div>
        )}

        {/* Images */}
        {!loading && images.length > 0 && (
          <motion.section
            variants={container}
            initial="hidden"
            animate="visible"
            /* Tailwind columns -> CSS multi-column */
            className="columns-2 sm:columns-3 lg:columns-4 gap-4"
          >
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                variants={item}
                /* ‎`break-inside-avoid` يمنع انقسام العنصر بين عمودين */
                className="relative w-full mb-4 rounded-xl overflow-hidden shadow-lg break-inside-avoid"
              >
                {!loaded[i] && <div className={`absolute inset-0 ${skel}`} />}
                <motion.img
                  src={low(img.src)}
                  srcSet={`${img.src} 2x`}
                  alt=""
                  onLoad={() => markLoaded(i)}
                  className="w-full h-auto object-contain transition-transform duration-300 ease-out"
                  style={{ filter: loaded[i] ? "blur(0)" : "blur(20px)" }}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 240, damping: 20 }}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* Empty state */}
        {!loading && images.length === 0 && (
          <p className="text-center text-gray-400 mt-20">لا توجد صور</p>
        )}
      </main>

      <style jsx>{`
        @keyframes loading {
          0%,100% {background-position: 200% 0}
          50% {background-position: 0 0}
        }
      `}</style>
    </div>
  );
}
