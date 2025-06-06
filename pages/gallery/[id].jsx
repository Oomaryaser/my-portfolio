import React, { useEffect, useState } from 'react';
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
      <main className="flex-1 max-w-7xl mx-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <p className="col-span-full text-center">جاري التحميل...</p>
        ) : images.length ? (
          images.map(img => (
            <div key={img.id} className="relative w-full" style={{ paddingTop: '100%' }}>
              <img src={img.src} alt="" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">لا توجد صور</p>
        )}
      </main>
    </div>
  );
}
