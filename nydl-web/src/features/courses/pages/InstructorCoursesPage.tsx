import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { useInstructorProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, GraduationCap } from 'lucide-react';
import type { Course } from '@/types';

export default function InstructorCoursesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useCourses();
  const { data: profileRes, isLoading: profileLoading, error: profileError } = useInstructorProfile();

  const isLoading = coursesLoading || profileLoading;
  const error = coursesError || profileError;

  const assignedCoursesList = profileRes?.data?.assignedCourses || [];
  const assignedCourseIds = assignedCoursesList.map((c: any) => c.id || c._id || c);

  const filteredCourses = courses?.data?.docs?.filter((course: Course) => {
    // Only display courses assigned to the logged-in instructor
    if (!assignedCourseIds.includes(course.id)) {
      return false;
    }

    return (
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase())
    );
  }) || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            Course Curriculum management
          </h1>
          <p className="text-muted-foreground mt-1">
            Build and optimize training paths, modules, and lessons for your students.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full bg-[#18181b] border border-zinc-800 text-white placeholder-zinc-400 text-sm rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="Search programs..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-md text-sm">
          Failed to load courses. Please try again.
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white">No courses found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="bg-[#09090b] border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between group">
              <CardHeader className="space-y-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300">
                    {course.category}
                  </Badge>
                  <Badge className="bg-primary/10 border-primary/20 text-primary">
                    {course.level || 'Intermediate'}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-white font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-zinc-400 leading-relaxed text-xs">
                  {course.shortDescription || course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 border-t border-zinc-850 flex items-center justify-between">
                <span className="text-zinc-450 text-xs font-medium">
                  {course.durationWeeks} Weeks duration
                </span>
                <Button 
                  size="sm"
                  onClick={() => navigate(`/instructor/courses/${course.id}/curriculum`)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Manage Curriculum
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
