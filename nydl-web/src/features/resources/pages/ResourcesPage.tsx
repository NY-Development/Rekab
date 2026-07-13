import { useState } from 'react';
import { useResources } from '@/hooks/useResources';
import type { Resource } from '@/types';

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All Modules');
  const { data: resourcesRes, isLoading, error } = useResources();

  const resourcesList: Resource[] = resourcesRes?.data?.docs || [];

  // Filter list
  const filteredResources = resourcesList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === 'All Modules' || item.moduleId === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const videos = filteredResources.filter(item => item.type === 'VIDEO');
  const readings = filteredResources.filter(item => item.type === 'PDF' || item.type === 'DOCUMENT');
  const codeStarters = filteredResources.filter(item => item.type === 'CODE' || item.type === 'LINK');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Header Area */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Course Resources</h2>
          <p className="text-sm text-slate-500">Access program video lectures, slides, documents and starter codes.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full bg-white border border-slate-200 text-sm text-slate-900 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-body-sm"
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
          No resources matches search / filter settings.
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
              <p className="text-xs text-slate-400 py-4 italic">No lecture videos matches current filters.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="bg-white border border-slate-200 rounded-lg overflow-hidden group hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="h-36 bg-slate-150 flex items-center justify-center relative">
                      <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-blue-600 transition-all cursor-pointer">
                        play_circle
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="text-[10px] font-bold text-blue-600 mb-1 uppercase tracking-widest">
                        {vid.moduleId ? `Module ${vid.moduleId.toUpperCase()}` : 'General'}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">{vid.title}</h4>
                      <p className="text-xs text-slate-550 mb-4 line-clamp-2 leading-relaxed">{vid.description}</p>
                      
                      <div className="flex gap-2 mt-auto">
                        <a
                          href={vid.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-blue-50 text-blue-750 hover:bg-blue-600 hover:text-white font-semibold text-xs py-2 rounded transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          Watch
                        </a>
                      </div>
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
              <div className="flex items-center gap-2 mb-4 border-b border-slate-105 pb-2">
                <span className="material-symbols-outlined text-tertiary">picture_as_pdf</span>
                <h3 className="text-lg font-bold text-slate-900">Readings & Guides</h3>
              </div>
              
              {readings.length === 0 ? (
                <p className="text-xs text-slate-400 py-2 italic text-left">No PDF guidelines uploaded.</p>
              ) : (
                <ul className="space-y-3">
                  {readings.map((doc) => (
                    <li
                      key={doc.id}
                      className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded bg-red-50 text-red-650 border border-red-100 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">description</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">{doc.title}</p>
                          <p className="text-[10px] text-slate-400">{doc.fileSize ? `${(doc.fileSize / (1024 * 1024)).toFixed(1)} MB` : 'PDF'}</p>
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
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Code Starters */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-105 pb-2">
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
                      className="bg-slate-900 text-white rounded-lg p-3 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-sm text-emerald-400">data_object</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate text-slate-100">{code.title}</p>
                          <p className="text-[10px] text-slate-400">Repository starter</p>
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
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
