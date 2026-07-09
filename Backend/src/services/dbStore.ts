import fs from 'fs';
import path from 'path';
import { isMongoConnected } from '../configs/db';
import UserModel from '../modules/users/models/User';
import CourseModel from '../modules/courses/models/Course';
import CohortModel from '../modules/cohorts/models/Cohort';
import EnrollmentModel from '../modules/enrollments/models/Enrollment';
import SubmissionModel from '../modules/submissions/models/Submission';
import ActivityLogModel from '../modules/analytics/models/ActivityLog';
import { User, Course, Cohort, Enrollment, Submission, ActivityLog, Module } from '../types';

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface LocalDB {
  users: User[];
  courses: Course[];
  cohorts: Cohort[];
  enrollments: Enrollment[];
  submissions: Submission[];
  activityLogs: ActivityLog[];
}

// Default initial seed data
export const INITIAL_SEED: LocalDB = {
  users: [
    {
      id: 'admin-1',
      name: 'NYDL Admin',
      firstName: 'NYDL',
      lastName: 'Admin',
      username: 'admin',
      email: 'admin@nydl.edu',
      passwordHash: '$2a$10$T8VqYnbeK.6EaR6FWeC9NOnS2D10oGZ.ybyE3B8L5.N0rY6vWp5D6', // password: password123
      role: 'admin',
      isEmailVerified: true,
      isActive: true,
      isBlocked: false,
      refreshTokenVersion: 1,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'inst-1',
      name: 'Dr. Sarah Jenkins',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      username: 'sarah',
      email: 'sarah@nydl.edu',
      passwordHash: '$2a$10$T8VqYnbeK.6EaR6FWeC9NOnS2D10oGZ.ybyE3B8L5.N0rY6vWp5D6', // password: password123
      role: 'instructor',
      isEmailVerified: true,
      isActive: true,
      isBlocked: false,
      refreshTokenVersion: 1,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'inst-2',
      name: 'Marcus Chen',
      firstName: 'Marcus',
      lastName: 'Chen',
      username: 'marcus',
      email: 'marcus@nydl.edu',
      passwordHash: '$2a$10$T8VqYnbeK.6EaR6FWeC9NOnS2D10oGZ.ybyE3B8L5.N0rY6vWp5D6', // password: password123
      role: 'instructor',
      isEmailVerified: true,
      isActive: true,
      isBlocked: false,
      refreshTokenVersion: 1,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'stud-1',
      name: 'Alex Rivera',
      firstName: 'Alex',
      lastName: 'Rivera',
      username: 'alex',
      email: 'alex@student.nydl.edu',
      passwordHash: '$2a$10$T8VqYnbeK.6EaR6FWeC9NOnS2D10oGZ.ybyE3B8L5.N0rY6vWp5D6', // password: password123
      role: 'student',
      isEmailVerified: true,
      isActive: true,
      isBlocked: false,
      refreshTokenVersion: 1,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  courses: [
    {
      id: 'course-fs',
      title: 'Full-Stack Software Engineering',
      slug: 'full-stack-software-engineering',
      code: 'FS-101',
      description: 'Master professional full-stack web application development. Learn design systems, backends, database layers, hosting pipelines, and standard engineering tooling.',
      category: 'Full-Stack',
      difficulty: 'Intermediate',
      level: 'Intermediate',
      durationWeeks: 12,
      price: 0,
      discountPrice: 0,
      currency: 'ETB',
      prerequisites: [],
      learningOutcomes: [],
      skills: [],
      instructors: [],
      mentors: [],
      enrollmentEnabled: true,
      maxStudentsPerCohort: 30,
      defaultTeamSize: 5,
      allowWaitlist: true,
      totalEnrollments: 0,
      totalRevenue: 0,
      status: 'published',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      syllabusSummary: 'Covers HTML5/CSS3, TypeScript, React & Vite, Tailwind, Node.js, Express, PostgreSQL, MongoDB, Docker, and CI/CD pipelines.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'course-devops',
      title: 'Advanced DevOps & Cloud Infrastructure',
      slug: 'advanced-devops-cloud-infrastructure',
      code: 'DO-201',
      description: 'Architect, deploy, and scale modern cloud-native systems. Deep dive into container orchestrations, configuration tools, pipeline automation, and telemetry.',
      category: 'DevOps',
      difficulty: 'Advanced',
      level: 'Advanced',
      durationWeeks: 8,
      price: 0,
      discountPrice: 0,
      currency: 'ETB',
      prerequisites: [],
      learningOutcomes: [],
      skills: [],
      instructors: [],
      mentors: [],
      enrollmentEnabled: true,
      maxStudentsPerCohort: 30,
      defaultTeamSize: 5,
      allowWaitlist: true,
      totalEnrollments: 0,
      totalRevenue: 0,
      status: 'published',
      image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800',
      syllabusSummary: 'Covers Linux systems, Bash scripting, Docker containers, Kubernetes, AWS, Terraform, GitHub Actions, Prometheus, and Grafana.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'course-frontend',
      title: 'Frontend Architecture & Design Systems',
      slug: 'frontend-architecture-design-systems',
      code: 'FE-102',
      description: 'Craft stunning, high-performance interfaces. Master Tailwind CSS, animations, advanced React patterns, state managers, and accessibility standards.',
      category: 'Frontend',
      difficulty: 'Intermediate',
      level: 'Intermediate',
      durationWeeks: 10,
      price: 0,
      discountPrice: 0,
      currency: 'ETB',
      prerequisites: [],
      learningOutcomes: [],
      skills: [],
      instructors: [],
      mentors: [],
      enrollmentEnabled: true,
      maxStudentsPerCohort: 30,
      defaultTeamSize: 5,
      allowWaitlist: true,
      totalEnrollments: 0,
      totalRevenue: 0,
      status: 'published',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800',
      syllabusSummary: 'Covers React 19, Vite, Tailwind CSS, Motion/Framer Motion, Redux Toolkit, Component library creation, WAI-ARIA, and performance auditing.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'course-backend',
      title: 'Backend Systems & API Engineering',
      slug: 'backend-systems-api-engineering',
      code: 'BE-103',
      description: 'Build fast, bulletproof APIs and distributed databases. Master scalable server systems, concurrency, background queues, caching, and auth.',
      category: 'Backend',
      difficulty: 'Advanced',
      level: 'Advanced',
      durationWeeks: 10,
      price: 0,
      discountPrice: 0,
      currency: 'ETB',
      prerequisites: [],
      learningOutcomes: [],
      skills: [],
      instructors: [],
      mentors: [],
      enrollmentEnabled: true,
      maxStudentsPerCohort: 30,
      defaultTeamSize: 5,
      allowWaitlist: true,
      totalEnrollments: 0,
      totalRevenue: 0,
      status: 'published',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      syllabusSummary: 'Covers Go/Golang, Node.js, REST & GraphQL, gRPC, Redis caching, RabbitMQ/Kafka, database optimization, and high concurrency patterns.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  cohorts: [
    {
      id: 'cohort-fs-a',
      courseId: 'course-fs',
      name: 'Full-Stack Cohort 2026-A',
      code: 'NYDL-26-FS-A',
      startDate: '2026-03-01',
      endDate: '2026-05-24',
      status: 'active',
      maxCapacity: 25,
      instructors: ['inst-1'],
      students: ['stud-1'],
      instructorIds: [],
      mentorIds: [],
      enrolledStudents: [],
      schedule: 'Mon & Wed 7:00 PM - 9:00 PM EST',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cohort-devops-a',
      courseId: 'course-devops',
      name: 'Cloud Infrastructure Cohort 2026-A',
      code: 'NYDL-26-DO-A',
      startDate: '2026-04-15',
      endDate: '2026-06-10',
      status: 'upcoming',
      maxCapacity: 20,
      instructors: ['inst-2'],
      students: [],
      instructorIds: [],
      mentorIds: [],
      enrolledStudents: [],
      schedule: 'Tue & Thu 6:30 PM - 8:30 PM EST',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  enrollments: [
    {
      id: 'enroll-1',
      studentId: 'stud-1',
      cohortId: 'cohort-fs-a',
      status: 'enrolled',
      progressPercentage: 45,
      enrolledAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  submissions: [],
  activityLogs: [
    {
      id: 'log-1',
      userId: 'admin-1',
      userName: 'NYDL Admin',
      action: 'SYSTEM_BOOT',
      details: 'Technology education platform initialized with master seed database.',
      timestamp: new Date().toISOString()
    }
  ]
};

// Course curriculum details for each course (stored as child arrays/objects in modular format)
export const SEED_MODULES: Record<string, any[]> = {
  'course-fs': [
    {
      id: 'fs-m1',
      courseId: 'course-fs',
      title: 'Module 1: Advanced Frontend Fundamentals',
      description: 'Master TypeScript, React hooks, custom state management, and modern layout systems with Tailwind CSS.',
      order: 1,
      lessons: [
        {
          id: 'fs-m1-l1',
          title: 'Deep Dive: React hooks and state lifecycle',
          content: 'In this lesson, we will dissect React render pipeline, state reconciliation, useMemo, and useCallback optimization hooks.',
          durationMinutes: 45,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          resources: [{ title: 'React Docs Reference', url: 'https://react.dev' }]
        },
        {
          id: 'fs-m1-l2',
          title: 'TypeScript with React & Props Typing',
          content: 'Understand strict type annotations, generics, type narrowings, and building fully type-safe React UI components.',
          durationMinutes: 50,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          resources: [{ title: 'TypeScript Cheat Sheet', url: 'https://react-typescript-cheatsheet.netlify.app' }]
        }
      ],
      assignments: [
        {
          id: 'fs-m1-a1',
          moduleId: 'fs-m1',
          title: 'Assignment 1: Responsive Portfolio Builder',
          description: 'Construct a highly polished personal developer portfolio utilizing React, Tailwind CSS, custom layout animations, and full TypeScript annotations.',
          maxPoints: 100,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          submissionType: 'github'
        }
      ]
    },
    {
      id: 'fs-m2',
      courseId: 'course-fs',
      title: 'Module 2: Server Architecture with Express & Node',
      description: 'Build resilient backends using Node.js, Express, robust middleware layers, JWT authorization pipelines, and API contract validations.',
      order: 2,
      lessons: [
        {
          id: 'fs-m2-l1',
          title: 'Express v5 Routing & Async Handlers',
          content: 'Learn to design modular sub-routers, handle errors in asynchronous pathways gracefully, and enforce strict payload validation policies.',
          durationMinutes: 60,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ],
      assignments: [
        {
          id: 'fs-m2-a1',
          moduleId: 'fs-m2',
          title: 'Assignment 2: Task Scheduler API',
          description: 'Engineer a scalable, modular Express backend with full support for JWT tokens, password hashing, and input validation using Zod schemas.',
          maxPoints: 100,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          submissionType: 'github'
        }
      ]
    }
  ],
  'course-devops': [
    {
      id: 'do-m1',
      courseId: 'course-devops',
      title: 'Module 1: Infrastructure as Code & Containers',
      description: 'Master Docker containerization pipelines and building declarative systems using Terraform configurations.',
      order: 1,
      lessons: [
        {
          id: 'do-m1-l1',
          title: 'Writing Production Dockerfiles',
          content: 'Master multi-stage build patterns, minimizing layer footprint sizes, running processes as non-root, and securing container secrets.',
          durationMinutes: 55,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ],
      assignments: [
        {
          id: 'do-m1-a1',
          moduleId: 'do-m1',
          title: 'Assignment 1: High Performance Multi-stage Build',
          description: 'Construct a secure, optimized multi-stage build for a full-stack Node/React application and push it to a private container registry.',
          maxPoints: 100,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          submissionType: 'github'
        }
      ]
    }
  ],
  'course-frontend': [
    {
      id: 'fe-m1',
      courseId: 'course-frontend',
      title: 'Module 1: Design Systems and Layout Choreography',
      description: 'Learn the principles of professional UI design systems, fluid spacing scales, responsive flexbox/grid containers, and accessibility specs.',
      order: 1,
      lessons: [
        {
          id: 'fe-m1-l1',
          title: 'Responsive Flex Grid & Layout Systems',
          content: 'Examine layout structures, aspect ratios, responsive scaling ranges, flex container wrapping, and bento box grids.',
          durationMinutes: 40
        }
      ],
      assignments: [
        {
          id: 'fe-m1-a1',
          moduleId: 'fe-m1',
          title: 'Assignment 1: Aesthetic Dashboard Interface',
          description: 'Style a modern dashboard wireframe using standard Tailwind tokens, emphasizing professional visual balance and fluid typography.',
          maxPoints: 100,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          submissionType: 'github'
        }
      ]
    }
  ],
  'course-backend': [
    {
      id: 'be-m1',
      courseId: 'course-backend',
      title: 'Module 1: Database Mechanics and Query Architectures',
      description: 'Deep dive into database transaction isolation levels, raw query plans, custom indexes, and caching strategies.',
      order: 1,
      lessons: [
        {
          id: 'be-m1-l1',
          title: 'PostgreSQL Indexes and Execution Plans',
          content: 'Learn how indexes (B-tree, GIN) operate, examine query planners, and run EXPLAIN ANALYZE command blocks.',
          durationMinutes: 50
        }
      ],
      assignments: [
        {
          id: 'be-m1-a1',
          moduleId: 'be-m1',
          title: 'Assignment 1: SQL Schema Optimization',
          description: 'Identify slow query pathways in an existing SQL schema, propose compound indexes, and write query plan explanations.',
          maxPoints: 100,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          submissionType: 'github'
        }
      ]
    }
  ]
};

// Add curriculum modules to seeded courses
INITIAL_SEED.courses = INITIAL_SEED.courses.map(course => ({
  ...course,
  modules: SEED_MODULES[course.id] || []
}));

// Normalize seeded users to have new required fields
INITIAL_SEED.users = INITIAL_SEED.users.map(user => {
  const name = user.name;
  return {
    ...user,
    firstName: name.split(' ')[0],
    lastName: name.split(' ').slice(1).join(' ') || 'User',
    isEmailVerified: true,
    isActive: true,
    isBlocked: false,
    refreshTokenVersion: 1,
    updatedAt: user.createdAt
  };
}) as any;

export class DBStore {
  private static localData: LocalDB = INITIAL_SEED;

  public static initialize() {
    if (isMongoConnected) {
      console.log('⚡ DBStore: Running in MongoDB-backed mode.');
      return;
    }

    console.log('⚡ DBStore: Initializing file-backed local database...');
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.localData = JSON.parse(raw);
        // Normalize loaded local users to make sure they have new fields
        this.localData.users = this.localData.users.map(u => {
          const name = u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'User';
          return {
            ...u,
            name,
            firstName: u.firstName || name.split(' ')[0] || 'First',
            lastName: u.lastName || name.split(' ').slice(1).join(' ') || 'Last',
            isEmailVerified: u.isEmailVerified !== undefined ? u.isEmailVerified : true,
            isActive: u.isActive !== undefined ? u.isActive : true,
            isBlocked: u.isBlocked !== undefined ? u.isBlocked : false,
            refreshTokenVersion: u.refreshTokenVersion || 1,
            updatedAt: u.updatedAt || new Date().toISOString()
          };
        });
        this.saveToDisk();
        console.log(`✅ Loaded ${this.localData.users.length} users, ${this.localData.courses.length} courses from existing local DB file.`);
      } else {
        this.saveToDisk();
        console.log('🆕 Created new database file on disk with loaded seed data.');
      }
    } catch (err: any) {
      console.error('❌ Failed to initialize local DB file:', err.message);
    }
  }

  private static saveToDisk() {
    if (isMongoConnected) return;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.localData, null, 2), 'utf-8');
    } catch (err: any) {
      console.error('❌ Failed to write to local DB file:', err.message);
    }
  }

  // --- Users Operations ---
  public static async getUsers(): Promise<User[]> {
    if (isMongoConnected) {
      const docs = await (UserModel as any).find({});
      return docs.map((d: any) => d.toJSON() as User);
    }
    return this.localData.users;
  }

  public static async getUserById(id: string): Promise<User | null> {
    if (isMongoConnected) {
      const doc = await (UserModel as any).findById(id);
      return doc ? (doc.toJSON() as User) : null;
    }
    return this.localData.users.find(u => u.id === id) || null;
  }

  public static async getUserByEmail(email: string): Promise<User | null> {
    if (isMongoConnected) {
      const doc = await (UserModel as any).findOne({ email });
      return doc ? (doc.toJSON() as User) : null;
    }
    return this.localData.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public static async createUser(user: Omit<User, 'id'>): Promise<User> {
    const name = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
    const firstName = user.firstName || name.split(' ')[0] || 'First';
    const lastName = user.lastName || name.split(' ').slice(1).join(' ') || 'Last';
    const normalized = {
      ...user,
      name,
      firstName,
      lastName,
      isEmailVerified: user.isEmailVerified !== undefined ? user.isEmailVerified : false,
      isActive: user.isActive !== undefined ? user.isActive : true,
      isBlocked: user.isBlocked !== undefined ? user.isBlocked : false,
      refreshTokenVersion: user.refreshTokenVersion || 1,
      updatedAt: user.updatedAt || new Date().toISOString()
    };

    if (isMongoConnected) {
      const doc = await (UserModel as any).create(normalized);
      return doc.toJSON() as User;
    }
    const newUser: User = {
      ...normalized,
      id: `u-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    } as User;
    this.localData.users.push(newUser);
    this.saveToDisk();
    return newUser;
  }

  public static async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    if (isMongoConnected) {
      const doc = await (UserModel as any).findByIdAndUpdate(id, { $set: updateData }, { new: true });
      return doc ? (doc.toJSON() as User) : null;
    }
    const idx = this.localData.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.localData.users[idx] = { ...this.localData.users[idx], ...updateData };
      this.saveToDisk();
      return this.localData.users[idx];
    }
    return null;
  }

  // --- Courses Operations ---
  public static async getCourses(): Promise<Course[]> {
    if (isMongoConnected) {
      const docs = await (CourseModel as any).find({});
      return docs.map((d: any) => d.toJSON() as Course);
    }
    return this.localData.courses;
  }

  public static async getCourseById(id: string): Promise<Course | null> {
    if (isMongoConnected) {
      const doc = await (CourseModel as any).findById(id);
      if (!doc) {
        // Fallback search by string id
        const docByStringId = await (CourseModel as any).findOne({ id });
        return docByStringId ? (docByStringId.toJSON() as Course) : null;
      }
      return doc.toJSON() as Course;
    }
    return this.localData.courses.find(c => c.id === id) || null;
  }

  public static async createCourse(course: Omit<Course, 'id'>): Promise<Course> {
    const slug = course.slug || course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const code = course.code || `NYDL-${course.title.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const status = course.status || 'draft';
    const normalized = {
      ...course,
      slug,
      code,
      status
    };

    if (isMongoConnected) {
      const doc = await (CourseModel as any).create({ ...normalized, modules: [] });
      return doc.toJSON() as Course;
    }
    const newCourse: Course = {
      ...normalized,
      id: `course-${Date.now()}`,
      modules: []
    } as Course;
    this.localData.courses.push(newCourse);
    this.saveToDisk();
    return newCourse;
  }

  public static async addModule(courseId: string, moduleData: Omit<Module, 'id' | 'lessons' | 'assignments'>): Promise<Module> {
    const newModule: Module = {
      ...moduleData,
      id: `m-${Date.now()}`,
      courseId,
      lessons: [],
      assignments: []
    };

    if (isMongoConnected) {
      await (CourseModel as any).findOneAndUpdate(
        { _id: courseId },
        { $push: { modules: newModule } }
      );
      return newModule;
    }

    const course = this.localData.courses.find(c => c.id === courseId);
    if (course) {
      if (!course.modules) course.modules = [];
      course.modules.push(newModule);
      this.saveToDisk();
    }
    return newModule;
  }

  public static async updateCourseModules(courseId: string, modules: Module[]): Promise<Course | null> {
    if (isMongoConnected) {
      const doc = await (CourseModel as any).findOneAndUpdate(
        { _id: courseId },
        { $set: { modules } },
        { new: true }
      );
      return doc ? (doc.toJSON() as Course) : null;
    }

    const course = this.localData.courses.find(c => c.id === courseId);
    if (course) {
      course.modules = modules;
      this.saveToDisk();
      return course;
    }
    return null;
  }

  // --- Cohorts Operations ---
  public static async getCohorts(): Promise<Cohort[]> {
    if (isMongoConnected) {
      const docs = await (CohortModel as any).find({});
      return docs.map((d: any) => d.toJSON() as Cohort);
    }
    return this.localData.cohorts;
  }

  public static async getCohortById(id: string): Promise<Cohort | null> {
    if (isMongoConnected) {
      const doc = await (CohortModel as any).findById(id);
      return doc ? (doc.toJSON() as Cohort) : null;
    }
    return this.localData.cohorts.find(c => c.id === id) || null;
  }

  public static async createCohort(cohort: Omit<Cohort, 'id'>): Promise<Cohort> {
    if (isMongoConnected) {
      const doc = await (CohortModel as any).create(cohort);
      return doc.toJSON() as Cohort;
    }
    const newCohort: Cohort = {
      ...cohort,
      id: `cohort-${Date.now()}`
    };
    this.localData.cohorts.push(newCohort);
    this.saveToDisk();
    return newCohort;
  }

  public static async updateCohort(id: string, updateData: Partial<Cohort>): Promise<Cohort | null> {
    if (isMongoConnected) {
      const doc = await (CohortModel as any).findByIdAndUpdate(id, { $set: updateData }, { new: true });
      return doc ? (doc.toJSON() as Cohort) : null;
    }
    const idx = this.localData.cohorts.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.localData.cohorts[idx] = { ...this.localData.cohorts[idx], ...updateData };
      this.saveToDisk();
      return this.localData.cohorts[idx];
    }
    return null;
  }

  // --- Enrollments Operations ---
  public static async getEnrollments(): Promise<Enrollment[]> {
    if (isMongoConnected) {
      const docs = await (EnrollmentModel as any).find({});
      return docs.map((d: any) => d.toJSON() as Enrollment);
    }
    return this.localData.enrollments;
  }

  public static async getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    if (isMongoConnected) {
      const docs = await (EnrollmentModel as any).find({ studentId });
      return docs.map((d: any) => d.toJSON() as Enrollment);
    }
    return this.localData.enrollments.filter(e => e.studentId === studentId);
  }

  public static async getEnrollmentsByCohort(cohortId: string): Promise<Enrollment[]> {
    if (isMongoConnected) {
      const docs = await (EnrollmentModel as any).find({ cohortId });
      return docs.map((d: any) => d.toJSON() as Enrollment);
    }
    return this.localData.enrollments.filter(e => e.cohortId === cohortId);
  }

  public static async createEnrollment(enrollment: Omit<Enrollment, 'id'>): Promise<Enrollment> {
    if (isMongoConnected) {
      const doc = await (EnrollmentModel as any).create(enrollment);
      // Update Cohort students array
      await (CohortModel as any).findByIdAndUpdate(enrollment.cohortId, {
        $addToSet: { students: enrollment.studentId }
      });
      return doc.toJSON() as Enrollment;
    }

    // Check duplicate
    const exists = this.localData.enrollments.find(
      e => e.studentId === enrollment.studentId && e.cohortId === enrollment.cohortId
    );
    if (exists) return exists;

    const newEnroll: Enrollment = {
      ...enrollment,
      id: `enroll-${Date.now()}`
    };
    this.localData.enrollments.push(newEnroll);

    // Update Cohort
    const cohort = this.localData.cohorts.find(c => c.id === enrollment.cohortId);
    if (cohort && !cohort.students.includes(enrollment.studentId)) {
      cohort.students.push(enrollment.studentId);
    }

    this.saveToDisk();
    return newEnroll;
  }

  public static async updateEnrollmentProgress(studentId: string, cohortId: string, progressPercentage: number): Promise<Enrollment | null> {
    if (isMongoConnected) {
      const doc = await (EnrollmentModel as any).findOneAndUpdate(
        { studentId, cohortId },
        { $set: { progressPercentage } },
        { new: true }
      );
      return doc ? (doc.toJSON() as Enrollment) : null;
    }

    const enroll = this.localData.enrollments.find(
      e => e.studentId === studentId && e.cohortId === cohortId
    );
    if (enroll) {
      enroll.progressPercentage = progressPercentage;
      this.saveToDisk();
      return enroll;
    }
    return null;
  }

  public static async updateEnrollmentStatus(id: string, status: 'enrolled' | 'completed' | 'dropped', certificateUrl?: string): Promise<Enrollment | null> {
    const update: any = { status };
    if (status === 'completed') {
      update.certificateIssued = true;
      if (certificateUrl) update.certificateUrl = certificateUrl;
    }

    if (isMongoConnected) {
      const doc = await (EnrollmentModel as any).findByIdAndUpdate(id, { $set: update }, { new: true });
      return doc ? (doc.toJSON() as Enrollment) : null;
    }

    const idx = this.localData.enrollments.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.localData.enrollments[idx] = { ...this.localData.enrollments[idx], ...update };
      this.saveToDisk();
      return this.localData.enrollments[idx];
    }
    return null;
  }

  // --- Submissions Operations ---
  public static async getSubmissions(): Promise<Submission[]> {
    if (isMongoConnected) {
      const docs = await (SubmissionModel as any).find({});
      return docs.map((d: any) => d.toJSON() as Submission);
    }
    return this.localData.submissions;
  }

  public static async getSubmissionsByStudent(studentId: string): Promise<Submission[]> {
    if (isMongoConnected) {
      const docs = await (SubmissionModel as any).find({ studentId });
      return docs.map((d: any) => d.toJSON() as Submission);
    }
    return this.localData.submissions.filter(s => s.studentId === studentId);
  }

  public static async getSubmissionsByCohort(cohortId: string): Promise<Submission[]> {
    if (isMongoConnected) {
      const docs = await (SubmissionModel as any).find({ cohortId });
      return docs.map((d: any) => d.toJSON() as Submission);
    }
    return this.localData.submissions.filter(s => s.cohortId === cohortId);
  }

  public static async createSubmission(submission: Omit<Submission, 'id'>): Promise<Submission> {
    if (isMongoConnected) {
      // Use findOneAndUpdate with upsert to prevent multiple submissions
      const doc = await (SubmissionModel as any).findOneAndUpdate(
        { assignmentId: submission.assignmentId, studentId: submission.studentId },
        { $set: submission },
        { new: true, upsert: true }
      );
      return doc.toJSON() as Submission;
    }

    const existingIdx = this.localData.submissions.findIndex(
      s => s.assignmentId === submission.assignmentId && s.studentId === submission.studentId
    );

    const data: Submission = {
      ...submission,
      id: existingIdx !== -1 ? this.localData.submissions[existingIdx].id : `sub-${Date.now()}`
    };

    if (existingIdx !== -1) {
      this.localData.submissions[existingIdx] = data;
    } else {
      this.localData.submissions.push(data);
    }
    this.saveToDisk();
    return data;
  }

  public static async gradeSubmission(id: string, gradeData: { points: number; feedback: string; gradedBy: string }): Promise<Submission | null> {
    const update = {
      ...gradeData,
      status: 'graded' as const
    };

    if (isMongoConnected) {
      const doc = await (SubmissionModel as any).findByIdAndUpdate(id, { $set: update }, { new: true });
      return doc ? (doc.toJSON() as Submission) : null;
    }

    const idx = this.localData.submissions.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.localData.submissions[idx] = { ...this.localData.submissions[idx], ...update };
      this.saveToDisk();
      return this.localData.submissions[idx];
    }
    return null;
  }

  // --- Activity Log Operations ---
  public static async getActivityLogs(): Promise<ActivityLog[]> {
    if (isMongoConnected) {
      const docs = await (ActivityLogModel as any).find({}).sort({ timestamp: -1 }).limit(100);
      return docs.map((d: any) => d.toJSON() as ActivityLog);
    }
    return [...this.localData.activityLogs].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 100);
  }

  public static async logActivity(userId: string, userName: string, action: string, details: string): Promise<ActivityLog> {
    const log: Omit<ActivityLog, 'id'> = {
      userId,
      userName,
      action,
      details,
      timestamp: new Date().toISOString()
    };

    if (isMongoConnected) {
      const doc = await (ActivityLogModel as any).create(log);
      return doc.toJSON() as ActivityLog;
    }

    const newLog: ActivityLog = {
      ...log,
      id: `log-${Date.now()}`
    };
    this.localData.activityLogs.push(newLog);
    this.saveToDisk();
    return newLog;
  }
}
