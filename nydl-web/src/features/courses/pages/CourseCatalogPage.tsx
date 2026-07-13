import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import type { Course } from '@/types';

export default function CourseCatalogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const { data: courses, isLoading, error } = useCourses();

  // Categories helper
  const categories = ['All', 'Frontend', 'Backend', 'AI', 'Mobile', 'Cybersecurity'];

  // Filter based on UI Category and Search
  const filteredCourses = courses?.data?.docs?.filter((course: Course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                          course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || course.category === category;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse Programs</h1>
          <p className="text-base text-slate-500">Discover world-class curricula designed to accelerate your career.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              placeholder="Search courses..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-semibold text-xs tracking-wider transition-all border ${
              category === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading & Error States */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm">
          Failed to load courses. Please try again.
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-slate-500 py-20 text-center">
          No courses match your search criteria.
        </div>
      ) : (
        /* Course Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <article
              key={course.id}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden group hover:shadow-md hover:border-slate-350 transition-all duration-200 flex flex-col cursor-pointer"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <div className="h-48 bg-slate-100 w-full flex items-center justify-center border-b border-slate-200">
                <span className="material-symbols-outlined text-[64px] text-blue-600 bg-blue-50 p-6 rounded-full">
                  {course.category === 'Frontend' ? 'html' : course.category === 'Backend' ? 'javascript' : 'terminal'}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {course.level || 'Beginner'}
                  </span>
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span> 12 Weeks
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed line-clamp-3">
                  {course.description}
                </p>
                <div className="flex justify-between items-center mt-auto border-t border-slate-100 pt-4" onClick={(e) => e.stopPropagation()}>
                  <span className="text-lg font-semibold text-slate-900">ETB {course.price || '999'}</span>
                  <button
                    onClick={() => {
                      window.location.href='https://nydev-form-generation.vercel.app/f/nydev-learning-nydl-summer-cohort-registration-2026'
                      // navigate(`/enroll/${course.id}`)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors shadow-sm"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
