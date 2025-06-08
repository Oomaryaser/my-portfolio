import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'فشل تسجيل الدخول');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg space-y-4 shadow-md"
      >
        <h1 className="text-2xl font-bold text-white text-center">تسجيل الدخول</h1>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700 text-gray-100"
          placeholder="اسم المستخدم"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 rounded bg-gray-700 text-gray-100"
          placeholder="كلمة المرور"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded"
        >
          دخول
        </button>
      </form>
    </div>
  );
}
