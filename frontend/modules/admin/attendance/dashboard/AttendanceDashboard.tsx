import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { attendanceService } from '@/services/attendance.service';
import Skeleton from '@/components/ui/Skeleton';
import {
    Users,
    UserCheck,
    UserX,
    BarChart3,
    PieChart as PieIcon,
    Activity,
    Calendar,
    AlertCircle,
    TrendingUp,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    Clock,
    Database,
    Briefcase,
    LayoutDashboard
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function AttendanceDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetching initial overview stats
                const data = await attendanceService.getReports({ type: 'overview' });
                setStats(data || null);
            } catch (err: any) {
                toast.error('Strategic overview synchronization failure');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <AdminLayout title="Attendance Dashboard">
            <Head>
                <title>Attendance Dashboard - EduCore</title>
            </Head>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary mb-1 text-[10px] font-black uppercase tracking-[0.2em]">
                        <LayoutDashboard size={14} />
                        Operational Overview
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Attendance Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Monitor presence and absence patterns across the institution.</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => router.push('/admin/attendance/students')}
                        className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <UserCheck size={16} />
                        Student Attendance
                    </button>
                    <button
                        onClick={() => router.push('/admin/attendance/teachers')}
                        className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Briefcase size={16} />
                        Staff Attendance
                    </button>
                </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <OverviewCard
                    label="Student Presence"
                    value={loading ? '...' : '96.4%'}
                    icon={Users}
                    color="blue"
                    trend="+0.8% today"
                />
                <OverviewCard
                    label="Staff Presence"
                    value={loading ? '...' : '98.2%'}
                    icon={Briefcase}
                    color="emerald"
                    trend="Stable"
                />
                <OverviewCard
                    label="Total Absences"
                    value={loading ? '...' : '12'}
                    icon={UserX}
                    color="rose"
                    trend="-4 from yesterday"
                />
                <OverviewCard
                    label="System Status"
                    value={loading ? '...' : 'ONLINE'}
                    icon={Activity}
                    color="purple"
                    trend="Operating Normal"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Movement Trends (Left) */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm relative overflow-hidden h-[500px]">
                        <div className="absolute top-0 right-0 size-80 bg-primary/5 rounded-full blur-[100px]" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Weekly Trends</h3>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Attendance Stability</p>
                                </div>
                                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <TrendingUp size={24} />
                                </div>
                            </div>

                            <div className="flex-1 flex items-end justify-between gap-6 px-4">
                                {[40, 55, 45, 70, 60, 85, 95].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                        <div className="w-full relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl h-64 overflow-hidden">
                                            <div
                                                style={{ height: `${h}%` }}
                                                className="absolute bottom-0 left-0 w-full bg-primary/20 group-hover:bg-primary transition-all duration-500"
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sector Insights (Right) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm relative overflow-hidden flex flex-col h-[500px]">
                        <div className="flex flex-col gap-6">
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Departmental Analysis</h3>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Active Departments</p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center space-y-6">
                            <DepartmentStability label="Science" percentage={98} color="bg-emerald-500" />
                            <DepartmentStability label="Mathematics" percentage={94} color="bg-primary" />
                            <DepartmentStability label="Humanities" percentage={89} color="bg-amber-500" />
                            <DepartmentStability label="Languages" percentage={92} color="bg-purple-500" />
                            <DepartmentStability label="Fine Arts" percentage={85} color="bg-rose-500" />
                        </div>

                        <button
                            onClick={() => router.push('/admin/attendance/reports')}
                            className="w-full py-5 bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-3xl hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-all flex items-center justify-center gap-2"
                        >
                            View Attendance Reports
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function OverviewCard({ label, value, icon: Icon, color, trend }: any) {
    const styles: any = {
        blue: 'bg-primary text-white shadow-primary/20',
        emerald: 'bg-emerald-500 text-white shadow-emerald-500/20',
        rose: 'bg-rose-500 text-white shadow-rose-500/20',
        purple: 'bg-purple-600 text-white shadow-purple-600/20',
    };

    return (
        <div className={`p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group ${styles[color]}`}>
            <div className="absolute -top-10 -right-10 size-32 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="size-12 rounded-2xl bg-black/10 flex items-center justify-center backdrop-blur-md">
                        <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">{trend}</span>
                </div>
                <div>
                    <h4 className="text-4xl font-black tracking-tight mb-1">{value}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none">{label}</p>
                </div>
            </div>
        </div>
    );
}

function DepartmentStability({ label, percentage, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{label}</span>
                <span className="text-xs font-black text-slate-400">{percentage}%</span>
            </div>
            <div className="h-2 w-full bg-slate-50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded-full ${color} shadow-sm`}
                />
            </div>
        </div>
    );
}
