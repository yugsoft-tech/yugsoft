import { useState, useEffect } from 'react';
import {
    Bell,
    Send,
    Megaphone,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    AlertCircle,
    MoreVertical,
    Plus,
    Activity,
    User,
    ExternalLink,
    Calendar,
    Layers
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
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';

const noticeSchema = z.object({
    title: z.string().min(5, 'Notice title too short'),
    message: z.string().min(10, 'Message required'),
    audience: z.enum(['ALL', 'STUDENTS', 'TEACHERS', 'PARENTS']).default('ALL'),
});

type NoticeFormValues = z.infer<typeof noticeSchema>;

export default function NoticeBoard() {
    const [activeTab, setActiveTab] = useState<'publish' | 'current' | 'archive'>('current');
    const { loading, notices, fetchNotices, createNotice } = useCommunication();
    const [publishing, setPublishing] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<NoticeFormValues>({
        resolver: zodResolver(noticeSchema),
        defaultValues: { audience: 'ALL' }
    });

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);

    const onPublish = async (data: NoticeFormValues) => {
        setPublishing(true);
        const success = await createNotice(data);
        if (success) {
            reset();
            setActiveTab('current');
            fetchNotices();
        }
        setPublishing(false);
    };

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout title="Notices">
                    <Head>
                        <title>Notices | School ERP</title>
                    </Head>
                    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">Notice Board</h1>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic text-primary">Post and manage school announcements</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() => setActiveTab('publish')}
                                    className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                                >
                                    <Plus size={18} />
                                    New Notice
                                </Button>
                            </div>
                        </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="flex border-b border-slate-100 dark:border-slate-800">
                        <button
                            onClick={() => setActiveTab('current')}
                            className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'current' ? 'text-primary bg-primary/5 border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Current
                        </button>
                        <button
                            onClick={() => setActiveTab('archive')}
                            className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'archive' ? 'text-primary bg-primary/5 border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Archive
                        </button>
                </div>

                <div className="p-10">
                    {activeTab === 'publish' && (
                        <form onSubmit={handleSubmit(onPublish)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-8 space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Notice Title</label>
                                    <div className="relative group">
                                        <Megaphone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            {...register('title')}
                                            placeholder="Annual Sports Meet 2024..."
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                    {errors.title && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Message</label>
                                    <textarea
                                        {...register('message')}
                                        rows={6}
                                        placeholder="Enter notice details..."
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-6 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                    ></textarea>
                                    {errors.message && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.message.message}</p>}
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Send To</label>
                                        <select
                                            {...register('audience')}
                                            className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary appearance-none"
                                        >
                                            <option value="ALL">Everyone</option>
                                            <option value="STUDENTS">Students</option>
                                            <option value="TEACHERS">Teachers</option>
                                            <option value="PARENTS">Parents</option>
                                        </select>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={publishing}
                                        className="w-full bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] py-6 h-auto font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 transition-all active:scale-95"
                                    >
                                        {publishing ? <Activity size={18} className="animate-spin" /> : <Send size={18} />}
                                        Post Notice
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}

                    {(activeTab === 'current' || activeTab === 'archive') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-64 rounded-[2rem]" />
                                ))
                            ) : notices.length === 0 ? (
                                <div className="col-span-full py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                                            <Megaphone size={32} />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">No current notices.</p>
                                    </div>
                                </div>
                            ) : (
                                notices.map((notice) => (
                                    <div key={notice.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 p-8 space-y-6 hover:border-primary/30 transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8">
                                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2">
                                                {notice.audience}
                                            </Badge>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <Bell size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight truncate max-w-[200px]">{notice.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Calendar size={12} className="text-slate-400" />
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(notice.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide leading-relaxed line-clamp-3 italic">
                                                {notice.message}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black">
                                                    {notice.audience.charAt(0)}
                                                </div>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audience: {notice.audience}</span>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="size-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-all">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl">
                                                    <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                        <Layers size={14} className="text-primary" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-rose-500">
                                                        <AlertCircle size={14} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Remove Notice</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))
                            )}
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
