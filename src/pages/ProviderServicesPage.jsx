import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PhotoUploadWithWatermark from '../components/PhotoUploadWithWatermark';
import { Briefcase, DollarSign, Save, Shield } from 'lucide-react';

const ProviderServicesPage = () => {
  const { addService, isProvider } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    price: '',
    priceType: 'fixed',
    description: '',
  });

  const categories = [
    { id: 'home', name: 'Home Services' },
    { id: 'auto', name: 'Auto Services' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'electrical', name: 'Electrical' },
    { id: 'landscaping', name: 'Landscaping' },
    { id: 'tech', name: 'Tech Support' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
    setError('');
  };

  const handleImagesChange = (files) => {
    setUploadedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isProvider) return;

    setSaving(true);
    setError('');

    const payload = {
      title: formData.title,
      categoryId: formData.categoryId,
      price: Number(formData.price),
      priceType: formData.priceType,
      description: formData.description,
      images: uploadedFiles.map(file => file.name),
    };

    const result = await addService(payload);
    if (!result.success) {
      setError(result.error || 'Unable to save service');
    } else {
      setSaved(true);
      setFormData({
        title: '',
        categoryId: '',
        price: '',
        priceType: 'fixed',
        description: '',
      });
      setUploadedFiles([]);
    }

    setSaving(false);
  };

  if (!isProvider) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto px-4 text-center bg-white rounded-xl shadow-sm p-6">
          <Shield className="mx-auto text-blue-600 mb-3" size={32} />
          <h1 className="text-2xl font-bold text-gray-900">Provider access only</h1>
          <p className="text-gray-600 mt-2">You need a provider account to add services.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Services</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}
          {saved && (
            <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm">
              Service saved successfully
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Example: Drain Cleaning"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="100.00"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Type</label>
            <select
              name="priceType"
              value={formData.priceType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
              <option value="quote">Quote</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your service..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
            <PhotoUploadWithWatermark onUploadComplete={handleImagesChange} />
            <p className="text-xs text-gray-500 mt-2">
              Photos are watermarked and should not include email or phone numbers.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
          >
            <Save size={18} className="mr-2" />
            {saving ? 'Saving...' : 'Save Service'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProviderServicesPage;
