import { useState } from 'react';
import { useParent } from '@/contexts/ParentContext';
import {
    Users,
    GraduationCap,
    TrendingUp,
    Clock,
    Calendar,
    ChevronRight,
    Activity,
    AlertCircle,
    CheckCircle2,
    BookOpen,
    Download,
    ArrowRight,
    RefreshCw
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import ParentLayout from '@/components/layouts/ParentLayout';
import { toast } from 'react-hot-toast';

export default function ParentDashboard() {
    const { selectedChildId, childrenList } = useParent();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDownloadReports = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Preparing academic reports...',
                success: 'Reports downloaded successfully!',
                error: 'Failed to generate reports.',
            }
        ).then(() => {
            window.print();
        });
    };

    const handleCheckUpdates = () => {
        setIsUpdating(true);
        setTimeout(() => {
            setIsUpdating(false);
            toast.success('Your data is now up to date.');
        }, 1500);
    };

    const handlePayNow = () => {
        toast.loading('Redirecting to secure gateway...');
        setTimeout(() => {
            toast.dismiss();
            toast.success('Fee payment process initiated.');
        }, 1500);
    };

    // Mock Data Generators based on Context
    const getStats = () => {
        if (selectedChildId === 'ALL') {
            return [
                { label: 'Total Wards', value: childrenList.length.toString(), icon: <Users size={24} />, sub: 'ACTIVE', color: 'blue' as const },
                { label: 'Pending Dues', value: '$1,250', icon: <AlertCircle size={24} />, sub: 'URGENT', color: 'orange' as const },
                { label: 'Avg Attendance', value: '94%', icon: <Activity size={24} />, sub: 'OPTIMAL', color: 'emerald' as const },
            ];
        }
        // Child Specific Stats
        return [
            { label: 'Attendance', value: '96%', icon: <CheckCircle2 size={24} />, sub: 'EXCELLENT', color: 'emerald' as const },
            { label: 'Upcoming Exam', value: 'Math', icon: <Calendar size={24} />, sub: 'IN 2 DAYS', color: 'blue' as const },
            { label: 'Assignments', value: '03', icon: <BookOpen size={24} />, sub: 'PENDING', color: 'indigo' as const },
        ];
    };

    return (
        <ParentLayout>
            <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {selectedChildId === 'ALL' ? 'Family Overview' : `Student Overview: ${childrenList.find(c => c.id === selectedChildId)?.name}`}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            {selectedChildId === 'ALL'
                                ? 'Monitor academic progress and school notifications for all your children.'
                                : 'Detailed academic reports and attendance records for this student.'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleDownloadReports}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <Download size={18} className="mr-2" />
                            Download Reports
                        </button>
                        <button 
                            onClick={handleCheckUpdates}
                            disabled={isUpdating}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-lg shadow-primary/20 text-sm font-medium text-white bg-primary hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-50">
                            <Activity size={18} className={`mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                            {isUpdating ? 'Checking...' : 'Check Updates'}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getStats().map((stat, i) => (
                        <StatCard
                            key={i}
                            title={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            trend={stat.sub}
                            trendType={stat.sub === 'URGENT' ? 'down' : 'up'}
                            color={stat.color}
                        />
                    ))}
                </div>

                {/* Content switching based on context */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Stream */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                                {selectedChildId === 'ALL' ? 'Recent Activity' : 'Academic Timeline'}
                            </h3>
                            <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group">
                                View History
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="flex flex-col items-center">
                                        <div className={`size-3 rounded-full border-2 border-white dark:border-slate-900 z-10 ${i === 0 ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                        {i !== 2 && <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800 -mt-1" />}
                                    </div>
                                    <div className="pb-8 flex-1">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 group-hover:border-primary/20 transition-all">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Academics</span>
                                                <span className="text-[10px] font-medium text-slate-400">2h ago</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">Math Assignment: Calculus I</p>
                                            <p className="text-xs text-slate-500 font-medium">Assignment has been graded and is available for review.</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Side Widgets */}
                    <div className="space-y-6">
                        {/* Fee Reminder Card */}
                        <div className="bg-slate-900 dark:bg-white rounded-2xl p-8 text-white dark:text-slate-900 shadow-xl relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col h-full justify-between min-h-[240px]">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight italic mb-3">Fee Reminder</h3>
                                    <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold leading-relaxed">Payment for Term 2 is now due. Please process to avoid late charges.</p>
                                </div>

                                <div>
                                    <div className="flex items-end justify-between mb-6">
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none mb-2">Balance Due</p>
                                            <p className="text-3xl font-black italic">$1,250</p>
                                        </div>
                                        <span className="px-3 py-1 bg-red-500 text-[10px] font-black italic rounded-lg text-white animate-pulse">DUE SOON</span>
                                    </div>

                                    <button className="w-full bg-primary text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-primary/20">
                                        Pay Now
                                    </button>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 size-40 bg-primary opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        </div>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
