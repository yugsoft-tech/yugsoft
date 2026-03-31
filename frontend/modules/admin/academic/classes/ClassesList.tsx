import { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Activity,
    Layers,
    ShieldCheck,
    ChevronRight,
    TrendingUp,
    BookOpen,
    UserCheck,
    Building
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useClasses } from '@/hooks/useClasses';
import { classesService } from '@/services/classes.service';
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

const classSchema = z.object({
    name: z.string().min(1, 'Class identifier required'),
    numericName: z.number().min(1, 'Numeric node required'),
});

type ClassFormValues = z.infer<typeof classSchema>;

export default function ClassesList() {
    const { classes, loading, refetch } = useClasses();
    const [activeTab, setActiveTab] = useState<'matrix' | 'create'>('matrix');
    const [registering, setRegistering] = useState(false);

    const { register, handleSubmit, reset } = useForm<ClassFormValues>({
        resolver: zodResolver(classSchema),
    });

    const onRegister = async (data: ClassFormValues) => {
        setRegistering(true);
        try {
            await classesService.create(data);
            toast.success('Academic Architecture: New class node registered.');
            reset();
            setActiveTab('matrix');
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Failed to register class');
        } finally {
            setRegistering(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Academic Architecture: Classes</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Configure institutional academic nodes and manage class-level metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setActiveTab('create')}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                    >
                        <Plus size={18} />
                        Register Class Node
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Academic Nodes', value: `${classes.length || 0} Classes`, icon: <Layers className="text-primary" /> },
                    { label: 'Global Capacity', value: '1,840 Nodes', icon: <Users className="text-indigo-500" /> },
                    { label: 'Certified Path', value: 'EduCore v1', icon: <ShieldCheck className="text-emerald-500" /> },
                    { label: 'System Health', value: 'STABLE', icon: <Activity className="text-amber-500" /> },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group hover:border-primary/50 transition-all">
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    {activeTab === 'create' ? (
                        <div className="space-y-10">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Academic Node Registry</h2>
                                <button onClick={() => setActiveTab('matrix')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Return to Matrix</button>
                            </div>
                            <form onSubmit={handleSubmit(onRegister)} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Class Identifier (Name)</label>
                                        <input
                                            {...register('name')}
                                            placeholder="Grade 10 / Secondary..."
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Numeric Node (Value)</label>
                                        <input
                                            type="number"
                                            {...register('numericName', { valueAsNumber: true })}
                                            placeholder="10"
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
                                        {registering ? <Activity size={18} className="animate-spin" /> : <Layers size={18} />}
                                        Commit Class Node
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
                                        placeholder="Sync Class Identifier..."
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all"
                                    />
                                </div>
                                <Button variant="secondary" className="rounded-xl px-6 py-4 h-auto font-black text-[10px] uppercase tracking-widest gap-2 border-2 text-slate-400">
                                    <Filter size={14} />
                                    Hierarchical synchronization
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="h-64 rounded-[2.5rem]" />
                                    ))
                                ) : (
                                    classes.map((cls) => (
                                        <div key={cls.id} className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-50 dark:border-slate-800 p-10 space-y-8 hover:border-primary transition-all shadow-xl group cursor-pointer overflow-hidden relative">
                                            <div className="flex justify-between items-start relative z-10">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{cls.name}</h3>
                                                        <Badge color="blue" className="bg-blue-500/10 text-blue-600 border-none text-[8px] font-black uppercase tracking-widest px-3">
                                                            LVL-{cls.numericName}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Node Identifier</p>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="size-10 rounded-2xl hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 dark:border-slate-800">
                                                            <MoreVertical size={20} />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                                                        <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                            <Layers size={16} className="text-primary" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Section Matrix</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                            <UserCheck size={16} className="text-emerald-500" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Assign Faculty</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                            <BookOpen size={16} className="text-indigo-500" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Curriculum Sync</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                                <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[2rem] flex flex-col items-center gap-3 border border-slate-100 dark:border-slate-800">
                                                    <Users size={24} className="text-primary" />
                                                    <div className="text-center">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Students</p>
                                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{cls._count?.students || 0} Nodes</p>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[2rem] flex flex-col items-center gap-3 border border-slate-100 dark:border-slate-800">
                                                    <Building size={24} className="text-indigo-500" />
                                                    <div className="text-center">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Sections</p>
                                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{cls._count?.sections || 0} Active</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <TrendingUp size={14} className="text-emerald-500" />
                                                    Performance: 88%
                                                </p>
                                                <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                                    Manage Node
                                                    <ChevronRight size={14} />
                                                </span>
                                            </div>

                                            {/* Abstract Design Element */}
                                            <div className="absolute -right-12 -top-12 size-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
