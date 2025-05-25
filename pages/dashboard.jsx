// File: pages/dashboard.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

// Firebase SDK imports
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';

// ─── 1) Firebase Configuration ───────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBCK0nvchDA90-IOhTTS2VhVoRlrZPqbU",
  authDomain: "my-portfolio-af99f.firebaseapp.com",
  projectId: "my-portfolio-af99f",
  storageBucket: "my-portfolio-af99f.appspot.com",
  messagingSenderId: "1063982898136",
  appId: "1:1063982898136:web:273273bc1611b578a3b0ad",
  measurementId: "G-HZLL1YZW98" // اختياري
};

// ─── 2) Initialize Firebase services ─────────────────────────────────────────
const app     = initializeApp(firebaseConfig);
const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

// ─── 3) Dashboard Component ─────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();

  // ─ State hooks
  const [user, setUser]         = useState(null);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  // ─ Listen authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ─ Handle login form submit
  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('خطأ في البريد أو كلمة المرور.');
    }
  };

  // ─ Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  // ─ Handle file upload
  const handleUpload = async () => {
    const files = Array.from(fileInputRef.current.files || []);
    if (!files.length) return;
    setUploading(true);

    for (let file of files) {
      const path = `portfolio/${Date.now()}_${file.name}`;
      const ref  = storageRef(storage, path);
      const task = uploadBytesResumable(ref, file);

      task.on(
        'state_changed',
        null,
        console.error,
        async () => {
          const url = await getDownloadURL(ref);
          await addDoc(collection(db, 'portfolioImages'), {
            url,
            timestamp: serverTimestamp()
          });
        }
      );
    }

    fileInputRef.current.value = null;
    setUploading(false);
  };

  // ─ If user is not logged in, show login form
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white p-6 rounded shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">تسجيل دخول</h2>
          {error && <p className="text-red-500 mb-3">{error}</p>}
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full mb-3 px-3 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full mb-4 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            دخول
          </button>
        </form>
      </div>
    );
  }

  // ─ Dashboard UI after login
  return (
    <div dir="rtl" className="min-h-screen bg-white p-6 lg:p-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">لوحة تحكّم البورتفوليو</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          خروج
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">رفع الصور</h2>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          className="block mb-3"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-4 py-2 rounded text-white ${
            uploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {uploading ? 'جاري الرفع...' : 'رفع الصور'}
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">عرض البورتفوليو</h2>
        <a
          href="/"
          className="text-blue-600 hover:underline"
        >
          اذهب إلى الصفحة الرئيسية
        </a>
      </div>
    </div>
  );
}
