import { useState, useEffect } from 'react';
import {
    BookOpen,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Activity,
    Layers,
    ShieldCheck,
    ChevronRight,
    Zap,
    Book,
    FileText,
    Clock,
    ArrowRight,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSubjects } from '@/hooks/useSubjects';
import { subjectsService } from '@/services/subjects.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { toast } from 'react-hot-toast';

const subjectSchema = z.object({
    name: z.string().min(1, 'Subject identifier required'),
    code: z.string().min(1, 'Categorical code required'),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

export default function SubjectsList() {
    const { subjects, loading, refetch } = useSubjects();
    const [activeTab, setActiveTab] = useState<'matrix' | 'create'>('matrix');
    const [registering, setRegistering] = useState(false);

    const { register, handleSubmit, reset } = useForm<SubjectFormValues>({
        resolver: zodResolver(subjectSchema),
    });

    const onRegister = async (data: SubjectFormValues) => {
        setRegistering(true);
        try {
            await subjectsService.create(data as any);
            toast.success('Curriculum Expansion: New subject node registered.');
            reset();
            setActiveTab('matrix');
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Failed to register subject');
        } finally {
            setRegistering(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Curriculum Node Registry</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Manage institutional subject entities, syllabus synchronization, and academic credits.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setActiveTab('create')}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                    >
                        <Plus size={18} />
                        Add New Subject
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    {activeTab === 'create' ? (
                        <div className="space-y-10">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Academic Asset Registry</h2>
                                <button onClick={() => setActiveTab('matrix')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Return to Matrix</button>
                            </div>
                            <form onSubmit={handleSubmit(onRegister)} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Subject Identifier (Name)</label>
                                        <input
                                            {...register('name')}
                                            placeholder="Theoretical Physics / Macroeconomics..."
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Canonical Code (ID)</label>
                                        <input
                                            {...register('code')}
                                            placeholder="PHY-402 / ECO-101..."
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={registering}
                                        className="bg-primary hover:bg-primary/90 text-white rounded-[2rem] px-12 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
                                    >
                                        {registering ? <Activity size={18} className="animate-spin" /> : <BookOpen size={18} />}
                                        Commit Asset Node
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="relative group max-w-md w-full">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Sync Subject Identifier..."
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all"
                                    />
                                </div>
                                <Button variant="secondary" className="rounded-xl px-6 py-4 h-auto font-black text-[10px] uppercase tracking-widest gap-2 border-2 text-slate-400">
                                    <Filter size={14} />
                                    Curriculum Filter
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="h-64 rounded-[2.5rem]" />
                                    ))
                                ) : (
                                    subjects.map((sub) => (
                                        <div key={sub.id} className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-50 dark:border-slate-800 p-10 space-y-8 hover:border-primary transition-all shadow-xl group cursor-pointer overflow-hidden relative">
                                            <div className="flex justify-between items-start relative z-10">
                                                <div className="space-y-2 text-left">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{sub.name}</h3>
                                                        <Badge color="amber" className="bg-amber-500/10 text-amber-600 border-none text-[8px] font-black uppercase tracking-widest px-3">
                                                            {sub.code}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="size-10 rounded-2xl hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 dark:border-slate-800">
                                                            <MoreVertical size={20} />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                                                        <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                            <FileText size={16} className="text-primary" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Syllabus Matrix</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                            <Activity size={16} className="text-emerald-500" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Assessment Sync</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                                <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[2rem] flex flex-col items-center gap-3 border border-slate-100 dark:border-slate-800">
                                                    <Book size={24} className="text-primary" />
                                                    <div className="text-center">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Assignments</p>
                                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{sub._count?.homeworks || 0} Sets</p>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[2rem] flex flex-col items-center gap-3 border border-slate-100 dark:border-slate-800">
                                                    <Clock size={24} className="text-indigo-500" />
                                                    <div className="text-center">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Sessions</p>
                                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{sub._count?.timetables || 0} / Week</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10 text-left">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                                                    <ShieldCheck size={14} className="text-emerald-500" />
                                                    CREDIT_VALIDATED
                                                </p>
                                                <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                                    Sync Curriculum
                                                    <ChevronRight size={14} />
                                                </span>
                                            </div>

                                            {/* Abstract Design Element */}
                                            <div className="absolute -left-12 -bottom-12 size-40 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all"></div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
}
