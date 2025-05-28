// File: pages/index.jsx
import React, { useRef, useEffect, useState } from 'react';

// ————————————————————————————
// CSS عالمي لتخصيص لون شريط التمرير
const ScrollbarStyles = () => (
  <style>{`
    .scrollbar-white::-webkit-scrollbar { height: 8px; background: #fff; }
    .scrollbar-white::-webkit-scrollbar-thumb { background: #fff; border-radius: 4px; }
    .scrollbar-white::-webkit-scrollbar-track { background: #fff; }
    .scrollbar-white { scrollbar-width: thin; scrollbar-color: #fff #fff; }
  `}</style>
);

// ————————————————————————————
// Spinner صغير للتحميل
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  );
}

// ————————————————————————————
// ScrollStrip مع دعم السحب/التمرير والشكل التعريفي (Skeleton)
function ScrollStrip({ title, items, loading }) {
  const wrap       = useRef(null);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const startScroll= useRef(0);

  const startDrag = pageX => {
    isDragging.current    = true;
    startX.current        = pageX;
    startScroll.current   = wrap.current.scrollLeft;
    wrap.current.classList.add('cursor-grabbing');
    document.body.style.userSelect = 'none';
  };
  const moveDrag = pageX => {
    if (!isDragging.current) return;
    const dx = pageX - startX.current;
    wrap.current.scrollLeft = startScroll.current - dx;
  };
  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    wrap.current.classList.remove('cursor-grabbing');
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup',   onMouseUp);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend',  onTouchEnd);
  };

  const onMouseDown = e => {
    startDrag(e.pageX);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
  };
  const onMouseMove = e => moveDrag(e.pageX);
  const onMouseUp   = () => endDrag();

  const onTouchStart = e => {
    startDrag(e.touches[0].pageX);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend',  onTouchEnd);
  };
  const onTouchMove  = e => { e.preventDefault(); moveDrag(e.touches[0].pageX); };
  const onTouchEnd   = () => endDrag();

  // عدد العناصر الافتراضية للسكلتون
  const skeletonCount = 6;

  return (
    <section className="select-none">
      <h2 className="mb-3 text-lg md:text-xl font-semibold">{title}</h2>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-44 h-44 bg-gray-200 animate-pulse rounded-2xl"
            />
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
                  <img
                    src={src}
                    alt="Portfolio"
                    className="w-full h-full object-cover"
                  />
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

export default function PortfolioHome() {
  const [logos, setLogos]          = useState([]);
  const [loadingLogos, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogos() {
      try {
        const res = await fetch('/api/images');
        if (!res.ok) {
          const text = await res.text();
          console.error('❌ /api/images returned non-JSON:', text);
          setLogos([]);
        } else {
          const data = await res.json();
          setLogos(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('❌ Error fetching images:', err);
        setLogos([]);
      } finally {
        setLoading(false);
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

      {/* ====== Navbar ====== */}
      <nav className="py-5 flex justify-between items-center">
        {/* ضع هنا عناصر النافبار حسب تصميمك */}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ====== Sidebar ====== */}
        <aside className="space-y-8 lg:col-span-1">
          {/* ضع هنا محتوى السايدبار حسب تصميمك */}
        </aside>

        {/* ====== Main Content ====== */}
        <main className="lg:col-span-3 space-y-14">
          {/* شريط أقسام المهارات (قدّم بيانات ثابتة أو ديناميكية) */}
          <ScrollStrip title="اقسام مهاراتي" items={[]} loading={false} />

          {/* شريط شعارات بنيتها من MongoDB */}
          <ScrollStrip title="شعارات بنيتها" items={logos} loading={loadingLogos} />
        </main>
      </div>
    </div>
  );
}
