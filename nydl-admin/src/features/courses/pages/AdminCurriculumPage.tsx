import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '@/hooks/useCourses';
import { useCurriculumDetail, useCurriculumMutations } from '@/hooks/useCurriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';
import { 
  ChevronLeft, Plus, Edit, Trash2, BookOpen, 
  Video, FileText, Users, Target, HelpCircle, 
  Link as LinkIcon, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

type ActiveDialog = 
  | { type: 'create_module' }
  | { type: 'edit_module'; module: any }
  | { type: 'create_lesson'; moduleId: string }
  | { type: 'edit_lesson'; lesson: any; moduleId: string }
  | null;

export default function AdminCurriculumPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [dialogForm, setDialogForm] = useState<any>({});

  const { data: course, isLoading: courseLoading } = useCourse(id || '');
  const { data: curriculums, isLoading: curriculumLoading } = useCurriculumDetail(id || '');
  const mutations = useCurriculumMutations(id || '');

  const curriculum = curriculums?.[0]; // Primary curriculum outline
  const modules = curriculum?.modules || [];

  const handleOpenDialog = (dialog: ActiveDialog) => {
    setActiveDialog(dialog);
    if (!dialog) {
      setDialogForm({});
    } else if (dialog.type === 'edit_module') {
      setDialogForm({
        title: dialog.module.title,
        description: dialog.module.description,
        order: dialog.module.order
      });
    } else if (dialog.type === 'edit_lesson') {
      setDialogForm({
        title: dialog.lesson.title,
        description: dialog.lesson.description || '',
        lessonType: dialog.lesson.lessonType,
        content: dialog.lesson.content,
        duration: dialog.lesson.duration,
        order: dialog.lesson.order,
        resources: dialog.lesson.resources || [],
        learningObjectives: (dialog.lesson.learningObjectives || []).join('\n'),
        videoUrl: dialog.lesson.videoUrl || '',
        notesMarkdown: dialog.lesson.notesMarkdown || '',
        difficulty: dialog.lesson.difficulty || '',
        isPublished: dialog.lesson.isPublished ?? true,
        isMandatory: dialog.lesson.isMandatory ?? true,
      });
    } else if (dialog.type === 'create_lesson') {
      setDialogForm({
        title: '',
        description: '',
        lessonType: 'TEXT',
        content: '',
        duration: 30,
        order: (modules.find((m: any) => m.id === dialog.moduleId)?.lessons?.length || 0) + 1,
        resources: [],
        learningObjectives: '',
        videoUrl: '',
        notesMarkdown: '',
        difficulty: '',
        isPublished: true,
        isMandatory: true,
      });
    } else if (dialog.type === 'create_module') {
      setDialogForm({
        title: '',
        description: '',
        order: modules.length + 1
      });
    }
  };

  const handleSaveModule = async () => {
    if (!dialogForm.title) {
      toast.error('Module Title is required');
      return;
    }
    try {
      if (activeDialog?.type === 'create_module') {
        let currentCurriculumId = curriculum?.id;
        if (!currentCurriculumId) {
          toast.error('No curriculum initialized for this course yet.');
          return;
        }
        await mutations.createModule({
          courseId: id!,
          curriculumId: currentCurriculumId,
          title: dialogForm.title,
          description: dialogForm.description || '',
          order: Number(dialogForm.order) || 1
        });
        toast.success('Module created successfully');
      } else if (activeDialog?.type === 'edit_module') {
        await mutations.updateModule({
          id: activeDialog.module.id,
          title: dialogForm.title,
          description: dialogForm.description || '',
          order: Number(dialogForm.order) || 1
        });
        toast.success('Module updated successfully');
      }
      handleOpenDialog(null);
    } catch {
      toast.error('Failed to save module');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!window.confirm('Are you sure you want to delete this module and all its lessons?')) return;
    try {
      await mutations.deleteModule(moduleId);
      toast.success('Module deleted successfully');
    } catch {
      toast.error('Failed to delete module');
    }
  };

  const handleSaveLesson = async () => {
    if (!dialogForm.title || !dialogForm.content) {
      toast.error('Lesson Title and Content are required');
      return;
    }
    try {
      const enrichedPayload = {
        title: dialogForm.title,
        description: dialogForm.description || '',
        lessonType: dialogForm.lessonType,
        content: dialogForm.content,
        duration: Number(dialogForm.duration) || 30,
        order: Number(dialogForm.order) || 1,
        resources: dialogForm.resources || [],
        learningObjectives: dialogForm.learningObjectives ? dialogForm.learningObjectives.split('\n').map((s: string) => s.trim()).filter(Boolean) : [],
        videoUrl: dialogForm.videoUrl || undefined,
        notesMarkdown: dialogForm.notesMarkdown || undefined,
        difficulty: dialogForm.difficulty || undefined,
        isPublished: dialogForm.isPublished,
        isMandatory: dialogForm.isMandatory,
      };
      if (activeDialog?.type === 'create_lesson') {
        await mutations.createLesson({ moduleId: activeDialog.moduleId, ...enrichedPayload });
        toast.success('Lesson created successfully');
      } else if (activeDialog?.type === 'edit_lesson') {
        await mutations.updateLesson({ id: activeDialog.lesson.id, moduleId: activeDialog.moduleId, ...enrichedPayload });
        toast.success('Lesson updated successfully');
      }
      handleOpenDialog(null);
    } catch {
      toast.error('Failed to save lesson');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await mutations.deleteLesson(lessonId);
      toast.success('Lesson deleted successfully');
    } catch {
      toast.error('Failed to delete lesson');
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="h-4 w-4 text-rose-455 animate-pulse" />;
      case 'LIVE': return <Users className="h-4 w-4 text-emerald-455" />;
      case 'PRACTICE': return <Target className="h-4 w-4 text-blue-455" />;
      case 'QUIZ': return <HelpCircle className="h-4 w-4 text-amber-455" />;
      default: return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  const handleAddResource = () => {
    const title = prompt('Resource Title (e.g. Slides PDF):');
    if (!title) return;
    const url = prompt('Resource URL (e.g. https://...):');
    if (!url) return;
    setDialogForm({
      ...dialogForm,
      resources: [...(dialogForm.resources || []), { title, url }]
    });
  };

  const handleRemoveResource = (index: number) => {
    const resources = [...(dialogForm.resources || [])];
    resources.splice(index, 1);
    setDialogForm({ ...dialogForm, resources });
  };

  const isLoading = courseLoading || curriculumLoading;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
      {/* Back to courses */}
      <div>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/courses')}
          className="text-slate-450 hover:text-white pl-0 gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Course Catalog
        </Button>
      </div>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          {course && (
            <Badge className="bg-primary/20 border-primary/30 text-primary mb-2">
              {course.code}
            </Badge>
          )}
          <h1 className="text-2xl font-bold tracking-wider uppercase text-white">
            {course ? `${course.title} Syllabus Outline` : 'Manage Course Syllabus'}
          </h1>
          <p className="text-sm text-slate-450 mt-1">
            Official admin suite for designing, modifying, and tracking core academic pathways.
          </p>
        </div>

        {curriculum && (
          <Button 
            onClick={() => handleOpenDialog({ type: 'create_module' })}
            className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center gap-1.5 self-start md:self-center"
          >
            <Plus className="h-4 w-4" /> Add Chapter Module
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-slate-400">Loading syllabus outline structures...</span>
        </div>
      ) : !curriculum ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg">
          <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Syllabus Initialized</h3>
          <p className="text-slate-400 pb-6 text-sm max-w-sm mx-auto">
            This catalog course does not have an active curriculum template in the database.
          </p>
          <Button 
            onClick={async () => {
              try {
                await api.post('/curriculum', {
                  courseId: id,
                  title: `${course?.title} Curriculum`,
                  description: 'Core learning pathway',
                  order: 1
                });
                toast.success('Curriculum initialized');
                window.location.reload();
              } catch {
                toast.error('Failed to initialize curriculum');
              }
            }}
            className="bg-primary hover:bg-primary/80 font-bold"
          >
            Initialize Syllabus
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {modules.map((mod: any, mIdx: number) => (
            <Card key={mod.id} className="bg-[#09090b] border-zinc-800/80 overflow-hidden">
              {/* Module row header */}
              <div className="bg-[#121214] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-mono text-xs font-semibold uppercase tracking-wide">
                      Chapter {mod.order || (mIdx + 1)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">{mod.title}</h3>
                  <p className="text-xs text-slate-450 mt-1 lines-clamp-1">{mod.description}</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog({ type: 'create_lesson', moduleId: mod.id })}
                    className="text-slate-300 hover:text-white border border-zinc-800 hover:bg-zinc-900 bg-zinc-950 font-semibold gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Lesson
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleOpenDialog({ type: 'edit_module', module: mod })}
                    className="h-8 w-8 text-slate-400 hover:text-white"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteModule(mod.id)}
                    className="h-8 w-8 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Module Lessons grid */}
              <CardContent className="p-6">
                {!mod.lessons || mod.lessons.length === 0 ? (
                  <p className="text-zinc-550 text-xs italic py-4 text-center">No lessons in this module. Click 'Add Lesson' to begin.</p>
                ) : (
                  <div className="divide-y divide-zinc-850">
                    {mod.lessons.map((lesson: any) => (
                      <div key={lesson.id} className="py-4 flex flex-col md:flex-row md:items-start justify-between gap-4 first:pt-0 last:pb-0 group">
                        <div className="space-y-1.5 flex-grow">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-[10px] font-bold text-zinc-400 select-none">
                              No. {lesson.order}
                            </span>
                            <Badge className="bg-zinc-850 border-zinc-800 text-zinc-300 text-[10px] gap-1 flex items-center pr-2 py-0">
                              {getLessonIcon(lesson.lessonType)}
                              {lesson.lessonType}
                            </Badge>
                            <span className="text-[11px] text-zinc-450 flex items-center gap-1 font-mono">
                              {lesson.duration} Mins duration
                            </span>
                            {lesson.resources && lesson.resources.length > 0 && (
                              <span className="text-[10px] bg-primary/5 text-primary border border-primary/10 px-1.5 py-0 rounded flex items-center gap-1">
                                <LinkIcon className="h-2.5 w-2.5" /> {lesson.resources.length} Links
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{lesson.title}</h4>
                          <p className="text-xs text-zinc-450 leading-relaxed max-w-3xl border-l border-zinc-800 pl-3">
                            {lesson.description || 'No overview content set.'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity self-end md:self-start pt-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenDialog({ type: 'edit_lesson', lesson, moduleId: mod.id })}
                            className="h-7 w-7 text-slate-400 hover:text-white hover:bg-zinc-900"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="h-7 w-7 text-slate-500 hover:text-rose-455 hover:bg-rose-500/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Dialog for Module (Create/Edit) */}
      {(activeDialog?.type === 'create_module' || activeDialog?.type === 'edit_module') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md bg-[#09090b] border-zinc-800 shadow-2xl relative">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">
                {activeDialog.type === 'create_module' ? 'Add Chapter Module' : 'Edit Chapter Module'}
              </h3>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Module Title</label>
                  <input
                    type="text"
                    value={dialogForm.title || ''}
                    onChange={(e) => setDialogForm({ ...dialogForm, title: e.target.value })}
                    placeholder="e.g. Introduction to TypeScript"
                    className="w-full bg-[#18181b] border border-zinc-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Description Summary</label>
                  <textarea
                    rows={3}
                    value={dialogForm.description || ''}
                    onChange={(e) => setDialogForm({ ...dialogForm, description: e.target.value })}
                    placeholder="Provide a concise chapter breakdown..."
                    className="w-full bg-[#18181b] border border-zinc-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Display Order</label>
                  <input
                    type="number"
                    value={dialogForm.order || ''}
                    onChange={(e) => setDialogForm({ ...dialogForm, order: e.target.value })}
                    placeholder="e.g. 1"
                    className="w-full bg-[#18181b] border border-zinc-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-850">
                <Button 
                  variant="ghost" 
                  onClick={() => handleOpenDialog(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveModule}
                  disabled={mutations.isCreatingModule || mutations.isUpdatingModule}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
                >
                  {(mutations.isCreatingModule || mutations.isUpdatingModule) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Outline
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Dialog for Lesson (Create/Edit) */}
      {(activeDialog?.type === 'create_lesson' || activeDialog?.type === 'edit_lesson') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl bg-[#09090b] border-zinc-800 shadow-2xl relative my-8">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">
                {activeDialog.type === 'create_lesson' ? 'Add Class Lesson' : 'Edit Class Lesson'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Lesson Title</label>
                    <input
                      type="text"
                      value={dialogForm.title || ''}
                      onChange={(e) => setDialogForm({ ...dialogForm, title: e.target.value })}
                      placeholder="e.g. Day 1: Hello TS compiler"
                      className="w-full bg-[#18181b] border border-zinc-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Lesson Type</label>
                    <select
                      value={dialogForm.lessonType || 'TEXT'}
                      onChange={(e) => setDialogForm({ ...dialogForm, lessonType: e.target.value })}
                      className="w-full bg-[#18181b] border border-zinc-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="TEXT">TEXT (Written Outlines)</option>
                      <option value="VIDEO">VIDEO (Pre-recorded Lecture)</option>
                      <option value="LIVE">LIVE (Interactive Session)</option>
                      <option value="PRACTICE">PRACTICE (Lab Coding Block)</option>
                      <option value="QUIZ">QUIZ (Multiple Choice Assessment)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Duration (Mins)</label>
                      <input
                        type="number"
                        value={dialogForm.duration || ''}
                        onChange={(e) => setDialogForm({ ...dialogForm, duration: e.target.value })}
                        placeholder="e.g. 45"
                        className="w-full bg-[#18181b] border border-zinc-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Display Order</label>
                      <input
                        type="number"
                        value={dialogForm.order || ''}
                        onChange={(e) => setDialogForm({ ...dialogForm, order: e.target.value })}
                        placeholder="e.g. 1"
                        className="w-full bg-[#18181b] border border-zinc-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Lesson Description</label>
                    <input
                      type="text"
                      value={dialogForm.description || ''}
                      onChange={(e) => setDialogForm({ ...dialogForm, description: e.target.value })}
                      placeholder="Brief overview summary..."
                      className="w-full bg-[#18181b] border border-zinc-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Video URL</label>
                    <input
                      type="url"
                      value={dialogForm.videoUrl || ''}
                      onChange={(e) => setDialogForm({ ...dialogForm, videoUrl: e.target.value })}
                      placeholder="https://youtube.com/... or Cloudinary URL"
                      className="w-full bg-[#18181b] border border-zinc-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Difficulty</label>
                    <select
                      value={dialogForm.difficulty || ''}
                      onChange={(e) => setDialogForm({ ...dialogForm, difficulty: e.target.value })}
                      className="w-full bg-[#18181b] border border-zinc-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Not set</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dialogForm.isPublished ?? true}
                        onChange={(e) => setDialogForm({ ...dialogForm, isPublished: e.target.checked })}
                        className="accent-primary"
                      />
                      Published
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dialogForm.isMandatory ?? true}
                        onChange={(e) => setDialogForm({ ...dialogForm, isMandatory: e.target.checked })}
                        className="accent-primary"
                      />
                      Mandatory
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-zinc-300">Course Resource Links</label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleAddResource}
                        className="h-6 text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold px-2"
                      >
                        Add Link
                      </Button>
                    </div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto border border-zinc-800 rounded p-2 bg-[#18181b] divide-y divide-zinc-850">
                      {(!dialogForm.resources || dialogForm.resources.length === 0) ? (
                        <p className="text-zinc-550 text-[10px] italic py-2 text-center">No links attached.</p>
                      ) : (
                        dialogForm.resources.map((res: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] text-zinc-300 py-1.5 first:pt-0 last:pb-0">
                            <span className="truncate max-w-[170px]" title={res.title}>{res.title}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveResource(idx)}
                              className="h-4 w-4 text-zinc-500 hover:text-red-400"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Lesson Outline Content</label>
                    <textarea
                      rows={4}
                      value={dialogForm.content || ''}
                      onChange={(e) => setDialogForm({ ...dialogForm, content: e.target.value })}
                      placeholder="Markdown content, instructions, or body outlines to display for this class..."
                      className="w-full bg-[#18181b] border border-zinc-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Learning Objectives (one per line)</label>
                    <textarea
                      rows={3}
                      value={dialogForm.learningObjectives || ''}
                      onChange={(e) => setDialogForm({ ...dialogForm, learningObjectives: e.target.value })}
                      placeholder={"Understand event bubbling and delegation\nBuild reusable React components\nApply responsive design principles"}
                      className="w-full bg-[#18181b] border border-zinc-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Notes Markdown</label>
                    <textarea
                      rows={3}
                      value={dialogForm.notesMarkdown || ''}
                      onChange={(e) => setDialogForm({ ...dialogForm, notesMarkdown: e.target.value })}
                      placeholder="Extended lesson notes in Markdown format..."
                      className="w-full bg-[#18181b] border border-zinc-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-850">
                <Button 
                  variant="ghost" 
                  onClick={() => handleOpenDialog(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveLesson}
                  disabled={mutations.isCreatingLesson || mutations.isUpdatingLesson}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
                >
                  {(mutations.isCreatingLesson || mutations.isUpdatingLesson) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Outline
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
