import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext-Supabase';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { categories, getCategoryName } from '../../categories';
import PhotoUploadWithWatermark from '../../PhotoUploadWithWatermark';

const AddServicePage = ({ language }) => {
  const navigate = useNavigate();
  const { addService, isProvider } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    description: '',
    base_price: '',
    price_type: 'fixed',
    location_type: 'on_site',
    duration_minutes: '60',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (uploadedFiles) => {
    setImages(uploadedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isProvider) {
        throw new Error('You must be logged in as a provider to add services');
      }

      if (images.length === 0) {
        throw new Error('Please upload at least one image for your service');
      }

      // Convert images to base64 or upload to storage (mocked here)
      // In a real app, you would upload to Supabase Storage and get URLs
      // For this demo, we'll just pretend we have URLs
      const imageUrls = images.map(file => URL.createObjectURL(file));

      const serviceData = {
        ...formData,
        base_price: parseFloat(formData.base_price),
        duration_minutes: parseInt(formData.duration_minutes),
        images: imageUrls, // In production this would be storage paths
        active: true
      };

      const result = await addService(serviceData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/provider/dashboard');
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to create service');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isProvider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <AlertCircle className="mx-auto text-red-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need to be a registered provider to add services.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate('/provider/dashboard')}
          className="flex items-center text-gray-600 hover:text-red-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Add New Service</h1>
            <p className="text-gray-500 mt-1">Create a new service listing for your profile</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                <AlertCircle size={20} className="mr-2" />
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
                <CheckCircle size={20} className="mr-2" />
                Service created successfully! Redirecting...
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Service Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Residential Plumbing Repair"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select a category</option>
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {getCategoryName(cat, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe what this service includes..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Pricing & Duration */}
            <div className="space-y-4 pt-4 border-t">
              <h2 className="text-lg font-semibold text-gray-900">Pricing & Options</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Type
                  </label>
                  <select
                    name="price_type"
                    value={formData.price_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="quote">Quote Based</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="base_price"
                    value={formData.base_price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    required
                    min="15"
                    step="15"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Type
                  </label>
                  <select
                    name="location_type"
                    value={formData.location_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="on_site">On-site (I go to customer)</option>
                    <option value="remote">Remote (Online/Phone)</option>
                    <option value="both">Both Available</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-4 pt-4 border-t">
              <h2 className="text-lg font-semibold text-gray-900">Service Photos</h2>
              <p className="text-sm text-gray-500 mb-4">
                Upload photos of your work. They will be automatically watermarked with "myTROUVEpro".
              </p>
              
              <PhotoUploadWithWatermark 
                onUploadComplete={handleImageUpload}
                maxFiles={5}
                watermarkText="myTROUVEpro"
              />
            </div>

            {/* Submit */}
            <div className="pt-6 border-t flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all flex items-center"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Save size={24} className="mr-2" />
                    Create Service
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddServicePage;
