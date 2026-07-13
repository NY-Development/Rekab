import { useParams, useNavigate } from 'react-router-dom';
import { useCourse, useCourseModules } from '@/hooks/useCourses';
import { useCohorts } from '@/hooks/useCohorts';
import { levelBadgeClass, categoryIcon, skillIcon } from '@/utils/course';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: courseRes, isLoading, error } = useCourse(id || '');
  const { data: modulesRes, isLoading: isModulesLoading } = useCourseModules(id || '');
  const { data: cohortsRes, isLoading: isCohortsLoading } = useCohorts({ courseId: id, limit: 5 });

  const course = courseRes?.data;
  const modules = modulesRes?.data?.modules || [];
  const cohorts = cohortsRes?.data?.docs || [];

  const upcomingCohort = cohorts
    .filter((c) => c.status === 'upcoming' || c.status === 'active')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  const scrollToCurriculum = () => {
    document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' });
  };

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
                    {course.durationWeeks} Weeks
                  </span>
                  <span className={`px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wider ${levelBadgeClass(course.level)}`}>
                    {course.level || 'Beginner'}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                  {course.title}
                </h1>
                <p className="text-base text-slate-500 leading-relaxed max-w-xl">
                  {course.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => navigate(`/enroll/${course.id}`)}
                    className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold text-sm transition-colors shadow-sm"
                  >
                    Enroll for {course.price > 0 ? `${course.currency} ${course.price}` : 'Free'}
                  </button>
                  <button
                    onClick={scrollToCurriculum}
                    className="bg-white text-primary border border-slate-200 px-6 py-3 rounded-md font-semibold text-sm hover:bg-slate-100 transition-colors"
                  >
                    View Curriculum
                  </button>
                </div>
              </div>
              <div
                className="hidden md:flex rounded-xl overflow-hidden border border-slate-200 shadow-sm h-80 relative bg-slate-100 items-center justify-center bg-cover bg-center"
                style={course.thumbnail || course.image ? { backgroundImage: `url(${course.thumbnail || course.image})` } : undefined}
              >
                {!course.thumbnail && !course.image && (
                  <span className="material-symbols-outlined text-[100px] text-blue-600">
                    {categoryIcon(course.category)}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Course Overview */}
          <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Course Overview</h2>
              <p className="text-slate-500">Core skills you'll build in this program.</p>
            </div>
            {course.skills && course.skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {course.skills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center"
                  >
                    <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                      <span className="material-symbols-outlined">{skillIcon(skill)}</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">{skill}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 text-center py-10 border border-dashed rounded-lg">
                Skills breakdown coming soon.
              </div>
            )}
          </section>

          {/* Curriculum Breakdown */}
          <section id="curriculum" className="bg-white py-16 md:py-24 px-4 md:px-8 border-t border-slate-200">
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

          {/* Course Details & Next Cohort */}
          <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Course Details */}
              <div className="border border-slate-200 rounded-xl p-8 bg-white">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Details</h2>
                <ul className="text-sm text-slate-500 space-y-4">
                  <li className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">language</span> Language</span>
                    <span className="font-semibold text-slate-800">{course.language || 'English'}</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">signal_cellular_alt</span> Level</span>
                    <span className="font-semibold text-slate-800">{course.level || 'Beginner'}</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">calendar_today</span> Duration</span>
                    <span className="font-semibold text-slate-800">{course.durationWeeks} Weeks</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">how_to_reg</span> Enrollment</span>
                    <span className={`font-semibold ${course.enrollmentEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {course.enrollmentEnabled ? 'Open' : 'Closed'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Cohort Info */}
              <div className="border border-slate-200 rounded-xl p-8 bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Next Cohort</h2>
                {isCohortsLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : !upcomingCohort ? (
                  <div className="text-slate-500 text-sm text-center py-6 border border-dashed rounded-lg">
                    No upcoming cohorts scheduled yet.
                  </div>
                ) : (
                  <>
                    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-semibold text-primary uppercase mb-1">{upcomingCohort.name}</p>
                        <p className="text-lg font-semibold text-slate-900">
                          Starts {new Date(upcomingCohort.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      {upcomingCohort.maxCapacity - upcomingCohort.students.length <= 5 && (
                        <span className="bg-slate-200 text-slate-800 px-2 py-1 rounded-full text-[10px] font-bold uppercase">
                          Filling Fast
                        </span>
                      )}
                    </div>
                    <ul className="text-sm text-slate-500 space-y-3 mb-6">
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">calendar_today</span> {course.durationWeeks} Weeks Duration
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">schedule</span> {upcomingCohort.schedule}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">groups</span> {upcomingCohort.students.length} / {upcomingCohort.maxCapacity} enrolled
                      </li>
                    </ul>
                  </>
                )}
                <button
                  onClick={() => navigate(`/enroll/${course.id}`)}
                  className="w-full bg-primary text-white py-3 rounded-md font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Reserve Your Spot
                </button>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-slate-50 py-16 md:py-24 px-4 md:px-8 border-t border-slate-200">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-base font-semibold text-slate-900 mb-2">Do I need prior experience for this course?</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {course.level === 'Beginner'
                      ? 'No, this course is designed for beginners. We start with the fundamentals before moving on to more advanced concepts.'
                      : `This is a ${course.level.toLowerCase()}-level course, so some prior experience with the prerequisite topics is recommended before enrolling.`}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-base font-semibold text-slate-900 mb-2">What kind of computer do I need?</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Any modern Mac, Windows, or Linux laptop less than 5 years old will work perfectly. You just need a reliable internet connection and a modern web browser.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-base font-semibold text-slate-900 mb-2">Is there a certificate upon completion?</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Yes, upon successfully finishing {course.title} and its capstone requirements, you will receive an NYDL certificate of completion.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
