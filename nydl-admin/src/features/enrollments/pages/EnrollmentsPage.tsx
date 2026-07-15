import { useMemo, useState } from 'react';
import { useEnrollments, useEnrollmentMutations } from '@/hooks/useEnrollments';
import { useCourses } from '@/hooks/useCourses';
import { usePaymentMutations } from '@/hooks/usePayments';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Enrollment } from '@/types';
import { Eye, Trash, Download } from 'lucide-react';
import { toast } from 'sonner';
import { getPopulated, getPopulatedPayment, getRegistrationStatusMeta, REGISTRATION_STATUS_FILTERS, PAYMENT_STATUS_FILTERS } from '@/utils/registration';

const ALL = 'ALL';

export function EnrollmentsPage() {
  const [courseFilter, setCourseFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [paymentFilter, setPaymentFilter] = useState(ALL);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const { data, isLoading, isError } = useEnrollments({
    limit: 100,
    courseId: courseFilter !== ALL ? courseFilter : undefined,
    status: statusFilter !== ALL ? statusFilter : undefined,
    paymentStatus: paymentFilter !== ALL ? paymentFilter : undefined,
  });
  const { data: coursesData } = useCourses({ limit: 100 });
  const {
    deleteEnrollment,
    approveRegistration,
    rejectRegistration,
    grantAccess,
    suspendAccess,
  } = useEnrollmentMutations();
  const { verifyPayment } = usePaymentMutations();

  const registrations = data?.docs || [];
  const courses = coursesData?.docs || [];

  const filteredRegistrations = useMemo(() => {
    if (!search.trim()) return registrations;
    const q = search.toLowerCase();
    return registrations.filter((r) => {
      const student = getPopulated(r.studentId);
      const course = getPopulated(r.courseId);
      return (
        student?.name?.toLowerCase().includes(q) ||
        student?.email?.toLowerCase().includes(q) ||
        course?.title?.toLowerCase().includes(q)
      );
    });
  }, [registrations, search]);

  const selected = registrations.find((r) => r.id === selectedId) || null;

  const closeDialog = () => {
    setSelectedId(null);
    setShowRejectForm(false);
    setRejectReason('');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEnrollment(id);
      toast.success('Registration deleted successfully');
      if (selectedId === id) closeDialog();
    } catch {
      toast.error('Failed to delete registration');
    }
  };

  const handleVerifyPayment = async (paymentId: string, status: 'VERIFIED' | 'FAILED') => {
    try {
      await verifyPayment({ id: paymentId, data: { status, notes: 'Reviewed by admin' } });
      toast.success(status === 'VERIFIED' ? 'Payment verification successful.' : 'Payment marked as failed.');
    } catch {
      toast.error('Failed to update payment status');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveRegistration({ id });
      toast.success('Registration approved.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve registration');
    }
  };

  const handleReject = async (id: string) => {
    if (rejectReason.trim().length < 3) {
      toast.error('Please provide a rejection reason.');
      return;
    }
    try {
      await rejectRegistration({ id, reason: rejectReason });
      toast.success('Registration rejected.');
      setShowRejectForm(false);
      setRejectReason('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reject registration');
    }
  };

  const handleGrantAccess = async (id: string) => {
    try {
      await grantAccess(id);
      toast.success('Course access granted.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to grant course access');
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await suspendAccess({ id, notes: 'Suspended by admin' });
      toast.success('Course access suspended.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to suspend course access');
    }
  };

  const handleExport = () => {
    const rows = filteredRegistrations.map((r) => {
      const student = getPopulated(r.studentId);
      const course = getPopulated(r.courseId);
      const payment = getPopulatedPayment(r);
      const meta = getRegistrationStatusMeta(r);
      return {
        Student: student?.name || '',
        Email: student?.email || '',
        Course: course?.title || '',
        RegistrationStatus: meta.label,
        PaymentStatus: payment?.status || 'NONE',
        TransactionReference: payment?.transactionReference || '',
        AppliedAt: r.createdAt,
      };
    });
    if (rows.length === 0) {
      toast.warning('No registrations to export.');
      return;
    }
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => `"${String((row as any)[h]).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Registrations exported successfully.');
  };

  const columns: ColumnDef<Enrollment>[] = [
    {
      id: 'student',
      header: 'Student',
      cell: (info) => {
        const student = getPopulated(info.row.original.studentId);
        return (
          <div>
            <span className="font-semibold text-white block">{student?.name || 'N/A'}</span>
            <span className="text-xs text-slate-500">{student?.email || ''}</span>
          </div>
        );
      },
    },
    {
      id: 'course',
      header: 'Course',
      cell: (info) => <span>{getPopulated(info.row.original.courseId)?.title || 'N/A'}</span>,
    },
    {
      id: 'registrationStatus',
      header: 'Registration Status',
      cell: (info) => <StatusBadge status={getRegistrationStatusMeta(info.row.original).key} />,
    },
    {
      id: 'paymentStatus',
      header: 'Payment',
      cell: (info) => {
        const payment = getPopulatedPayment(info.row.original);
        return payment ? <StatusBadge status={payment.status || 'PENDING'} /> : <span className="text-xs text-slate-500">No payment</span>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Applied',
      cell: (info) => <span className="text-xs text-slate-400">{new Date(info.getValue() as string).toLocaleDateString()}</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedId(info.row.original.id)}
            className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 w-8"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
              />
            }
            title="Delete Registration?"
            description="This action cannot be undone. The registration, payment reference, and all associated review history will be permanently removed."
            onConfirm={() => handleDelete(info.row.original.id)}
          >
            <Trash className="h-4 w-4" />
          </ConfirmDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Registration Management</h1>
          <p className="text-sm text-slate-400 font-medium">Review student registrations, verify payments, and manage course access.</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search by student or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-900 border-slate-700 text-white max-w-xs"
        />
        <Select value={courseFilter} onValueChange={(v) => setCourseFilter(v ?? ALL)}>
          <SelectTrigger className="bg-slate-900 border-slate-700 text-white w-48"><SelectValue placeholder="Course" /></SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700 text-white">
            <SelectItem value={ALL}>All Courses</SelectItem>
            {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? ALL)}>
          <SelectTrigger className="bg-slate-900 border-slate-700 text-white w-48"><SelectValue placeholder="Registration Status" /></SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700 text-white">
            <SelectItem value={ALL}>All Statuses</SelectItem>
            {REGISTRATION_STATUS_FILTERS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={(v) => setPaymentFilter(v ?? ALL)}>
          <SelectTrigger className="bg-slate-900 border-slate-700 text-white w-48"><SelectValue placeholder="Payment Status" /></SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700 text-white">
            <SelectItem value={ALL}>All Payment Statuses</SelectItem>
            {PAYMENT_STATUS_FILTERS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading registrations...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load registrations. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={filteredRegistrations} pageCount={data?.totalPages || 1} />
      )}

      {/* ─── Registration Detail Dialog ─── */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (() => {
            const student = getPopulated(selected.studentId);
            const course = getPopulated(selected.courseId);
            const payment = getPopulatedPayment(selected);
            const reviewer = getPopulated(selected.reviewerId);
            const meta = getRegistrationStatusMeta(selected);

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-3">
                    {student?.name || 'Unknown Student'}
                    <StatusBadge status={meta.key} />
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 text-sm">
                  <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Course</h4>
                    <p className="text-slate-200">{course?.title || 'N/A'}</p>
                  </section>

                  {selected.externalForm && (selected.externalForm.registrationId || selected.externalForm.qrCodeImage) && (
                    <section>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">NYDev Form Registration (Fast Track)</h4>
                      <div className="space-y-3 text-slate-300">
                        <p className="text-xs text-slate-500">
                          This student registered via the external NYDev Form, so the intake sections were collected there.
                        </p>
                        {selected.externalForm.registrationId && (
                          <p>Registration ID: <span className="font-mono text-slate-200">{selected.externalForm.registrationId}</span></p>
                        )}
                        {selected.externalForm.qrCodeImage && (
                          <div>
                            <p className="mb-2">QR Code:</p>
                            <img
                              src={selected.externalForm.qrCodeImage}
                              alt="NYDev Form registration QR code"
                              className="h-40 w-40 rounded-md border border-slate-700 bg-white object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {selected.personalInfo && (
                    <section>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Personal Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <span>Full Name: {selected.personalInfo.fullName}</span>
                        <span>Gender: {selected.personalInfo.gender}</span>
                        <span>Date of Birth: {selected.personalInfo.dateOfBirth}</span>
                        <span>Age: {selected.personalInfo.age ?? 'N/A'}</span>
                        <span>Phone: {selected.personalInfo.phone}</span>
                        <span>Email: {student?.email || 'N/A'}</span>
                      </div>
                    </section>
                  )}

                  {selected.education && (
                    <section>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Education</h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <span>School: {selected.education.schoolName}</span>
                        <span>Grade: {selected.education.grade}</span>
                      </div>
                    </section>
                  )}

                  {selected.location && (
                    <section>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Location</h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <span>City: {selected.location.city}</span>
                        <span>Region: {selected.location.region || 'N/A'}</span>
                      </div>
                    </section>
                  )}

                  {selected.technicalReadiness && (
                    <section>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Technical Readiness</h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <span>OS: {selected.technicalReadiness.operatingSystem}</span>
                        <span>Programming Experience: {selected.technicalReadiness.programmingExperience}</span>
                        <span>Has Computer: {selected.technicalReadiness.hasPersonalComputer ? 'Yes' : 'No'}</span>
                        <span>Has Discord: {selected.technicalReadiness.hasDiscord ? 'Yes' : 'No'}</span>
                        <span className="col-span-2">Reason: {selected.technicalReadiness.reasonForJoining}</span>
                      </div>
                    </section>
                  )}

                  {selected.interests && selected.interests.length > 0 && (
                    <section>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.interests.map((i) => (
                          <span key={i} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">{i}</span>
                        ))}
                      </div>
                    </section>
                  )}

                  <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Payment</h4>
                    {payment ? (
                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <span>Method: {payment.paymentMethod}</span>
                        <span>Status: {payment.status}</span>
                        <span>Amount: {payment.amount} {payment.currency}</span>
                        <span className="font-mono text-xs">Ref: {payment.transactionReference}</span>
                      </div>
                    ) : (
                      <p className="text-slate-500">No payment submitted yet.</p>
                    )}
                  </section>

                  {(selected.reviewNotes || selected.rejectionReason || reviewer) && (
                    <section>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Review History</h4>
                      <div className="text-slate-300 space-y-1">
                        {reviewer && <p>Reviewed by: {reviewer.name}</p>}
                        {selected.rejectionReason && <p>Rejection reason: {selected.rejectionReason}</p>}
                        {selected.reviewNotes && <p>Notes: {selected.reviewNotes}</p>}
                      </div>
                    </section>
                  )}

                  {showRejectForm && (
                    <section className="bg-slate-900 border border-slate-800 rounded-md p-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rejection Reason</h4>
                      <Textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Explain why this registration is being rejected..."
                        className="bg-slate-950 border-slate-700 text-white"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-rose-600 hover:bg-rose-700 text-white"
                          onClick={() => handleReject(selected.id)}
                        >
                          Confirm Rejection
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowRejectForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </section>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                    {payment?.status === 'PENDING' && (
                      <>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleVerifyPayment(payment.id, 'VERIFIED')}>
                          Verify Payment
                        </Button>
                        <Button size="sm" variant="outline" className="border-rose-600 text-rose-400 hover:bg-rose-600/10" onClick={() => handleVerifyPayment(payment.id, 'FAILED')}>
                          Mark Payment Failed
                        </Button>
                      </>
                    )}
                    {selected.status === 'PENDING_APPROVAL' && !showRejectForm && (
                      <>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleApprove(selected.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-rose-600 text-rose-400 hover:bg-rose-600/10" onClick={() => setShowRejectForm(true)}>
                          Reject
                        </Button>
                      </>
                    )}
                    {selected.status === 'APPROVED' && (
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleGrantAccess(selected.id)}>
                        Grant Course Access
                      </Button>
                    )}
                    {selected.status === 'ACTIVE' && (
                      <Button size="sm" variant="outline" className="border-rose-600 text-rose-400 hover:bg-rose-600/10" onClick={() => handleSuspend(selected.id)}>
                        Suspend Access
                      </Button>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EnrollmentsPage;
