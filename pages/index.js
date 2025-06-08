import React from 'react';

const navLinks = [
  'اطلب تصميمك',
  'اتصل بعمر مباشرة',
  'اسأل سؤالك',
  'حسابات عمر',
  'نبذة عن عمر',
  'تواصل معي',
];

const boxStyle = {
  width: 120,
  height: 120,
  background: '#F2F4F7',
  borderRadius: 12,
};

function Home() {
  return (
    <div dir="rtl">
      <header
        style={{
          background: '#000',
          padding: 24,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <nav style={{ display: 'flex', gap: 16, marginLeft: 'auto', direction: 'rtl' }}>
          {navLinks.map((link) => (
            <a key={link} href="#" className="nav-link">
              {link}
            </a>
          ))}
        </nav>
        <h1
          style={{
            color: '#fff',
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            flex: 1,
            margin: 0,
          }}
        >
          مرئيات عمر
        </h1>
      </header>

      <div
        style={{
          display: 'flex',
          gap: 16,
          padding: 24,
        }}
      >
        <div style={{ width: '65%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ alignSelf: 'flex-end' }}>اقسام مهاراتي</span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 120px)',
                gap: 16,
                justifyContent: 'flex-end',
              }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={boxStyle} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ alignSelf: 'flex-end' }}>شعارات بنيتها</span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 120px)',
                gap: 16,
                justifyContent: 'flex-end',
              }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={boxStyle} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ width: '35%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ alignSelf: 'flex-end' }}>آخر أعمالي</span>
            <div
              style={{
                width: 300,
                height: 180,
                background: '#F2F4F7',
                borderRadius: 12,
                marginTop: 8,
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ alignSelf: 'flex-end' }}>أهم أعمالي</span>
            <div
              style={{
                width: 380,
                height: 380,
                background: '#F2F4F7',
                borderRadius: 12,
                marginTop: 8,
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-link {
          color: #fff;
          text-decoration: none;
        }
        .nav-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default Home;
