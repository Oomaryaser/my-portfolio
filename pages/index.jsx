import React, { useRef } from "react";

/**
 * 🎨 تغيير لون شريط التمرير إلى الأبيض مع بقاء كل شيء كما هو.
 * ----------------------------------------------------------
 * • أضفنا مكوّن <ScrollbarStyles/> يحقن CSS عالمي لجعل المسار والإبهام باللون الأبيض
 *   (Chrome/Safari + Firefox). الشريط ما زال ظاهر.
 * • أضفنا كلاس `scrollbar-white` على حاويات السطر.
 */

/* CSS عالمي لتخصيص لون الـ scrollbar */
const ScrollbarStyles = () => (
  <style>{`
    .scrollbar-white::-webkit-scrollbar { height: 8px; background: #ffffff; }
    .scrollbar-white::-webkit-scrollbar-thumb { background: #ffffff; border-radius: 4px; }
    .scrollbar-white::-webkit-scrollbar-track { background: #ffffff; }
    .scrollbar-white { scrollbar-width: thin; scrollbar-color: #ffffff #ffffff; }
  `}</style>
);

const navItems = [
  "نبذة عن عمر",
  "حسابات عمر",
  "اسأل سؤالك",
  "اتصل بعمر مباشرة",
  "اطلب تصميمك",
];

const Card = () => (
  <div className="shrink-0 w-44 h-44 md:w-56 md:h-56 bg-gray-200 rounded-2xl snap-center" />
);

function ScrollStrip({ title }) {
  const wrap = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const startDrag = (pageX) => {
    isDragging.current = true;
    startX.current = pageX;
    startScroll.current = wrap.current.scrollLeft;
    wrap.current.classList.add("cursor-grabbing");
    document.body.style.userSelect = "none";
  };
  const moveDrag = (pageX) => {
    if (!isDragging.current) return;
    const dx = startX.current - pageX;
    wrap.current.scrollLeft = startScroll.current + dx;
  };
  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    wrap.current.classList.remove("cursor-grabbing");
    document.body.style.userSelect = "";
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", mouseUp);
    window.removeEventListener("touchmove", touchMove);
    window.removeEventListener("touchend", touchEnd);
  };
  const mouseMove = (e) => moveDrag(e.pageX);
  const mouseUp = () => endDrag();
  const touchMove = (e) => moveDrag(e.touches[0].pageX);
  const touchEnd = () => endDrag();

  const onMouseDown = (e) => {
    startDrag(e.pageX);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
  };
  const onTouchStart = (e) => {
    startDrag(e.touches[0].pageX);
    window.addEventListener("touchmove", touchMove, { passive: false });
    window.addEventListener("touchend", touchEnd);
  };

  return (
    <section className="select-none">
      <h2 className="mb-3 text-lg md:text-xl font-semibold">{title}</h2>
      <div
        ref={wrap}
        dir="rtl"
        className="scrollbar-white overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 rounded-2xl cursor-grab"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div className="flex gap-4 w-max">
          {Array.from({ length: 10 }).map((_, idx) => (
            <Card key={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PortfolioHome() {
  return (
    <div dir="rtl" className="font-[Beiruti] text-black">
      <ScrollbarStyles />
      {/* Navbar */}
      <nav className="py-5 flex flex-wrap justify-between items-center gap-4">
        <h1 className="flex flex-col text-3xl md:text-4xl font-extrabold leading-tight text-right">
            <span className="text-black">مرئيات</span>
            <span className="text-black">عمر</span>
          </h1>
        <ul className="flex-1 flex flex-wrap justify-end gap-6 text-sm md:text-base text-black">
          {navItems.map((item) => (
            <li key={item} className="cursor-pointer text-black hover:text-blue-600 transition-colors">
              {item}
            </li>
          ))}
        </ul>
      </nav>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* Sidebar */}
        <aside className="space-y-8 lg:col-span-1">
          <div>
            <h2 className="mb-3 text-lg md:text-xl font-semibold">آخر اعمالي</h2>
            <div className="w-full h-40 md:h-52 bg-gray-200 rounded-2xl" />
          </div>
          <div>
            <h2 className="mb-3 text-lg md:text-xl font-semibold">أهم اعمالي</h2>
            <div className="w-full h-64 md:h-80 bg-gray-200 rounded-2xl" />
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-14">
          <ScrollStrip title="اقسام مهاراتي" />
          <ScrollStrip title="شعارات بنيتها" />
        </div>
      </section>
    </div>
  );
}
