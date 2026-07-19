import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCertificates } from '@/hooks/useCertificates';
import { useCourses } from '@/hooks/useCourses';
import { useCohorts } from '@/hooks/useCohorts';
import { certificatesApi } from '@/api/certificates.api';
import { cohortsApi } from '@/api/cohorts.api';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ColumnDef } from '@tanstack/react-table';
import { Certificate } from '@/types';
import { getPopulated } from '@/utils/registration';
import { UploadCloud, Award, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_BATCH = 'Summer 2026';

export function CertificatesPage() {
  const { data, isLoading, isError, refetch } = useCertificates();
  const { data: coursesData } = useCourses({ limit: 100 });
  const { data: cohortsData } = useCohorts({ limit: 100 });
  const courses = coursesData?.docs || [];
  const cohorts = cohortsData?.docs || [];

  // ── Generator state ──
  const [templateUrl, setTemplateUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [cohortId, setCohortId] = useState('');
  const [batch, setBatch] = useState(DEFAULT_BATCH);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [generating, setGenerating] = useState(false);

  const { data: roster } = useQuery({
    queryKey: ['cohort-roster', cohortId],
    queryFn: async () => (await cohortsApi.getRoster(cohortId)).data.data,
    enabled: !!cohortId,
  });
  const students = roster?.students || [];
  const selectedIds = useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await certificatesApi.uploadTemplate(file);
      setTemplateUrl(res.data.data.templateUrl);
      toast.success('Template uploaded');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to upload template');
    } finally {
      setUploading(false);
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === students.length) {
      setSelected({});
    } else {
      setSelected(Object.fromEntries(students.map((s) => [s.id, true])));
    }
  };

  const handleGenerate = async () => {
    if (!templateUrl) return toast.error('Upload a certificate template first');
    if (!courseId || !cohortId) return toast.error('Select a course and cohort');
    if (selectedIds.length === 0) return toast.error('Select at least one student');
    setGenerating(true);
    try {
      const res = await certificatesApi.generate({ templateUrl, courseId, cohortId, batch, studentIds: selectedIds });
      const { issued, failed } = res.data.data;
      toast.success(`Generated ${issued.length} certificate${issued.length === 1 ? '' : 's'}${failed.length ? `, ${failed.length} failed` : ''}`);
      setSelected({});
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to generate certificates');
    } finally {
      setGenerating(false);
    }
  };

  const columns: ColumnDef<Certificate>[] = [
    { accessorKey: 'certificateNumber', header: 'Certificate No.', cell: (info) => <span className="font-mono text-xs text-white">{info.getValue() as string}</span> },
    { id: 'graduate', header: 'Graduate', cell: (info) => <span className="font-semibold text-slate-200">{getPopulated(info.row.original.studentId)?.name || (info.row.original as any).metadata?.studentName || 'N/A'}</span> },
    { id: 'course', header: 'Course', cell: (info) => <span>{getPopulated(info.row.original.courseId)?.title || (info.row.original as any).metadata?.courseTitle || 'N/A'}</span> },
    { accessorKey: 'issueDate', header: 'Issued', cell: (info) => <span>{info.getValue() ? new Date(info.getValue() as string).toLocaleDateString() : 'N/A'}</span> },
    {
      id: 'pdf',
      header: 'PDF',
      cell: (info) => {
        const url = (info.row.original as any).pdfUrl;
        return url ? (
          <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline">
            View <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-xs text-slate-500">—</span>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-wider text-white">Certificates</h1>
        <p className="text-sm font-medium text-slate-400">Upload a template, pick a cohort, select graduates, and generate their certificates.</p>
      </div>

      {/* ─── Generator ─── */}
      <div className="grid grid-cols-1 gap-6 rounded-xl border border-slate-800 bg-slate-950/40 p-5 lg:grid-cols-2">
        {/* Left: template + config */}
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">1. Certificate Template</p>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-800 bg-slate-950 p-6 text-center hover:border-blue-500/40">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
              ) : (
                <UploadCloud className="h-6 w-6 text-slate-500" />
              )}
              <span className="text-xs text-slate-400">{templateUrl ? 'Template uploaded — click to replace' : 'Upload PNG, JPG, or PDF template'}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
            </label>
            {templateUrl && (
              <a href={templateUrl} target="_blank" rel="noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-blue-400 hover:underline">
                Preview template <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <p className="mt-1.5 text-[11px] text-slate-500">Name, course, and batch are overlaid centered on the template.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">Course</p>
              <Select value={courseId} onValueChange={(v) => setCourseId(v ?? '')}>
                <SelectTrigger className="border-slate-700 bg-slate-900 text-white"><SelectValue placeholder="Course" /></SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-900 text-white">
                  {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">Cohort</p>
              <Select value={cohortId} onValueChange={(v) => { setCohortId(v ?? ''); setSelected({}); }}>
                <SelectTrigger className="border-slate-700 bg-slate-900 text-white"><SelectValue placeholder="Cohort" /></SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-900 text-white">
                  {cohorts.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">Batch</p>
            <Input value={batch} onChange={(e) => setBatch(e.target.value)} className="border-slate-700 bg-slate-900 text-white" />
          </div>
        </div>

        {/* Right: student selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">2. Select Graduates</p>
            {students.length > 0 && (
              <button onClick={toggleAll} className="text-xs text-blue-400 hover:underline">
                {selectedIds.length === students.length ? 'Clear all' : 'Select all'}
              </button>
            )}
          </div>
          <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-2">
            {!cohortId ? (
              <p className="py-8 text-center text-xs text-slate-500">Select a cohort to load its students.</p>
            ) : students.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-500">No students in this cohort.</p>
            ) : (
              students.map((s) => (
                <label key={s.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-900">
                  <input
                    type="checkbox"
                    checked={!!selected[s.id]}
                    onChange={(e) => setSelected((prev) => ({ ...prev, [s.id]: e.target.checked }))}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-200">{s.name}</span>
                  <span className="ml-auto text-[11px] text-slate-500">{s.email}</span>
                </label>
              ))
            )}
          </div>
          <Button onClick={handleGenerate} disabled={generating} className="w-full bg-blue-600 text-white hover:bg-blue-700">
            {generating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</> : <><Award className="mr-2 h-4 w-4" /> Generate {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</>}
          </Button>
        </div>
      </div>

      {/* ─── Issued certificates ─── */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Issued Certificates</h2>
        {isLoading ? (
          <div className="text-slate-400">Loading certificates...</div>
        ) : isError ? (
          <div className="text-rose-400">Failed to load certificates.</div>
        ) : (
          <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
        )}
      </div>
    </div>
  );
}

export default CertificatesPage;
