import React, { useState } from 'react';
import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';
import { 
    Plus, 
    Search, 
    GraduationCap, 
    Users, 
    Globe, 
    FileEdit, 
    Trash2, 
    X, 
    Calendar, 
    Bold, 
    Italic, 
    Underline, 
    List, 
    ListOrdered, 
    Link2, 
    Image as ImageIcon, 
    UploadCloud, 
    FileText, 
    Send,
    AlertCircle
} from 'lucide-react';

// Mock Data
const announcementsData = [
    { id: 1, title: 'Q4 Curriculum Updates', content: 'Please be advised regarding the mandatory curriculum updates effective from next Monday. All staff must review...', date: '2h ago', status: 'Published', target: 'All Schools', icon: GraduationCap, statusColor: 'emerald' },
    { id: 2, title: 'Holiday Schedule: Thanksgiving', content: 'Draft for the upcoming holiday break schedule. Pending approval from the principal board.', date: 'Yesterday', status: 'Draft', target: 'Staff Only', icon: Users, statusColor: 'amber' },
    { id: 3, title: 'System Maintenance Notice', content: 'The ERP system will be down for scheduled maintenance on Sunday from 2 AM to 4 AM EST.', date: 'Oct 24', status: 'Scheduled', target: 'Public', icon: Globe, statusColor: 'blue' },
];

export default function AnnouncementsDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

    const handleSelectAnnouncement = (announcement: any) => {
        setSelectedAnnouncement(announcement);
    };

    const handleCreateNew = () => {
        setSelectedAnnouncement({
            id: 0,
            title: '',
            content: '',
            date: '',
            status: 'Draft',
            target: '',
            statusColor: 'slate'
        });
    };

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout title="Announcements Hub">
                    <Head>
                        <title>Announcements | School ERP</title>
                    </Head>
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px] p-6 pt-2">
                        {/* LEFT COLUMN: List View */}
                        <div className="lg:col-span-4 flex flex-col bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-[calc(100vh-250px)]">
                            {/* List Header */}
                            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white uppercase tracking-tight">All Posts</h3>
                                    <button onClick={handleCreateNew} className="flex items-center justify-center rounded-lg h-9 px-3 bg-primary text-white hover:bg-blue-600 transition-colors gap-2 text-xs font-black uppercase shadow-sm">
                                        <Plus size={16} />
                                        <span>Add New</span>
                                    </button>
                                </div>
                                {/* Search & Filter */}
                                <div className="flex flex-col gap-3">
                                    <div className="relative group">
                                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <input
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-9 pr-3 text-xs font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Search title..."
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">All</button>
                                        <button className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-transparent">Published</button>
                                        <button className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-transparent">Drafts</button>
                                    </div>
                                </div>
                            </div>
                            {/* List Items */}
                            <div className="overflow-y-auto custom-scroll flex-1 p-2 space-y-2 bg-slate-50/50 dark:bg-slate-800/50">
                                {announcementsData.map((item) => (
                                    <div key={item.id} onClick={() => handleSelectAnnouncement(item)} className={`group cursor-pointer p-4 rounded-lg bg-white dark:bg-slate-900 border shadow-sm transition-all relative ${selectedAnnouncement?.id === item.id ? 'border-primary ring-1 ring-primary/20' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ring-1 ring-inset ${item.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : item.statusColor === 'amber' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' : 'bg-blue-50 text-blue-700 ring-blue-600/20'}`}>{item.status}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{item.date}</span>
                                        </div>
                                        <h4 className="font-black text-slate-900 dark:text-white mb-1 line-clamp-1 text-sm">{item.title}</h4>
                                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 italic">{item.content}</p>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                                            <item.icon size={12} className="text-slate-300" />
                                            <span>{item.target}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Editor */}
                        <div className="lg:col-span-8 bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-[calc(100vh-250px)]">
                            {/* Editor Header */}
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800 rounded-t-xl">
                                <div className="flex items-center gap-2">
                                    <FileEdit size={18} className="text-primary" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Editing Announcement</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-slate-400 italic">Last saved 2 mins ago</span>
                                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-600"></div>
                                    <button className="text-slate-400 hover:text-red-500 transition-colors uppercase text-[10px] font-black tracking-widest flex items-center gap-1" title="Delete">
                                        Delete
                                    </button>
                                </div>
                            </div>
                            {/* Editor Content Form */}
                            <div className="flex-1 overflow-y-auto custom-scroll p-8">
                                <form className="flex flex-col gap-6 max-w-4xl mx-auto">
                                    {/* Title Input */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Announcement Title</label>
                                        <input className="w-full text-lg font-black px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400 text-slate-800 dark:text-white" type="text" defaultValue={selectedAnnouncement?.title || "Q4 Curriculum Updates"} />
                                    </div>
                                    {/* Targeting and Date Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Audience */}
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Audience</label>
                                            <div className="relative group">
                                                <div className="w-full min-h-[46px] px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary flex flex-wrap gap-2 items-center transition-all">
                                                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 transition-colors hover:bg-slate-200 uppercase">
                                                        All Schools
                                                        <button className="hover:text-red-500 transition-colors" type="button"><X size={12} /></button>
                                                    </span>
                                                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-[10px] font-black text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 transition-colors hover:bg-blue-100 uppercase">
                                                        Teachers
                                                        <button className="hover:text-blue-900 transition-colors" type="button"><X size={12} /></button>
                                                    </span>
                                                    <input className="flex-1 min-w-[100px] border-none bg-transparent p-0 text-[11px] font-bold focus:ring-0 placeholder:text-slate-400 text-slate-800 dark:text-white" placeholder="Add recipients..." type="text" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Schedule */}
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Publish Schedule</label>
                                            <div className="relative group">
                                                <Calendar size={18} className="absolute left-3 top-3 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                <input className="w-full px-4 py-2.5 pl-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px] font-bold focus:border-primary focus:ring-1 focus:ring-primary text-slate-600 dark:text-slate-300 transition-all outline-none" type="datetime-local" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Rich Text Editor Mockup */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Content</label>
                                        <div className="rounded-xl border border-slate-300 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-900 focus-within:ring-1 focus-within:ring-primary/30 focus-within:border-primary transition-all shadow-sm">
                                            {/* Toolbar */}
                                            <div className="flex items-center gap-2 p-2.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                                <button className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all hover:shadow-sm" type="button"><Bold size={16} /></button>
                                                <button className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all hover:shadow-sm" type="button"><Italic size={16} /></button>
                                                <button className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all hover:shadow-sm" type="button"><Underline size={16} /></button>
                                                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                                                <button className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all hover:shadow-sm" type="button"><List size={16} /></button>
                                                <button className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all hover:shadow-sm" type="button"><ListOrdered size={16} /></button>
                                                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                                                <button className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all hover:shadow-sm" type="button"><Link2 size={16} /></button>
                                                <button className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all hover:shadow-sm" type="button"><ImageIcon size={16} /></button>
                                            </div>
                                            {/* Text Area */}
                                            <textarea className="w-full h-64 p-5 border-none resize-none focus:ring-0 text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium placeholder:italic" placeholder="Start typing your announcement here..." defaultValue={selectedAnnouncement?.content || "Please be advised regarding the mandatory curriculum updates effective from next Monday. All staff must review the attached PDF document outlining the changes in Science and Math departments.\n\nWe will be holding a brief Q&A session on Wednesday at 2 PM in the Main Hall."}></textarea>
                                        </div>
                                    </div>
                                    {/* Attachments */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attachments</label>
                                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group/upload">
                                            <div className="bg-primary/10 text-primary p-3 rounded-full mb-3 group-hover/upload:scale-110 group-hover/upload:bg-primary group-hover/upload:text-white transition-all duration-300">
                                                <UploadCloud size={24} />
                                            </div>
                                            <p className="text-xs font-black text-slate-800 dark:text-slate-300 uppercase tracking-wider">Click to upload or drag and drop</p>
                                            <p className="text-[10px] font-bold text-slate-400 italic">PDF, PNG, JPG up to 10MB</p>
                                        </div>
                                        {/* Uploaded File Item */}
                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 mt-2 transition-all hover:border-primary/30">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg p-2 shadow-sm">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight leading-none mb-0.5">Curriculum_Changes_v2.pdf</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">2.4 MB</p>
                                                </div>
                                            </div>
                                            <button className="text-slate-300 hover:text-red-500 transition-colors" type="button">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            {/* Editor Footer Actions */}
                            <div className="px-8 py-5 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-xl flex justify-between items-center z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Changes saved locally</span>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:shadow-sm">
                                        Save Draft
                                    </button>
                                    <button className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                        <Send size={16} />
                                        Publish Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}
