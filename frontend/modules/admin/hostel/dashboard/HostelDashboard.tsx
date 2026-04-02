import { useState } from 'react';
import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';
import { 
    Home, 
    Bed, 
    TrendingUp, 
    DoorOpen, 
    Clock, 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Wrench,
    Users,
    Shield,
    Coffee,
    Zap,
    Wind,
    Droplets
} from 'lucide-react';

export default function HostelDashboard() {
    const [activeTab, setActiveTab] = useState('Room View');
    const [searchTerm, setSearchTerm] = useState('');

    const roomBlocks = [
        {
            name: 'Block A',
            floor: 'Floor 1',
            type: 'Boys',
            rooms: [
                { id: '101', number: '101', status: '1 Available', statusColor: 'emerald', capacity: 3, occupied: 2, type: 'occupied' },
                { id: '102', number: '102', status: 'Full', statusColor: 'slate', capacity: 2, occupied: 2, type: 'full' },
                { id: '103', number: '103', status: 'Empty', statusColor: 'emerald', capacity: 2, occupied: 0, type: 'vacant' },
                { id: '104', number: '104', status: 'Under Repair', statusColor: 'rose', capacity: 2, occupied: 0, type: 'maintenance' },
                { id: '105', number: '105', status: 'Full', statusColor: 'slate', capacity: 3, occupied: 3, type: 'full' },
            ]
        },
        {
            name: 'Block B',
            floor: 'Floor 1',
            type: 'Girls',
            rooms: [
                { id: 'G-01', number: 'G-01', status: 'Full', statusColor: 'slate', capacity: 2, occupied: 2, type: 'full' },
                { id: 'G-02', number: 'G-02', status: 'Full', statusColor: 'slate', capacity: 2, occupied: 2, type: 'full' },
                { id: 'G-03', number: 'G-03', status: '1 Available', statusColor: 'emerald', capacity: 2, occupied: 1, type: 'occupied' },
                { id: 'G-04', number: 'G-04', status: 'Empty', statusColor: 'emerald', capacity: 2, occupied: 0, type: 'vacant' },
            ]
        }
    ];

    const stats = [
        { title: 'Total Beds', value: '500', sub: 'Total capacity', icon: Bed, color: 'text-primary', bg: 'bg-primary/5', trend: 'Static' },
        { title: 'Occupancy', value: '85%', sub: 'Currently filled', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/5', trend: 'Increasing' },
        { title: 'Available Beds', value: '75', sub: 'Empty spots', icon: DoorOpen, color: 'text-blue-500', bg: 'bg-blue-500/5', trend: 'Stable' },
        { title: 'Pending Requests', value: '12', sub: 'For allocation', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/5', trend: 'Urgent' },
    ];

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout title="Hostel Management">
                    <Head>
                        <title>Hostel Management - Yugsoft</title>
                    </Head>

                    <div className="flex-1 flex flex-col gap-10 animate-in fade-in duration-700">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <Home size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Overview</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">Hostel Management</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium italic">
                                    Manage rooms and student stays.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95">
                                    <Plus size={18} />
                                    <span>Add New Room</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, i) => (
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
                                        <div className="mt-4 h-1 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${stat.color.replace('text-', 'bg-')} rounded-full`} style={{ width: stat.value.includes('%') ? stat.value : '100%' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Grid Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden min-h-[600px]">
                            {/* Toolbar */}
                             <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row gap-8 justify-between items-center bg-slate-50/30 dark:bg-slate-900/30">
                                <div className="flex items-center gap-12 overflow-x-auto no-scrollbar w-full sm:w-auto">
                                    {['Room View', 'Student List', 'Facilities', 'Billing'].map((tab) => (
                                        <button key={tab} onClick={() => setActiveTab(tab)} className={`relative py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                                            {tab}
                                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full transition-all duration-500" />}
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
                                            placeholder="Search for student or room..." 
                                        />
                                    </div>
                                    <button className="h-14 px-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        <Filter size={16} className="text-primary" />
                                        <span className="hidden sm:inline">Advanced Search</span>
                                    </button>
                                </div>
                            </div>

                            {/* View Content */}
                            <div className="p-10 bg-slate-50/20 dark:bg-slate-900/20 flex-1">
                                {roomBlocks.map((block, idx) => (
                                    <div key={idx} className="mb-14 last:mb-0">
                                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-primary mb-1">
                                                    <Shield size={14} className={block.type === 'Boys' ? 'text-blue-500' : 'text-rose-500'} />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{block.type} Hub</span>
                                                </div>
                                                 <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{block.name}</h2>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{block.floor} - {block.type === 'Boys' ? 'Boys Side' : 'Girls Side'}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {[Coffee, Zap, Wind, Droplets].map((Icon, i) => (
                                                    <div key={i} className="size-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-300 hover:text-primary transition-colors shadow-sm">
                                                        <Icon size={14} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                            {block.rooms.map((room) => (
                                                <div key={room.id} className={`group bg-white dark:bg-slate-900 border-2 rounded-[2rem] p-6 shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden ${
                                                    room.type === 'maintenance' ? 'border-rose-500/20 bg-rose-50/20' : 
                                                    room.type === 'vacant' ? 'border-emerald-500/20 bg-emerald-50/10' :
                                                    'border-slate-50 dark:border-slate-800'
                                                }`}>
                                                    <div className="absolute top-0 right-0 size-20 bg-slate-50 dark:bg-slate-800 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
                                                    <div className="relative z-10 flex flex-col h-full">
                                                        <div className="flex justify-between items-start mb-6">
                                                            <div>
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Room No.</p>
                                                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Room {room.number}</h3>
                                                            </div>
                                                            <div className={`size-10 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white transition-all shadow-sm`}>
                                                                <Bed size={20} />
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 mb-6">
                                                            {[...Array(room.capacity)].map((_, i) => (
                                                                <div key={i} className={`size-1.5 rounded-full ${i < room.occupied ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                                            ))}
                                                            <span className="text-[10px] font-black text-slate-500 uppercase ml-auto">{room.occupied}/{room.capacity}</span>
                                                        </div>

                                                        <div className="mt-auto space-y-4">
                                                            <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-center ${
                                                                room.statusColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                                                                room.statusColor === 'rose' ? 'bg-rose-500/10 text-rose-500' :
                                                                'bg-slate-100 text-slate-500'
                                                            }`}>
                                                                {room.status}
                                                            </div>
                                                            <button className="w-full py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2">
                                                                {room.type === 'maintenance' ? <Wrench size={10} /> : <Users size={10} />}
                                                                Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer / Pagination */}
                             <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between mt-auto bg-slate-50/20 dark:bg-slate-900/20">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                    Total <span className="text-slate-900 dark:text-white">Rooms and Beds</span> currently active
                                </p>
                                <div className="flex gap-3">
                                    <button className="h-10 px-6 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                                        Export Records
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
