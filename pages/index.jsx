// File: pages/index.jsx
import React, { useRef, useEffect, useState } from 'react';

/* ——— تخصيص شريط التمرير ——— */
const ScrollbarStyles = () => (
  <style>{`
    .scrollbar-white::-webkit-scrollbar        { height: 8px; background:#fff; }
    .scrollbar-white::-webkit-scrollbar-thumb  { background:#fff; border-radius:4px; }
    .scrollbar-white::-webkit-scrollbar-track  { background:#fff; }
    .scrollbar-white                          { scrollbar-width:thin; scrollbar-color:#fff #fff; }
  `}</style>
);

/* ——— سبينر تحميل صغير ——— */
function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" d="M4 12a8 8 0 018-8v8z" fill="currentColor" />
    </svg>
  );
}

/* ——— شريط سحب أفقي مع Skeleton أثناء التحميل ——— */
function ScrollStrip({ title, items, loading }) {
  const wrap = useRef(null);
  const isDrag = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const skel = 6;

  /* ——— دوال السحب ——— */
  const begin = x => {
    isDrag.current = true;
    startX.current = x;
    startScroll.current = wrap.current.scrollLeft;
    wrap.current.classList.add('cursor-grabbing');
    document.body.style.userSelect = 'none';
  };
  const move = x => {
    if (!isDrag.current) return;
    const dx = x - startX.current;
    wrap.current.scrollLeft = startScroll.current - dx;
  };
  const stop = () => {
    if (!isDrag.current) return;
    isDrag.current = false;
    wrap.current.classList.remove('cursor-grabbing');
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', stop);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', stop);
  };

  /* ——— أحداث الماوس ——— */
  const onMouseDown = e => {
    begin(e.pageX);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stop);
  };
  const onMouseMove = e => move(e.pageX);

  /* ——— أحداث اللمس ——— */
  const onTouchStart = e => {
    begin(e.touches[0].pageX);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', stop);
  };
  const onTouchMove = e => {
    e.preventDefault();
    move(e.touches[0].pageX);
  };

  return (
    <section className="select-none">
      <h2 className="mb-3 text-lg md:text-xl font-semibold">{title}</h2>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: skel }).map((_, i) => (
            <div key={i} className="shrink-0 w-44 h-44 rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div
          ref={wrap}
          dir="rtl"
          className="scrollbar-white overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 rounded-2xl cursor-grab"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          <div className="flex gap-4 w-max">
            {items.length > 0 ? (
              items.map(({ id, src }) => (
                <div
                  key={id}
                  className="shrink-0 w-44 h-44 bg-gray-200 rounded-2xl snap-center overflow-hidden"
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 px-4">لا توجد عناصر للعرض</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* ——— الصفحة الرئيسية ——— */
export default function PortfolioHome() {
  /* أقسام مهاراتي (ثابتة) */
  const [skills] = useState([
    { id: 1, src: '/images/skill-design.png' },
    { id: 2, src: '/images/skill-uiux.png' },
    { id: 3, src: '/images/skill-marketing.png' }
  ]);

  /* شعارات بنيتها (تُجلب من MySQL عبر /api/images) */
  const [logos, setLogos] = useState([]);
  const [loadingLogos, setLoadingLogos] = useState(true);

  useEffect(() => {
    async function fetchLogos() {
      try {
        const res = await fetch('/api/images');            // ← تستدعي MySQL API
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        setLogos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setLogos([]);
      } finally {
        setLoadingLogos(false);
      }
    }
    fetchLogos();
  }, []);

  return (
    <div
      dir="rtl"
      className="font-[Beiruti] text-black bg-white min-h-screen px-4 md:px-8 lg:px-14 py-6"
    >
      <ScrollbarStyles />

      {/* — Navbar (اختياري) — */}
      <nav className="py-5 flex justify-between items-center">
        {/* عناصر النافبار */}
        <h1 className="text-2xl font-bold">معرض أعمالي</h1>
      </nav>

      {/* — المحتوى الرئيسي — */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* سايدبار (اختياري) */}
        <aside className="space-y-8 lg:col-span-1">{/* محتوى السايدبار */}</aside>

        {/* المعرض */}
        <main className="lg:col-span-3 space-y-14">
          <ScrollStrip title="اقسام مهاراتي" items={skills} loading={false} />
          <ScrollStrip title="شعارات بنيتها" items={logos} loading={loadingLogos} />
        </main>
      </div>
    </div>
  );
}
