import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function Gallery() {
  const router = useRouter();
  const { id } = router.query;
  const [cat, setCat] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const resC = await fetch(`/api/categories/${id}`);
        const c = await resC.json();
        setCat(c);
        const resI = await fetch(`/api/categories/${id}/images`);
        const imgs = await resI.json();
        setImages(Array.isArray(imgs) ? imgs : []);
      } catch {
        setImages([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div dir="rtl" className="font-[Beiruti] min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="bg-black text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">{cat ? cat.name : '...'}</h1>
        <a href="/" className="hover:underline">العودة</a>
      </header>
      <main className="flex-1 max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="mb-4 h-40 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : images.length ? (
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
            {images.map(img => (
              <motion.img
                key={img.id}
                src={img.src}
                alt=""
                className="mb-4 w-full rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">لا توجد صور</p>
        )}
      </main>
    </div>
  );
}
