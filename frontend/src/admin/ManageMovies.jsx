import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';

const INDUSTRIES = ["Pollywood", "Bollywood", "Hollywood", "Tollywood", "Kollywood", "Mollywood", "Sandalwood", "South Indian", "Haryanvi", "Bhojpuri"];

const ManageMovies = () => {
    const { user, movies, addMovie, updateMovie, deleteMovie, deleteMovieComment, updateMovieComment } = useData();

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
    title: '', image: '', rating: '', genre: '', year: '', 
    overview: '', director: '', runtime: '', certification: '', 
    performance: { day1: '', weekend: '', status: '' }, industry: 'Pollywood',
    fullStory: '', trailerUrl: '', likes: 0, releaseDate: '', cast: []
  });
  const [showForm, setShowForm] = useState(false);
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isCustomIndustry, setIsCustomIndustry] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [activeSection, setActiveSection] = useState('all'); // 'all' or 'upcoming'
  const selectedMovie = movies.find(m => m._id === selectedMovieId);

  const filteredMovies = movies
    .filter(movie => {
      const isUpcoming = movie.releaseDate && new Date(movie.releaseDate) > new Date();
      if (activeSection === 'upcoming') return isUpcoming;
      return true;
    })
    .filter(movie => 
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || b.year) - new Date(a.createdAt || a.year);
      if (sortBy === 'oldest') return new Date(a.createdAt || a.year) - new Date(b.createdAt || b.year);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    const fieldsToExclude = ['comments', 'createdBy', '_id', 'createdAt', 'updatedAt', '__v'];

    Object.keys(formData).forEach(key => {
        if (!fieldsToExclude.includes(key)) {
            if (key === 'performance' || key === 'cast') {
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
      await updateMovie(movies[editingIndex]._id, data);
      setEditingIndex(null);
    } else {
      await addMovie(data);
    }
    setFormData({ 
      title: '', image: '', rating: '', genre: '', year: '', 
      overview: '', director: '', runtime: '', certification: '', 
      performance: { day1: '', weekend: '', status: '' }, industry: 'Pollywood',
      fullStory: '', trailerUrl: '', likes: 0, releaseDate: '', cast: []
    });
    setSelectedFile(null);
    setImageSource('url');
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const movie = movies[index];
    setFormData({
      ...movie,
      performance: movie.performance || { day1: '', weekend: '', status: '' },
      cast: movie.cast || []
    });
    setIsCustomIndustry(movie.industry && !INDUSTRIES.includes(movie.industry));
    setShowForm(true);
  };

  return (
    <div className="space-y-6 relative">
      <div className="sticky top-0 z-30 bg-gray-100/80 backdrop-blur-md pb-4 pt-2 -mt-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-text-dark">Manage Movies</h2>
          <div className="flex flex-wrap w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64 flex gap-2">
              <div className="relative flex-1">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="Search movies..." 
                  className="pl-10 pr-4 py-2 border rounded-lg w-full outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-gray-800 text-white px-3 py-2 rounded-lg font-bold hover:bg-black transition-all text-sm">
                Search
              </button>
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-red/20 bg-white font-semibold text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
                <option value="rating">Top Rated</option>
              </select>
              <button 
                onClick={() => { 
                  setShowForm(true); 
                  setEditingIndex(null); 
                  setFormData({ 
                    title: '', image: '', rating: '', genre: '', year: '', 
                    overview: '', director: '', runtime: '', certification: '', 
                    performance: { day1: '', weekend: '', status: '' }, industry: 'Pollywood',
                    fullStory: '', trailerUrl: '', likes: 0, releaseDate: ''
                  }); 
                  setIsCustomIndustry(false);
                }}
                className="bg-primary-red text-white px-4 py-2 rounded-lg font-bold hover:bg-secondary-red transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-primary-red/20"
              >
                <i className="fas fa-plus"></i> <span className="hidden sm:inline">Add Movie</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title={editingIndex !== null ? 'Edit Movie' : 'Add New Movie'}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            placeholder="Title" className="p-2 border rounded" required
            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
          />
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
          <input 
            placeholder="Genre" className="p-2 border rounded" required
            value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})}
          />
          <div className="flex gap-2">
            <input 
              placeholder="Year" className="p-2 border rounded w-1/2" required type="number"
              value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}
            />
            <input 
              placeholder="Rating (e.g. 8.5)" className="p-2 border rounded w-1/2" required type="number" step="0.1"
              value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <select 
              className="p-2 border rounded font-semibold text-sm outline-none focus:ring-2 focus:ring-primary-red/20"
              value={isCustomIndustry ? 'Custom' : formData.industry} 
              onChange={e => {
                if (e.target.value === 'Custom') {
                  setIsCustomIndustry(true);
                  setFormData({...formData, industry: ''});
                } else {
                  setIsCustomIndustry(false);
                  setFormData({...formData, industry: e.target.value});
                }
              }}
            >
              {INDUSTRIES.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
              <option value="Custom">Other (Add Manually...)</option>
            </select>
            {isCustomIndustry && (
              <input 
                placeholder="Type industry name..." 
                className="p-2 border rounded text-sm focus:ring-2 focus:ring-primary-red/20 outline-none animate-in fade-in slide-in-from-top-1 px-3"
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
                autoFocus
              />
            )}
          </div>
          <input 
            placeholder="Director" className="p-2 border rounded"
            value={formData.director} onChange={e => setFormData({...formData, director: e.target.value})}
          />
          <div className="flex gap-2">
            <input 
              placeholder="Runtime (e.g. 2h 30m)" className="p-2 border rounded w-1/2"
              value={formData.runtime} onChange={e => setFormData({...formData, runtime: e.target.value})}
            />
            <input 
              placeholder="Certification (e.g. U/A)" className="p-2 border rounded w-1/2"
              value={formData.certification} onChange={e => setFormData({...formData, certification: e.target.value})}
            />
          </div>
          <textarea 
            placeholder="Short Overview" className="p-2 border rounded md:col-span-2" rows="2"
            value={formData.overview} onChange={e => setFormData({...formData, overview: e.target.value})}
          />
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Detailed Story (Rich Text)</label>
            <ReactQuill 
              theme="snow"
              value={formData.fullStory}
              onChange={value => setFormData({...formData, fullStory: value})}
              modules={quillModules}
              className="bg-white rounded border border-gray-200"
            />
          </div>
          <div className="flex gap-2">
            <input 
                placeholder="Trailer URL (YouTube)" className="p-2 border rounded w-1/2"
                value={formData.trailerUrl} onChange={e => setFormData({...formData, trailerUrl: e.target.value})}
            />
            <div className="w-1/2 flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Like Counter (Override)</label>
                <input 
                type="number"
                placeholder="Likes" className="p-2 border rounded w-full bg-slate-50 font-bold"
                value={formData.likes} onChange={e => setFormData({...formData, likes: parseInt(e.target.value) || 0})}
                />
            </div>
          </div>
          <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Release Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Expected Release Date</label>
                    <input 
                        type="date" 
                        className="p-2 border rounded font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary-red/20"
                        value={formData.releaseDate ? new Date(formData.releaseDate).toISOString().split('T')[0] : ''} 
                        onChange={e => setFormData({...formData, releaseDate: e.target.value})}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Current Status</label>
                    <input 
                        placeholder="e.g. Blockbuster, Trending, Upcoming" className="p-2 border rounded font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary-red/20"
                        value={formData.performance?.status} onChange={e => setFormData({...formData, performance: {...formData.performance, status: e.target.value}})}
                    />
            </div>
          </div>
        </div>
          
          <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cast & Crew Members</h4>
                <button 
                    type="button" 
                    onClick={() => setFormData({...formData, cast: [...formData.cast, { name: '', role: 'Actor', image: '' }]})}
                    className="text-[10px] font-black uppercase text-white bg-primary-red px-3 py-1 rounded shadow-sm hover:scale-105 transition-transform"
                >
                    <i className="fas fa-plus mr-1"></i> Add Member
                </button>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.cast?.length > 0 ? formData.cast.map((member, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-white rounded-lg border border-slate-100 shadow-sm relative group animate-in fade-in slide-in-from-top-1">
                        <input 
                            placeholder="Actor Name" className="p-2 border rounded text-xs" 
                            value={member.name} onChange={e => {
                                const newCast = [...formData.cast];
                                newCast[idx].name = e.target.value;
                                setFormData({...formData, cast: newCast});
                            }}
                        />
                        <input 
                            placeholder="Role (e.g. Lead Actor)" className="p-2 border rounded text-xs" 
                            value={member.role} onChange={e => {
                                const newCast = [...formData.cast];
                                newCast[idx].role = e.target.value;
                                setFormData({...formData, cast: newCast});
                            }}
                        />
                        <div className="flex gap-2">
                            <input 
                                placeholder="Image URL" className="p-2 border rounded text-xs flex-1" 
                                value={member.image} onChange={e => {
                                    const newCast = [...formData.cast];
                                    newCast[idx].image = e.target.value;
                                    setFormData({...formData, cast: newCast});
                                }}
                            />
                            <button 
                                type="button" 
                                onClick={() => setFormData({...formData, cast: formData.cast.filter((_, i) => i !== idx)})}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                            >
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white/50 border-2 border-dashed border-slate-200 p-6 rounded-xl text-center">
                        <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest leading-relaxed">No cast members added yet.<br/>Click "Add Member" to begin.</p>
                    </div>
                )}
            </div>
          </div>
          
          {(!formData.releaseDate || new Date(formData.releaseDate) <= new Date()) && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded border border-gray-200 animate-in fade-in duration-500">
                <h4 className="md:col-span-3 text-xs font-bold uppercase text-gray-400">Box Office Performance</h4>
                <input 
                placeholder="Day 1 Collection" className="p-2 border rounded"
                value={formData.performance?.day1} onChange={e => setFormData({...formData, performance: {...formData.performance, day1: e.target.value}})}
                />
                <input 
                placeholder="Weekend Collection" className="p-2 border rounded"
                value={formData.performance?.weekend} onChange={e => setFormData({...formData, performance: {...formData.performance, weekend: e.target.value}})}
                />
                <input 
                placeholder="Status (e.g. Blockbuster)" className="p-2 border rounded"
                value={formData.performance?.status} onChange={e => setFormData({...formData, performance: {...formData.performance, status: e.target.value}})}
                />
            </div>
          )}
          <div className="md:col-span-2 flex gap-2 pt-4">
            <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all">Save Changes</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={showComments} 
        onClose={() => { setShowComments(false); setSelectedMovieId(null); }} 
        title={`Comments: ${selectedMovie?.title}`}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {selectedMovie?.comments?.length > 0 ? (
            [...selectedMovie.comments]
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
                      onChange={(e) => updateMovieComment(selectedMovie._id, comment._id, { likes: parseInt(e.target.value) || 0 })}
                      className="w-16 p-1 border rounded text-xs font-bold outline-none focus:ring-1 focus:ring-primary-red/50"
                    />
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    await deleteMovieComment(selectedMovie._id, comment._id);
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

      <div className="flex gap-2 mb-2 p-1 bg-gray-200/50 rounded-xl w-fit">
        <button 
          onClick={() => setActiveSection('all')}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeSection === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          All Movies
        </button>
        <button 
          onClick={() => setActiveSection('upcoming')}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeSection === 'upcoming' ? 'bg-primary-red text-white shadow-lg shadow-primary-red/20' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Upcoming Calendar
          {movies.filter(m => m.releaseDate && new Date(m.releaseDate) > new Date()).length > 0 && (
            <span className={`w-2 h-2 rounded-full ${activeSection === 'upcoming' ? 'bg-white animate-pulse' : 'bg-primary-red'}`}></span>
          )}
        </button>
      </div>

      <div className="overflow-x-auto border rounded-xl bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-bold text-text-gray uppercase">Movie</th>
              <th className="p-4 text-sm font-bold text-text-gray uppercase">Genre</th>
              <th className="p-4 text-sm font-bold text-text-gray uppercase">Year</th>
                <th className="p-4 text-sm font-bold text-text-gray uppercase">Rating</th>
                {user?.role === 'admin' && <th className="p-4 text-sm font-bold text-text-gray uppercase">Author</th>}
                <th className="p-4 text-sm font-bold text-text-gray uppercase">Likes</th>
                <th className="p-4 text-sm font-bold text-text-gray uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredMovies.map((movie, index) => (
              <tr key={movie._id || index} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="relative">
                    <img src={movie.image} className="w-10 h-14 object-cover rounded shadow-sm" alt="" />
                    {movie.releaseDate && new Date(movie.releaseDate) > new Date() && (
                        <div className="absolute -top-1 -left-1 bg-primary-red text-white text-[6px] font-black uppercase px-1 rounded-sm shadow-sm">Upcoming</div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-text-dark">{movie.title}</span>
                    {movie.releaseDate && new Date(movie.releaseDate) > new Date() && (
                        <span className="text-[9px] font-black text-primary-red uppercase tracking-tighter">Live in Calendar</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-sm text-text-gray">{movie.genre}</td>
                <td className="p-4 text-sm text-text-gray">{movie.year}</td>
                 <td className="p-4 text-sm font-bold text-accent-gold">⭐ {movie.rating}</td>
                 {user?.role === 'admin' && (
                   <td className="p-4">
                      <div className="flex flex-col">
                          <span className="text-[10px] font-black text-primary-red uppercase tracking-widest">{movie.createdBy?.fullName || movie.createdBy?.username || 'System'}</span>
                          <span className="text-[10px] font-bold text-gray-400">ID: {movie.createdBy?.employeeId || 'N/A'}</span>
                      </div>
                    </td>
                 )}
                  <td className="p-4 text-sm font-bold text-slate-700">❤️ {movie.likes || 0}</td>
                 <td className="p-4">
                   <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedMovieId(movie._id); setShowComments(true); }}
                      className="text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center relative"
                      title="Manage Comments"
                    >
                      <i className="fas fa-comments"></i>
                      {movie.comments?.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary-red text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-article-text">
                          {movie.comments.length}
                        </span>
                      )}
                    </button>
                    <button onClick={() => handleEdit(index)} className="text-blue-600 hover:bg-blue-50 w-8 h-8 rounded-full"><i className="fas fa-edit"></i></button>
                    <button onClick={() => deleteMovie(movie._id)} className="text-red-600 hover:bg-red-50 w-8 h-8 rounded-full"><i className="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMovies;
