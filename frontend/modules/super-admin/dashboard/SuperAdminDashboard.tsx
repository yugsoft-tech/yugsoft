import {
    Building2,
    Users,
    CreditCard,
    Activity,
    Download,
    Plus,
    AlertTriangle,
    CheckCircle,
    Server,
    ExternalLink,
    MoreHorizontal
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { useStats } from '@/hooks/useStats';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function SuperAdminDashboard() {
    const { stats, loading } = useStats();
    const [isExporting, setIsExporting] = useState(false);

    const handleExportReport = () => {
        setIsExporting(true);
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2500)),
            {
                loading: 'Generating global system report...',
                success: 'System report exported to PDF.',
                error: 'Export failed.',
            }
        ).finally(() => setIsExporting(false));
    };

    const handleAddSchool = () => {
        toast.loading('Initializing new tenant protocols...');
        setTimeout(() => {
            toast.dismiss();
            toast.success('Onboarding wizard launched.');
        }, 1200);
    };

    const handleViewAllSchools = () => {
        toast('Navigating to school directory...', { icon: '🏫' });
    };

    return (
        <SuperAdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Overview</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">View health and stats for all schools in the system.</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleExportReport}
                            disabled={isExporting}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
                            <Download size={18} className={`mr-2 ${isExporting ? 'animate-spin' : ''}`} />
                            {isExporting ? 'Exporting...' : 'Export Report'}
                        </button>
                        <button 
                            onClick={handleAddSchool}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-lg shadow-primary/20 text-sm font-medium text-white bg-primary hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
                            <Plus size={18} className="mr-2" />
                            Add School
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Active Schools"
                        value={stats?.statistics?.totalSchools || '0'}
                        icon={<Building2 size={24} />}
                        trend="+12%"
                        trendType="up"
                        color="blue"
                    />
                    <StatCard
                        title="Total Students"
                        value={stats?.statistics?.totalStudents?.toLocaleString() || '0'}
                        icon={<Users size={24} />}
                        trend="+5.4%"
                        trendType="up"
                        color="indigo"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value="$8.2M"
                        icon={<CreditCard size={24} />}
                        trend="-2.1%"
                        trendType="down"
                        color="purple"
                    />
                    <StatCard
                        title="System Uptime"
                        value="99.9%"
                        icon={<Activity size={24} />}
                        trend="Stable"
                        trendType="neutral"
                        color="orange"
                    />
                </div>

                {/* Middle Section: Trends & Health */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Registration Trends */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Registration Trends</h2>
                            <select className="bg-slate-50 dark:bg-slate-800 border-none text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary outline-none">
                                <option>Last 30 Days</option>
                                <option>Last 6 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        {/* Monthly Bar Chart */}
                        <div className="h-64 flex items-end gap-3 px-2">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                    <div className="w-full relative bg-slate-100 dark:bg-slate-800 rounded-t-lg h-48 overflow-hidden">
                                        <div
                                            className="absolute bottom-0 w-full bg-primary/20 group-hover:bg-primary transition-all duration-500 rounded-t-lg"
                                            style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Resources */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-8">System Health</h2>
                        <div className="space-y-8">
                            {[
                                { label: 'Server Load', value: 42, color: 'bg-primary' },
                                { label: 'Database Health', value: 88, color: 'bg-emerald-500' },
                                { label: 'Storage Usage', value: 76, color: 'bg-amber-500' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                                        <span className="text-xs font-black text-slate-900 dark:text-white">{item.value}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                                        <div
                                            className={`${item.color} h-1.5 rounded-full transition-all duration-1000`}
                                            style={{ width: `${item.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">System Alerts</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-lg text-rose-600 dark:text-rose-400">
                                            <AlertTriangle size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">High CPU Usage</p>
                                            <p className="text-[10px] text-slate-500 mt-2 font-medium">Server-A • 24 mins ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Database Backup Success</p>
                                            <p className="text-[10px] text-slate-500 mt-2 font-medium">All Regions • 2 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Schools Table */}
                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recently Added Schools</h2>
                        <button 
                            onClick={handleViewAllSchools}
                            className="text-sm text-primary font-bold hover:underline">View All Schools</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">School Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Plan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Admin</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {(stats?.recentSchools || [
                                    { name: 'Springfield International', address: 'London, UK', plan: 'Enterprise', admin: 'Sarah Connor', status: 'Active' },
                                    { name: 'Westside High', address: 'New York, USA', plan: 'Basic', admin: 'John Doe', status: 'Pending' },
                                ]).map((school: any, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{school.name}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{school.address || school.loc}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{school.plan || 'Enterprise'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{school.admin || 'System Admin'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${school.status === 'Active' || !school.status
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                : school.status === 'Pending'
                                                    ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400'
                                                    : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400'
                                                }`}>
                                                {school.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
