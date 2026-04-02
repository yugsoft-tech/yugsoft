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
    Trash2, 
    Calendar, 
    Hash, 
    User, 
    Library, 
    ChevronLeft, 
    ChevronRight, 
    Filter,
    Edit3
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
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
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
                <AdminLayout title="Library Management">
                    <Head>
                        <title>Library Management - Yugsoft</title>
                    </Head>

                    <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-700">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <Library size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Overview</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">Library</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium italic">
                                    {loading ? 'Updating...' : 'Manage books and track student loans.'}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => refresh()}
                                    className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                                    title="Refresh Data"
                                >
                                    <History size={20} />
                                </button>
                                <button 
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95"
                                >
                                    <Plus size={18} />
                                    <span>Add New Book</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Total Books', value: stats.totalBooks, sub: 'In Library', icon: BookIcon, color: 'text-primary', bg: 'bg-primary/5' },
                                { title: 'Borrowed', value: stats.issuedBooks, sub: 'Currently out', icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                                { title: 'Damaged', value: '4', sub: 'Need repair', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/5' },
                                { title: 'Activity', value: 'High', sub: 'Engagement', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-2xl relative group overflow-hidden">
                                    <div className="absolute top-0 right-0 size-24 bg-slate-50 dark:bg-slate-800 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-all duration-700" />
                                    <div className="relative z-10 flex flex-col gap-6">
                                        <div className={`size-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                                            <stat.icon size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                                            <p className="text-[9px] font-bold text-slate-400 mt-1">{stat.sub}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Content Area */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
                            {/* Toolbar */}
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row gap-8 justify-between items-center bg-slate-50/30 dark:bg-slate-900/30">
                                <div className="flex items-center gap-12 overflow-x-auto no-scrollbar w-full sm:w-auto">
                                    {['All Books', 'Borrowed', 'History'].map((tab) => (
                                        <button key={tab} className={`relative py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${tab === 'All Books' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                                            {tab}
                                            {tab === 'All Books' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full transition-all duration-500" />}
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
                                            placeholder="Search by book name or author..." 
                                        />
                                    </div>
                                    <button className="h-14 px-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        <Filter size={16} className="text-primary" />
                                        <span className="hidden sm:inline">Filter</span>
                                    </button>
                                </div>
                            </div>

                            {/* Books Table */}
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50 dark:border-slate-800">
                                            <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-12"><input type="checkbox" className="rounded-md border-slate-200 size-4" /></th>
                                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 min-w-[300px]">Book Title</th>
                                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Author</th>
                                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ISBN</th>
                                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Availability</th>
                                            <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {filteredBooks.map((book) => (
                                            <tr key={book.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all">
                                                <td className="py-8 px-10">
                                                    <input type="checkbox" className="rounded-md border-slate-200 size-4 group-hover:border-primary transition-colors" />
                                                </td>
                                                <td className="py-8 px-4">
                                                    <div className="flex items-center gap-5">
                                                        <div className="size-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                                            <BookIcon size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{book.title}</p>
                                                            <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                                <span className="flex items-center gap-1"><BookOpen size={10} /> {book.publisher}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-8 px-4">
                                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{book.author}</span>
                                                </td>
                                                <td className="py-8 px-4 text-xs font-black text-slate-500 uppercase tracking-widest">{book.isbn}</td>
                                                <td className="py-8 px-4">
                                                    <div className="flex flex-col gap-2 w-32">
                                                        <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                            <span>Copies: {book.quantity}</span>
                                                            <span className={book.quantity > 0 ? "text-emerald-500" : "text-rose-500"}>
                                                                {book.quantity > 0 ? "Available" : "Out of Stock"}
                                                            </span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full ${book.quantity > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: book.quantity > 0 ? '100%' : '0%' }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-8 px-10 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-primary transition-all hover:shadow-md"
                                                            title="Edit"
                                                        >
                                                            <Edit3 size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(book.id, book.title)}
                                                            className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-rose-500 transition-all hover:shadow-md"
                                                            title="Delete"
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

                            {/* Table Footer */}
                            <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between mt-auto bg-slate-50/20 dark:bg-slate-900/20">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Showing {filteredBooks.length} books
                                </p>
                                <div className="flex gap-3">
                                    <button className="h-10 px-6 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all">
                                        Previous
                                    </button>
                                    <button className="h-10 px-6 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add Book Modal */}
                    {isAddModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl p-10 animate-in zoom-in-95 duration-300">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="size-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20">
                                        <Plus size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Add New Book</h2>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Enter book details below</p>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleAddBook} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Book Title</label>
                                            <input 
                                                required
                                                value={newBook.title}
                                                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary text-xs font-bold text-slate-900 dark:text-white outline-none transition-all shadow-sm" 
                                                placeholder="Enter title..." 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Author Name</label>
                                            <input 
                                                required
                                                value={newBook.author}
                                                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary text-xs font-bold text-slate-900 dark:text-white outline-none transition-all shadow-sm" 
                                                placeholder="Enter author..." 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">ISBN Code</label>
                                            <input 
                                                required
                                                value={newBook.isbn}
                                                onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary text-xs font-bold text-slate-900 dark:text-white outline-none transition-all shadow-sm" 
                                                placeholder="Enter ISBN identifier..." 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Stock Quantity</label>
                                            <input 
                                                type="number"
                                                min="1"
                                                value={newBook.quantity}
                                                onChange={(e) => setNewBook({...newBook, quantity: parseInt(e.target.value) || 1})}
                                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary text-xs font-bold text-slate-900 dark:text-white outline-none transition-all shadow-sm" 
                                                placeholder="Quantity in stock" 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-8">
                                        <button 
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="flex-1 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold text-sm hover:bg-slate-100 transition-all text-[10px] uppercase tracking-widest"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            className="flex-[2] h-16 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/95 transition-all shadow-xl shadow-primary/20 text-[10px] uppercase tracking-widest"
                                        >
                                            Save Book
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}
