import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';

const ManageCelebs = () => {
  const { user, celebs, addCeleb, updateCeleb, deleteCeleb, deleteCelebComment, updateCelebComment } = useData();

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', image: '', role: '', bio: '', 
    fullBio: '', 
    milestones: [{ year: '', text: '' }],
    stats: { fanBase: '', tours: '', impactScore: '' },
    birthDate: '',
    birthPlace: '',
    photos: [''],
    videos: [''],
    industry: 'Pollywood',
    category: 'Actor',
    slug: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [selectedCelebId, setSelectedCelebId] = useState(null);
  const selectedCeleb = celebs.find(c => c._id === selectedCelebId);

  const filteredCelebs = celebs.filter(celeb => 
    celeb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    celeb.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    celeb.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    const fieldsToExclude = ['comments', 'createdBy', '_id', 'createdAt', 'updatedAt', '__v'];

    Object.keys(formData).forEach(key => {
        if (!fieldsToExclude.includes(key)) {
            if (['milestones', 'stats', 'photos', 'videos'].includes(key)) {
                data.append(key, JSON.stringify(formData[key]));
            } else if (key !== 'image' || imageSource === 'url') {
                data.append(key, formData[key]);
            }
        }
    });

    if (imageSource === 'file' && selectedFile) {
        data.append('image', selectedFile);
    }

    if (editingIndex !== null) {
      await updateCeleb(editingIndex, data);
      setEditingIndex(null);
    } else {
      await addCeleb(data);
    }
    setFormData({ 
      name: '', image: '', role: '', bio: '', 
      fullBio: '', 
      milestones: [{ year: '', text: '' }],
      stats: { fanBase: '', tours: '', impactScore: '' },
      birthDate: '',
      birthPlace: '',
      photos: [''],
      videos: [''],
      industry: 'Pollywood',
      category: 'Actor',
      slug: ''
    });
    setSelectedFile(null);
    setImageSource('url');
    setShowForm(false);
  };

  const handleEdit = (celeb) => {
    setEditingIndex(celeb._id);
    setFormData({
      ...celeb,
      milestones: celeb.milestones?.length ? celeb.milestones : [{ year: '', text: '' }],
      stats: celeb.stats || { fanBase: '', tours: '', impactScore: '' },
      birthDate: celeb.birthDate || '',
      birthPlace: celeb.birthPlace || '',
      photos: celeb.photos?.length ? celeb.photos : [''],
      videos: celeb.videos?.length ? celeb.videos : [''],
      industry: celeb.industry || 'Pollywood',
      category: celeb.category || 'Actor'
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6 relative">
      <div className="sticky top-0 z-30 bg-gray-100/80 backdrop-blur-md pb-4 pt-2 -mt-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-text-dark">Manage Celebrities</h2>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="Search by name or role..." 
                className="pl-10 pr-4 py-2 border rounded-lg w-full outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { 
                setShowForm(true); 
                setEditingIndex(null); 
                setFormData({ 
                  name: '', image: '', role: '', bio: '', 
                  fullBio: '', 
                  milestones: [{ year: '', text: '' }],
                  stats: { fanBase: '', tours: '', impactScore: '' },
                  birthDate: '',
                  birthPlace: '',
                  photos: [''],
                  videos: [''],
                  industry: 'Pollywood',
                  category: 'Actor',
                  slug: ''
                }); 
              }}
              className="bg-primary-red text-white px-4 py-2 rounded-lg font-bold hover:bg-secondary-red transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-primary-red/20"
            >
              <i className="fas fa-plus"></i> <span className="hidden sm:inline">Add Celebrity</span>
            </button>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title={editingIndex !== null ? 'Edit Celebrity' : 'Add New Celebrity'}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            placeholder="Name" className="p-2 border rounded" required
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <input 
            placeholder="Role" className="p-2 border rounded" required
            value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
          />
          <input 
            placeholder="URL Slug (e.g. sidhu-moose-wala)" className="p-2 border rounded bg-yellow-50 font-bold col-span-2"
            value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})}
          />
          <div className="flex gap-2">
            <input 
              placeholder="Industry (e.g. Pollywood)" className="p-2 border rounded w-1/2"
              value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}
            />
            <input 
              placeholder="Category (e.g. Actor)" className="p-2 border rounded w-1/2"
              value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
            />
          </div>
          <div className="flex gap-2">
            <input 
              placeholder="Birth Date (e.g. Jan 06, 1984)" className="p-2 border rounded w-1/2"
              value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})}
            />
            <input 
              placeholder="Birth Place (e.g. Punjab, India)" className="p-2 border rounded w-1/2"
              value={formData.birthPlace} onChange={e => setFormData({...formData, birthPlace: e.target.value})}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <div className="flex gap-4 mb-2">
              <button 
                type="button"
                onClick={() => setImageSource('url')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${imageSource === 'url' ? 'bg-primary-red text-white shadow-lg shadow-primary-red/20' : 'bg-gray-100 text-gray-500'}`}
              >
                Image URL
              </button>
              <button 
                type="button"
                onClick={() => setImageSource('file')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${imageSource === 'file' ? 'bg-primary-red text-white shadow-lg shadow-primary-red/20' : 'bg-gray-100 text-gray-500'}`}
              >
                Upload File
              </button>
            </div>
            
            {imageSource === 'url' ? (
              <input 
                placeholder="Image URL" className="p-2 border rounded w-full" required
                value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
              />
            ) : (
              <div className="flex flex-col gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setSelectedFile(e.target.files[0])}
                  className="text-xs font-medium text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary-red file:text-white hover:file:bg-secondary-red"
                  required={!editingIndex}
                />
                {selectedFile && <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Selected: {selectedFile.name}</p>}
              </div>
            )}
          </div>
          <textarea 
            placeholder="Short Bio Quote" className="p-2 border rounded md:col-span-2 h-20" required
            value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}
          />
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Full Biography (Rich Text)</label>
            <ReactQuill 
              theme="snow"
              value={formData.fullBio}
              onChange={value => setFormData({...formData, fullBio: value})}
              modules={quillModules}
              className="bg-white rounded border border-gray-200"
            />
          </div>

          <div className="md:col-span-2 p-4 bg-white rounded border border-gray-200">
            <h4 className="text-xs font-bold uppercase text-gray-400 mb-4">Quick Stats</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                placeholder="Fan Base (e.g. 12M+)" className="p-2 border rounded text-sm"
                value={formData.stats?.fanBase} onChange={e => setFormData({...formData, stats: {...formData.stats, fanBase: e.target.value}})}
              />
              <input 
                placeholder="Global Tours (e.g. 15 Nations)" className="p-2 border rounded text-sm"
                value={formData.stats?.tours} onChange={e => setFormData({...formData, stats: {...formData.stats, tours: e.target.value}})}
              />
              <input 
                placeholder="Impact Score (e.g. 98%)" className="p-2 border rounded text-sm"
                value={formData.stats?.impactScore} onChange={e => setFormData({...formData, stats: {...formData.stats, impactScore: e.target.value}})}
              />
            </div>
          </div>

          <div className="md:col-span-2 p-4 bg-white rounded border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold uppercase text-gray-400">Photo Gallery</h4>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, photos: [...formData.photos, '']})}
                className="text-primary-red text-xs font-bold hover:underline"
              >
                + Add Photo URL
              </button>
            </div>
            <div className="space-y-3">
              {formData.photos.map((p, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    placeholder="Image URL" className="p-2 border rounded flex-1 text-sm"
                    value={p} onChange={e => {
                      const newPhotos = [...formData.photos];
                      newPhotos[idx] = e.target.value;
                      setFormData({...formData, photos: newPhotos});
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      const newPhotos = formData.photos.filter((_, i) => i !== idx);
                      setFormData({...formData, photos: newPhotos.length ? newPhotos : ['']});
                    }}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 p-4 bg-white rounded border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold uppercase text-gray-400">Video Collection</h4>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, videos: [...formData.videos, '']})}
                className="text-primary-red text-xs font-bold hover:underline"
              >
                + Add Video URL
              </button>
            </div>
            <div className="space-y-3">
              {formData.videos.map((v, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    placeholder="Video/YouTube URL" className="p-2 border rounded flex-1 text-sm"
                    value={v} onChange={e => {
                      const newVideos = [...formData.videos];
                      newVideos[idx] = e.target.value;
                      setFormData({...formData, videos: newVideos});
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      const newVideos = formData.videos.filter((_, i) => i !== idx);
                      setFormData({...formData, videos: newVideos.length ? newVideos : ['']});
                    }}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 p-4 bg-white rounded border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold uppercase text-gray-400">Historic Milestones</h4>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, milestones: [...formData.milestones, { year: '', text: '' }]})}
                className="text-primary-red text-xs font-bold hover:underline"
              >
                + Add Milestone
              </button>
            </div>
            <div className="space-y-3">
              {formData.milestones.map((m, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    placeholder="Year" className="p-2 border rounded w-24 text-sm"
                    value={m.year} onChange={e => {
                      const newMilestones = [...formData.milestones];
                      newMilestones[idx].year = e.target.value;
                      setFormData({...formData, milestones: newMilestones});
                    }}
                  />
                  <input 
                    placeholder="Achievement Description" className="p-2 border rounded flex-1 text-sm"
                    value={m.text} onChange={e => {
                      const newMilestones = [...formData.milestones];
                      newMilestones[idx].text = e.target.value;
                      setFormData({...formData, milestones: newMilestones});
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      const newMilestones = formData.milestones.filter((_, i) => i !== idx);
                      setFormData({...formData, milestones: newMilestones.length ? newMilestones : [{ year: '', text: '' }]});
                    }}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex gap-2 pt-4">
            <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all">Save Changes</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={showComments} 
        onClose={() => { setShowComments(false); setSelectedCelebId(null); }} 
        title={`Comments: ${selectedCeleb?.name}`}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {selectedCeleb?.comments?.length > 0 ? (
            [...selectedCeleb.comments]
              .sort((a, b) => (b.likes || 0) - (a.likes || 0))
              .map((comment, index) => (
              <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-xs">{comment.user}</span>
                    <span className="text-[10px] text-gray-400 font-bold">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-2">{comment.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Likes:</span>
                    <input 
                      type="number" 
                      value={comment.likes || 0} 
                      onChange={(e) => updateCelebComment(selectedCeleb._id, comment._id, { likes: parseInt(e.target.value) || 0 })}
                      className="w-16 p-1 border rounded text-xs font-bold outline-none focus:ring-1 focus:ring-primary-red/50"
                    />
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    await deleteCelebComment(selectedCeleb._id, comment._id);
                  }}
                  className="text-red-500 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Comment"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No comments found</div>
          )}
        </div>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCelebs.map((celeb) => (
          <div key={celeb._id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="flex p-4 gap-4">
              <img src={celeb.image} className="w-16 h-16 rounded-full object-cover border-2 border-primary-red" alt="" />
              <div className="flex-1">
                <div className="p-4">
                    <h4 className="font-bold text-sm mb-1 line-clamp-1">{celeb.name}</h4>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{celeb.category}</p>
                        {user?.role === 'admin' && (
                            <div className="text-right">
                                <p className="text-[9px] font-black text-primary-red uppercase tracking-tighter">BY: {celeb.createdBy?.fullName || celeb.createdBy?.username || 'SYSTEM'}</p>
                                <p className="text-[8px] font-bold text-gray-400">EMP ID: {celeb.createdBy?.employeeId || 'N/A'}</p>
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-primary-red text-xs font-bold">{celeb.role}</p>
                <p className="text-gray-400 text-[10px] mt-1 font-bold">Added: {celeb.createdAt ? new Date(celeb.createdAt).toLocaleDateString() : 'Legacy'}</p>
                <div className="flex gap-2 mt-2 items-center">
                  <button onClick={() => handleEdit(celeb)} className="text-blue-600 text-xs hover:underline">Edit</button>
                  <button onClick={() => deleteCeleb(celeb._id)} className="text-red-600 text-xs hover:underline">Delete</button>
                  <button 
                    onClick={() => { setSelectedCelebId(celeb._id); setShowComments(true); }}
                    className="ml-auto text-gray-600 hover:bg-gray-100 p-1 rounded relative"
                    title="Manage Comments"
                  >
                    <i className="fas fa-comments"></i>
                    {celeb.comments?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-red text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-article-text">
                        {celeb.comments.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCelebs;
