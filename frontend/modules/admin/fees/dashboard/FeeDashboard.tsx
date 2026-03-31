import Head from 'next/head';
import Link from 'next/link';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';
import { useFeeDashboard } from '@/hooks/useFeeDashboard';
import { format } from 'date-fns';

export default function FeeDashboard() {
    const { data, loading, error } = useFeeDashboard();

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-96 items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    const { statistics, recentTransactions, monthlyOverview } = data || {
        statistics: { totalCollected: 0, outstandingBalance: 0, todayCollection: 0, overdueCount: 0 },
        recentTransactions: [],
        monthlyOverview: []
    };

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout title="Fee Management">
                    <Head>
                        <title>Fee Management - School ERP</title>
                    </Head>

                    <div className="flex flex-col gap-6">
                        {/* Page Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fee Management</h1>
                                <p className="text-slate-500 dark:text-slate-400">Financial Overview & Collections</p>
                            </div>
                            <div className="flex gap-3">
                                <Link href="/admin/fees/collection" className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                    <span>Collect Fee</span>
                                </Link>
                            </div>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-[#1e2936] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                                        <span className="material-symbols-outlined">attach_money</span>
                                    </div>
                                    <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+12.5%</span>
                                </div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Fees Collected</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    ${statistics.totalCollected.toLocaleString()}
                                </h3>
                            </div>
                            <div className="bg-white dark:bg-[#1e2936] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg text-red-600 dark:text-red-400">
                                        <span className="material-symbols-outlined">money_off</span>
                                    </div>
                                    <span className="flex items-center text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">+5.2%</span>
                                </div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Outstanding Balance</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    ${statistics.outstandingBalance.toLocaleString()}
                                </h3>
                            </div>
                            <div className="bg-white dark:bg-[#1e2936] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-primary">
                                        <span className="material-symbols-outlined">event_available</span>
                                    </div>
                                    <span className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">Today</span>
                                </div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Today's Collection</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    ${statistics.todayCollection.toLocaleString()}
                                </h3>
                            </div>
                            <div className="bg-white dark:bg-[#1e2936] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400">
                                        <span className="material-symbols-outlined">warning</span>
                                    </div>
                                    <span className="flex items-center text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">Attention</span>
                                </div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Overdue Records</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {statistics.overdueCount || 0}
                                </h3>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Chart Section */}
                            <div className="lg:col-span-2 bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Collection Overview</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Past 6 Months</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded uppercase font-bold tracking-widest">Live API</span>
                                    </div>
                                </div>

                                {/* Custom Bar Chart from Backend Data */}
                                <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
                                    {(monthlyOverview || []).map((entry: any, index: number) => {
                                        const maxAmount = Math.max(...monthlyOverview.map((m: any) => m.amount), 1);
                                        const percentage = (entry.amount / maxAmount) * 100;
                                        return (
                                            <div key={entry.month} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group cursor-pointer">
                                                <div className="relative w-full max-w-[40px] bg-primary/20 rounded-t-sm group-hover:bg-primary/30 transition-all duration-300" style={{ height: `${Math.max(percentage, 5)}%` }}>
                                                    <div className="absolute bottom-0 w-full bg-primary rounded-t-sm h-full"></div>
                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                                                        ${entry.amount.toLocaleString()}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-tighter">{entry.month}</span>
                                            </div>
                                        )
                                    })}
                                    {monthlyOverview.length === 0 && (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 italic text-sm">
                                            No collection data available
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Upcoming Dues Reminders */}
                            <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Status</h3>
                                    <Link href="/admin/fees" className="text-sm text-primary hover:underline font-medium">Manage All</Link>
                                </div>
                                <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-2">
                                    {recentTransactions.slice(0, 3).map((item: any, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                            <div className={`bg-blue-100 dark:bg-blue-900/30 text-primary p-2 rounded-lg flex-shrink-0`}>
                                                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.studentName}</p>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{item.class}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-slate-900 dark:text-white">${item.amount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {recentTransactions.length === 0 && (
                                        <div className="text-center py-8 text-slate-400 text-sm italic">
                                            No recent transactions
                                        </div>
                                    )}
                                </div>
                                <button className="mt-8 py-3 w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-primary hover:text-white transition-all shadow-sm">
                                    <span className="material-symbols-outlined text-[18px]">notifications</span> 
                                    <span>Send Reminders</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Transactions Table */}
                        <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Latest Transactions</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Most recent fee activities across the school</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                        Filter
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="px-6 py-4">Transaction ID</th>
                                            <th className="px-6 py-4">Student</th>
                                            <th className="px-6 py-4">Class</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {recentTransactions.map((trx: any, i: number) => (
                                            <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-6 py-4 font-mono text-[10px] text-slate-400">#TRX-{trx.id.substring(trx.id.length - 6).toUpperCase()}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{trx.studentName}</td>
                                                <td className="px-6 py-4 text-xs font-medium text-slate-500">{trx.class}</td>
                                                <td className="px-6 py-4 text-xs text-slate-500">{format(new Date(trx.date), 'MMM dd, yyyy')}</td>
                                                <td className="px-6 py-4 font-black text-slate-900 dark:text-white">${trx.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                                        trx.status === 'PAID'
                                                            ? 'bg-emerald-500/10 text-emerald-600'
                                                            : trx.status === 'OVERDUE'
                                                                ? 'bg-rose-500/10 text-rose-600'
                                                                : 'bg-amber-500/10 text-amber-600'
                                                    }`}>
                                                        {trx.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {recentTransactions.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                                                    No transactions found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}
