import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import ExamForm from '@/modules/admin/exams/form/ExamForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { examsService } from '@/services/exams.service';
import { Exam } from '@/utils/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function EditExamPage() {
    const router = useRouter();
    const { id } = router.query;
    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            examsService.getExamById(id as string)
                .then(setExam)
                .catch(() => router.push('/admin/exams'))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;
    if (!exam) return null;

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/exams" className="size-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Modify Protocol</h1>
                        <p className="text-sm font-medium text-slate-500 italic">Editing: {exam.name}</p>
                    </div>
                </div>

                <ExamForm initialData={exam} />
            </div>
        </AdminLayout>
    );
}
