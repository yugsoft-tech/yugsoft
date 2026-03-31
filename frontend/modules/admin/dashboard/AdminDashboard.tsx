import {
  GraduationCap,
  Users,
  UserCheck,
  CreditCard,
  TrendingUp,
  Download,
  Plus,
  Calendar,
  ArrowUpRight,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Activity
} from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import { useStats } from '@/hooks/useStats';

export default function AdminDashboard() {
  const { stats, loading } = useStats();

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Quick look at how the school is doing today.</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Download size={18} className="mr-2" />
              Get Report
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-lg shadow-primary/20 text-sm font-medium text-white bg-primary hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
              <Plus size={18} className="mr-2" />
              New Admission
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={stats?.statistics?.totalStudents || '0'}
            icon={<GraduationCap size={24} />}
            trend="+4.2%"
            trendType="up"
            color="indigo"
          />
          <StatCard
            title="Total Teachers"
            value={stats?.statistics?.totalTeachers || '0'}
            icon={<Users size={24} />}
            trend="+2"
            trendType="neutral"
            color="blue"
          />
          <StatCard
            title="Active Classes"
            value={stats?.statistics?.activeClasses || '0'}
            icon={<UserCheck size={24} />}
            trend="+12%"
            trendType="up"
            color="purple"
          />
          <StatCard
            title="Daily Attendance"
            value={`${stats?.statistics?.todayAttendance || 0}%`}
            icon={<CreditCard size={24} />}
            trend="+8.2%"
            trendType="up"
            color="emerald"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendance Analytics */}
          <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Attendance Summary</h2>
              </div>
              <select className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-xs rounded-lg px-3 py-1.5 focus:ring-primary focus:border-primary">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>

            <div className="h-64 flex items-end gap-2 px-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full relative bg-slate-100 dark:bg-slate-800 rounded-t-lg h-48 overflow-hidden">
                    <div
                      className="absolute bottom-0 w-full bg-primary/40 rounded-t-lg transition-all duration-500 group-hover:bg-primary/60"
                      style={{ height: `${Math.floor(Math.random() * 50) + 30}%` }}
                    />
                    <div
                      className="absolute bottom-0 w-full bg-emerald-500/80 rounded-t-lg transition-all duration-500 group-hover:bg-emerald-600"
                      style={{ height: `${Math.floor(Math.random() * 30) + 10}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-bold">{day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-6 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs font-medium text-slate-500">Students</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-slate-500">Staff</span>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Recent Actions</h2>
            <div className="space-y-6">
              {(stats?.recentActivities || []).map((activity: any, i: number) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform`}>
                    <Activity size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-none truncate max-w-[120px]">{activity.action}</p>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{activity.user}</p>
                  </div>
                </div>
              ))}
              {(!stats?.recentActivities || stats.recentActivities.length === 0) && (
                <p className="text-xs text-slate-400 text-center py-8 italic">No recent activities.</p>
              )}
            </div>
            <button className="w-full mt-6 py-2 text-xs font-bold text-slate-400 hover:text-primary border border-dashed border-slate-200 dark:border-slate-700 rounded-lg transition-all">
            View All
            </button>
          </div>
        </div>

        {/* Resources Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Bus Usage', value: 82, color: 'bg-indigo-500' },
            { label: 'Hostel Rooms', value: 64, color: 'bg-purple-500' },
            { label: 'Library Books', value: 38, color: 'bg-emerald-500' },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{item.label}</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">{item.value}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
