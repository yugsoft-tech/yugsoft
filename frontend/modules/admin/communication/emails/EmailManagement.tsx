import { useState, useEffect } from 'react';
import {
    Mail,
    Send,
    History,
    FileText,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    AlertCircle,
    MoreVertical,
    ChevronRight,
    Plus,
    Activity,
    User,
    ExternalLink
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCommunication } from '@/hooks/useCommunication';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';

const emailSchema = z.object({
    recipients: z.string().min(1, 'Target nodes required'),
    subject: z.string().min(3, 'Broadcast identifier required'),
    content: z.string().min(10, 'Message body cannot be empty'),
    priority: z.enum(['LOW', 'NORMAL', 'HIGH']).default('NORMAL'),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function EmailManagement() {
    const [activeTab, setActiveTab] = useState<'broadcast' | 'logs' | 'templates'>('broadcast');
    const { loading, emailHistory, fetchEmailHistory, sendEmail } = useCommunication();
    const [sending, setSending] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        defaultValues: { priority: 'NORMAL' }
    });

    useEffect(() => {
        if (activeTab === 'logs') {
            fetchEmailHistory();
        }
    }, [activeTab, fetchEmailHistory]);

    const onSend = async (data: EmailFormValues) => {
        setSending(true);
        const success = await sendEmail(data);
        if (success) {
            reset();
            setActiveTab('logs');
        }
        setSending(false);
    };

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout title="Email Hub">
                    <Head>
                        <title>Email Management | School ERP</title>
                    </Head>
                    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                        {/* Header & Stats Dashboard */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Communication Hub: Email</h1>
                                <p className="text-sm font-medium text-slate-500 italic">Orchestrate institutional broadcasts and track delivery synchronization.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="size-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black">
                                            U{i}
                                        </div>
                                    ))}
                                </div>
                                <Badge variant="outline" className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2">
                                    SESSION ACTIVE
                                </Badge>
                            </div>
                        </div>

                        {/* Analytics Matrix */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-6 group hover:border-primary/50 transition-all">
                                <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Successful Sync</p>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">12,408</h3>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-6 group hover:border-indigo-500/50 transition-all">
                                <div className="size-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Transmission Queue</p>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">42</h3>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-6 group hover:border-rose-500/50 transition-all">
                                <div className="size-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Failed Delivery</p>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">0.4%</h3>
                                </div>
                            </div>
                        </div>

                        {/* Main Orchestration Interface */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                            <div className="flex border-b border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => setActiveTab('broadcast')}
                                    className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'broadcast' ? 'text-primary bg-primary/5 border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Initiate Broadcast
                                </button>
                                <button
                                    onClick={() => setActiveTab('logs')}
                                    className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'text-primary bg-primary/5 border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Transmission Logs
                                </button>
                                <button
                                    onClick={() => setActiveTab('templates')}
                                    className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'templates' ? 'text-primary bg-primary/5 border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Institutional Templates
                                </button>
                            </div>

                            <div className="p-10">
                                {activeTab === 'broadcast' && (
                                    <form onSubmit={handleSubmit(onSend)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                        <div className="lg:col-span-8 space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Cluster (Recipients)</label>
                                                <div className="relative group">
                                                    <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        {...register('recipients')}
                                                        placeholder="All Students, Grade-10, parents@educore.inst..."
                                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                                    />
                                                </div>
                                                {errors.recipients && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.recipients.message}</p>}
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Broadcast Identifier (Subject)</label>
                                                <div className="relative group">
                                                    <FileText size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        {...register('subject')}
                                                        placeholder="Urgent: Institutional Maintenance Protocol..."
                                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Narrative Node (Content)</label>
                                                <textarea
                                                    {...register('content')}
                                                    rows={8}
                                                    placeholder="Enter institutional message payload..."
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-6 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-4 space-y-8">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 space-y-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transmission Priority</label>
                                                    <select
                                                        {...register('priority')}
                                                        className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary appearance-none"
                                                    >
                                                        <option value="NORMAL">Priority: Normal</option>
                                                        <option value="HIGH">Priority: Critical</option>
                                                        <option value="LOW">Priority: Low</option>
                                                    </select>
                                                </div>

                                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                                                    <div className="flex items-center gap-2 text-primary">
                                                        <Activity size={16} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Protocol Check</span>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-500 italic uppercase leading-relaxed">
                                                        Ensuring 100% encryption and institutional node compatibility for this broadcast.
                                                    </p>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={sending}
                                                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] py-6 h-auto font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 transition-all active:scale-95"
                                                >
                                                    {sending ? <Activity size={18} className="animate-spin" /> : <Send size={18} />}
                                                    Dispatch Protocol
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                {activeTab === 'logs' && (
                                    <div className="space-y-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="relative group max-w-md w-full">
                                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                                <input
                                                    type="text"
                                                    placeholder="Query Transmission Id or Target..."
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <Button variant="secondary" className="rounded-xl px-6 py-4 h-auto font-black text-[10px] uppercase tracking-widest gap-2 border-2">
                                                <Filter size={14} />
                                                Advanced Filter
                                            </Button>
                                        </div>

                                        <div className="rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 overflow-hidden">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transmission Identifier</th>
                                                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cluster / Node</th>
                                                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status Code</th>
                                                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Temporal Node</th>
                                                        <th className="px-8 py-6"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                    {loading ? (
                                                        Array.from({ length: 5 }).map((_, i) => (
                                                            <tr key={i}>
                                                                <td className="px-8 py-6"><Skeleton className="h-6 w-32" /></td>
                                                                <td className="px-8 py-6"><Skeleton className="h-6 w-48" /></td>
                                                                <td className="px-8 py-6"><Skeleton className="h-6 w-20" /></td>
                                                                <td className="px-8 py-6"><Skeleton className="h-6 w-24" /></td>
                                                                <td className="px-8 py-6"><Skeleton className="size-8 rounded-lg ml-auto" /></td>
                                                            </tr>
                                                        ))
                                                    ) : emailHistory.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={5} className="px-8 py-20 text-center">
                                                                <div className="flex flex-col items-center gap-4">
                                                                    <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                                                                        <History size={32} />
                                                                    </div>
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No Transmission Data Found</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        emailHistory.map((log) => (
                                                            <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                                <td className="px-8 py-6">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                                                            <Mail size={16} />
                                                                        </div>
                                                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase truncate max-w-[200px]">{log.subject}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{log.recipients}</td>
                                                                <td className="px-8 py-6">
                                                                    <Badge className={log.status === 'SENT' ? 'bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px]' : 'bg-rose-500/10 text-rose-500 border-none font-black text-[9px]'}>
                                                                        {log.status || 'SYNCHRONIZED'}
                                                                    </Badge>
                                                                </td>
                                                                <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(log.createdAt).toLocaleDateString()}</td>
                                                                <td className="px-8 py-6 text-right">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <button className="size-8 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-all">
                                                                                <MoreVertical size={16} />
                                                                            </button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl">
                                                                            <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                                                <ExternalLink size={14} className="text-primary" />
                                                                                <span className="text-[10px] font-black uppercase tracking-widest">Detail Matrix</span>
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                                                <Plus size={14} className="text-indigo-500" />
                                                                                <span className="text-[10px] font-black uppercase tracking-widest">Retransmit Node</span>
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'templates' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {[
                                            { name: 'Fee Reminder Protocol', type: 'FINANCE' },
                                            { name: 'Academic Results Sync', type: 'ACADEMIC' },
                                            { name: 'Event Notification Node', type: 'GENERAL' },
                                        ].map((t, i) => (
                                            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] space-y-6 group hover:border-primary border border-transparent transition-all cursor-pointer">
                                                <div className="flex justify-between items-start">
                                                    <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <Plus size={20} />
                                                    </div>
                                                    <Badge variant="secondary" className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5">{t.type}</Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.name}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase italic">Institutional Master Template</p>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                                                    <span className="text-[9px] font-black text-primary uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                                                        Load Configuration
                                                        <ChevronRight size={12} />
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="bg-white dark:bg-slate-900 rounded-[2rem] border-4 border-dashed border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center justify-center gap-6 group hover:border-primary/50 transition-all">
                                            <div className="size-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-primary transition-all shadow-sm">
                                                <Plus size={32} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Protocol Template</span>
                                        </button>
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

