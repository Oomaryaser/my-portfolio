// File: pages/dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { verifySession } from '../lib/auth';
import { motion } from 'framer-motion';
import {
  FiUpload,
  FiFile,
  FiTrash2,
  FiPlus,
  FiEdit,
  FiLoader,
  FiCheck,
  FiSquare,
  FiCheckSquare,
  FiMenu
} from 'react-icons/fi';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('categories');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ————————————————— بيانات الأقسام ————————————————— */
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [newName, setNewName] = useState('');
  const [newCover, setNewCover] = useState(null);
  const [newCoverPreview, setNewCoverPreview] = useState('');
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCover, setEditCover] = useState(null);
  const [editCoverPreview, setEditCoverPreview] = useState('');
  const [saving, setSaving] = useState(false);

  /* ————————————————— بيانات رفع الصور ————————————————— */
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [categoryForUpload, setCategoryForUpload] = useState('');
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [loadingImgs, setLoadingImgs] = useState(true);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [deleteIds, setDeleteIds] = useState(new Set());
  const inputRef = useRef();
  const [status, setStatus] = useState('');

  /* ————————————————— جلب الأقسام والصور ————————————————— */
  const fetchCats = async () => {
    setLoadingCats(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
      if (data.length && !categoryForUpload) {
        setCategoryForUpload(String(data[0].id));
      }
    } catch {
      setCategories([]);
    } finally {
      setLoadingCats(false);
    }
  };

  const fetchImgs = async () => {
    if (!categoryForUpload) return setImages([]);
    setLoadingImgs(true);
    try {
      const res  = await fetch(`/api/categories/${categoryForUpload}/images`);
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch {
      setImages([]);
    } finally {
      setLoadingImgs(false);
      setSelected(new Set());
      setSelectMode(false);
    }
  };


  useEffect(() => {
    fetchCats();
  }, []);

  useEffect(() => {
    fetchImgs();
  }, [categoryForUpload]);

  /* ————————————————— دوال الأقسام ————————————————— */
  const handleNewCover = e => {
    const f = e.target.files[0];
    setNewCover(f);
    setNewCoverPreview(URL.createObjectURL(f));
  };

  const createCat = async () => {
    if (!newName.trim()) return setStatus('❗ أدخل اسم القسم');
    setCreating(true);
    try {
      const fm = new FormData();
      fm.append('name', newName.trim());
      if (newCover) fm.append('cover', newCover);
      await fetch('/api/categories', { method: 'POST', body: fm });
      setStatus('✅ تم إنشاء القسم');
      setNewName('');
      setNewCover(null);
      setNewCoverPreview('');
      fetchCats();
    } catch {
      setStatus('❌ خطأ أثناء الإنشاء');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = c => {
    setEditId(c.id);
    setEditName(c.name);
    setEditCoverPreview(c.cover);
  };

  const handleEditCover = e => {
    const f = e.target.files[0];
    setEditCover(f);
    setEditCoverPreview(URL.createObjectURL(f));
  };

  const saveEdit = async () => {
    if (!editName.trim()) return setStatus('❗ أدخل اسم القسم');
    setSaving(true);
    try {
      const fm = new FormData();
      fm.append('name', editName.trim());
      if (editCover) fm.append('cover', editCover);
      await fetch(`/api/categories/${editId}`, { method: 'PUT', body: fm });
      setStatus('✅ تم حفظ التعديل');
      setEditId(null);
      fetchCats();
    } catch {
      setStatus('❌ خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditCover(null);
    setEditCoverPreview('');
  };

  const deleteCat = async id => {
    if (!confirm('تأكيد حذف القسم؟')) return;
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      setStatus('🗑️ تم حذف القسم');
      fetchCats();
    } catch {
      setStatus('❌ خطأ أثناء الحذف');
    }
  };

  /* ————————————————— دوال رفع الصور ————————————————— */
  const handleSelect = e => {
    const arr = Array.from(e.target.files);
    setFiles(arr);
    setPreviews(arr.map(f => URL.createObjectURL(f)));
  };

  const uploadFiles = async () => {
    if (!files.length) return setStatus('❗ اختر صورة');
    if (!categoryForUpload) return setStatus('❗ اختر القسم'+ categoryForUpload);
    setUploading(true);
    try {
      for (let f of files) {
        const fm = new FormData();        fm.append('cat', categoryForUpload);

        fm.append('file', f);

        await fetch(`/api/categories/${categoryForUpload}/images`, {
          method: 'POST',
          body: fm
        });
      }
      setStatus('✅ تم رفع الصور');
      setFiles([]);
      setPreviews([]);
      inputRef.current.value = null;
      fetchImgs();
    } catch {
      setStatus('❌ خطأ أثناء الرفع');
    } finally {
      setUploading(false);
    }
  };

  const toggleSel = id => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const selectAll = () => {
    if (selected.size === images.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(images.map(i => i.id)));
    }
    setSelectMode(true);
  };

  const confirmDel = ids => {
    setDeleteIds(new Set(ids));
    setShowModal(true);
  };

  const doDelete = async () => {
    for (let id of deleteIds) {
      await fetch(`/api/images?id=${id}`, { method: 'DELETE' });
    }
    setStatus(`🗑️ حذف ${deleteIds.size}`);
    setShowModal(false);
    fetchImgs();
  };

  const handleLogout = async () => {
    await fetch('/api/logout');
    window.location.href = '/login';
  };

  /* ————————————————— JSX ————————————————— */
  return (
    <div className="md:flex min-h-screen bg-gray-50 text-gray-900 font-[Beiruti]">
      {/* ——— القائمة الجانبية ——— */}
      <aside
        className={`fixed z-20 inset-y-0 right-0 w-64 bg-white p-6 shadow-lg border-l border-gray-200 transform transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">القائمة</h2>
          <button
            className="md:hidden p-1"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveSection('categories')}
              className={`w-full text-right px-4 py-2 rounded-lg transition ${
                activeSection === 'categories'
                  ? 'bg-black text-white shadow-xl'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              أقسام مهاراتي
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('upload')}
              className={`w-full text-right px-4 py-2 rounded-lg transition ${
                activeSection === 'upload'
                  ? 'bg-black text-white shadow-xl'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              رفع الصور
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-right px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              تسجيل الخروج
            </button>
          </li>
        </ul>
      </aside>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ——— المحتوى الرئيسي ——— */}
      <main className="flex-1 p-6 md:p-10 space-y-10 md:ml-64">
        <div className="flex justify-between items-center">
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <a href="/" className="text-black hover:underline">العودة للموقع</a>
        </div>

        {/* ——— قسم الأقسام ——— */}
        {activeSection === 'categories' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* إنشاء قسم جديد */}
            <div className="bg-white rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-2xl font-semibold">إنشاء قسم جديد</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="اسم القسم"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="bg-gray-100 border border-gray-300 rounded-lg p-2 flex-1 text-gray-900 placeholder-gray-500"
                />
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <FiFile /> غلاف
                  <input type="file" accept="image/*" hidden onChange={handleNewCover} />
                </label>
                <button
                  onClick={createCat}
                  disabled={creating}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow"
                >
                  <FiPlus className="inline-block" /> إنشاء
                </button>
              </div>
              {newCoverPreview && (
                <div className="w-full relative" style={{ paddingTop: '100%' }}>
                  <img
                    src={newCoverPreview}
                    alt="cover preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-inner"
                  />
                </div>
              )}
            </div>

            {/* الأقسام الحالية */}
            <div className="bg-white rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-2xl font-semibold">الأقسام الحالية</h2>
              {loadingCats ? (
                <div className="flex gap-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <p className="text-gray-500">لا توجد أقسام.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map(c => (
                    <div
                      key={c.id}
                      className="bg-white border border-gray-300 rounded-2xl p-5 relative shadow-md hover:shadow-lg transition"
                    >
                      {editId === c.id ? (
                        <>
                          <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="w-full mb-2 p-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-300"
                          />
                          <label className="flex items-center gap-2 mb-2 cursor-pointer text-gray-600">
                            <FiFile /> غلاف جديد
                            <input type="file" accept="image/*" hidden onChange={handleEditCover} />
                          </label>
                          {editCoverPreview && (
                            <div className="w-full relative" style={{ paddingTop: '100%' }}>
                              <img
                                src={editCoverPreview}
                                alt="edit cover preview"
                                className="absolute inset-0 w-full h-full object-cover rounded-lg mb-2"
                              />
                            </div>
                          )}
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={saveEdit}
                              disabled={saving}
                              className="px-3 py-1 bg-black hover:bg-gray-800 rounded-lg text-white"
                            >
                              حفظ
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg text-white"
                            >
                              إلغاء
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {c.cover && (
                            <div className="w-full relative" style={{ paddingTop: '100%' }}>
                              <img
                                src={c.cover}
                                alt={c.name}
                                className="absolute inset-0 w-full h-full object-cover rounded-lg mb-3 border-2 border-gray-700"
                              />
                            </div>
                          )}
                          <p className="font-medium mb-4 text-gray-800">{c.name}</p>
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => startEdit(c)}
                              className="p-2 bg-black hover:bg-gray-800 rounded-lg text-white"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => deleteCat(c.id)}
                              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ——— قسم رفع الصور ——— */}
        {activeSection === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* رفع جديد */}
            <div className="bg-white rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-2xl font-semibold">رفع صور</h2>

              {/* التحكم في القسم (اختياري للواجهة فقط) */}
              <div className="flex items-center gap-4">
                <label className="text-gray-700">اختر القسم:</label>
                <select
                  value={categoryForUpload}
                  onChange={e => setCategoryForUpload(e.target.value)}
                  className="bg-gray-100 border border-gray-300 rounded-lg p-2 text-gray-900"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex-1 flex items-center justify-center gap-3 cursor-pointer bg-gray-100 border border-gray-300 rounded-lg py-3 hover:bg-gray-200">
                  <FiFile /> اختر ملفات
                  <input
                    ref={inputRef}
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleSelect}
                  />
                </label>

                <button
                  onClick={uploadFiles}
                  disabled={uploading || !files.length}
                  className="w-16 h-16 bg-black hover:bg-gray-800 text-white rounded-lg flex items-center justify-center"
                >
                  {uploading ? <FiLoader className="animate-spin" /> : <FiUpload size={24} />}
                </button>
              </div>

              {/* معاينة الصور قبل الرفع */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {previews.map((p, i) => (
                    <div key={i} className="w-full relative" style={{ paddingTop: '100%' }}>
                      <img
                        src={p}
                        alt={`preview-${i}`}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* الصور المخزنة */}
            <div className="bg-white rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">الصور المخزنة</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectMode(!selectMode)}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg"
                  >
                    {selectMode ? 'إلغاء التحديد' : 'تحديد'}
                  </button>
                  {selectMode && images.length > 0 && (
                    <button
                      onClick={selectAll}
                      className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg"
                    >
                      {selected.size === images.length ? 'إلغاء الكل' : 'تحديد الكل'}
                    </button>
                  )}
                </div>
              </div>

              {loadingImgs ? (
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : images.length === 0 ? (
                <p className="text-gray-400">لا توجد صور.</p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {images.map(img => (
                    <div key={img.id} className="relative group w-full" style={{ paddingTop: '100%' }}>
                      <img
                        src={img.src}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover rounded-lg transition-transform transform group-hover:scale-105"
                      />
                      {selectMode ? (
                        <button
                          onClick={() => toggleSel(img.id)}
                          className="absolute top-2 left-2 text-white bg-black p-1 rounded-full"
                        >
                          {selected.has(img.id) ? <FiCheckSquare /> : <FiSquare />}
                        </button>
                      ) : (
                        <button
                          onClick={() => confirmDel([img.id])}
                          className="absolute top-2 right-2 bg-gray-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectMode && selected.size > 0 && (
                <button
                  onClick={() => confirmDel(Array.from(selected))}
                  className="mt-4 px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                  حذف المحدد ({selected.size})
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ——— نافذة تأكيد الحذف ——— */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 text-right space-y-4">
              <p className="text-gray-700">هل أنت متأكد من حذف الصور المحددة؟</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                >
                  إلغاء
                </button>
                <button
                  onClick={doDelete}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ——— رسالة الحالة ——— */}
        {status && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full">
            {status}
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  if (!verifySession(req)) {
    return {
      redirect: { destination: '/login', permanent: false }
    };
  }
  return { props: {} };
}
