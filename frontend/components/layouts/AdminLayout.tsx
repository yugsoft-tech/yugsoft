import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import DashboardLayout, { NavSection } from './DashboardLayout';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  FileText,
  Settings,
  Layers,
  Bus,
  Briefcase,
  Bell,
  Megaphone,
  Search,
  UserCheck,
  Award,
  ClipboardList,
  Database,
  Utensils,
  ShieldCheck,
  MessageSquare,
  BookMarked,
  Smartphone
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const ADMIN_SECTIONS: NavSection[] = [
  {
    title: 'Home',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Students', href: '/admin/students', icon: GraduationCap },
      { label: 'Staff', href: '/admin/users', icon: Users },
      { label: 'Attendance', href: '/admin/attendance', icon: UserCheck },
    ]
  },
  {
    title: 'School',
    items: [
      { label: 'Classes', href: '/admin/classes', icon: Layers },
      { label: 'Subjects', href: '/admin/subjects', icon: BookMarked },
      { label: 'Calendar', href: '/admin/academic/calendar', icon: Calendar },
      { label: 'Exams', href: '/admin/exams', icon: Award },
      { label: 'Homework', href: '/admin/homework', icon: ClipboardList },
      { label: 'Timetable', href: '/admin/timetable', icon: Calendar },
    ]
  },
  {
    title: 'Office',
    items: [
      { label: 'Messages', href: '/admin/communication', icon: MessageSquare },
      { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
      { label: 'Fees', href: '/admin/fees', icon: FileText },
      { label: 'Library', href: '/admin/library', icon: BookOpen },
    ]
  },
  {
    title: 'Settings',
    items: [
      { label: 'Logs', href: '/admin/audit', icon: Database },
      { label: 'Notice Board', href: '/admin/notices', icon: Bell },
      { label: 'General Settings', href: '/admin/settings', icon: Settings },
    ]
  }
];

function AdminLayoutContent({ children, title }: AdminLayoutProps) {
  return (
    <DashboardLayout sections={ADMIN_SECTIONS} role="Admin">
      {children}
    </DashboardLayout>
  );
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[USER_ROLES.SCHOOL_ADMIN]}>
        <AdminLayoutContent title={title}>{children}</AdminLayoutContent>
      </RoleGuard>
    </AuthGuard>
  );
}
