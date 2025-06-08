// File: components/Gallery.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function Gallery() {
  const router = useRouter();
  const { id } = router.query;

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
        const list   = await imgRes.json();
        setImages(Array.isArray(list) ? list : []);
        setLoaded(Array.isArray(list) ? list.map(() => false) : []);
      } catch {
        setImages([]); setLoaded([]);
      } finally { setLoading(false); }
    })();
  }, [id]);

  const markLoaded = i => setLoaded(p => { const a=[...p]; a[i]=true; return a; });

  const container = { hidden:{opacity:0}, visible:{opacity:1, transition:{staggerChildren:.06}} };
  const item      = { hidden:{opacity:0, y:20}, visible:{opacity:1, y:0} };

  const skel = `rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[loading_1.2s_ease-in-out_infinite]`;
  const low  = src => `${src}${src.includes('?') ? '&' : '?'}w=480&q=40`;

  const headerCls =
    "fixed top-4 inset-x-4 sm:inset-x-6 md:inset-x-10 lg:inset-x-16 z-50 flex justify-between items-center " +
    "px-5 py-3 md:py-4 bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/40 text-gray-900";

  return (
    <div dir="rtl" className="font-[Beiruti] flex flex-col min-h-screen bg-white text-gray-900">
      <header className={headerCls}>
        <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">{cat ? cat.name : '...'}</h1>
        <a href="/" className="hover:underline text-sm sm:text-base">العودة</a>
      </header>

      <main className="flex-1 w-full max-w-none p-4 pt-24">
        {loading && (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ height: 240 }} className={skel} />
            ))}
          </div>
        )}

        {!loading && images.length > 0 && (
          <motion.section variants={container} initial="hidden" animate="visible"
                          className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img, i) => (
              <motion.div key={img.id} variants={item}
                          className="break-inside-avoid rounded-xl overflow-hidden relative group">
                {!loaded[i] && <div className={`absolute inset-0 ${skel}`} />}
                <motion.img
                  src={low(img.src)} srcSet={`${img.src} 2x`} alt=""
                  className="w-full h-auto rounded-xl shadow-md transition-transform"
                  style={{ filter: loaded[i] ? 'blur(0px)' : 'blur(20px)', transition:'filter .4s' }}
                  onLoad={() => markLoaded(i)}
                  initial={{ scale:1 }} whileHover={{ scale:1.04 }}
                  transition={{ type:'spring', stiffness:260 }} loading="lazy"
                />
              </motion.div>
            ))}
          </motion.section>
        )}

        {!loading && images.length === 0 && (
          <p className="text-center text-gray-500 mt-20">لا توجد صور</p>
        )}
      </main>

      <style jsx>{`
        @keyframes loading { 0%,100%{background-position:200% 0} 50%{background-position:0 0} }
      `}</style>
    </div>
  );
}
