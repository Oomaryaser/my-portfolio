// File: pages/dashboard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiTrash2, FiImage, FiCheckSquare, FiSquare } from 'react-icons/fi';

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [deleteIds, setDeleteIds] = useState(new Set());
  const inputRef = useRef();

  const fetchImages = async () => {
    setLoadingImages(true);
    try {
      const res = await fetch('/api/images');
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
      setSelected(new Set());
      setSelectMode(false);
    } catch {
      setImages([]);
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleSelectFiles = e => {
    const sel = Array.from(e.target.files || []);
    setFiles(sel);
    setPreviews(sel.map(f => URL.createObjectURL(f)));
    setStatus('');
  };

  const handleUpload = async () => {
    if (!files.length) {
      setStatus('❗ اختر صورة واحدة على الأقل');
      return;
    }
    setUploading(true);
    try {
      for (let f of files) {
        const fm = new FormData();
        fm.append('file', f);
        const res = await fetch('/api/upload', { method: 'POST', body: fm });
        if (!res.ok) throw new Error();
      }
      setStatus('✅ تم رفع الصور بنجاح');
      setFiles([]);
      setPreviews([]);
      inputRef.current.value = null;
      await fetchImages();
    } catch {
      setStatus('❌ حدث خطأ أثناء الرفع');
    } finally {
      setUploading(false);
    }
  };

  // Prepare single or bulk delete
  const confirmDelete = ids => {
    setDeleteIds(new Set(ids));
    setShowModal(true);
  };

  const deleteConfirmed = async () => {
    for (let id of deleteIds) {
      await fetch(`/api/images?id=${id}`, { method: 'DELETE' });
    }
    setStatus(`🗑️ تم حذف ${deleteIds.size} صورة`);
    setShowModal(false);
    setDeleteIds(new Set());
    await fetchImages();
  };

  const toggleSelect = id => {
    const newSet = new Set(selected);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelected(newSet);
  };

  return (
    <div className="relative font-[Beiruti] bg-white min-h-screen p-10">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-8">لوحة التحكم</h1>
      <div className="flex flex-col lg:flex-row gap-10">

        {/* Stored Images Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 bg-white shadow-xl rounded-2xl p-8 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center text-2xl font-semibold text-gray-700">
              <FiImage className="mr-2" /> الصور المخزنة
            </h2>
            <button
              onClick={() => setSelectMode(!selectMode)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition cursor-pointer"
            >
              {selectMode ? 'إلغاء التحديد' : 'تحديد'}
            </button>
          </div>

          {loadingImages ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-full aspect-square bg-gray-100 rounded-lg"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              ))}
            </div>
          ) : images.length === 0 ? (
            <p className="text-gray-500 text-center">لا توجد صور حتى الآن.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {images.map(({ id, src }) => {
                const isSelected = selected.has(id);
                return (
                  <motion.div
                    key={id}
                    whileHover={{ scale: 1.03 }}
                    className={`relative bg-gray-50 rounded-lg overflow-hidden shadow-sm aspect-square cursor-pointer transition-shadow ${selectMode ? 'ring-2 ring-indigo-300' : ''} ${isSelected ? 'ring-4 ring-indigo-500' : ''}`}
                    onClick={() => selectMode && toggleSelect(id)}
                  >
                    <img src={src} alt="uploaded" className="w-full h-full object-cover" />
                    {selectMode && (
                      <div className="absolute top-2 left-2 text-white">
                        {isSelected ? <FiCheckSquare /> : <FiSquare />}
                      </div>
                    )}
                    {!selectMode && (
                      <button
                        onClick={() => confirmDelete([id])}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition cursor-pointer"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bulk delete button */}
          {selectMode && selected.size > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => confirmDelete(Array.from(selected))}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition cursor-pointer"
              >حذف المحدد</button>
            </div>
          )}
        </motion.section>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex-1 bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-200"
        >
          <h2 className="flex items-center text-2xl font-semibold text-gray-700">
            <FiUpload className="mr-2" /> رفع الصور الجديدة
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-shadow cursor-pointer">
              <FiFile className="text-gray-600 text-xl mr-2" />
              <span className="text-gray-800">اختر ملفات</span>
              <input
                type="file"
                ref={inputRef}
                accept="image/*"
                multiple
                onChange={handleSelectFiles}
                className="hidden"
              />
            </label>
            <button
              onClick={handleUpload}
              disabled={!files.length || uploading}
              className={`${!files.length || uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} aspect-square w-16 flex items-center justify-center text-white rounded-lg transition cursor-pointer`}
            >
              {uploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-5 h-5 border-4 border-white border-t-transparent rounded-full"
                />
              ) : (
                <FiUpload className="text-xl" />
              )}
            </button>
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {previews.map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="relative bg-gray-50 rounded-lg overflow-hidden shadow-sm transition-shadow aspect-square cursor-pointer"
                >
                  <img src={src} className="w-full h-full object-cover" alt="preview" />
                </motion.div>
              ))}
            </div>
          )}

          {status && (
            <p className="mt-4 text-center text-sm text-gray-600">{status}</p>
          )}
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 text-right shadow-2xl">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">تأكيد الحذف</h3>
            <p className="mb-5 text-gray-700">هل تريد حذف الصور المحددة بالفعل؟</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowModal(false); setDeleteIds(new Set()); }}
                className="px-3 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
              >إلغاء</button>
              <button
                onClick={deleteConfirmed}
                className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
