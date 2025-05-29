/* File: pages/index.jsx */
import React, { useEffect, useRef, useState } from 'react';

/*——— شريط تمرير أبيض ———*/
const ScrollbarStyles = () => (
  <style>{`
    .white-scroll::-webkit-scrollbar       { height: 10px; background:#fff }
    .white-scroll::-webkit-scrollbar-thumb { background:#fff; border-radius:5px }
    .white-scroll::-webkit-scrollbar-track { background:#fff }
    .white-scroll                         { scrollbar-width:thin; scrollbar-color:#fff #fff }
  `}</style>
);

/*——— مربع Skeleton ———*/
const Placeholder = () => (
  <div className="w-64 h-64 rounded-2xl bg-gray-200/80 animate-pulse shrink-0" />
);

/*——— شريط سحب أفقي ———*/
function ScrollStrip({ title, items, loading }) {
  const wrap        = useRef(null);
  const dragging    = useRef(false);
  const startX      = useRef(0);
  const startScroll = useRef(0);
  const hintSeen    = useRef(false);   // لإخفاء تلميحة السحب بعد أول تفاعل

  /*——— Pointer Events للسحب ———*/
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    const onPointerDown = e => {
      dragging.current   = true;
      startX.current     = e.clientX;
      startScroll.current = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.classList.add('cursor-grabbing');
      if (!hintSeen.current) hintSeen.current = true;  // إخفاء التلميحة
    };

    const onPointerMove = e => {
      if (!dragging.current) return;
      el.scrollLeft = startScroll.current - (e.clientX - startX.current);
    };

    const onPointerUp = e => {
      dragging.current = false;
      el.releasePointerCapture(e.pointerId);
      el.classList.remove('cursor-grabbing');
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup',   onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup',   onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  /*——— أزرار الأسهم ———*/
  const scrollBy = dir => {
    wrap.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
    if (!hintSeen.current) hintSeen.current = true;
  };

  const SkeletonRow = (
    <div className="flex gap-4">
      {Array.from({ length: 6 }).map((_, i) => <Placeholder key={i} />)}
    </div>
  );

  const ImagesRow = (
    <div className="flex gap-4 w-max">
      {items.map(({ id, src }) => (
        <div key={id} className="w-64 h-64 shrink-0 rounded-2xl overflow-hidden bg-gray-100 snap-center">
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );

  return (
    <section className="space-y-3">
      <h2 className="text-lg md:text-xl font-semibold text-right">{title}</h2>

      {/* حاوية الشريط + السهمين */}
      <div className="relative group">
        {/* سهم يسار */}
        <button
          aria-label="Scroll left"
          onClick={() => scrollBy( -1 )}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/60 backdrop-blur-sm
                     opacity-0 group-hover:opacity-100 transition"
        >
          ‹
        </button>

        {/* الشريط */}
        <div
          ref={wrap}
          dir="rtl"
          className="white-scroll overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 cursor-grab"
        >
          {loading
            ? SkeletonRow
            : items.length ? ImagesRow : <p className="text-gray-500 px-4">لا توجد عناصر للعرض</p>}
        </div>

        {/* سهم يمين */}
        <button
          aria-label="Scroll right"
          onClick={() => scrollBy( 1 )}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/60 backdrop-blur-sm
                     opacity-0 group-hover:opacity-100 transition"
        >
          ›
        </button>
      </div>

      {/* تلميحة السحب */}
      {!hintSeen.current && (
        <p className="text-center text-sm text-gray-500 select-none">← اسحب لرؤية المزيد →</p>
      )}
    </section>
  );
}

/*——— الصفحة الرئيسية ———*/
export default function Home() {
  const [skills, setSkills] = useState([]);
  const [logos,  setLogos]  = useState([]);
  const [loadS,  setLoadS]  = useState(true);
  const [loadL,  setLoadL]  = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r  = await fetch('/api/categories');
        const d  = await r.json();
        const arr = Array.isArray(d) ? d.filter(c => c.cover).map(c => ({ id:c.id, src:c.cover })) : [];
        setSkills(arr);
      } catch { setSkills([]); }
      finally  { setLoadS(false); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r  = await fetch('/api/images');
        const d  = await r.json();
        setLogos(Array.isArray(d) ? d : []);
      } catch { setLogos([]); }
      finally  { setLoadL(false); }
    })();
  }, []);

  return (
    <div dir="rtl" className="font-[Beiruti] bg-white min-h-screen text-black">
      <ScrollbarStyles />

      {/* رأس الصفحة */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-end justify-between">
          <div className="leading-none text-right">
            <div className="text-2xl font-bold">مرئيات</div>
            <div className="-mt-1 text-xl">عمر</div>
          </div>

          <nav className="hidden lg:flex space-x-reverse space-x-10 text-gray-800">
            <a href="#order"     className="hover:text-indigo-600">اطلب تصميمك</a>
            <a href="#contact"   className="hover:text-indigo-600">اتصل بعمر مباشرة</a>
            <a href="#faq"       className="hover:text-indigo-600">اسأل سؤالك</a>
            <a href="#accounts"  className="hover:text-indigo-600">حسابات عمر</a>
            <a href="#about"     className="hover:text-indigo-600">نبذة عن عمر</a>
          </nav>
        </div>
      </header>

      {/* المحتوى */}
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-16 space-y-20">
        <ScrollStrip title="اقسام مهاراتي" items={skills} loading={loadS} />
        <ScrollStrip title="شعارات بنيتها"  items={logos}  loading={loadL} />
      </main>
    </div>
  );
}
