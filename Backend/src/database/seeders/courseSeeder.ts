import { CourseModel } from '@/modules/courses/models/Course';

interface SeedCourse {
  title: string;
  slug: string;
  code: string;
  shortDescription: string;
  description: string;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Full-Stack' | 'Cybersecurity' | 'Networking' | 'Mobile';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  skills: string[];
  price: number;
}

const SEED_COURSES: SeedCourse[] = [
  {
    title: 'Frontend Beginner',
    slug: 'frontend-beginner',
    code: 'FE-BEG-101',
    shortDescription: 'Learn the foundations of building websites.',
    description: 'A beginner-friendly introduction to web development covering HTML, CSS, and JavaScript fundamentals.',
    category: 'Frontend',
    level: 'Beginner',
    durationWeeks: 8,
    skills: ['HTML', 'CSS', 'JavaScript'],
    price: 2000,
  },
  {
    title: 'Frontend Intermediate',
    slug: 'frontend-intermediate',
    code: 'FE-INT-201',
    shortDescription: 'Build dynamic user interfaces with modern React.',
    description: 'Go beyond the basics with React.js, modern React patterns, hooks, state management, routing, and API integration.',
    category: 'Frontend',
    level: 'Intermediate',
    durationWeeks: 10,
    skills: ['React.js', 'Hooks', 'State Management', 'Routing', 'API Integration'],
    price: 2500,
  },
  {
    title: 'Backend Beginner',
    slug: 'backend-beginner',
    code: 'BE-BEG-101',
    shortDescription: 'Learn to build server-side applications from scratch.',
    description: 'An introduction to backend development covering Node.js, Express.js, MongoDB, REST APIs, and authentication.',
    category: 'Backend',
    level: 'Beginner',
    durationWeeks: 10,
    skills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Authentication'],
    price: 2000,
  },
  {
    title: 'Backend Intermediate',
    slug: 'backend-intermediate',
    code: 'BE-INT-201',
    shortDescription: 'Architect scalable backend systems with NestJS.',
    description: 'Deepen your backend skills with NestJS architecture, modules, guards, interceptors, and testing.',
    category: 'Backend',
    level: 'Intermediate',
    durationWeeks: 10,
    skills: ['NestJS', 'Architecture', 'Modules', 'Guards', 'Interceptors', 'Testing'],
    price: 2500,
  },
  {
    title: 'Cybersecurity Beginner',
    slug: 'cybersecurity-beginner',
    code: 'SEC-BEG-101',
    shortDescription: 'Understand the fundamentals of keeping systems secure.',
    description: 'An introduction to cybersecurity covering networking basics, the OWASP Top 10, authentication, authorization, and security fundamentals.',
    category: 'Cybersecurity',
    level: 'Beginner',
    durationWeeks: 8,
    skills: ['Networking Basics', 'OWASP', 'Authentication', 'Authorization', 'Security Fundamentals'],
    price: 2000,
  },
  {
    title: 'Networking Beginner',
    slug: 'networking-beginner',
    code: 'NET-BEG-101',
    shortDescription: 'Learn how data moves across networks.',
    description: 'An introduction to networking fundamentals covering TCP/IP, DNS, HTTP, the OSI model, and LAN/WAN concepts.',
    category: 'Networking',
    level: 'Beginner',
    durationWeeks: 6,
    skills: ['Networking Fundamentals', 'TCP/IP', 'DNS', 'HTTP', 'OSI Model', 'LAN/WAN'],
    price: 2000,
  },
  {
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    code: 'MOB-INT-201',
    shortDescription: 'Build cross-platform mobile apps with React Native.',
    description: 'Learn to build and publish cross-platform mobile applications with React Native, Expo, navigation, and native APIs.',
    category: 'Mobile',
    level: 'Intermediate',
    durationWeeks: 10,
    skills: ['React Native', 'Expo', 'Navigation', 'Native APIs', 'Publishing'],
    price: 2500,
  },
];

export async function seedCourses(): Promise<void> {
  for (const course of SEED_COURSES) {
    const exists = await CourseModel.findOne({ slug: course.slug });
    if (exists) continue;

    await CourseModel.create({
      title: course.title,
      slug: course.slug,
      code: course.code,
      shortDescription: course.shortDescription,
      description: course.description,
      category: course.category,
      level: course.level,
      language: 'English',
      durationWeeks: course.durationWeeks,
      skills: course.skills,
      price: 0,
      currency: 'ETB',
      status: 'published',
      enrollmentEnabled: true,
      image: '/preview.png',
      thumbnail: '/preview.png',
      syllabusSummary: course.shortDescription,
    });

    console.log(`Seeded course: ${course.title}`);
  }
}

export default seedCourses;
