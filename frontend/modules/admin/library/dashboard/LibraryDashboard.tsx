import { useState } from 'react';
import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';
import { useLibrary } from '@/hooks/useLibrary';
import { 
    Book as BookIcon, 
    BookOpen, 
    Users, 
    AlertCircle, 
    Plus, 
    Search, 
    History, 
    ArrowUpRight, 
    ArrowDownLeft,
    MoreVertical,
    Trash2,
    Calendar,
    Hash,
    User,
    Library,
    ChevronLeft,
    ChevronRight,
    Filter
} from 'lucide-react';

export default function LibraryDashboard() {
    const { books, loading, stats, addBook, deleteBook, refresh } = useLibrary();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', publisher: '', quantity: 1 });
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await addBook(newBook);
        if (result.success) {
            setIsAddModalOpen(false);
            setNewBook({ title: '', author: '', isbn: '', publisher: '', quantity: 1 });
        } else {
            alert(result.error);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Are you sure you want to remove "${title}"?`)) {
            await deleteBook(id);
        }
    };

    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout title="Library Hub">
                    <Head>
                        <title>Library Hub - EduCore</title>
                    </Head>

                    <div className="flex-1 flex flex-col gap-10 animate-in fade-in duration-700">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <Library size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Archival Control</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">Library Hub</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium italic">
                                    {loading ? 'Synchronizing global repository...' : 'Aggregate scholarly resources and monitor asset distribution.'}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => refresh()}
                                    className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                                >
                                    <History size={20} />
                                </button>
                                <button 
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95"
                                >
                                    <Plus size={18} />
                                    <span>Register New Volume</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Global Volume', value: stats.totalBooks, sub: '+12 added', icon: BookIcon, color: 'text-primary', bg: 'bg-primary/5', trend: '+4% gain' },
                                { title: 'Active Loans', value: stats.issuedBooks, sub: 'Currently borrowed', icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/5', trend: 'Stable' },
                                { title: 'Overdue Assets', value: stats.overdueBooks, sub: 'Immediate return', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/5', trend: 'Critical' },
                                { title: 'New Acquisitions', value: '42', sub: 'Last 30 days', icon: ArrowUpRight, color: 'text-emerald-500', bg: 'bg-emerald-500/5', trend: '+18% surge' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-2xl relative group overflow-hidden">
                                    <div className="absolute top-0 right-0 size-24 bg-slate-50 dark:bg-slate-800 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-all duration-700" />
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                                            <div className={`size-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                                <stat.icon size={20} />
                                            </div>
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${stat.trend === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{stat.trend}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Repository List */}
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden min-h-[600px]">
                            {/* Inventory Toolbar */}
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row gap-8 justify-between items-center bg-slate-50/30 dark:bg-slate-900/30">
                                <div className="flex items-center gap-12 overflow-x-auto no-scrollbar w-full sm:w-auto">
                                    {['All Volumes', 'Available', 'Distributed', 'Archived'].map((tab) => (
                                        <button key={tab} className={`relative py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${tab === 'All Volumes' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                                            {tab}
                                            {tab === 'All Volumes' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full transition-all duration-500" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-4 w-full sm:w-auto">
                                    <div className="relative group w-full sm:w-72">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <input 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary text-xs font-bold text-slate-900 dark:text-white outline-none transition-all shadow-sm" 
                                            placeholder="Search repository index..." 
                                        />
                                    </div>
                                    <button className="h-14 px-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        <Filter size={16} className="text-primary" />
                                        <span className="hidden sm:inline">Advanced Search</span>
                                    </button>
                                </div>
                            </div>

                            {/* Inventory Table */}
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50 dark:border-slate-800">
                                            <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-12"><input type="checkbox" className="rounded-md border-slate-200 size-4" /></th>
                                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 min-w-[280px]">Literary Node</th>
                                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Authorial Signature</th>
                                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory Load</th>
                                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status Vector</th>
                                            <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Op Console</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {filteredBooks.map((book) => (
                                            <tr key={book.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                                                <td className="py-8 px-10">
                                                    <input type="checkbox" className="rounded-md border-slate-200 size-4 group-hover:border-primary transition-colors" />
                                                </td>
                                                <td className="py-8 px-4">
                                                    <div className="flex items-center gap-5">
                                                        <div className="size-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                            <BookIcon size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{book.title}</p>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{book.isbn}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-8 px-4 text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{book.author}</td>
                                                <td className="py-8 px-4">
                                                    <div className="flex flex-col gap-2 w-32">
                                                        <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                            <span>Load: {book.quantity} Units</span>
                                                            <span className="text-primary">100%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-8 px-4">
                                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                        <div className="size-1.5 rounded-full bg-emerald-500" />
                                                        Available
                                                    </span>
                                                </td>
                                                <td className="py-8 px-10 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-primary transition-all hover:shadow-md"
                                                            title="Edit Details"
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(book.id, book.title); }}
                                                            className="p-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all hover:shadow-md"
                                                            title="Purge Node"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Terminal */}
                            <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between mt-auto bg-slate-50/20 dark:bg-slate-900/20">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                    Displaying <span className="text-slate-900 dark:text-white">{filteredBooks.length} Active Nodes</span> of internal repository
                                </p>
                                <div className="flex gap-3">
                                    <button className="size-12 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-primary hover:border-primary transition-all flex items-center justify-center shadow-sm disabled:opacity-30">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button className="size-12 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-primary hover:border-primary transition-all flex items-center justify-center shadow-sm">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add Book Modal Upgrade */}
                    {isAddModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 px-6">
                            <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-800 p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 size-48 bg-primary/5 rounded-full -translate-y-24 translate-x-24 blur-3xl" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="size-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20">
                                            <BookIcon size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Volume Registration</h2>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Node Acquisition Protocol</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleAddBook} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <InputGroup 
                                                label="Volume Title" 
                                                id="title" 
                                                value={newBook.title} 
                                                onChange={(val) => setNewBook({ ...newBook, title: val })}
                                                icon={<BookOpen size={16} />}
                                                span={2}
                                            />
                                            <InputGroup 
                                                label="Authorial Node" 
                                                id="author" 
                                                value={newBook.author} 
                                                onChange={(val) => setNewBook({ ...newBook, author: val })}
                                                icon={<User size={16} />}
                                            />
                                            <InputGroup 
                                                label="ISBN Signature" 
                                                id="isbn" 
                                                value={newBook.isbn} 
                                                onChange={(val) => setNewBook({ ...newBook, isbn: val })}
                                                icon={<Hash size={16} />}
                                            />
                                            <InputGroup 
                                                label="Publisher" 
                                                id="publisher" 
                                                value={newBook.publisher} 
                                                onChange={(val) => setNewBook({ ...newBook, publisher: val })}
                                                icon={<Calendar size={16} />}
                                            />
                                            <InputGroup 
                                                label="Load Count" 
                                                id="quantity" 
                                                type="number"
                                                value={newBook.quantity} 
                                                onChange={(val) => setNewBook({ ...newBook, quantity: parseInt(val) || 1 })}
                                                icon={<ArrowUpRight size={16} />}
                                            />
                                        </div>
                                        <div className="flex gap-4 mt-12">
                                            <button 
                                                type="button"
                                                onClick={() => setIsAddModalOpen(false)}
                                                className="flex-1 px-8 py-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                                            >
                                                Abort
                                            </button>
                                            <button 
                                                type="submit"
                                                className="flex-[2] px-8 py-5 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all active:scale-95"
                                            >
                                                Initialize Capture
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}

// Sub-components
interface InputGroupProps {
    label: string;
    id: string;
    type?: string;
    value: string | number;
    onChange: (val: string) => void;
    icon: React.ReactNode;
    span?: number;
}

function InputGroup({ label, id, type = 'text', value, onChange, icon, span = 1 }: InputGroupProps) {
    return (
        <div className={`space-y-2 ${span === 2 ? 'col-span-2' : ''}`}>
            <label htmlFor={id} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                {icon}
                {label}
            </label>
            <input 
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-4 text-xs font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                required
            />
        </div>
    );
}
