import React, { useState, useEffect } from 'react';
import { getInquiries, deleteInquiry } from '../api';

const ManageInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInquiries = async () => {
        try {
            const res = await getInquiries();
            setInquiries(res.data);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
        try {
            await deleteInquiry(id);
            setInquiries(inquiries.filter(i => i._id !== id));
        } catch (err) {
            alert('Delete failed: ' + err.message);
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
             <div className="flex flex-col items-center gap-4">
                 <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-red rounded-full animate-spin"></div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Inquiries...</p>
             </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Promotion <span className="text-primary-red">Inquiries</span></h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage users who want to advertise or post news on the website.</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl px-6 py-3 shadow-sm flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Leads</span>
                        <span className="text-xl font-black text-slate-900">{inquiries.length}</span>
                    </div>
                    <div className="w-10 h-10 bg-primary-red/10 rounded-xl flex items-center justify-center text-primary-red">
                        <i className="fas fa-users-viewfinder"></i>
                    </div>
                </div>
            </header>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest">
                    Error: {error}
                </div>
            )}

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 italic">User Details</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 italic">Phone Number</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 italic">Submitted On</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 italic text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {inquiries.length > 0 ? inquiries.map((inquiry) => (
                                <tr key={inquiry._id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs uppercase shadow-lg shadow-slate-200">
                                                {inquiry.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-900 uppercase tracking-tight italic">{inquiry.name}</span>
                                                <span className="text-xs font-bold text-slate-400">{inquiry.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                            <i className="fas fa-phone text-[10px] text-slate-300"></i>
                                            {inquiry.phone}
                                        </div>
                                    </td>
                                    <td className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                        {new Date(inquiry.createdAt).toLocaleDateString(undefined, { 
                                            year: 'numeric', 
                                            month: 'short', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="p-6 text-right">
                                        <button 
                                            onClick={() => handleDelete(inquiry._id)}
                                            className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center ml-auto"
                                            title="Delete Inquiry"
                                        >
                                            <i className="fas fa-trash-alt text-xs"></i>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <i className="fas fa-inbox text-5xl"></i>
                                            <p className="font-black uppercase tracking-[0.3em] text-xs">No inquiries found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageInquiries;
