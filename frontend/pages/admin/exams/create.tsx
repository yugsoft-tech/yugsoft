import AdminLayout from '@/components/layouts/AdminLayout';
import ExamForm from '@/modules/admin/exams/form/ExamForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateExamPage() {
    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/exams" className="size-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">New Assessment</h1>
                        <p className="text-sm font-medium text-slate-500 italic">Configure and deploy a new examination protocol.</p>
                    </div>
                </div>

                <ExamForm />
            </div>
        </AdminLayout>
    );
}
