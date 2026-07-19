import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Award, Grid, List } from 'lucide-react';
import { useEnrollments } from '@/hooks/useEnrollments';
import { coursesApi } from '@/api/courses.api';
import { getRegistrationStatusMeta } from '@/utils/registration';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MyCoursesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Query enrolled courses
  const { data: enrollmentsRes, isLoading: isEnrollmentsLoading } = useEnrollments();

  // Query all available catalog courses
  const { data: coursesRes, isLoading: isCatalogLoading } = useQuery({
    queryKey: ['catalogCourses'],
    queryFn: () => coursesApi.getAll({ limit: 50 }).then((res) => res.data),
  });

  console.log('fetched course : ', coursesRes);
  console.log('enrolled course : ', enrollmentsRes);

  const enrollments = enrollmentsRes?.data || [];
  const catalogCourses = coursesRes?.data?.docs || [];

  const isLoading = isEnrollmentsLoading || isCatalogLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/40 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">My Courses</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your active enrollments and learning progress.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
            className="h-8 w-8"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="enrolled">Active & Enrolled</TabsTrigger>
          <TabsTrigger value="catalog">Course Catalog</TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: Enrolled Courses ─── */}
        <TabsContent value="enrolled">
          {enrollments.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {enrollments.map((enrollment) => {
                // Find course detail in catalog
                const matchingCourse = catalogCourses.find(c => c.id === enrollment.courseId?.id);
                const progressVal = enrollment.progressPercentage || 0;
                const statusMeta = getRegistrationStatusMeta(enrollment);
                const hasAccess = enrollment.status === 'ACTIVE' || enrollment.status === 'COMPLETED';

                const toneClasses: Record<typeof statusMeta.tone, string> = {
                  success: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200/50',
                  warning: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200/50',
                  destructive: 'bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200/50',
                  muted: 'bg-muted text-muted-foreground border-border',
                };

                return (
                   <Card key={enrollment.id} className="relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold shrink-0">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <Badge
                          variant={statusMeta.tone === 'success' ? 'default' : statusMeta.tone === 'destructive' ? 'destructive' : 'outline'}
                          className="text-[10px] tracking-wide px-2.5 py-0.5"
                        >
                          {statusMeta.label}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-foreground">
                        {matchingCourse?.title || 'Bootcamp Course'}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1.5 text-xs text-muted-foreground">
                        {matchingCourse?.shortDescription || matchingCourse?.description || 'Learn advanced concepts through cohorts.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-4 border-t border-border/40 space-y-4">
                      {enrollment.status === 'ACTIVE' && (
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1.5">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-foreground">{progressVal}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressVal}%` }} />
                          </div>
                        </div>
                      )}

                      {enrollment.status === 'COMPLETED' && (
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-lg text-xs">
                          <Award className="h-4 w-4" /> Passed Course Successfully!
                        </div>
                      )}

                      {!hasAccess && enrollment.status !== 'COMPLETED' && (
                        <div className={`flex items-start gap-2 p-2.5 rounded-lg text-xs border ${toneClasses[statusMeta.tone]}`}>
                          {statusMeta.tone === 'success' ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                          ) : statusMeta.tone === 'destructive' ? (
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                          ) : (
                            <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                          )}
                          <span>{statusMeta.description}</span>
                        </div>
                      )}

                      <Link
                        to={`/courses/${enrollment.courseId?.id}`}
                        className={buttonVariants({ variant: 'default', size: 'sm', className: 'w-full text-center flex items-center justify-center' })}
                      >
                        {hasAccess ? 'Continue Learning' : 'View Details'}
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No Courses Enrolled</CardTitle>
              <p className="text-muted-foreground text-sm max-w-sm mb-6">
                You haven't enrolled in any cohorts yet. Pick a course from the catalog to get started.
              </p>
            </Card>
          )}
        </TabsContent>

        {/* ─── TAB 2: Course Catalog ─── */}
        <TabsContent value="catalog">
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {catalogCourses.map((course: any) => {
              const isEnrolled = enrollments.some(e => e.courseId === course.id);
              return (
                <Card key={course.id} className="flex flex-col justify-between hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-[10px] tracking-wide uppercase">
                        {course.category}
                      </Badge>
                      {isEnrolled && (
                        <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 text-[10px] tracking-wide">
                          Enrolled
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground truncate">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 mt-1.5 text-xs text-muted-foreground">
                      {course.shortDescription || course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Price</p>
                      <p className="text-base font-bold text-primary">${course.price} {course.currency}</p>
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className={buttonVariants({ variant: 'default', size: 'sm', className: 'flex items-center justify-center' })}
                    >
                      View Details <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
