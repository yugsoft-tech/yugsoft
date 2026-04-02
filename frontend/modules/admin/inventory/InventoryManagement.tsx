import { useState, useEffect } from 'react';
import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';
import {
    Package,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Activity,
    Tag,
    Layers,
    Archive,
    ArrowUpRight,
    TrendingDown,
    AlertTriangle,
    History,
    User,
    CheckCircle2,
    ShoppingCart,
    Box,
    Truck,
    ClipboardList,
    Boxes
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useInventory } from '@/hooks/useInventory';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';

const itemSchema = z.object({
    name: z.string().min(3, 'Item name too short'),
    category: z.string().min(1, 'Category required'),
    quantity: z.number().min(0, 'Quantity required'),
    price: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function InventoryManagement() {
    const [activeTab, setActiveTab] = useState<'inventory' | 'history' | 'add'>('inventory');
    const { loading, items, history, fetchItems, fetchHistory, createItem } = useInventory();
    const [registering, setRegistering] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { register, handleSubmit, reset } = useForm<ItemFormValues>({
        resolver: zodResolver(itemSchema),
    });

    useEffect(() => {
        if (activeTab === 'inventory') fetchItems();
        if (activeTab === 'history') fetchHistory();
    }, [activeTab, fetchItems, fetchHistory]);

    const onRegister = async (data: ItemFormValues) => {
        setRegistering(true);
        const success = await createItem(data);
        if (success) {
            reset();
            setActiveTab('inventory');
        }
        setRegistering(false);
    };

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout title="Inventory Control">
                    <Head>
                        <title>Inventory Hub - EduCore</title>
                    </Head>

                    <div className="flex-1 flex flex-col gap-10 animate-in fade-in duration-700">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <Box size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Inventory Status</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">Inventory Management</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium italic">
                                    Track school supplies, monitor stock levels, and manage items.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                                    <Truck size={20} />
                                </button>
                                <button 
                                    onClick={() => setActiveTab('add')}
                                    className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95"
                                >
                                    <Plus size={18} />
                                    <span>Add New Item</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Total Items', value: items.length || '124', sub: 'In stock', icon: Box, color: 'text-primary', bg: 'bg-primary/5', trend: 'Stable' },
                                { title: 'Low Stock', value: items.filter(i => i.quantity < 10).length || '3', sub: 'Items running low', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/5', trend: 'Alert' },
                                { title: 'Items Issued', value: history.length || '42', sub: 'Last 30 days', icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-500/5', trend: 'Normal' },
                                { title: 'Stock Value', value: '₹45k', sub: 'Total value', icon: Tag, color: 'text-emerald-500', bg: 'bg-emerald-500/5', trend: 'Updated' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-2xl group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 size-24 bg-slate-50 dark:bg-slate-800 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-all duration-700" />
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                                            <div className={`size-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                                <stat.icon size={20} />
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{stat.value}</h3>
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">{stat.sub}</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className={`size-1.5 rounded-full ${stat.trend === 'Critical' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none italic">{stat.trend}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Interaction Hub */}
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden min-h-[600px]">
                            {/* Toolbar */}
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row gap-8 justify-between items-center bg-slate-50/30 dark:bg-slate-900/30">
                                <div className="flex items-center gap-12 overflow-x-auto no-scrollbar w-full sm:w-auto">
                                    {[
                                        { id: 'inventory', label: 'Stock List' },
                                        { id: 'history', label: 'Issue Records' },
                                        { id: 'add', label: 'Add New Item' }
                                    ].map((tab) => (
                                        <button 
                                            key={tab.id} 
                                            onClick={() => setActiveTab(tab.id as any)} 
                                            className={`relative py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                                            {tab.label}
                                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full transition-all duration-500" />}
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
                                            placeholder="Search inventory..." 
                                        />
                                    </div>
                                    <button className="h-14 px-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        <Filter size={16} className="text-primary" />
                                        <span className="hidden sm:inline">Filters</span>
                                    </button>
                                </div>
                            </div>

                            {/* Dynamic Content */}
                            <div className="p-10 flex-1 relative min-h-[500px]">
                                {activeTab === 'add' ? (
                                    <div className="max-w-2xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 py-12">
                                        <div className="flex items-center gap-6 mb-10">
                                            <div className="size-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20">
                                                <Boxes size={32} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Add New Item Details</h2>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Enter new item information below</p>
                                            </div>
                                        </div>
                                        <form onSubmit={handleSubmit(onRegister)} className="grid grid-cols-2 gap-10">
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Item Name</label>
                                                <input {...register('name')} placeholder="e.g. Whiteboard Markers" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Item Category</label>
                                                <select {...register('category')} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 px-8 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none">
                                                    <option value="">Select Category...</option>
                                                    <option value="ELECTRONICS">Electronics</option>
                                                    <option value="FURNITURE">Furniture</option>
                                                    <option value="STATIONERY">Stationery</option>
                                                    <option value="SPORTS">Sports</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2 flex justify-end pt-8">
                                                <button type="submit" disabled={registering} className="bg-primary text-white px-12 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95">
                                                    {registering ? <Activity size={18} className="animate-spin" /> : <span>Save Item</span>}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : activeTab === 'inventory' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {loading ? (
                                            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-[2.5rem]" />)
                                        ) : filteredItems.map((item) => (
                                            <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl transition-all hover:border-primary hover:-translate-y-2 group overflow-hidden relative">
                                                <div className="absolute top-0 right-0 size-20 bg-slate-50 dark:bg-slate-800 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-all duration-700" />
                                                <div className="relative z-10 flex flex-col h-full">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="space-y-1">
                                                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate max-w-[150px]">{item.name}</h3>
                                                            <div className="flex items-center gap-2">
                                                                <Tag size={10} className="text-primary" />
                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{item.category}</span>
                                                            </div>
                                                        </div>
                                                        <button className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-primary transition-all">
                                                            <MoreVertical size={20} />
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                                        <div className="bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center gap-1">
                                                            <Layers size={18} className="text-primary" />
                                                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{item.quantity} Unit</span>
                                                        </div>
                                                        <div className="bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center gap-1">
                                                            <TrendingDown size={18} className={item.quantity < 10 ? 'text-rose-500' : 'text-emerald-500'} />
                                                            <span className={`text-[10px] font-black uppercase ${item.quantity < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>{item.quantity < 10 ? 'Alert' : 'Nominal'}</span>
                                                        </div>
                                                    </div>
                                                    <button className="mt-auto py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2">
                                                        <ShoppingCart size={12} />
                                                        Issue Item
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-xl overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Item Name</th>
                                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Issued To</th>
                                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                                {history.map((log) => (
                                                    <tr key={log.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                                                        <td className="px-10 py-6 text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{log.itemName}</td>
                                                        <td className="px-10 py-6">
                                                            <div className="flex items-center gap-3">
                                                                <User size={14} className="text-primary" />
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{log.issuedTo}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(log.issuedDate).toLocaleDateString()}</td>
                                                        <td className="px-10 py-6">
                                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest w-fit">
                                                                <CheckCircle2 size={10} />
                                                                Issued
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}
