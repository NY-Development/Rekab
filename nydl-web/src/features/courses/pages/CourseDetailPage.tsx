import { useParams, useNavigate } from 'react-router-dom';
import { useCourse, useCourseModules } from '@/hooks/useCourses';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: courseRes, isLoading, error } = useCourse(id || '');
  const { data: modulesRes, isLoading: isModulesLoading } = useCourseModules(id || '');
  
  const course = courseRes?.data;
  const modules = modulesRes?.data?.modules || [];

  return (
    <div className="w-full">
      {/* Loading & Error banner */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error || !course ? (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm">
            Failed to load course details. Please try again.
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="bg-slate-50 border-b border-slate-205 py-16 md:py-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wider">
                    12 Weeks
                  </span>
                  <span className="bg-slate-205 text-slate-800 border border-slate-300 px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wider">
                    {course?.level || 'Beginner'}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                  {course?.title}
                </h1>
                <p className="text-base text-slate-500 leading-relaxed max-w-xl">
                  {course?.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => navigate(`/enroll/${course?.id}`)}
                    className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold text-sm transition-colors shadow-sm"
                  >
                    Enroll for ETB {course?.price || '999'}
                  </button>
                </div>
              </div>
              <div className="hidden md:flex rounded-xl overflow-hidden border border-slate-200 shadow-sm h-80 relative bg-slate-100 items-center justify-center">
                <span className="material-symbols-outlined text-[100px] text-blue-600">
                  {course?.category === 'Frontend' ? 'html' : course?.category === 'Backend' ? 'javascript' : 'terminal'}
                </span>
              </div>
            </div>
          </section>

          {/* Curriculum Breakdown */}
          <section className="bg-white py-16 md:py-24 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="mb-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Curriculum Breakdown</h2>
                <p className="text-slate-500">A step-by-step path designed for completion and mastery.</p>
              </div>

              {isModulesLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : !modules || modules.length === 0 ? (
                <div className="text-slate-500 text-center py-10 border border-dashed rounded-lg">
                  No modules published for this course yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {modules.map((mod: any, idx: number) => (
                    <div key={mod.id} className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col md:flex-row gap-6 hover:bg-slate-100 transition-colors cursor-pointer group">
                      <div className="w-24 shrink-0 font-semibold text-xs text-slate-550 uppercase tracking-wider pt-1">
                        Module {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-650 transition-colors">
                          {mod.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-4">
                          {mod.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
