import React, { useEffect, useState } from 'react';
import { FiPhoneCall, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// — Global Dark Styles —
const GlobalCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Beiruti:wght@400;700&display=swap');
    body { margin:0; padding:0; font-family:'Beiruti',sans-serif; background:#121212; color:#e0e0e0; direction: rtl; }
    * { box-sizing: border-box; }
    a { text-decoration: none; color: inherit; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius:3px; }
  `}</style>
);

// — Header —
function Header({ onMenu }) {
  const tabs = ['التصميم', 'معرضي'];
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-20 bg-[#1f1f1f] px-6 py-4 flex items-center justify-between"
    >
      <span className="text-2xl font-bold">مرئيات عمر</span>
      <div className="flex items-center space-x-4 space-x-reverse">
        <nav className="hidden md:flex space-x-6 space-x-reverse">
          {tabs.map(label => (
            <a key={label} href="#" className="relative px-2 py-1 font-medium hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <button onClick={onMenu} className="md:hidden p-2"><FiMenu size={24} /></button>
      </div>
    </motion.header>
  );
}

// — Mobile Menu —
function MobileMenu({ isOpen, onClose }) {
  const tabs = ['التصميم','معرضي'];
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed inset-0 bg-[#121212] bg-opacity-95 p-6 flex flex-col space-y-4"
        >
          <button onClick={onClose} className="self-start p-2"><FiX size={24} /></button>
          {tabs.map(label => (<a key={label} href="#" className="block py-3 text-xl font-medium">{label}</a>))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// — Single Slider with Dots —
const slideData = ['اكتشف إبداعي', 'جودة احترافية', 'تجربة فريدة'];
function Slider() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIdx(i => (i + 1) % slideData.length), 3000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="relative w-full">
      <div className="h-64 md:h-72 lg:h-80 rounded-lg overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900">
        {slideData.map((txt, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: idx === i ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white bg-black bg-opacity-40 px-4 py-2 rounded">
              {txt}
            </h1>
          </motion.div>
        ))}
      </div>
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-6">
        {slideData.map((_, i) => (
          <motion.span
            key={i}
            animate={{ scale: idx === i ? 1.3 : 1, opacity: idx === i ? 1 : 0.5 }}
            whileHover={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="block w-2 h-2 bg-blue-500 rounded-full cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}

// — Two Sliders Side by Side —
function DoubleSliders() {
  return (
    <div className="mt-20 mb-8 px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Slider />
      <Slider />
    </div>
  );
}

// — Section with Dark Cards —
function Section({ title, items = [], loading }) {
  return (
    <div className="px-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-right">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 space-x-reverse pb-2">
        {loading
          ? Array(4).fill(0).map((_,i)=><div key={i} className="w-48 h-48 bg-gray-700 animate-pulse rounded-lg"/>):
          items.map(x=>(
            <a key={x.id} href={x.link} className="w-48 h-48 bg-[#1f1f1f] rounded-lg overflow-hidden flex-shrink-0">
              <img src={x.src} alt={x.name} className="w-full h-full object-cover" />
              <div className="p-2 text-sm text-gray-300 text-center">{x.name}</div>
            </a>
          ))}
      </div>
    </div>
  );
}

// — Main Component —
export default function Home() {
  const [skills,setSkills]=useState([]);
  const [logos,setLogos]=useState([]);
  const [ldS,setLdS]=useState(true);
  const [ldL,setLdL]=useState(true);
  const [menuOpen,setMenuOpen]=useState(false);

  useEffect(()=>{
    fetch('/api/categories').then(r=>r.json()).then(d=>setSkills(Array.isArray(d)?d.map(c=>({id:c.id,src:c.cover,name:c.name,link:`/gallery/${c.id}`})):[])).finally(()=>setLdS(false));
    fetch('/api/images').then(r=>r.json()).then(d=>setLogos(Array.isArray(d)?d:[])).finally(()=>setLdL(false));
  },[]);

  return (
    <div className="min-h-screen">
      <GlobalCSS />
      <Header onMenu={()=>setMenuOpen(true)} />
      <MobileMenu isOpen={menuOpen} onClose={()=>setMenuOpen(false)} />
      <DoubleSliders />
      <Section title="أقسام مهاراتي" items={skills} loading={ldS} />
      <Section title="شعارات بنيتها" items={logos} loading={ldL} />
    </div>
  );
}
