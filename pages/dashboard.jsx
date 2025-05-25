// pages/dashboard.jsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  initializeApp
} from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

// 1️⃣ Firebase config: عوّض القيم بقيم مشروعك
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 2️⃣ Initialization
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export default function DashboardPage() {
  const router = useRouter();

  // 3️⃣ States
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef();

  // 4️⃣ Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 5️⃣ Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('فشل تسجيل الدخول. تأكد من البريد وكلمة المرور.');
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push('/');
    });
  };

  const handleUpload = async () => {
    const files = Array.from(fileInputRef.current.files || []);
    if (files.length === 0) return;
    setUploading(true);
    for (let file of files) {
      const path = `portfolio/${Date.now()}_${file.name}`;
      const ref = storageRef(storage, path);
      const task = uploadBytesResumable(ref, file);
      task.on('state_changed',
        null,
        (err) => console.error(err),
        async () => {
          const url = await getDownloadURL(ref);
          await addDoc(collection(db, 'portfolioImages'), {
            url,
            timestamp: serverTimestamp()
          });
        }
      );
    }
    // بعد الانتهاء
    fileInputRef.current.value = null;
    setUploading(false);
  };

  // 6️⃣ إذا غير مسجّل فيرجع يصير Login
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white p-6 rounded-lg shadow"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <label className="block mb-2">
            <span className="text-sm">البريد الإلكتروني</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded"
            />
          </label>
          <label className="block mb-4">
            <span className="text-sm">كلمة المرور</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded"
            />
          </label>
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

  // 7️⃣ Dashboard بعد تسجيل الدخول
  return (
    <div className="min-h-screen bg-white p-6 lg:p-12">
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
        <h2 className="text-xl font-semibold mb-4">توجيه المستخدمين</h2>
        <p>
          لعرض البورتفوليو، افتح&nbsp;
          <a
            href="/"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            الصفحة الرئيسية
          </a>
        </p>
      </div>
    </div>
  );
}
