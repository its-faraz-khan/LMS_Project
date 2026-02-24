import React, { useState, useEffect, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Sidebar from '../components/Sidebar';
import { getCroppedImg } from '../utils/imageUtils';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    description: '',
    social_links: { github: '', linkedin: '', website: '' },
    profile_pic: null
  });

  // Cropper State
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        description: user.description || '',
        social_links: {
          github: user.social_links?.github || '',
          linkedin: user.social_links?.linkedin || '',
          website: user.social_links?.website || ''
        },
        profile_pic: null
      });
      if (user.profile_pic) {
        setPreviewImage(user.profile_pic.startsWith('http') ? user.profile_pic : `http://localhost:8000${user.profile_pic}`);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const platform = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        social_links: { ...prev.social_links, [platform]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageToCrop(reader.result);
        setShowCropper(true);
      };
      setSuccess('');
    }
  };

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const { file, url } = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setFormData(prev => ({ ...prev, profile_pic: file }));
      setPreviewImage(url);
      setShowCropper(false);
    } catch (e) {
      console.error(e);
      setError("Failed to crop image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      // Create FormData to handle file upload
      const data = new FormData();
      data.append('username', formData.username);
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('description', formData.description);
      data.append('social_links', JSON.stringify(formData.social_links));
      
      if (formData.profile_pic) {
        data.append('profile_pic', formData.profile_pic);
      }

      const res = await authAPI.updateProfile(data);
      
      // Update local storage and context
      const tokens = {
        access: localStorage.getItem('access_token'),
        refresh: localStorage.getItem('refresh_token')
      };
      login(tokens, res.data);
      setSuccess('Your profile has been updated beautifully!');
    } catch (err) {
      const backendErrors = err.response?.data;
      if (backendErrors && typeof backendErrors === 'object') {
        const firstError = Object.values(backendErrors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : 'Validation error occurred.');
      } else {
        setError('Something went wrong while updating.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-h-screen relative">
        {/* Dark Background Header */}
        <div className="bg-[#1B4D3E] h-64 w-full absolute top-0 left-0 z-0 shadow-lg" />
        
        <div className="relative z-10 flex-1 p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-5xl mx-auto mt-8">
            
            {/* Page Title */}
            <div className="mb-8 flex items-end justify-between">
              <div>
                 <h2 className="text-[10px] font-black text-[#F26522] uppercase tracking-[0.4em] mb-2">Account Settings</h2>
                 <h1 className="text-4xl font-black text-white" style={{ fontFamily: 'Merriweather, serif' }}>Manage Profile</h1>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 hidden md:block">
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest text-right">Registered as</p>
                <p className="text-sm font-bold text-white">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Profile Card */}
              <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 overflow-hidden border border-gray-100">
                <div className="flex flex-col lg:flex-row">
                  
                  {/* Left: Avatar Upload */}
                  <div className="lg:w-1/3 bg-gray-50/50 p-12 border-r border-gray-100 flex flex-col items-center justify-center">
                    <div 
                      className="relative group cursor-pointer w-48 h-48 rounded-full border-8 border-white shadow-xl overflow-hidden mb-6"
                      onClick={() => fileInputRef.current.click()}
                    >
                      {previewImage ? (
                        <img src={previewImage} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl font-black text-gray-400">
                          {user?.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Change Photo</span>
                      </div>
                    </div>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                    
                    <h3 className="text-xl font-black text-gray-800">{formData.username || 'Unset Username'}</h3>
                    <p className="text-[10px] text-[#F26522] font-black uppercase tracking-widest mt-1">UET {user?.role}</p>
                    
                    <div className="mt-8 pt-8 border-t border-gray-200 w-full text-center">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 font-sans">Reg No.</p>
                       <p className="text-sm font-black text-gray-700 font-serif italic">{user?.registration_number || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Right: Personal Info */}
                  <div className="flex-1 p-12 overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-10 h-10 bg-[#1B4D3E]/10 rounded-xl flex items-center justify-center text-[#1B4D3E]">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                       </div>
                       <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="form-input transition-all focus:bg-gray-50 border-gray-100"
                          placeholder="Public handle"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                        <div className="form-input bg-gray-50 border-gray-100 text-gray-400 flex items-center gap-2 cursor-not-allowed italic font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Account Active
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className="form-input transition-all focus:bg-gray-50 border-gray-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className="form-input transition-all focus:bg-gray-50 border-gray-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bio / Professional Summary</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-input min-h-[140px] resize-none transition-all focus:bg-gray-50 border-gray-100"
                        placeholder="Share your academic goals or professional summary..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Connectivity & Links */}
              <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-black/5 border border-gray-100">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-10 h-10 bg-[#F26522]/10 rounded-xl flex items-center justify-center text-[#F26522]">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                   </div>
                   <h3 className="text-xl font-bold text-gray-800">Presence & Connectivity</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-gray-800" /> GitHub Profile
                    </label>
                    <input
                      type="url"
                      name="social_github"
                      value={formData.social_links.github}
                      onChange={handleChange}
                      className="form-input bg-gray-50 border-transparent focus:bg-white focus:border-[#1B4D3E]/30"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-600" /> LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="social_linkedin"
                      value={formData.social_links.linkedin}
                      onChange={handleChange}
                      className="form-input bg-gray-50 border-transparent focus:bg-white focus:border-[#1B4D3E]/30"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#1B4D3E]" /> Personal Portfolio / Website
                    </label>
                    <input
                      type="url"
                      name="social_website"
                      value={formData.social_links.website}
                      onChange={handleChange}
                      className="form-input bg-gray-50 border-transparent focus:bg-white focus:border-[#1B4D3E]/30"
                      placeholder="https://yourwork.com"
                    />
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="bg-red-50 text-red-600 p-6 rounded-[24px] text-center font-bold text-sm animate-fade-slide">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-700 p-6 rounded-[24px] text-center font-bold text-sm animate-fade-slide">
                  {success}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-6 pb-20 pt-4">
                <button 
                  type="button"
                  className="px-8 py-4 text-xs font-black text-gray-400 hover:text-gray-800 uppercase tracking-widest transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-14 py-5 bg-[#1B4D3E] text-white font-black rounded-[24px] shadow-2xl shadow-[#1B4D3E]/30 hover:bg-[#153a2f] transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 text-xs uppercase tracking-[0.2em]"
                >
                  {loading ? 'Processing...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Decorative corner element */}
        <div className="absolute bottom-0 right-0 p-12 opacity-5 pointer-events-none">
           <span className="text-9xl font-black text-[#1B4D3E]">UET</span>
        </div>

        {/* Improved Image Cropper Modal */}
        {showCropper && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1B4D3E]/95 backdrop-blur-xl animate-fade-slide">
            <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-800">Adjust Profile Photo</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Move and zoom to frame your photo perfectly</p>
                </div>
                <button 
                  onClick={() => setShowCropper(false)}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="relative h-[400px] bg-slate-100">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                />
              </div>

              <div className="p-8 space-y-8 bg-white">
                <div className="flex items-center gap-6">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[60px]">Zoom Level</div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(e.target.value)}
                    className="flex-1 accent-[#1B4D3E] h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs font-bold text-[#1B4D3E] bg-[#1B4D3E]/10 px-3 py-1 rounded-full">
                    {Math.round(zoom * 100)}%
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <button
                    onClick={() => setShowCropper(false)}
                    className="px-8 py-4 text-xs font-black text-gray-400 hover:text-gray-800 uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropSave}
                    className="px-12 py-4 bg-[#F26522] text-white font-black rounded-2xl shadow-xl shadow-[#F26522]/20 hover:bg-[#d94f0e] transition-all text-xs uppercase tracking-widest"
                  >
                    Apply Adjustment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
