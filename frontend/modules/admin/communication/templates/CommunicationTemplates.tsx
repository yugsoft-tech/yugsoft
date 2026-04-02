import { useState } from 'react';
import {
    FileText,
    Plus,
    Search,
    Filter,
    Copy,
    Edit3,
    Trash2,
    MoreVertical,
    Activity,
    Code,
    Type,
    Layout,
    Smartphone
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';

export default function CommunicationTemplates() {
    const [activeType, setActiveType] = useState<'ALL' | 'EMAIL' | 'SMS' | 'NOTICE'>('ALL');

    const templates = [
        { id: 1, name: 'Welcome Onboarding', type: 'EMAIL', category: 'General', lastUsed: '2 days ago' },
        { id: 2, name: 'Fee Arrears Sentinel', type: 'EMAIL', category: 'Finance', lastUsed: '5 hours ago' },
        { id: 3, name: 'Emergency Matrix SMS', type: 'SMS', category: 'Urgent', lastUsed: '1 week ago' },
        { id: 4, name: 'Academic Result Sync', type: 'NOTICE', category: 'Academic', lastUsed: '1 month ago' },
        { id: 5, name: 'Event Synergy Invite', type: 'EMAIL', category: 'General', lastUsed: '3 days ago' },
    ];

    const filtered = activeType === 'ALL' ? templates : templates.filter(t => t.type === activeType);

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout title="Institutional Templates">
                    <Head>
                        <title>Templates | School ERP</title>
                    </Head>
                    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Institutional Templates</h1>
                                <p className="text-sm font-medium text-slate-500 italic">Curate and manage standardized messaging protocols for consistent institutional branding.</p>
                            </div>
                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20">
                                <Plus size={18} />
                                Create New Template
                            </Button>
                        </div>

                        {/* Filter Matrix */}
                        <div className="flex flex-wrap items-center gap-3">
                            {['ALL', 'EMAIL', 'SMS', 'NOTICE'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setActiveType(type as any)}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeType === type ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-600 border border-slate-200 dark:border-slate-800'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.map((template) => (
                                <div key={template.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 p-8 space-y-6 hover:border-primary/30 transition-all group relative overflow-hidden">
                                    <div className="flex justify-between items-start">
                                        <div className={`size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${template.type === 'EMAIL' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' : template.type === 'SMS' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-500'}`}>
                                            {template.type === 'EMAIL' ? <Type size={20} /> : template.type === 'SMS' ? <Smartphone size={18} /> : <Layout size={20} />}
                                        </div>
                                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2">
                                            {template.category}
                                        </Badge>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{template.name}</h3>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5">
                                                <Activity size={12} className="text-primary" />
                                                USED {template.lastUsed}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <button className="size-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                                                <Copy size={16} />
                                            </button>
                                            <button className="size-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-all">
                                                <Edit3 size={16} />
                                            </button>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="size-9 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl">
                                                <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                    <Code size={14} className="text-primary" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">View Source Code</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-rose-500">
                                                    <Trash2 size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Purge Template</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}

                            <button className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-4 border-dashed border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center justify-center gap-6 group hover:border-primary/50 transition-all">
                                <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-primary transition-all shadow-sm">
                                    <Plus size={36} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Architect New</p>
                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Messaging Node</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}
