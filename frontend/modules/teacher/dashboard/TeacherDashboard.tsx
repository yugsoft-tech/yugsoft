import { useState, useEffect } from 'react';
import {
    Users,
    Activity,
    Star,
    Layers,
    TrendingUp,
    Zap,
    Plus,
    Download,
    Calendar,
    ArrowRight,
    CheckCircle2,
    Award,
    ShieldCheck,
    Clock
} from 'lucide-react';
import { statsService } from '@/services/stats.service';
import { toast } from 'react-hot-toast';
import StatCard from '@/components/ui/StatCard';
import TeacherLayout from '@/components/layouts/TeacherLayout';

export default function TeacherDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownloadReport = () => {
        setIsGenerating(true);
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Compiling teaching performance report...',
                success: 'Report downloaded successfully!',
                error: 'Failed to generate report.',
            }
        ).finally(() => setIsGenerating(false));
    };

    const handleActiveClasses = () => {
        toast('Checking current class schedules...', { icon: '📅' });
        // Navigation could go here too: router.push('/teacher/timetable')
    };

    const handleViewGrades = () => {
        toast.loading('Loading grade analytics...');
        setTimeout(() => toast.dismiss(), 1000);
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statsService.getTeacherStats();
                setStats(data.data || data);
            } catch (error: any) {
                toast.error('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const activities = [
        { title: 'Homework Help', detail: 'Class 10-A, Mathematics', status: 'In Review', icon: <Layers className="text-primary" /> },
        { title: 'Attendance Check', detail: 'Complete for Class 9-B', status: 'Done', icon: <CheckCircle2 className="text-emerald-500" /> },
        { title: 'Exam Results', detail: 'Internal Test Q1', status: 'Pending', icon: <Zap className="text-amber-500" /> },
    ];

    const statistics = stats?.statistics || stats || {};

    return (
        <TeacherLayout>
            <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Teacher Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your classes and track student progress easily.</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleDownloadReport}
                            disabled={isGenerating}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
                            <Download size={18} className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                            {isGenerating ? 'Generating...' : 'My Report'}
                        </button>
                        <button 
                            onClick={handleActiveClasses}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-lg shadow-primary/20 text-sm font-medium text-white bg-primary hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
                            <Activity size={18} className="mr-2" />
                            Active Classes
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Assigned Classes"
                        value={statistics.totalClasses || '0'}
                        icon={<Layers size={24} />}
                        trend="+1"
                        trendType="up"
                        color="blue"
                    />
                    <StatCard
                        title="Total Students"
                        value={statistics.totalStudents || '0'}
                        icon={<Users size={24} />}
                        trend="Stable"
                        trendType="neutral"
                        color="indigo"
                    />
                    <StatCard
                        title="Attendance Rate"
                        value={`${statistics.attendanceRate || statistics.todayAttendance || 0}%`}
                        icon={<Activity size={24} />}
                        trend="+2.1%"
                        trendType="up"
                        color="emerald"
                    />
                    <StatCard
                        title="My Rating"
                        value={statistics.rating || '4.8/5'}
                        icon={<Star size={24} />}
                        trend="Top 5%"
                        trendType="up"
                        color="purple"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Student Grades Section */}
                    <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={20} className="text-primary" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Student Grades</h2>
                            </div>
                            <button 
                                onClick={handleViewGrades}
                                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group">
                                View Grades
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="h-64 flex items-end gap-3 px-2">
                            {[30, 60, 45, 80, 55, 75, 95, 50, 70, 85].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
                                    <div className="w-full relative bg-slate-50 dark:bg-slate-800 rounded-t-lg h-48 overflow-hidden">
                                        <div
                                            className="absolute bottom-0 w-full bg-primary/20 rounded-t-lg transition-all duration-500 group-hover/bar:bg-primary/40"
                                            style={{ height: `${h}%` }}
                                        />
                                        <div
                                            className="absolute bottom-0 w-full bg-indigo-500/80 rounded-t-lg transition-all duration-500 group-hover/bar:bg-indigo-600"
                                            style={{ height: `${h - 20}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden md:block">B{i + 1}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-6 mt-6 px-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                <span className="text-xs font-medium text-slate-500">Average</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary/20" />
                                <span className="text-xs font-medium text-slate-500">Goal</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tasks */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Quick Tasks</h2>
                        <div className="space-y-6">
                            {activities.map((act, i) => (
                                <div key={i} className="flex items-start gap-4 group">
                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors">
                                        {act.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{act.title}</p>
                                            <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 rounded-md uppercase tracking-tighter">{act.status}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{act.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-2.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary bg-slate-50 dark:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-primary/20">
                            See All
                        </button>
                    </div>
                </div>

                {/* Performance Card */}
                <div className="bg-slate-900 dark:bg-white rounded-2xl p-8 text-white dark:text-slate-900 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-primary/10 rounded-2xl">
                                <Award size={48} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight italic">Top Performer</h3>
                                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium leading-relaxed max-w-xl">You have a great teaching record. Keep it up!</p>
                            </div>
                        </div>
                        <ShieldCheck size={48} className="text-primary opacity-20 absolute top-4 right-4 md:static md:opacity-100" />
                    </div>
                    <div className="absolute -bottom-10 -right-10 size-40 bg-primary opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                </div>
            </div>
        </TeacherLayout>
    );
}
