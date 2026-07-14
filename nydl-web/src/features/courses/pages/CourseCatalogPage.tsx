import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { useAuthStore } from '@/store/auth.store';
import { AuthRequiredDialog } from '@/components/common/AuthRequiredDialog';
import { levelBadgeClass, categoryIcon } from '@/utils/course';
import type { Course } from '@/types';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'DevOps', 'Full-Stack', 'Cybersecurity', 'Networking', 'Mobile'];

export default function CourseCatalogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [authPromptCourse, setAuthPromptCourse] = useState<Course | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  const { data: courses, isLoading, error } = useCourses();

  // Only students enroll; instructors/mentors browse the catalog read-only.
  const isStaff = isAuthenticated && (role || '').toUpperCase() !== 'STUDENT';

  const handleEnroll = (course: Course) => {
    if (isStaff) {
      navigate(`/courses/${course.id}`);
      return;
    }
    if (isAuthenticated) {
      navigate(`/enroll/${course.id}`);
    } else {
      setAuthPromptCourse(course);
    }
  };

  const filteredCourses = courses?.data?.docs?.filter((course: Course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || course.category === category;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Programs</h1>
          <p className="text-base text-muted-foreground">Discover world-class curricula designed to accelerate your career.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">search</span>
            <input
              className="w-full bg-background border border-border text-foreground text-sm rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-semibold text-xs tracking-wider transition-all border ${
              category === cat
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-background text-muted-foreground border-border hover:bg-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading & Error States */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300 p-4 rounded-md text-sm">
          Failed to load courses. Please try again.
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-muted-foreground py-20 text-center">
          No courses match your search criteria.
        </div>
      ) : (
        /* Course Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <article
              key={course.id}
              className="bg-card border border-border rounded-lg overflow-hidden group hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col cursor-pointer"
              onClick={() => handleEnroll(course)}
            >
              <div
                className="h-48 bg-muted w-full bg-cover bg-center flex items-center justify-center border-b border-border"
                style={course.thumbnail || course.image ? { backgroundImage: `url(${course.thumbnail || course.image})` } : undefined}
              >
                {!course.thumbnail && !course.image && (
                  <span className="material-symbols-outlined text-[64px] text-primary bg-primary/10 p-6 rounded-full">
                    {categoryIcon(course.category)}
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${levelBadgeClass(course.level)}`}>
                    {course.level || 'Beginner'}
                  </span>
                  <span className="text-muted-foreground text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span> {course.durationWeeks} Weeks
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed line-clamp-3">
                  {course.shortDescription || course.description}
                </p>
                <div className="flex justify-between items-center mt-auto border-t border-border pt-4" onClick={(e) => e.stopPropagation()}>
                  <span className="text-lg font-semibold text-foreground">
                    {course.price > 0 ? `${course.currency} ${course.price}` : 'Free'}
                  </span>
                  {!isStaff && (
                    <button
                      onClick={() => handleEnroll(course)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 py-2 rounded-md transition-colors shadow-sm"
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AuthRequiredDialog
        open={!!authPromptCourse}
        onOpenChange={(open) => !open && setAuthPromptCourse(null)}
        courseTitle={authPromptCourse?.title}
      />
    </div>
  );
}
