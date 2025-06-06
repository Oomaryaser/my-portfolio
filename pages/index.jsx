// File: pages/index.jsx
import React, { useEffect, useRef, useState } from 'react';
import { FiPhoneCall, FiMenu, FiX } from 'react-icons/fi';

/* — Global CSS + hide vertical scroll + gentle shake keyframes — */
const GlobalCSS = () => (
  <style>{`
    body { overflow:hidden; }
    .white-scroll::-webkit-scrollbar { height:6px; background:#fff; }
    .white-scroll::-webkit-scrollbar-thumb { background:#fff; border-radius:3px; }
    .white-scroll::-webkit-scrollbar-track { background:#fff; }
    .white-scroll { scrollbar-width:thin; scrollbar-color:#fff #fff; }

    @keyframes shake {
      0%,100% { transform: translateX(0); }
      25%,75% { transform: translateX(-1px); }
      50%     { transform: translateX(1px); }
    }
    .shake {
      animation: shake 1.5s ease-in-out infinite;
    }
  `}</style>
);

/* — Skeleton for images — */
const BoxSkel = () => (
  <div className="
    w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64
    rounded-2xl bg-gray-200 animate-pulse shrink-0
  "/>
);

/* — Skeleton for side cards — */
const CardSkel = ({ tall }) => (
  <div className={`
    w-full
    ${tall ? 'h-48 sm:h-56 md:h-72 lg:h-[22rem]' : 'h-24 sm:h-32 md:h-44 lg:h-52'}
    bg-gray-200 rounded-2xl animate-pulse
  `}/>
);

/* — Horizontal scroll strip — */
function Strip({ title, items, loading }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const start = useRef({ x: 0, scroll: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onDown = e => {
      dragging.current = true;
      start.current = { x: e.clientX, scroll: el.scrollLeft };
      el.setPointerCapture(e.pointerId);
    };
    const onMove = e => {
      if (dragging.current) {
        el.scrollLeft = start.current.scroll - (e.clientX - start.current.x);
      }
    };
    const onUp = e => {
      dragging.current = false;
      el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-right">{title}</h2>
      <div
        ref={ref}
        dir="rtl"
        className="white-scroll overflow-x-auto snap-x snap-mandatory cursor-grab pb-2"
      >
        <div className="flex gap-4 w-max">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <BoxSkel key={i} />)
            : items.length
              ? items.map(({ id, src, name, link }) => (
                  <a key={id} href={link || '#'} className="relative shrink-0 rounded-2xl overflow-hidden">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gray-100">
                      <img src={src} alt={name||''} className="w-full h-full object-cover"/>
                    </div>
                    {name && (
                      <div className="
                        absolute top-0 left-0 w-full
                        bg-white/60 backdrop-blur-sm
                        text-gray-800 text-sm sm:text-base md:text-lg
                        text-center py-1
                      ">
                        {name}
                      </div>
                    )}
                  </a>
                ))
              : <p className="text-gray-500 px-4">لا توجد عناصر</p>}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [skills, setSkills] = useState([]);
  const [logos,  setLogos]  = useState([]);
  const [ls, setLs]         = useState(true);
  const [ll, setLl]         = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  /* fetch categories */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setSkills(
          Array.isArray(data)
            ? data.filter(c => c.cover).map(c => ({
                id: c.id,
                src: c.cover,
                name: c.name,
                link: `/gallery/${c.id}`
              }))
            : []
        );
      } catch {
        setSkills([]);
      } finally {
        setLs(false);
      }
    })();
  }, []);

  /* fetch images */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/images');
        const data = await res.json();
        setLogos(Array.isArray(data) ? data : []);
      } catch {
        setLogos([]);
      } finally {
        setLl(false);
      }
    })();
  }, []);

  return (
    <div dir="rtl" className="font-[Beiruti] h-screen flex flex-col bg-white text-gray-900">
      <GlobalCSS />

      {/* Header with mobile sidebar toggle */}
      <header className="flex-none bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center text-right space-x-2 rtl:space-x-reverse">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold">مرئـــيات</span>
            <span className="text-lg sm:text-xl md:text-2xl font-medium">عُمــــر</span>
          </div>

          {/* Desktop nav + button */}
          <nav className="hidden md:flex items-center space-x-6 text-lg text-white rtl:space-x-reverse">
            <a href="#" className="hover:text-gray-200">اطلب تصميمك</a>
            <a href="#" className="hover:text-gray-200">اتصل بعمر مباشرة</a>
            <a href="#" className="hover:text-gray-200">اسأل سؤالك</a>
            <a href="#" className="hover:text-gray-200">حسابات عمر</a>
            <a href="#" className="hover:text-gray-200">نبذة عن عمر</a>
            <button className="px-6 py-2 bg-black text-white font-medium rounded-full shadow hover:opacity-90 active:opacity-80 transition">
              تواصل معي
            </button>
          </nav>

          {/* Mobile icons */}
          <div className="flex md:hidden items-center space-x-4 rtl:space-x-reverse">
            <a href="tel:+123456789" className="p-3 bg-black text-white rounded-full shake text-xl hover:opacity-90 transition">
              <FiPhoneCall />
            </a>
            <button onClick={() => setMenuOpen(true)} className="text-2xl text-white hover:text-gray-200">
              <FiMenu />
            </button>
          </div>
        </div>

        {/* Mobile sidebar with smooth slide */}
        <aside className="fixed inset-0 z-50 flex pointer-events-none">
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
            onClick={() => setMenuOpen(false)}
          />
          {/* Panel */}
          <div className={`
            relative w-64 bg-white shadow-lg p-6 flex flex-col space-y-6
            transform transition-transform duration-300 ease-in-out
            ${menuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full'}
          `}>
            <button
              className="absolute top-4 left-4 text-2xl text-gray-700 hover:text-gray-900"
              onClick={() => setMenuOpen(false)}
            >
              <FiX />
            </button>
            <a href="#" className="text-lg font-medium hover:text-black">اطلب تصميمك</a>
            <a href="#" className="text-lg font-medium hover:text-black">اتصل بعمر مباشرة</a>
            <a href="#" className="text-lg font-medium hover:text-black">اسأل سؤالك</a>
            <a href="#" className="text-lg font-medium hover:text-black">حسابات عمر</a>
            <a href="#" className="text-lg font-medium hover:text-black">نبذة عن عمر</a>
            <button className="mt-auto px-6 py-2 bg-black text-white font-medium rounded-full shadow hover:opacity-90 active:opacity-80 transition">
              تواصل معي
            </button>
          </div>
        </aside>
      </header>

      {/* Content: strips & side cards */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <main className="flex-1 overflow-hidden px-6 lg:px-12 py-8 space-y-8">
          <Strip title="اقسام مهاراتي" items={skills} loading={ls}/>
          <Strip title="شعارات بنيتها"  items={logos}  loading={ll}/>
        </main>
        <aside className="w-full md:w-2/5 xl:w-[26rem] flex flex-col px-6 lg:px-12 py-8 space-y-8 overflow-hidden flex-none">
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-right">آخر أعمالي</h3>
            {ll ? <CardSkel tall={false}/> : (
              <div className="w-full h-24 sm:h-32 md:h-44 lg:h-52 xl:h-64 rounded-2xl bg-gray-100 overflow-hidden"/>
            )}
          </section>
          <section className="space-y-4 flex-1 flex flex-col">
            <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-right">أهم أعمالي</h3>
            {ll ? <CardSkel tall/> : (
              <div className="w-full flex-1 rounded-2xl bg-gray-100 overflow-hidden"/>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
