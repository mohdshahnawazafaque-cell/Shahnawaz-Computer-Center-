import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Save, X, GripVertical } from 'lucide-react';
import { Promotion } from '../types';
import { getClientPromotions, saveClientPromotions } from '../utils/clientStorage';

export const AdminPromotionsTab: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Promotion>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Initial local load
    setPromotions(getClientPromotions());

    // Fetch from server
    const token = localStorage.getItem('scc_admin_token') || '';
    if (token) {
      fetch('/api/admin/promotions', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPromotions(data);
          saveClientPromotions(data);
        }
      })
      .catch(() => console.warn('Offline mode: Using local promotions data.'));
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      isActive: true,
      order: promotions.length + 1
    });
    setIsFormOpen(true);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingId(promo.id);
    setFormData(promo);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('क्या आप वाकई इस प्रचार को हटाना चाहते हैं?')) {
      const updated = promotions.filter((p) => p.id !== id);
      setPromotions(updated);
      saveClientPromotions(updated);
      
      const token = localStorage.getItem('scc_admin_token') || '';
      if (token) {
        try {
          await fetch(`/api/admin/promotions/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          console.warn('Server delete failed');
        }
      }
      
      showNotification('प्रचार सफलतापूर्वक हटाया गया');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    let updatedPromo: Promotion | undefined;
    const updated = promotions.map((p) => {
      if (p.id === id) {
        updatedPromo = { ...p, isActive: !currentStatus };
        return updatedPromo;
      }
      return p;
    });
    setPromotions(updated);
    saveClientPromotions(updated);

    const token = localStorage.getItem('scc_admin_token') || '';
    if (token && updatedPromo) {
      try {
        await fetch(`/api/admin/promotions/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedPromo)
        });
      } catch (err) {
        console.warn('Server toggle failed');
      }
    }

    showNotification(currentStatus ? 'प्रचार बंद किया गया' : 'प्रचार चालू किया गया');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      showNotification('Title और Description अनिवार्य हैं', 'error');
      return;
    }

    // Client-side Validation for URLs and Media Types
    const urlPattern = /^(https?:\/\/)/i;
    
    if (formData.promotionalLink && !urlPattern.test(formData.promotionalLink)) {
      showNotification('Promotional link must be a valid HTTP/HTTPS URL', 'error');
      return;
    }
    
    if (formData.imageUrl) {
      if (!urlPattern.test(formData.imageUrl)) {
        showNotification('Image URL must be a valid HTTP/HTTPS URL', 'error');
        return;
      }
      try {
        const urlObj = new URL(formData.imageUrl);
        const ext = urlObj.pathname.split('.').pop()?.toLowerCase();
        if (!ext || !['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
          showNotification('Image URL must point to a valid image file (.jpg, .png, .gif, .webp, .svg)', 'error');
          return;
        }
      } catch (e) {
        showNotification('Invalid Image URL format', 'error');
        return;
      }
    }
    
    if (formData.videoUrl) {
      if (!urlPattern.test(formData.videoUrl)) {
        showNotification('Video URL must be a valid HTTP/HTTPS URL', 'error');
        return;
      }
      if (!formData.videoUrl.includes('youtube.com') && !formData.videoUrl.includes('youtu.be')) {
        try {
          const urlObj = new URL(formData.videoUrl);
          const ext = urlObj.pathname.split('.').pop()?.toLowerCase();
          if (!ext || !['mp4', 'webm', 'ogg'].includes(ext)) {
            showNotification('Video URL must be a valid YouTube link or point to an MP4/WEBM/OGG file', 'error');
            return;
          }
        } catch(e) {
          showNotification('Invalid Video URL format', 'error');
          return;
        }
      }
    }

    let updatedList = [...promotions];
    let savedPromo: Promotion | null = null;

    if (editingId) {
      savedPromo = { ...(formData as Promotion) };
      updatedList = updatedList.map((p) => (p.id === editingId ? savedPromo! : p));
    } else {
      savedPromo = {
        ...(formData as Promotion),
        id: `promo-${Date.now()}`
      };
      updatedList.push(savedPromo);
    }

    setPromotions(updatedList);
    saveClientPromotions(updatedList);

    // Attempt to sync with server API (fallback to local if offline)
    const token = localStorage.getItem('scc_admin_token') || '';
    if (token) {
      try {
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/api/admin/promotions/${editingId}` : '/api/admin/promotions';
        await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(savedPromo),
        });
      } catch (err) {
        console.warn('Server sync failed, saved locally.');
      }
    }

    setIsFormOpen(false);
    showNotification(editingId ? 'प्रचार अपडेट किया गया' : 'नया प्रचार जोड़ा गया');
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === promotions.length - 1)
    ) return;

    const updated = [...promotions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    
    // Update order property
    updated.forEach((p, idx) => p.order = idx + 1);
    
    setPromotions(updated);
    saveClientPromotions(updated);

    const token = localStorage.getItem('scc_admin_token') || '';
    if (token) {
      try {
        await Promise.all([
          fetch(`/api/admin/promotions/${updated[index].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(updated[index])
          }),
          fetch(`/api/admin/promotions/${updated[targetIndex].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(updated[targetIndex])
          })
        ]);
      } catch (err) {
        console.warn('Server move failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`p-4 rounded-lg flex items-center gap-2 text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">प्रचार एवं विज्ञापन (Promotions)</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">वेबसाइट पर दिखाए जाने वाले विज्ञापनों और प्रचारों का प्रबंधन करें</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span>नया प्रचार जोड़ें</span>
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {editingId ? 'प्रचार एडिट करें' : 'नया प्रचार जोड़ें'}
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:text-slate-300"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Title (शीर्षक) *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="प्रचार का मुख्य शीर्षक"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Description (विवरण) *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="प्रचार का पूरा विवरण"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Image URL (इमेज लिंक)</label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Video URL (वीडियो लिंक - YouTube/MP4)</label>
                <input
                  type="url"
                  value={formData.videoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.whatsAppNumber || ''}
                  onChange={(e) => setFormData({ ...formData, whatsAppNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="919876543210 (Country code with number)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Contact Number (कॉल करने के लिए)</label>
                <input
                  type="text"
                  value={formData.contactNumber || ''}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+919876543210"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Promotional Link (अधिक जानकारी के लिए लिंक)</label>
                <input
                  type="url"
                  value={formData.promotionalLink || ''}
                  onChange={(e) => setFormData({ ...formData, promotionalLink: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Start Date (प्रारंभ तिथि - Optional)</label>
                <input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">End Date (अंतिम तिथि - Optional)</label>
                <input
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 md:col-span-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.isActive || false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-slate-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-200">सक्रिय (Active)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:bg-slate-700 transition-colors"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Save size={18} />
                <span>सेव करें</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {promotions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              अभी तक कोई प्रचार नहीं जोड़ा गया है।
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {promotions.map((promo, index) => (
                <li key={promo.id} className="p-4 hover:bg-slate-50 dark:bg-slate-700 transition-colors flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex flex-col gap-1 items-center justify-center shrink-0">
                    <button 
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <GripVertical size={20} className="text-slate-300" />
                    <button 
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === promotions.length - 1}
                      className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                  
                  {promo.imageUrl && (
                    <div className="shrink-0 w-24 h-16 bg-slate-200 rounded overflow-hidden">
                      <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">{promo.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{promo.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${promo.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'}`}>
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {promo.whatsAppNumber && <span className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-full">WA: {promo.whatsAppNumber}</span>}
                      {promo.startDate && <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-full">Starts: {promo.startDate}</span>}
                      {promo.endDate && <span className="px-2 py-0.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-full">Ends: {promo.endDate}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleActive(promo.id, promo.isActive)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        promo.isActive 
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                          : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                      }`}
                    >
                      {promo.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(promo)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
