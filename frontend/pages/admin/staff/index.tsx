import { Download, Plus } from 'lucide-react';
import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';
import StaffDashboard from '@/modules/admin/staff/dashboard/StaffDashboard';

export default function AdminStaffDashboardPage() {
    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout>
                    <Head>
                        <title>Staff Management - School ERP</title>
                    </Head>
                    <div className="flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 p-6 pb-0 max-w-[1400px] w-full mx-auto">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight mb-1 text-slate-900 dark:text-white">Non-Teaching Staff</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">Manage profiles, departments, roles, and employment details for support personnel.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center justify-center gap-2 px-4 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2936] text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <Download size={18} />
                                    Export
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 h-10 rounded-lg bg-primary text-white text-sm font-semibold shadow-sm hover:bg-blue-600 transition-colors">
                                    <Plus size={18} />
                                    Add New Staff
                                </button>
                            </div>
                        </div>
                        <StaffDashboard />
                    </div>
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}
