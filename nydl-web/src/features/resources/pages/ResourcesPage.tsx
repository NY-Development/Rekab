import { useState, useEffect } from 'react';
import { useResources, useCreateResource, useUpdateResource, useDeleteResource } from '@/hooks/useResources';
import { useCourses } from '@/hooks/useCourses';
import { useAuthStore } from '@/store/auth.store';
import type { Resource } from '@/types';

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All Modules');
  
  // Auth and query hooks
  const { user } = useAuthStore();
  const isStaff = user && ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'].includes(user.role);
  
  const { data: resourcesRes, isLoading, error } = useResources();
  const { data: coursesRes } = useCourses();
  
  const createResource = useCreateResource();
  const updateResource = useUpdateResource();
  const deleteResource = useDeleteResource();

  const resourcesList: Resource[] = resourcesRes?.data?.docs || [];
  const coursesList = coursesRes?.data?.docs || [];

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [moduleId, setModuleId] = useState('');  const [resourceType, setResourceType] = useState('LINK');
  const [sourceType, setSourceType] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync edit resource data
  useEffect(() => {
    if (dialogMode === 'edit' && selectedResource) {
      setTitle(selectedResource.title || '');
      setDescription(selectedResource.description || '');
      setCourseId(selectedResource.courseId || '');
      setModuleId(selectedResource.moduleId || '');
      setResourceType(selectedResource.resourceType || 'LINK');
      setSourceType('url');
      setUrl(selectedResource.url || '');
      setFile(null);
    } else {
      setTitle('');
      setDescription('');
      setCourseId('');
      setModuleId('');
      setResourceType('LINK');
      setSourceType('url');
      setUrl('');
      setFile(null);
    }
  }, [dialogMode, selectedResource, isDialogOpen]);

  // Filter list
  const filteredResources = resourcesList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === 'All Modules' || item.moduleId === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const videos = filteredResources.filter(item => item.resourceType === 'VIDEO');
  const readings = filteredResources.filter(item => item.resourceType === 'PDF' || item.resourceType === 'SLIDES');
  const codeStarters = filteredResources.filter(item => item.resourceType === 'LINK' || item.resourceType === 'ZIP' || item.resourceType === 'GITHUB');

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource.mutateAsync(id);
      } catch (err) {
        alert('Failed to delete resource');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId) {
      alert('Title and Course are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isUploading = sourceType === 'file' && file;
      let payload: any;

      if (isUploading) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('courseId', courseId);
        if (moduleId) formData.append('moduleId', moduleId);
        formData.append('resourceType', resourceType);
        formData.append('file', file as Blob);
        payload = formData;
      } else {
        payload = {
          title,
          description,
          courseId,
          moduleId: moduleId || undefined,
          resourceType,
          url,
        };
      }

      if (dialogMode === 'create') {
        await createResource.mutateAsync(payload);
      } else if (selectedResource) {
        await updateResource.mutateAsync({ id: selectedResource.id, data: payload });
      }

      setIsDialogOpen(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save resource.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 relative">
      {/* Header Area */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Course Resources</h2>
          <p className="text-sm text-slate-550">Access program video lectures, slides, documents and starter codes.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full bg-white border border-slate-205 text-sm text-slate-900 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-body-sm"
              placeholder="Search resources..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full sm:w-auto bg-white border border-slate-205 text-sm rounded-md py-2 px-3 focus:ring-blue-600 focus:border-blue-600 text-slate-700 font-body-sm"
          >
            <option>All Modules</option>
            <option value="m1">Module 1</option>
            <option value="m2">Module 2</option>
            <option value="m3">Module 3</option>
          </select>
          {isStaff && (
            <button
              onClick={() => {
                setDialogMode('create');
                setIsDialogOpen(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-md shadow-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Resource
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm">
          Failed to load course resources.
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
          No resources match search / filter settings.
        </div>
      ) : (
        /* Bento Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Video Lectures Section (Left Column) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <span className="material-symbols-outlined text-blue-600">video_library</span>
              <h3 className="text-lg font-bold text-slate-900">Video Lectures</h3>
            </div>
            
            {videos.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 italic">No lecture videos match current filters.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="bg-white border border-slate-200 rounded-lg overflow-hidden group hover:shadow-md transition-all flex flex-col pt-1"
                  >
                    <div className="h-36 bg-slate-100 flex items-center justify-center relative">
                      <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-blue-600 transition-all cursor-pointer">
                        play_circle
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="text-[10px] font-bold text-blue-600 mb-1 uppercase tracking-widest">
                        {vid.moduleId ? `Module ${vid.moduleId.toUpperCase()}` : 'General'}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">{vid.title}</h4>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{vid.description}</p>
                      
                      <div className="flex gap-2 mt-auto">
                        <a
                          href={vid.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-grow bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-xs py-2 rounded transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          Watch
                        </a>
                      </div>
                      
                      {isStaff && (
                        <div className="flex gap-2 mt-2 border-t border-slate-100 pt-2">
                          <button
                            onClick={() => {
                              setSelectedResource(vid);
                              setDialogMode('edit');
                              setIsDialogOpen(true);
                            }}
                            className="flex-grow bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-1.5 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(vid.id)}
                            className="bg-red-55 border border-red-100 text-red-650 hover:bg-red-650 hover:text-white px-2 py-1.5 rounded transition-colors flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Readings & Starters Panel (Right Column) */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            
            {/* Readings Category */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <span className="material-symbols-outlined text-red-600">picture_as_pdf</span>
                <h3 className="text-lg font-bold text-slate-900">Readings & Guides</h3>
              </div>
              
              {readings.length === 0 ? (
                <p className="text-xs text-slate-400 py-2 italic text-left">No PDF guidelines uploaded.</p>
              ) : (
                <ul className="space-y-3">
                  {readings.map((doc) => (
                    <li
                      key={doc.id}
                      className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col gap-2 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 rounded bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined">description</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">{doc.title}</p>
                            <p className="text-[10px] text-slate-450 uppercase">{doc.resourceType}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors"
                            title="View"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                          </a>
                        </div>
                      </div>

                      {isStaff && (
                        <div className="flex justify-end gap-1.5 border-t border-slate-100 pt-2">
                          <button
                            onClick={() => {
                              setSelectedResource(doc);
                              setDialogMode('edit');
                              setIsDialogOpen(true);
                            }}
                            className="px-2 py-1 text-slate-500 hover:text-blue-650 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded text-[11px] font-semibold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="px-2 py-1 text-slate-500 hover:text-red-650 hover:bg-red-50 border border-transparent hover:border-red-100 rounded text-[11px] font-semibold transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Code Starters */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <span className="material-symbols-outlined text-emerald-600">code</span>
                <h3 className="text-lg font-bold text-slate-900">Code Starters</h3>
              </div>
              
              {codeStarters.length === 0 ? (
                <p className="text-xs text-slate-400 py-2 italic text-left">No codebase ZIPs / links.</p>
              ) : (
                <ul className="space-y-3">
                  {codeStarters.map((code) => (
                    <li
                      key={code.id}
                      className="bg-slate-900 text-white rounded-lg p-3 flex flex-col gap-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-sm text-emerald-400">data_object</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate text-slate-100">{code.title}</p>
                            <p className="text-[10px] text-slate-400 uppercase">{code.resourceType}</p>
                          </div>
                        </div>
                        <a
                          href={code.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                          title="Link"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                      </div>

                      {isStaff && (
                        <div className="flex justify-end gap-1.5 border-t border-slate-800 pt-2">
                          <button
                            onClick={() => {
                              setSelectedResource(code);
                              setDialogMode('edit');
                              setIsDialogOpen(true);
                            }}
                            className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded text-[11px] font-semibold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(code.id)}
                            className="px-2 py-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded text-[11px] font-semibold transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- CRUD Slideover/Dialog Modal --- */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {dialogMode === 'create' ? 'Add Class Resource' : 'Edit Class Resource'}
              </h3>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Intro to Node.js Guide"
                  className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Course */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course *</label>
                <select
                  required
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select a Course</option>
                  {coursesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Module Filter/ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Module ID (Optional)</label>
                <select
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">None / General</option>
                  <option value="m1">Module 1</option>
                  <option value="m2">Module 2</option>
                  <option value="m3">Module 3</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell students about this lecture slides, helper files or codes..."
                  className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-900 h-20 resize-none focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Resource Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Resource Type</label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-705 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="VIDEO">Video Lecture</option>
                  <option value="PDF">PDF Guideline</option>
                  <option value="LINK">External Link</option>
                  <option value="ZIP">ZIP Codebase Code Starter</option>
                  <option value="SLIDES">Slideshow Presentation</option>
                  <option value="GITHUB">GitHub Repository</option>
                </select>
              </div>

              {/* Source Mode Toggle (File upload to Cloudinary vs direct link insertion) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Upload Method</label>
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-650 cursor-pointer">
                    <input
                      type="radio"
                      name="sourceType"
                      checked={sourceType === 'url'}
                      onChange={() => setSourceType('url')}
                    />
                    Provide Web Link / URL
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-650 cursor-pointer">
                    <input
                      type="radio"
                      name="sourceType"
                      checked={sourceType === 'file'}
                      onChange={() => setSourceType('file')}
                    />
                    Upload File to Cloudinary
                  </label>
                </div>

                {sourceType === 'url' ? (
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/resources/file"
                    className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded p-4 flex flex-col items-center justify-center bg-slate-50">
                    <span className="material-symbols-outlined text-slate-400 text-3xl mb-1">upload_file</span>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="text-xs text-slate-500 focus:outline-none"
                    />
                    {file && (
                      <p className="text-[10px] text-emerald-600 mt-2 font-semibold">
                        Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-slate-150 pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 border border-slate-205 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : null}
                  {dialogMode === 'create' ? 'Add' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
