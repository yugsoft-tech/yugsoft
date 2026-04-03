import Link from 'next/link';
import {
    Mail,
    MessageSquare,
    Megaphone,
    FileText,
    Send,
    CheckCircle2,
    Clock,
    AlertCircle,
    Activity,
    ArrowUpRight,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';

export default function CommunicationDashboard() {
    const hubs = [
        {
            title: 'Email Management',
            desc: 'Institutional broadcasts & tracking',
            icon: <Mail size={24} />,
            path: '/admin/communication/emails',
            color: 'bg-blue-50 text-blue-500',
            stats: '12.4k Dispatched'
        },
        {
            title: 'SMS Gateway',
            desc: 'Mobile notifications & OTP logs',
            icon: <Send size={24} />,
            path: '/admin/communication/sms',
            color: 'bg-amber-50 text-amber-500',
            stats: '5.2k Delivered'
        },
        {
            title: 'Notice Board',
            desc: 'Bulletin publishing & archive',
            icon: <Megaphone size={24} />,
            path: '/admin/communication/notices',
            color: 'bg-purple-50 text-purple-500',
            stats: '12 Active'
        },
        {
            title: 'Messaging Templates',
            desc: 'Standardized content protocols',
            icon: <FileText size={24} />,
            path: '/admin/communication/templates',
            color: 'bg-emerald-50 text-emerald-500',
            stats: '48 Templates'
        },
    ];

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout title="Communication Orchestration">
                    <Head>
                        <title>Communication | School ERP</title>
                    </Head>
                    <div className="space-y-10 animate-in fade-in duration-500 pb-12">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Communication Orchestration</h1>
                                <p className="text-sm font-medium text-slate-500 italic">Central command for institutional messaging, broadcasts, and data-synchronization across all channels.</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Global Delivery Rate</p>
                                    <h4 className="text-2xl font-black text-emerald-500 tracking-tighter">99.8%</h4>
                                </div>
                                <div className="size-14 rounded-full border-4 border-emerald-500/10 flex items-center justify-center">
                                    <TrendingUp size={24} className="text-emerald-500" />
                                </div>
                            </div>
                        </div>

                        {/* Hero Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Volume', value: '184k', trend: '+12%', icon: <Activity className="text-primary" /> },
                                { label: 'Latency Node', value: '42ms', trend: '-2ms', icon: <Clock className="text-indigo-500" /> },
                                { label: 'Active Syncs', value: '2,408', trend: 'STABLE', icon: <CheckCircle2 className="text-emerald-500" /> },
                                { label: 'System Alerts', value: '0', trend: 'ZERO', icon: <AlertCircle className="text-slate-300" /> },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group hover:border-primary/50 transition-all">
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                                {stat.icon}
                                            </div>
                                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-xl">
                                                {stat.trend}
                                            </Badge>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{stat.value}</h3>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 size-32 bg-slate-50 dark:bg-slate-800/50 rounded-full blur-2xl group-hover:bg-primary/5 transition-all"></div>
                                </div>
                            ))}
                        </div>

                        {/* Module Matrix */}
                        <div className="space-y-6">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-2">Node Selector: Channel Hubs</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {hubs.map((hub, i) => (
                                    <Link href={hub.path} key={i}>
                                        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl hover:border-primary/30 hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden">
                                            <div className="flex items-center gap-8 relative z-10">
                                                <div className={`size-20 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${hub.color.split(' ')[0]} dark:${hub.color.split(' ')[0]}/20 ${hub.color.split(' ')[1]}`}>
                                                    {hub.icon}
                                                </div>
                                                <div className="space-y-2 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{hub.title}</h3>
                                                        <ArrowUpRight size={18} className="text-slate-300 group-hover:text-primary transition-colors group-hover:translate-x-1 group-hover:-translate-y-1" />
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wide italic">{hub.desc}</p>
                                                    <div className="pt-4 flex items-center gap-3">
                                                        <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none font-black text-[9px] px-3 py-1">
                                                            {hub.stats}
                                                        </Badge>
                                                        <span className="text-[9px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Access Hub Node</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Global Activity Feed Placeholder */}
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-12 overflow-hidden relative">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                        <Activity size={20} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Real-time Transmission Stream</h3>
                                </div>
                                <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline">View Full Spectrum History</button>
                            </div>

                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <div className="size-10 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-400">
                                            <Mail size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Broadcast: Unified Maintenance Protocol Initiated</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sent to all student nodes (12,408) • 0 errors detected</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">COMPLETED</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{i * 5}m AGO</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}

