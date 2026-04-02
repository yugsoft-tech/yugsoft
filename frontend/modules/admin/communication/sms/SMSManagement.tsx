import { useState, useEffect } from 'react';
import {
    MessageSquare,
    Send,
    History,
    Smartphone,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    AlertCircle,
    MoreVertical,
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
import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';

const smsSchema = z.object({
    recipients: z.string().min(1, 'Target nodes required'),
    content: z.string().min(1, 'Message payload required').max(160, 'SMS protocol limit: 160 characters'),
    senderId: z.string().optional(),
});

type SMSFormValues = z.infer<typeof smsSchema>;

export default function SMSManagement() {
    const [activeTab, setActiveTab] = useState<'broadcast' | 'logs'>('broadcast');
    const { loading, smsHistory, fetchSmsHistory, sendSMS } = useCommunication();
    const [sending, setSending] = useState(false);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<SMSFormValues>({
        resolver: zodResolver(smsSchema),
    });

    const content = watch('content', '');

    useEffect(() => {
        if (activeTab === 'logs') {
            fetchSmsHistory();
        }
    }, [activeTab, fetchSmsHistory]);

    const onSend = async (data: SMSFormValues) => {
        setSending(true);
        const success = await sendSMS(data);
        if (success) {
            reset();
            setActiveTab('logs');
        }
        setSending(false);
    };

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout title="Communication Hub: SMS">
                    <Head>
                        <title>SMS Management | School ERP</title>
                    </Head>
                    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Communication Hub: SMS</h1>
                                <p className="text-sm font-medium text-slate-500 italic">Deploy high-latency mobile broadcasts and track institutional delivery metrics.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2">
                                    GATEWAY: DISPATCH_ACTIVE
                                </Badge>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                            <div className="flex border-b border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => setActiveTab('broadcast')}
                                    className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'broadcast' ? 'text-primary bg-primary/5 border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Initiate SMS Broadcast
                                </button>
                                <button
                                    onClick={() => setActiveTab('logs')}
                                    className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'text-primary bg-primary/5 border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Transmission history
                                </button>
                            </div>

                            <div className="p-10">
                                {activeTab === 'broadcast' && (
                                    <form onSubmit={handleSubmit(onSend)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                        <div className="lg:col-span-8 space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Cluster (Phone Nodes)</label>
                                                <div className="relative group">
                                                    <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        {...register('recipients')}
                                                        placeholder="+123456789, Grade-10, parents_all..."
                                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex justify-between">
                                                    <span>SMS Payload (Message)</span>
                                                    <span className={content.length > 140 ? 'text-rose-500' : 'text-slate-400'}>{content.length} / 160</span>
                                                </label>
                                                <textarea
                                                    {...register('content')}
                                                    rows={5}
                                                    placeholder="Enter institutional SMS payload..."
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-6 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-4 space-y-8">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 space-y-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gateway configuration</label>
                                                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                                                        <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center">
                                                            <Smartphone size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Route</p>
                                                            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">Twilio_Institutional</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                                                    <div className="flex items-center gap-2 text-indigo-500">
                                                        <Activity size={16} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Protocol Check</span>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-500 italic uppercase leading-relaxed">
                                                        Verify character count to prevent multi-segment billing protocols.
                                                    </p>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={sending}
                                                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-[1.5rem] py-6 h-auto font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
                                                >
                                                    {sending ? <Activity size={18} className="animate-spin" /> : <Send size={18} />}
                                                    Dispatch SMS
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                {activeTab === 'logs' && (
                                    <div className="rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 overflow-hidden">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transmission Hub</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payload Snippet</th>
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
                                                            <td className="px-8 py-6"><Skeleton className="h-6 w-64" /></td>
                                                            <td className="px-8 py-6"><Skeleton className="h-6 w-20" /></td>
                                                            <td className="px-8 py-6"><Skeleton className="h-6 w-24" /></td>
                                                            <td className="px-8 py-6"><Skeleton className="size-8 ml-auto" /></td>
                                                        </tr>
                                                    ))
                                                ) : smsHistory.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="px-8 py-20 text-center">
                                                            <div className="flex flex-col items-center gap-4">
                                                                <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                                                                    <MessageSquare size={32} />
                                                                </div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No Transmission Data Found</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    smsHistory.map((log) => (
                                                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                            <td className="px-8 py-6 text-[10px] font-black text-slate-900 dark:text-white uppercase truncate max-w-[150px]">{log.recipients}</td>
                                                            <td className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate max-w-[300px]">{log.content}</td>
                                                            <td className="px-8 py-6">
                                                                <Badge className={log.status === 'SENT' ? 'bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px]' : 'bg-rose-500/10 text-rose-500 border-none font-black text-[9px]'}>
                                                                    {log.status || 'SUCCESS'}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(log.createdAt).toLocaleDateString()}</td>
                                                            <td className="px-8 py-6 text-right">
                                                                <button className="size-8 rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-all">
                                                                    <MoreVertical size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
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
