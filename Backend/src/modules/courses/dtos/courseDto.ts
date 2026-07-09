import { Course } from '../../../types';

export interface CreateCourseDto {
  title: string;
  description: string;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Full-Stack';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  image: string;
  syllabusSummary: string;
}

export interface CourseDetailsResponseDto {
  course: Course;
}
