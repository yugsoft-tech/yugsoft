import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useClasses } from '@/hooks/useClasses';
import { studentSchema, StudentSchema } from '@/utils/validation';
import { studentsService } from '@/services/students.service';
import {
  UserPlus,
  School,
  Users,
  FileText,
  ChevronRight,
  Save,
  X,
  Camera,
  AlertCircle,
  CheckCircle2,
  Fingerprint
} from 'lucide-react';

const tabs = [
  { id: 'personal', label: 'Personal Information', icon: Fingerprint, color: 'primary' },
  { id: 'academic', label: 'Academic Details', icon: School, color: 'info' },
  { id: 'guardian', label: 'Guardian Information', icon: Users, color: 'success' },
  { id: 'documents', label: 'Documents', icon: FileText, color: 'warning' },
];

export default function AddStudent() {
  const router = useRouter();
  const { classes, loading: classesLoading } = useClasses();

  const [activeTab, setActiveTab] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      admissionNumber: 'AD-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      gender: 'MALE',
    }
  });

  const onCommit = async (data: StudentSchema) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await studentsService.create(data);
      setSubmitSuccess(true);
      setTimeout(() => {
        router.push('/admin/students');
      }, 1500);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to add student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Add New Student">
      <Head>
        <title>Add Student - {APP_NAME}</title>
      </Head>

      <form onSubmit={handleSubmit(onCommit)} className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <UserPlus size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Student Registration</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Add Student</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">Fill in the details to register a new student.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-500 hover:text-rose-500 transition-all active:scale-95"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Activity className="animate-spin" size={18} /> : <Save size={18} />}
              {isSubmitting ? 'Saving...' : 'Add Student'}
            </button>
          </div>
        </div>

        {submitSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={20} />
            <span className="text-sm font-bold">Student added successfully. Redirecting to list...</span>
          </div>
        )}

        {submitError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <span className="text-sm font-bold">{submitError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 space-y-2 sticky top-24 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-black transition-all ${isActive
                        ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-1'
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary'
                      }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content Area */}
          <div className="lg:col-span-9 page-transition">
            {activeTab === 'personal' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm space-y-10">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="size-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-2xl text-slate-400 overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                      ?
                    </div>
                    <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl border-4 border-white dark:border-slate-900 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Personal Information</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Enter student details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput label="First Name" {...register('firstName')} placeholder="Enter first name" error={errors.firstName?.message} />
                  <FormInput label="Last Name" {...register('lastName')} placeholder="Enter last name" error={errors.lastName?.message} />
                  <FormInput label="Email Address" type="email" {...register('email')} placeholder="student@school.com" error={errors.email?.message} />
                  <FormInput label="Phone Number" type="tel" {...register('phone')} placeholder="Phone number" error={errors.phone?.message} />
                  <FormInput label="Admission Number" {...register('admissionNumber')} error={errors.admissionNumber?.message} />
                  <FormInput label="Date of Birth" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
                  <FormSelect
                    label="Gender"
                    {...register('gender')}
                    options={[
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' },
                      { value: 'OTHER', label: 'Other' }
                    ]}
                    error={errors.gender?.message}
                  />
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm space-y-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500">
                    <School size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Academic Details</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Class and Section assignment</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormSelect
                    label="Assigned Class"
                    {...register('classId')}
                    options={classes.map(c => ({ value: c.id, label: c.name }))}
                    error={errors.classId?.message}
                    disabled={classesLoading}
                  />
                  <FormInput label="Address" {...register('address')} placeholder="Home address" error={errors.address?.message} />
                </div>
              </div>
            )}

            {activeTab === 'guardian' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm space-y-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Guardian Information</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Parent or Guardian contact details</p>
                  </div>
                </div>
                <div className="p-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                  <p className="text-sm font-bold text-slate-400 italic">Advanced guardian management endpoints are being synchronized. You can add them later via the profile editor.</p>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm space-y-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Documents</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Student document storage</p>
                  </div>
                </div>
                <div className="p-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                  <p className="text-sm font-bold text-slate-400 italic">Archive protocols are currently locked. Onboard the entity first to enable document uploads.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

const FormInput = ({ label, error, ...props }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
    <input
      {...props}
      className={`px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all ${error ? 'ring-2 ring-rose-500/50' : ''}`}
    />
    {error && <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter ml-2">{error}</p>}
  </div>
);

const FormSelect = ({ label, options, error, ...props }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
    <select
      {...props}
      className={`px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all ${error ? 'ring-2 ring-rose-500/50' : ''}`}
    >
      <option value="">Select Option</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter ml-2">{error}</p>}
  </div>
);

const Activity = ({ className, size }: any) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

