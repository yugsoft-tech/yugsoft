import AdminLayout from '@/components/layouts/AdminLayout';
import Notices from '@/modules/admin/communication/notices/Notices';

export default function NoticesPage() {
    return (
        <AdminLayout>
            <Notices />
        </AdminLayout>
    );
}
