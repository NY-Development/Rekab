interface LessonSeed {
  title: string;
  description?: string;
  content: string;
  lessonType?: 'VIDEO' | 'TEXT' | 'LIVE' | 'PRACTICE' | 'QUIZ';
  duration?: number;
  estimatedMinutes?: number;
  resources?: { title: string; url: string }[];
  learningObjectives?: string[];
  videoUrl?: string;
  notesMarkdown?: string;
  practiceActivities?: { title: string; description: string; completed?: boolean }[];
  externalLinks?: { title: string; url: string }[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  isMandatory?: boolean;
  isPublished?: boolean;
}

interface ModuleSeed {
  title: string;
  description: string;
  lessons: LessonSeed[];
}

export interface CourseSeed {
  title: string;
  slug: string;
  code: string;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Full-Stack' | 'Cybersecurity' | 'Networking' | 'Mobile';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  price: number;
  shortDescription: string;
  description: string;
  syllabusSummary: string;
  skills: string[];
  learningOutcomes: string[];
  prerequisites?: string[];
  modules: ModuleSeed[];
}

function withIds(modules: ModuleSeed[]) {
  return modules.map((m, mi) => ({
    id: `m${mi + 1}`,
    title: m.title,
    description: m.description,
    order: mi + 1,
    lessons: m.lessons.map((l, li) => ({
      id: `m${mi + 1}-l${li + 1}`,
      title: l.title,
      description: l.description || '',
      content: l.content,
      lessonType: l.lessonType || 'LIVE',
      duration: l.duration || 30,
      durationMinutes: l.duration || 30,
      order: li + 1,
      resources: l.resources || [],
      learningObjectives: l.learningObjectives || [],
      videoUrl: l.videoUrl || '',
      notesMarkdown: l.notesMarkdown || l.content,
      practiceActivities: l.practiceActivities || [],
      externalLinks: l.externalLinks || [],
      estimatedMinutes: l.estimatedMinutes || l.duration || 30,
      difficulty: l.difficulty || 'Intermediate',
      isMandatory: l.isMandatory !== false,
      isPublished: l.isPublished !== false,
    })),
  }));
}

// ─── 1. Web Development Foundations (Beginner) ───
const webDevFoundations: CourseSeed = {
  title: 'Web Development Foundations',
  slug: 'web-development-foundations',
  code: 'FE-BEG-101',
  category: 'Frontend',
  difficulty: 'Beginner',
  durationWeeks: 4,
  price: 2000,
  shortDescription: 'Learn the foundations of building websites with HTML, CSS, and JavaScript.',
  description:
    'This course takes an absolute beginner from zero to building and deploying real, responsive, multi-page websites with interactive features. Students progress through four tightly-scoped weeks — HTML5 structure, CSS3 styling and responsive layout (Flexbox & Grid), JavaScript fundamentals, and DOM/event-driven interactivity — culminating in a fully responsive final project deployed live on GitHub Pages.',
  syllabusSummary:
    'Four-week beginner web development track covering HTML5, CSS3, responsive design with Flexbox/Grid, JavaScript fundamentals, and DOM/event-driven interactivity, ending in a deployed capstone site.',
  skills: ['HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'JavaScript (ES6+)', 'DOM Manipulation', 'Git & GitHub Pages'],
  learningOutcomes: [
    'Structure semantic, accessible multi-page websites using HTML5.',
    'Style pages confidently with CSS3: box model, typography, color, positioning.',
    'Build responsive layouts using Flexbox, CSS Grid, and media queries (mobile-first).',
    'Apply core JavaScript fundamentals: variables, types, operators, control flow, functions, arrays, and objects.',
    'Select and manipulate the DOM to update page content dynamically.',
    'Attach and handle events to build interactive UI components.',
    'Use Git/GitHub and deploy a live website using GitHub Pages.',
  ],
  modules: [
    {
      title: 'Week 1: HTML5 Foundations & CSS3 Basics',
      description: 'Weekly goal: Students can hand-build a semantic, styled, multi-page static website.',
      lessons: [
        { title: 'Day 1: HTML5 Document Structure & Semantic Elements & Environment', content: 'Set up the dev environment and build your first HTML page using semantic HTML5 document structure and elements.' },
        { title: 'Day 2: CSS3 Basics — Selectors, Box Model, Typography', content: 'Selectors, the CSS box model, and typography. Practice: fully style a page from an external stylesheet using at least 3 selector types, an imported Google Font, and a consistent color palette (3-4 hex colors).' },
        { title: 'Day 3: Backgrounds, Borders, Positioning & Units', content: 'Backgrounds, borders, positioning, and CSS units. Practice: add a styled hero section with a background image and positioned heading/tagline.' },
        {
          title: 'Day 4: Multi-Page Navigation & Weekly Graded Project',
          content:
            'Graded Project: Build a 3-page static website (Home, About, Contact) fully linked, using semantic HTML5, styled with an external CSS3 stylesheet. Requirements: 3 pages sharing one stylesheet and consistent nav/footer; at least 5 semantic HTML5 tags; one styled hero/banner section; a consistent color palette (3-4 colors) and one imported font; organized folder structure (/css, /images). No responsiveness required yet.',
          resources: [
            { title: 'MDN - Getting Started with HTML', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics' },
            { title: 'MDN - The CSS Box Model', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model' },
          ],
        },
      ],
    },
    {
      title: 'Week 2: Responsive Design, Flexbox & CSS Grid',
      description: 'Weekly goal: Students can build a fully responsive landing page using Flexbox and Grid.',
      lessons: [
        { title: 'Day 1: Responsive Design Principles & Media Queries', content: 'Viewport meta tag and media queries. Practice: make your Week 1 project responsive at mobile widths.' },
        { title: 'Day 2: Flexbox Fundamentals', content: 'Flexbox fundamentals. Practice: build a horizontal Flexbox nav that stacks into a column below 600px.' },
        { title: 'Day 3: CSS Grid Fundamentals', content: 'CSS Grid fundamentals. Practice: build a responsive image/portfolio grid (min. 6 items) that reflows without a media query.' },
        {
          title: 'Day 4: Combining Flexbox + Grid & Weekly Graded Project',
          content:
            'Graded Project: Design and build a single-page responsive landing page that adapts cleanly across mobile, tablet, and desktop. Requirements: mobile-first CSS with 2+ media query breakpoints; at least one Grid section and one Flexbox section; a responsive nav bar; responsive images; hero, features/services, gallery/testimonial, and footer sections.',
          resources: [
            { title: 'CSS-Tricks - A Complete Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
            { title: 'MDN - CSS Grid Layout', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout' },
          ],
        },
      ],
    },
    {
      title: 'Week 3: JavaScript Fundamentals',
      description: 'Weekly goal: Students can write JavaScript programs using variables, logic, functions, arrays, and objects.',
      lessons: [
        { title: 'Day 1: JavaScript Basics — Variables, Data Types, Operators', content: 'Variables, data types, and operators. Practice: build a "tip calculator" logic script.' },
        { title: 'Day 2: Control Flow — Conditionals & Loops', content: 'Conditionals and loops. Practice: simulate a login check using conditionals.' },
        { title: 'Day 3: Functions, Scope & Arrays', content: 'Functions, scope, and arrays. Practice: build a "shopping list" script with push/pop and a formatted loop.' },
        {
          title: 'Day 4: Objects, ES6 Features & Weekly Graded Project',
          content:
            'Graded Project: Build a JavaScript program (demonstrated via console.log) modeling a small real-world tool (quiz engine, budget tracker, or grade calculator). Requirements: an array of objects representing real data; at least 3 custom functions with parameters/return values; at least one loop over the array; at least one conditional decision; clean console output.',
          resources: [
            { title: 'javascript.info - Variables', url: 'https://javascript.info/variables' },
            { title: 'javascript.info - Objects', url: 'https://javascript.info/object' },
          ],
        },
      ],
    },
    {
      title: 'Week 4: DOM Manipulation, Events & Final Project',
      description: 'Weekly goal: Students connect JavaScript to the page, handle user interaction, build a small interactive app, and deploy a finished site.',
      lessons: [
        { title: 'Day 1: The DOM & Selecting/Manipulating Elements', content: 'Selecting and manipulating DOM elements. Practice: dynamically insert today\'s date and toggle a highlight class.' },
        { title: 'Day 2: Events & Event Listeners', content: 'Events and event listeners. Practice: build an image slider, accordion, or live search filter.' },
        { title: 'Day 3: Building an Interactive Project (To-Do List Lab)', content: 'Build a fully working To-Do app: add, complete/toggle, and delete, with basic CSS styling.' },
        {
          title: 'Day 4: Git, GitHub Pages Deployment & Final Project Work Session',
          content:
            'Final Project: Synthesize all 4 weeks into one polished, deployed, multi-page, responsive website with at least one meaningful JavaScript-powered interactive feature. Requirements: minimum 3 linked pages; consistent header/nav/footer; mobile-first with 2+ breakpoints; a Flexbox component and a Grid layout section; a consistent design system; a genuinely interactive DOM feature; 2+ custom functions; no console errors; public GitHub repo with clean commit history; live on GitHub Pages; a README.md.',
          resources: [
            { title: 'javascript.info - Introduction to Events', url: 'https://javascript.info/introduction-browser-events' },
            { title: 'GitHub Docs - Creating a GitHub Pages Site', url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site' },
          ],
        },
      ],
    },
  ],
};

// ─── 2. Intermediate Frontend Developer ───
const intermediateFrontend: CourseSeed = {
  title: 'Intermediate Frontend Developer',
  slug: 'intermediate-frontend-developer',
  code: 'FE-INT-201',
  category: 'Frontend',
  difficulty: 'Intermediate',
  durationWeeks: 8,
  price: 3000,
  shortDescription: 'Build dynamic user interfaces with modern React, Vite, and Tailwind CSS.',
  description:
    'This course takes a beginner-level web developer and builds them into a confident intermediate frontend developer. Students move from advanced CSS and utility-first styling with Tailwind CSS, through modern asynchronous JavaScript, into a deep, hooks-first React curriculum built entirely on Vite — covering component architecture, routing, forms, state management, API integration, testing, performance, and deployment. Week 8 has no new lectures — it is a dedicated review, code-review, and capstone build week ending in a live Demo Day.',
  syllabusSummary:
    'Eight-week intermediate track: Tailwind CSS, modern async JavaScript, React + Vite fundamentals, hooks & architecture, routing & forms, state management & API integration, testing/performance/deployment, and a capstone demo week.',
  skills: ['Tailwind CSS', 'Modern JavaScript (ES6+)', 'React', 'Vite', 'React Router', 'React Hooks', 'useReducer/useContext', 'Vitest', 'React Testing Library'],
  prerequisites: ['Completion of a beginner web development course (HTML5, CSS3, JavaScript fundamentals) or equivalent experience'],
  learningOutcomes: [
    'Style production-quality, fully responsive interfaces using Tailwind CSS and modern CSS features.',
    'Write modern, modular JavaScript (ES6+) and consume real APIs using Promises and async/await.',
    'Scaffold and structure React applications using Vite.',
    'Build component-based UIs with props, state, and composition.',
    'Use React hooks (useState, useEffect, useRef, useContext, useReducer) and write custom hooks.',
    'Implement multi-page navigation with React Router, including dynamic and nested routes.',
    'Build and validate controlled forms.',
    'Manage global application state and integrate CRUD operations against a REST API.',
    'Apply basic performance optimization and write simple automated component tests.',
    'Build and deploy a production React application to a live hosting platform.',
  ],
  modules: [
    {
      title: 'Week 1: Advanced CSS & Tailwind CSS Foundations',
      description: 'Weekly goal: Students can build fully responsive, utility-first styled pages using Tailwind CSS on top of solid modern CSS fundamentals.',
      lessons: [
        { title: 'Day 1: Modern CSS Refresher — Custom Properties, Advanced Selectors, Cascade Layers', content: 'CSS custom properties, :is/:where/:has, and cascade layers. Homework: convert repeated hex/spacing values into custom properties.' },
        { title: 'Day 2: Tailwind CSS Setup with Vite & Utility-First Fundamentals', content: 'Install Tailwind in a Vite project and rebuild a page using only utility classes.' },
        { title: 'Day 3: Tailwind Responsive Design, Dark Mode & Theme Customization', content: 'Responsive variants, dark mode, and tailwind.config theme customization.' },
        {
          title: 'Day 4: Component-Driven Styling Patterns & Weekly Graded Project',
          content:
            'Graded Project: Build a fully responsive marketing/landing page (3+ sections) styled entirely with Tailwind CSS, including a working dark mode toggle. Requirements: Vite + Tailwind only; 3+ sections with a consistent design system; fully responsive; working dark/light toggle; clean semantic HTML5.',
          resources: [{ title: 'Tailwind CSS - Installation with Vite', url: 'https://tailwindcss.com/docs/guides/vite' }],
        },
      ],
    },
    {
      title: 'Week 2: Modern JavaScript (ES6+) & Asynchronous JavaScript',
      description: 'Weekly goal: Students can write modular, modern JavaScript and fetch and consume real API data asynchronously.',
      lessons: [
        { title: 'Day 1: ES6+ Deep Dive — Destructuring, Spread/Rest, Modules', content: 'Destructuring, spread/rest, and import/export modules.' },
        { title: 'Day 2: Array Methods & Functional Patterns', content: 'map, filter, reduce, find, sort applied to real data sets.' },
        { title: 'Day 3: Asynchronous JavaScript — Callbacks, Promises, async/await', content: 'Rewrite callback-based code using Promises, then async/await.' },
        {
          title: 'Day 4: Fetch API & Working with JSON + Weekly Graded Project',
          content:
            'Graded Project: Build a vanilla JS app that fetches data from a public API and lets the user search, filter, and paginate results. Requirements: Fetch with async/await and proper error/loading states; 3+ array methods; ES6 modules across 2+ files; a search/filter input; simple pagination or "load more".',
          resources: [{ title: 'MDN - Using Fetch', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch' }],
        },
      ],
    },
    {
      title: 'Week 3: React Fundamentals with Vite',
      description: 'Weekly goal: Students can scaffold a React application with Vite and build component-based UIs with props and state.',
      lessons: [
        { title: 'Day 1: Introduction to React & Vite — Why React, Project Setup, JSX', content: 'Scaffold a Vite + React project and build presentational components.' },
        { title: 'Day 2: Components, Props & Composition', content: 'Build a reusable Card component that accepts props and reuse it with different data.' },
        { title: 'Day 3: State with useState & Event Handling', content: 'Build a click counter and a show/hide toggle with useState.' },
        {
          title: 'Day 4: Conditional Rendering, Lists & Keys + Weekly Graded Project',
          content:
            'Graded Project: Rebuild the Week 2 vanilla JS API app as a React (Vite) app using components, props, and state. Requirements: 4+ single-responsibility components; correct prop passing and one lifted-state callback; useState for search/pagination; conditional rendering for loading/empty/error; stable unique keys.',
          resources: [{ title: 'React Docs - Quick Start', url: 'https://react.dev/learn' }],
        },
      ],
    },
    {
      title: 'Week 4: React Hooks & Component Architecture',
      description: 'Weekly goal: Students can manage side effects, share logic across components, and structure a React application cleanly.',
      lessons: [
        { title: 'Day 1: useEffect — Data Fetching, Side Effects & Cleanup', content: 'Convert manual fetch-on-click to useEffect fetch-on-mount, with cleanup.' },
        { title: 'Day 2: Custom Hooks & Lifting State Up', content: 'Extract a data-fetching pattern into a custom useFetch hook and reuse it.' },
        { title: 'Day 3: useRef & useContext for Simple Global State', content: 'Share a light/dark theme via useContext across nested components.' },
        {
          title: 'Day 4: Component Architecture & Folder Structure + Weekly Graded Project',
          content:
            'Graded Project: Build a multi-component dashboard app using useEffect, a custom hook, and useContext. Requirements: a custom hook encapsulating reusable logic; useContext for shared state; useEffect with cleanup/cancellation; organized folder structure; no more than 2 levels of prop drilling.',
          resources: [{ title: 'React Docs - Reusing Logic with Custom Hooks', url: 'https://react.dev/learn/reusing-logic-with-custom-hooks' }],
        },
      ],
    },
    {
      title: 'Week 5: Routing, Forms & Styling in React',
      description: 'Weekly goal: Students can build multi-page React applications with client-side routing and robust, validated forms.',
      lessons: [
        { title: 'Day 1: React Router — Routes, Navigation & URL Params', content: 'Add React Router with 3+ routes and a working nav bar.' },
        { title: 'Day 2: Nested Routes, Layouts & 404 Handling', content: 'Build a dynamic route (/products/:id) reading URL params.' },
        { title: 'Day 3: Forms in React — Controlled Components & Validation', content: 'Build a controlled multi-field form with inline validation.' },
        {
          title: 'Day 4: Styling in React with Tailwind (clsx) + Weekly Graded Project',
          content:
            'Graded Project: Build a multi-page React app (e.g. mini e-commerce, recipe app, job board) with routing and a working form. Requirements: 4+ routes including one dynamic route; shared layout via nested routes/Outlet; a controlled validated form; fully Tailwind-styled and responsive; a custom 404 route.',
          resources: [{ title: 'React Router - Tutorial', url: 'https://reactrouter.com/en/main/start/tutorial' }],
        },
      ],
    },
    {
      title: 'Week 6: State Management & API Integration',
      description: 'Weekly goal: Students can manage complex application state and build a CRUD-style app against a real or mock API.',
      lessons: [
        { title: 'Day 1: useReducer for Complex State Logic', content: 'Refactor a useState-heavy to-do list to use useReducer.' },
        { title: 'Day 2: Global State Patterns — Context + useReducer', content: 'Combine useReducer + useContext into a small global store (cart/favorites).' },
        { title: 'Day 3: REST API Integration — Loading/Error States & Custom Data Hooks', content: 'Build a custom useApi hook handling loading, error, and data states.' },
        {
          title: 'Day 4: Authentication Basics & Protected Routes + Weekly Graded Project',
          content:
            'Graded Project: Build a CRUD-style React app (task manager, notes app, or contact manager) against a mock/public API, with a mock auth gate. Requirements: full CRUD against an API; global state via Context + useReducer; graceful loading/error handling; a mock login gate protecting at least one route; API calls isolated in a service/hooks layer.',
          resources: [{ title: 'JSONPlaceholder - Free Fake API', url: 'https://jsonplaceholder.typicode.com/' }],
        },
      ],
    },
    {
      title: 'Week 7: Performance, Testing Basics & Deployment',
      description: 'Weekly goal: Students can optimize a React app, write basic automated tests, and deploy a production build live.',
      lessons: [
        { title: 'Day 1: Performance — React.memo, useMemo, useCallback', content: 'Use the DevTools Profiler to find and fix an unnecessary re-render.' },
        { title: 'Day 2: Code-Splitting & Lazy Loading with React.lazy/Suspense', content: 'Add React.lazy + Suspense to code-split one route.' },
        { title: 'Day 3: Testing Basics — Vitest & React Testing Library', content: 'Write 2-3 simple component tests with Vitest and RTL.' },
        {
          title: 'Day 4: Build & Deploy — Vite Build, Environment Variables & Hosting + Weekly Graded Project',
          content:
            'Graded Project: Take the Week 6 CRUD app, optimize it, add 2+ automated tests, and deploy it live. Requirements: a justified performance optimization; 2+ passing component tests; environment variables for config; live deployment on Vercel/Netlify/GitHub Pages; updated README with setup, features, and live link.',
          resources: [{ title: 'Vitest - Getting Started', url: 'https://vitest.dev/guide/' }],
        },
      ],
    },
    {
      title: 'Week 8: Review, Capstone Build & Demo Day',
      description: 'Weekly goal: Consolidate all 7 weeks of material, complete and polish the final capstone project, and present it in a live demo. No new lecture content — 4 structured working days.',
      lessons: [
        { title: 'Day 1: Cumulative Review & Project Proposal Check-in', content: 'Instructor-led review of common bugs/misconceptions from Weeks 1-7; open Q&A; confirm capstone scope with the instructor.' },
        { title: 'Day 2: Final Project Build Day', content: 'Dedicated build time with 1:1 instructor pairing and live code review on request.' },
        { title: 'Day 3: Peer Code Review & Polish', content: 'Review a classmate\'s repository against the Final Evaluation Rubric; final bug fixes, responsive QA, and a basic accessibility pass.' },
        {
          title: 'Day 4: Demo Day',
          content:
            'Final Project (Capstone): combine Tailwind, modern JS, React hooks, routing, state management, API integration, testing, and deployment into one polished, deployed application. Requirements: React + Vite + Tailwind, fully responsive; 4+ routes with a dynamic route and custom 404; a controlled validated form; Context + useReducer global state; CRUD API integration; a custom hook; a performance optimization; 2+ passing tests; live deployment; public GitHub repo with a complete README. Each student presents a 5-10 minute live demo, followed by instructor feedback and final grading.',
        },
      ],
    },
  ],
};

// ─── 3. Advanced Frontend Development ───
const advancedFrontend: CourseSeed = {
  title: 'Advanced Frontend Development',
  slug: 'advanced-frontend-development',
  code: 'FE-ADV-301',
  category: 'Frontend',
  difficulty: 'Advanced',
  durationWeeks: 8,
  price: 4000,
  shortDescription: 'Master TypeScript, advanced React patterns, state management at scale, testing, and production deployment.',
  description:
    'An advanced track for developers who already know React, Vite, Tailwind CSS, hooks, routing, and basic state management. Students learn to type entire applications with TypeScript, apply advanced component and performance patterns, architect server vs. client state, master Vite tooling, build layered test suites with CI/CD, design accessible design systems, and harden applications for production with authentication and monitoring — culminating in a capstone week and live demo.',
  syllabusSummary:
    'Eight-week advanced React track: TypeScript for React, advanced patterns & performance, state management at scale, advanced Vite tooling, testing & CI/CD, design systems & accessibility, auth & production hardening, and a capstone week.',
  skills: ['TypeScript', 'Advanced React Patterns', 'TanStack Query', 'Zustand', 'Vite Configuration', 'Vitest', 'Playwright', 'GitHub Actions', 'Storybook', 'Framer Motion', 'JWT/OAuth', 'Sentry'],
  prerequisites: ['Completion of an Intermediate Frontend Developer course (React + Vite, Tailwind CSS, hooks, routing, basic state management) or equivalent experience'],
  learningOutcomes: [
    'Confidently type a React + Vite application with TypeScript.',
    'Apply advanced component patterns and diagnose/fix performance issues.',
    'Architect state management for server vs. client state using TanStack Query and Zustand.',
    'Master Vite configuration and production build optimization.',
    'Build a layered automated test suite and automate deployment with CI/CD.',
    'Build reusable, accessible, and animated design-system components.',
    'Implement secure authentication flows and production-grade monitoring.',
  ],
  modules: [
    {
      title: 'Week 1: TypeScript for React Developers',
      description: 'Goal: Students can confidently type a React + Vite application with TypeScript.',
      lessons: [
        { title: 'TypeScript Fundamentals — Types, Interfaces, Generics', content: 'Core TypeScript type system: primitives, interfaces, unions, and generics.' },
        { title: 'Typing React Components — Props & Children', content: 'Type component props, children, and default props patterns.' },
        { title: 'Typing Hooks & Events', content: 'Type useState/useReducer/useRef and DOM event handlers correctly.' },
        { title: 'Migrating JS to TypeScript', content: 'Incrementally migrate an existing JavaScript React project to TypeScript.' },
      ],
    },
    {
      title: 'Week 2: Advanced React Patterns & Performance',
      description: 'Goal: Apply advanced component patterns and diagnose/fix performance issues.',
      lessons: [
        { title: 'Compound Components, Render Props, HOCs', content: 'Compare compound components, render props, and higher-order components.' },
        { title: 'Advanced Hooks — useMemo, useCallback, useImperativeHandle', content: 'Memoization hooks and imperative component APIs.' },
        { title: 'Performance Profiling', content: 'Use the React DevTools Profiler to identify and fix unnecessary re-renders.' },
        { title: 'Error Boundaries & Suspense', content: 'Build error boundaries and use Suspense for data/code loading states.' },
      ],
    },
    {
      title: 'Week 3: State Management at Scale',
      description: 'Goal: Architect state management for server vs. client state.',
      lessons: [
        { title: 'Server State with TanStack Query — Caching, Mutations', content: 'Configure TanStack Query for caching, invalidation, and mutations.' },
        { title: 'Client State with Zustand', content: 'Model UI/client-only state with a lightweight Zustand store.' },
        { title: 'Combining Server & Client State', content: 'Establish clear boundaries between server state (TanStack Query) and client state (Zustand).' },
        { title: 'Optimistic Updates', content: 'Implement optimistic updates and rollback on mutation failure.' },
      ],
    },
    {
      title: 'Week 4: Advanced Build & Tooling (Vite)',
      description: 'Goal: Master Vite configuration and production optimization.',
      lessons: [
        { title: 'Vite Configuration & Custom Plugins', content: 'Configure Vite and write a simple custom plugin.' },
        { title: 'Chunk Splitting & Lazy Loading', content: 'Manually control chunk splitting for optimal bundle sizes.' },
        { title: 'Asset Optimization', content: 'Optimize images, fonts, and static assets in a Vite build.' },
        { title: 'Advanced Environment Configuration', content: 'Multi-environment configuration (dev/staging/prod) with Vite env files.' },
      ],
    },
    {
      title: 'Week 5: Testing & CI/CD',
      description: 'Goal: Build a layered test suite and automate deployment.',
      lessons: [
        { title: 'Unit Testing (Vitest)', content: 'Write focused unit tests for utility functions and hooks.' },
        { title: 'Integration Testing (React Testing Library)', content: 'Test component behavior from the user\'s perspective.' },
        { title: 'E2E Testing (Playwright)', content: 'Write an end-to-end test covering a critical user flow.' },
        { title: 'CI/CD (GitHub Actions)', content: 'Automate test runs and deployment with a GitHub Actions workflow.' },
      ],
    },
    {
      title: 'Week 6: Design Systems & Accessibility',
      description: 'Goal: Build reusable, accessible, and animated components.',
      lessons: [
        { title: 'Design Systems (Storybook)', content: 'Document and develop components in isolation with Storybook.' },
        { title: 'Accessibility (a11y) Standards', content: 'Apply WCAG basics: semantic markup, focus management, ARIA where needed.' },
        { title: 'Animations (Framer Motion)', content: 'Add purposeful motion and transitions with Framer Motion.' },
        { title: 'Design Tokens & Dark Mode', content: 'Model a token-based theme system supporting dark mode.' },
      ],
    },
    {
      title: 'Week 7: Authentication & Production Hardening',
      description: 'Goal: Implement secure auth and production monitoring.',
      lessons: [
        { title: 'Auth Flows (JWT/OAuth), Protected Routes', content: 'Implement JWT-based auth flows and protected route guards.' },
        { title: 'Axios Interceptors', content: 'Use interceptors for auth headers, token refresh, and centralized error handling.' },
        { title: 'Error Tracking (Sentry)', content: 'Wire up Sentry for production error tracking.' },
        { title: 'Performance Monitoring (Web Vitals)', content: 'Measure and report Core Web Vitals in production.' },
      ],
    },
    {
      title: 'Week 8: Capstone Week',
      description: 'Goal: Consolidate learning and present the final capstone project. No new lecture content.',
      lessons: [
        { title: 'Cumulative Review & Office Hours', content: 'Instructor-led review across all 7 weeks; open office hours for capstone questions.' },
        { title: 'Final Project Build Day', content: 'Dedicated build time with 1:1 instructor pairing.' },
        { title: 'Peer Code Reviews', content: 'Structured peer review of capstone repositories against the course rubric.' },
        { title: 'Demo Day', content: 'Each student presents their capstone project live, followed by instructor feedback and final grading.' },
      ],
    },
  ],
};

// ─── 4. Backend Development Fundamentals with Node.js & Express.js ───
const backendFundamentals: CourseSeed = {
  title: 'Backend Development Fundamentals with Node.js & Express.js',
  slug: 'backend-development-fundamentals-nodejs',
  code: 'BE-BEG-101',
  category: 'Backend',
  difficulty: 'Beginner',
  durationWeeks: 4,
  price: 2000,
  shortDescription: 'Learn to build server-side applications from scratch with Node.js and Express.js.',
  description:
    'Modern applications rely on backend systems to process data, authenticate users, communicate with databases, and provide APIs for websites and mobile applications. This course introduces students to the fundamentals of backend development using Node.js and Express.js. Starting from how the web works, students will gradually learn server-side programming, REST APIs, routing, middleware, databases, authentication basics, and deployment fundamentals — learning by building a complete backend application throughout the program. No prior backend development experience is required.',
  syllabusSummary:
    'Thirteen-session beginner backend track: HTTP & client-server architecture, Node.js & npm, Express.js routing & REST APIs, middleware & error handling, database fundamentals & CRUD, project structure & environment variables, authentication basics, validation, testing, and deployment, ending in an independent final backend project.',
  skills: ['Node.js', 'Express.js', 'REST APIs', 'HTTP', 'MongoDB', 'CRUD Operations', 'Authentication Basics', 'API Testing (Postman/Bruno)', 'Git & GitHub'],
  prerequisites: ['Basic computer skills', 'Basic JavaScript knowledge (variables, functions, arrays, objects, loops, conditionals)'],
  learningOutcomes: [
    'Explain the role of backend development in modern web applications.',
    'Understand how clients, servers, and APIs communicate.',
    'Build web servers using Node.js and Express.js.',
    'Create RESTful APIs and handle HTTP requests and responses.',
    'Implement CRUD (Create, Read, Update, Delete) operations.',
    'Understand database fundamentals and integrate a database into an application.',
    'Implement basic authentication concepts.',
    'Organize backend projects using a clean folder structure.',
    'Test APIs using Postman or Bruno, and deploy a simple backend application.',
  ],
  modules: [
    {
      title: 'Module 1: Backend & JavaScript Foundations',
      description: 'Sessions 1-2: How the web works, client-server architecture, and running JavaScript with Node.js.',
      lessons: [
        { title: 'Session 1: Introduction to Backend Development', content: 'Understanding how websites work, client-server architecture, and the HTTP request flow.' },
        { title: 'Session 2: JavaScript for Backend & Node.js Fundamentals', content: 'Running JavaScript with Node.js, npm, modules, and package.json.' },
      ],
    },
    {
      title: 'Module 2: Express.js & REST APIs',
      description: 'Sessions 3-5: Your first web server, routing, REST APIs, and middleware.',
      lessons: [
        { title: 'Session 3: Introduction to Express.js', content: 'Build your first web server and create basic routes.' },
        { title: 'Session 4: HTTP, Routing & REST APIs', content: 'Build a simple REST API using GET, POST, PUT, and DELETE.' },
        { title: 'Session 5: Middleware & Error Handling', content: 'Create custom middleware, request logging, and centralized error handling.' },
      ],
    },
    {
      title: 'Module 3: Databases',
      description: 'Sessions 6-7: Database fundamentals and building APIs backed by a database.',
      lessons: [
        { title: 'Session 6: Database Essentials & Fundamentals', content: 'Data storage concepts, SQL vs NoSQL, database design basics, CRUD operations, connecting to a database.' },
        { title: 'Session 7: Building APIs with a Database', content: 'Store and retrieve data from the database using Express.' },
      ],
    },
    {
      title: 'Module 4: Project Structure, Auth & API Quality',
      description: 'Sessions 8-10: Organizing projects, authentication fundamentals, and validation.',
      lessons: [
        { title: 'Session 8: Project Structure & Environment Variables', content: 'Organize backend projects, configuration files, and environment variables.' },
        { title: 'Session 9: Authentication Fundamentals', content: 'Password hashing, user registration, login, and an introduction to JWT.' },
        { title: 'Session 10: Input Validation & API Best Practices', content: 'Validate requests, handle invalid input, and improve API quality.' },
      ],
    },
    {
      title: 'Module 5: Testing, Deployment & Final Project',
      description: 'Sessions 11-13: Testing APIs, deployment fundamentals, and the final project.',
      lessons: [
        { title: 'Session 11: Testing APIs & Introduction to Deployment', content: 'Test APIs using Postman/Bruno and deploy a simple backend application.' },
        {
          title: 'Session 12: Final Project Development',
          content:
            'Build a complete backend application with instructor guidance. Suggested projects: Student Management System, Library Management System, Task Manager API, Notes Application, Expense Tracker API, Movie Collection API, Book Store API. Must include: RESTful API design, CRUD operations, database integration, input validation, basic authentication, proper project structure, error handling.',
        },
        { title: 'Session 13: Final Project Presentation & Course Review', content: 'Present projects, receive feedback, and review key concepts.' },
      ],
    },
  ],
};

// ─── 5. Backend Development with NestJS ───
const backendNestJS: CourseSeed = {
  title: 'Backend Development with NestJS',
  slug: 'backend-development-with-nestjs',
  code: 'BE-INT-201',
  category: 'Backend',
  difficulty: 'Intermediate',
  durationWeeks: 4,
  price: 3000,
  shortDescription: 'Architect scalable, production-ready backend systems with NestJS, TypeScript, and Prisma.',
  description:
    'This course builds upon Backend Development Fundamentals with Node.js & Express.js and introduces students to professional backend development using NestJS. Students learn to design scalable, maintainable, production-ready backend applications using modern software engineering practices: modular architecture, dependency injection, database integration with Prisma ORM, authentication and authorization, validation, testing, API documentation, and deployment fundamentals — building a complete backend application following industry-standard architecture throughout.',
  syllabusSummary:
    'Thirteen-session intermediate backend track: NestJS architecture & DI, controllers/services/modules, Prisma + PostgreSQL, DTOs & validation, JWT auth, guards & RBAC, middleware/interceptors/filters, Swagger docs, testing with Jest, and a capstone project.',
  skills: ['TypeScript', 'NestJS', 'Dependency Injection', 'PostgreSQL', 'Prisma ORM', 'JWT Authentication', 'RBAC', 'Swagger', 'Jest', 'Docker Fundamentals'],
  prerequisites: ['Backend Development Fundamentals with Node.js & Express.js or equivalent knowledge', 'JavaScript & TypeScript fundamentals', 'REST APIs, HTTP methods, JSON, CRUD, database fundamentals', 'Git and GitHub'],
  learningOutcomes: [
    'Understand the architecture and philosophy of NestJS.',
    'Build modular backend applications using NestJS.',
    'Apply Dependency Injection and Separation of Concerns.',
    'Design scalable RESTful APIs and integrate PostgreSQL using Prisma ORM.',
    'Implement authentication and authorization with JWT and RBAC.',
    'Validate and transform incoming requests, and handle exceptions effectively.',
    'Write unit and integration tests, and document APIs using Swagger.',
    'Deploy a production-ready NestJS application using clean architecture principles.',
  ],
  modules: [
    {
      title: 'Module 1: NestJS Architecture Foundations',
      description: 'Sessions 1-3: Philosophy, controllers/services, and modules with dependency injection.',
      lessons: [
        { title: 'Session 1: Introduction to NestJS & Backend Architecture', content: 'NestJS philosophy, project structure, modules, controllers, providers, dependency injection — build your first NestJS application.' },
        { title: 'Session 2: Controllers, Routing & Services', content: 'Build REST endpoints using controllers and business logic with services; Separation of Concerns.' },
        { title: 'Session 3: Modules & Dependency Injection', content: 'Organize applications into reusable modules and inject services.' },
      ],
    },
    {
      title: 'Module 2: Data & Validation',
      description: 'Sessions 4-5: Prisma + PostgreSQL integration and request validation.',
      lessons: [
        { title: 'Session 4: Database Integration with Prisma & PostgreSQL', content: 'Configure Prisma, connect to PostgreSQL, create models, run migrations, perform CRUD operations.' },
        { title: 'Session 5: DTOs, Validation & Pipes', content: 'Validate incoming requests using DTOs, class-validator, and Validation Pipes.' },
      ],
    },
    {
      title: 'Module 3: Authentication & Authorization',
      description: 'Sessions 6-7: JWT auth and role-based access control.',
      lessons: [
        { title: 'Session 6: Authentication with JWT', content: 'Build registration and login endpoints, hash passwords, generate JWT access tokens, and protect routes.' },
        { title: 'Session 7: Authorization, Guards & Role-Based Access Control (RBAC)', content: 'Protect endpoints using Guards and implement role-based authorization.' },
      ],
    },
    {
      title: 'Module 4: Production Concerns',
      description: 'Sessions 8-9: Cross-cutting concerns and API documentation.',
      lessons: [
        { title: 'Session 8: Middleware, Interceptors, Filters & Exception Handling', content: 'Request logging, response transformation, centralized exception handling, application-wide middleware.' },
        { title: 'Session 9: API Documentation & Configuration', content: 'Generate interactive API docs with Swagger and manage configuration via environment variables.' },
      ],
    },
    {
      title: 'Module 5: Testing, Deployment & Capstone',
      description: 'Sessions 10-13: Automated testing, deployment prep, and the capstone project.',
      lessons: [
        { title: 'Session 10: Testing NestJS Applications', content: 'Write unit and integration tests using Jest, mock dependencies, test API endpoints.' },
        { title: 'Session 11: Project Structure, Best Practices & Deployment', content: 'Clean folder organization, SOLID principles overview, Docker basics, deployment preparation.' },
        {
          title: 'Session 12: Capstone Project Development',
          content:
            'Develop a complete production-style backend using all concepts learned. Suggested projects: School Management System, E-Commerce Backend API, Event Management System, Library Management System, Inventory Management System, Blog & Content Management API, Task & Team Collaboration API. Minimum requirements: modular NestJS architecture, RESTful API design, PostgreSQL + Prisma, CRUD, JWT auth, RBAC, request validation, error handling, environment configuration, Swagger docs, unit/integration tests.',
        },
        { title: 'Session 13: Final Project Presentation & Course Review', content: 'Demonstrate completed projects, participate in code reviews, review key backend engineering concepts.' },
      ],
    },
  ],
};

// ─── 6. Networking Foundations ───
const networkingFoundations: CourseSeed = {
  title: 'Networking Foundations',
  slug: 'networking-foundations',
  code: 'NET-BEG-101',
  category: 'Networking',
  difficulty: 'Beginner',
  durationWeeks: 4,
  price: 2000,
  shortDescription: 'Learn how data moves across networks — from fundamentals to a simulated network build.',
  description:
    'This course takes an absolute beginner from zero to confidently understanding, designing, and configuring small computer networks. Students progress through four tightly-scoped weeks — networking fundamentals and devices, IP addressing and subnetting, switching and routing basics, and core network services with hands-on Packet Tracer configuration — culminating in a fully documented final project: a small simulated network the student designs, builds, configures, and tests end to end.',
  syllabusSummary:
    'Four-week beginner networking track covering network fundamentals & devices, IP addressing & subnetting (including VLSM and IPv6), switching & routing fundamentals, and hands-on Packet Tracer configuration, ending in a simulated network capstone.',
  skills: ['Networking Fundamentals', 'OSI & TCP/IP Models', 'IPv4/IPv6 Addressing', 'Subnetting & VLSM', 'Switching & VLANs', 'Static Routing', 'Cisco Packet Tracer'],
  learningOutcomes: [
    'Explain core networking concepts and terminology, including network types, topologies, and the OSI/TCP-IP models.',
    'Identify common networking devices and media and describe their role in moving data across a network.',
    'Assign, calculate, and troubleshoot IPv4 addresses, subnet masks, and CIDR notation, including basic VLSM.',
    'Describe IPv6 addressing fundamentals and write addresses in compressed form.',
    'Explain switching concepts (MAC address tables, VLANs) and routing concepts (routing tables, static routes).',
    'Perform basic device configuration and verification in a simulated environment.',
    'Install and navigate Packet Tracer to build a topology and configure basic device settings.',
    'Design, build, configure, and document a small multi-subnet network from scratch.',
  ],
  modules: [
    {
      title: 'Week 1: Networking Fundamentals & Devices',
      description: 'Weekly goal: Students can describe how data moves across a network and identify the devices and media involved.',
      lessons: [
        { title: 'Day 1: Introduction to Networking, Network Types & Topologies', content: 'LAN, WAN, PAN; star, bus, mesh topologies. Practice: diagram a home/small-office network with 3+ device types.' },
        { title: 'Day 2: The OSI Model & TCP/IP Model', content: 'Map an application\'s data flow (e.g. loading a webpage) to the 7 OSI layers.' },
        { title: 'Day 3: Networking Devices & Media', content: 'Hubs, switches, routers, access points; copper, fiber, wireless. Practice: identify device roles and connector types.' },
        {
          title: 'Day 4: Introduction to IP Addressing & Weekly Graded Project',
          content:
            'Graded Project: Design a small-office network diagram for a given scenario (10 employees, one printer, one server, guest Wi-Fi). Requirements: 4+ device types correctly placed/labeled; topology justified in 2-3 sentences; one wired and one wireless segment; a legend; a 150-250 word explanation of how a laptop request reaches the internet referencing OSI/TCP-IP layers.',
          resources: [{ title: 'Cloudflare Learning - What Is the OSI Model?', url: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/' }],
        },
      ],
    },
    {
      title: 'Week 2: IP Addressing & Subnetting',
      description: 'Weekly goal: Students can subnet an IPv4 network confidently and describe IPv6 fundamentals.',
      lessons: [
        { title: 'Day 1: IPv4 Addressing Deep Dive', content: 'Classes, public vs. private, special/reserved addresses. Practice: classify 10 IP addresses.' },
        { title: 'Day 2: Subnetting Fundamentals — CIDR Notation & Subnet Masks', content: 'Convert IPs between decimal/binary; determine network/broadcast addresses.' },
        { title: 'Day 3: Subnetting Practice — Calculating Subnets, Hosts, VLSM Intro', content: 'Subnet a /24 network into 4 equal subnets with full addressing detail.' },
        {
          title: 'Day 4: IPv6 Fundamentals & Weekly Graded Project',
          content:
            'Graded Project: Given a 4-department company scenario with required host counts, subnet the assigned block using VLSM and produce a complete addressing table. Requirements: correct VLSM calculations for all 4 departments with minimal waste; a full addressing table; a 3-5 sentence explanation of why VLSM was used; one address in compressed IPv6 notation.',
          resources: [{ title: 'GeeksforGeeks - Subnetting in Computer Networks', url: 'https://www.geeksforgeeks.org/subnetting-in-computer-network/' }],
        },
      ],
    },
    {
      title: 'Week 3: Switching & Routing Fundamentals',
      description: 'Weekly goal: Students can explain and simulate basic switching and routing behavior and perform basic device configuration.',
      lessons: [
        { title: 'Day 1: Switching Concepts — MAC Address Tables, Frame Forwarding, VLANs', content: 'Trace how a switch builds and uses its MAC address table for a 4-PC scenario.' },
        { title: 'Day 2: Routing Concepts — Routing Tables, Static Routes, Default Gateway', content: 'Write the static routes each router needs in a 3-router topology.' },
        { title: 'Day 3: Basic Device Configuration — CLI Basics, Interfaces & Verification', content: 'Configure hostnames, IPs, and interface descriptions on 2 routers and 1 switch, verified with show commands.' },
        {
          title: 'Day 4: Weekly Graded Project — Build & Test a Simulated Network',
          content:
            'Graded Project: Using simulation software, build a network with 2 routers, 1 switch, and 4+ end devices across 2 VLANs/subnets, configure static routing, and verify full connectivity. Requirements: a consistent IP addressing plan; 2+ VLANs correctly assigned; static routes so all devices can reach each other; verification output (pings, MAC/routing tables); a 150-200 word design summary.',
          resources: [{ title: 'GeeksforGeeks - VLAN (Virtual LAN)', url: 'https://www.geeksforgeeks.org/introduction-of-vlan-virtual-lan/' }],
        },
      ],
    },
    {
      title: 'Week 4: Getting Hands-On with Packet Tracer',
      description: 'Weekly goal: Students install Packet Tracer, build a simple topology, and configure devices with basic IP addressing.',
      lessons: [
        { title: 'Day 1: Downloading, Installing & Exploring Packet Tracer', content: 'Install Packet Tracer and explore the device palette and workspace.' },
        { title: 'Day 2: Building a Simple Topology — PCs, a Switch & a Router', content: 'Recreate a 3-PC + switch + router topology, cabling every device correctly.' },
        { title: 'Day 3: Basic Device Configuration — Hostnames, IP Addresses & Verifying Connectivity', content: 'Assign hostnames/IPs to every device and verify full connectivity with ping.' },
        {
          title: 'Day 4: Final Project Work Session & Presentations',
          content:
            'Final Project: Build and configure a simple network tying together the design and addressing skills learned this month. Requirements: 1+ router, 1+ switch, 4+ end devices correctly cabled; correct addressing for 2+ subnets; a hostname and IP on every device; verified pings between 3+ device pairs; a 1-page write-up; a brief walkthrough/demo in Packet Tracer.',
          resources: [{ title: 'Packet Tracer - Official Download Page', url: 'https://www.netacad.com/courses/packet-tracer' }],
        },
      ],
    },
  ],
};

// ─── 7. Cybersecurity Professional Roadmap ───
const cybersecurityRoadmap: CourseSeed = {
  title: 'Cybersecurity Professional Roadmap',
  slug: 'cybersecurity-professional-roadmap',
  code: 'SEC-BEG-101',
  category: 'Cybersecurity',
  difficulty: 'Beginner',
  durationWeeks: 10,
  price: 2000,
  shortDescription: 'A complete ethical hacking and cybersecurity roadmap, from networking basics to industry certifications.',
  description:
    'A comprehensive, ground-up cybersecurity and ethical hacking roadmap. Students start with core networking, operating systems, and security fundamentals, then progress through programming for security tooling, scanning and exploitation, web application security, wireless and social engineering attacks, malware analysis, incident response, and penetration testing methodology — before covering cryptography, mobile and cloud security, IoT risk, legal/compliance frameworks, and the industry-standard tools and certifications that define a professional cybersecurity career path.',
  syllabusSummary:
    'A 21-topic ethical hacking and cybersecurity roadmap spanning networking, operating systems, security fundamentals, programming for security, scanning/exploitation, web application security, wireless and social engineering attacks, malware analysis, incident response, penetration testing, cryptography, mobile/cloud/IoT security, legal & compliance, industry tools, and certification pathways (CEH, OSCP, CISSP, Security+).',
  skills: ['Ethical Hacking', 'Networking (TCP/IP, OSI)', 'Linux & Windows CLI', 'Python & Bash Scripting', 'Nmap & Vulnerability Scanning', 'Metasploit', 'OWASP Top 10', 'Wireshark & Burp Suite', 'Digital Forensics', 'Cryptography'],
  learningOutcomes: [
    'Explain the definition, purpose, types of hackers, and legal/ethical considerations of ethical hacking.',
    'Apply core networking concepts (TCP/IP, OSI, subnetting, DNS, DHCP) to security analysis.',
    'Operate confidently across Linux, Windows, and macOS command lines.',
    'Explain core security controls: encryption, firewalls, antivirus, IDS/IPS.',
    'Write security tooling and scripts in Python, JavaScript, Bash, and SQL.',
    'Perform port scanning, service enumeration, and vulnerability scanning.',
    'Identify and safely demonstrate common exploits using tools like Metasploit.',
    'Assess web application security against the OWASP Top Ten (SQLi, XSS, etc.).',
    'Explain wireless security protocols and common wireless attacks.',
    'Recognize and explain phishing, spear phishing, and social engineering techniques.',
    'Explain sniffing/spoofing attacks (MITM, ARP spoofing, DNS spoofing).',
    'Classify malware types and perform basic sandbox analysis.',
    'Describe the incident response process, digital forensics, and chain of custody.',
    'Explain penetration testing types, methodology, and reporting.',
    'Apply symmetric/asymmetric encryption, hashing, and digital signatures.',
    'Describe mobile, cloud, and IoT security risks and best practices.',
    'Explain relevant legal/compliance frameworks (CFAA, GDPR, HIPAA, PCI DSS).',
    'Use industry-standard tools: Nmap, Wireshark, Burp Suite, Snort, Nessus, Aircrack-ng.',
    'Map out a certification and career path (CEH, OSCP, CISSP, CompTIA Security+).',
  ],
  modules: [
    {
      title: '1. Introduction to Ethical Hacking',
      description: 'Definitions, purpose, types of hackers, and legal/ethical considerations.',
      lessons: [{ title: 'Foundations of Ethical Hacking', content: 'Definition and purpose of ethical hacking; types of hackers (white/grey/black hat); legal and ethical considerations for security professionals.' }],
    },
    {
      title: '2. Networking Basics',
      description: 'TCP/IP, OSI model, subnetting, DNS, and DHCP.',
      lessons: [{ title: 'Core Networking for Security', content: 'TCP/IP and the OSI model; subnetting fundamentals; DNS and DHCP — the networking foundation every security assessment relies on.' }],
    },
    {
      title: '3. Operating Systems',
      description: 'Linux, Windows, macOS, and command line basics.',
      lessons: [{ title: 'Operating Systems & the Command Line', content: 'Working across Linux, Windows, and macOS; essential command line skills for security work.' }],
    },
    {
      title: '4. Cybersecurity Fundamentals',
      description: 'Encryption, firewalls, antivirus, and IDS/IPS.',
      lessons: [{ title: 'Core Security Controls', content: 'Encryption basics; firewalls and antivirus; intrusion detection/prevention systems (IDS/IPS).' }],
    },
    {
      title: '5. Programming Languages',
      description: 'Python, JavaScript, Bash scripting, SQL, and C/C++/Java/Ruby.',
      lessons: [{ title: 'Scripting & Programming for Security', content: 'Python and Bash scripting for automation and tooling; JavaScript and SQL fundamentals; an overview of C/C++/Java/Ruby in security contexts.' }],
    },
    {
      title: '6. Scanning and Enumeration',
      description: 'Port scanning, service enumeration, and vulnerability scanning.',
      lessons: [{ title: 'Reconnaissance Techniques', content: 'Port scanning and service enumeration; vulnerability scanning to map an attack surface.' }],
    },
    {
      title: '7. Exploitation',
      description: 'Common vulnerabilities and exploits, Metasploit, and buffer overflows.',
      lessons: [{ title: 'Exploitation Fundamentals', content: 'Common vulnerabilities and exploits; the Metasploit Framework; buffer overflow fundamentals.' }],
    },
    {
      title: '8. Web Application Security',
      description: 'OWASP Top Ten, SQL Injection, and Cross-Site Scripting (XSS).',
      lessons: [{ title: 'Securing Web Applications', content: 'The OWASP Top Ten; SQL Injection; Cross-Site Scripting (XSS) — identification and mitigation.' }],
    },
    {
      title: '9. Wireless Network Hacking',
      description: 'Wi-Fi security, WEP/WPA/WPA2, and wireless attacks.',
      lessons: [{ title: 'Wireless Security', content: 'Wi-Fi security fundamentals; WEP, WPA, WPA2; common wireless attacks.' }],
    },
    {
      title: '10. Social Engineering',
      description: 'Phishing, spear phishing, and the Social Engineering Toolkit (SET).',
      lessons: [{ title: 'Human-Layer Attacks', content: 'Phishing and spear phishing techniques; the Social Engineering Toolkit (SET).' }],
    },
    {
      title: '11. Sniffing and Spoofing',
      description: 'Man-in-the-Middle attacks, ARP spoofing, and DNS spoofing.',
      lessons: [{ title: 'Interception Attacks', content: 'Man-in-the-Middle attacks; ARP spoofing; DNS spoofing.' }],
    },
    {
      title: '12. Malware Analysis',
      description: 'Types of malware, sandbox analysis, and detection techniques.',
      lessons: [{ title: 'Analyzing Malware', content: 'Types of malware; sandbox analysis; signature-based vs. behavior-based detection.' }],
    },
    {
      title: '13. Incident Response and Handling',
      description: 'Incident response process, digital forensics, and chain of custody.',
      lessons: [{ title: 'Responding to Incidents', content: 'The incident response process; digital forensics fundamentals; chain of custody requirements.' }],
    },
    {
      title: '14. Penetration Testing',
      description: 'Types of penetration testing, methodology, and reporting.',
      lessons: [{ title: 'Pentest Methodology', content: 'Types of penetration testing; standard methodology; professional reporting.' }],
    },
    {
      title: '15. Cryptography',
      description: 'Symmetric/asymmetric encryption, hashing algorithms, and digital signatures.',
      lessons: [{ title: 'Applied Cryptography', content: 'Symmetric and asymmetric encryption; hashing algorithms; digital signatures.' }],
    },
    {
      title: '16. Mobile Hacking',
      description: 'Android and iOS security, and mobile application security.',
      lessons: [{ title: 'Mobile Security', content: 'Android and iOS security models; mobile application security testing.' }],
    },
    {
      title: '17. Cloud Security',
      description: 'AWS, Azure, Google Cloud, and security best practices.',
      lessons: [{ title: 'Securing the Cloud', content: 'Security fundamentals across AWS, Azure, and Google Cloud; cloud security best practices.' }],
    },
    {
      title: '18. IoT Security',
      description: 'Internet of Things risks and securing IoT devices.',
      lessons: [{ title: 'Internet of Things Risk', content: 'IoT-specific risks; approaches to securing IoT devices.' }],
    },
    {
      title: '19. Legal and Compliance',
      description: 'CFAA, GDPR, HIPAA, and PCI DSS.',
      lessons: [{ title: 'Legal & Regulatory Frameworks', content: 'The Computer Fraud and Abuse Act (CFAA); GDPR, HIPAA, and PCI DSS compliance.' }],
    },
    {
      title: '20. Cybersecurity Tools',
      description: 'Nmap, Wireshark, Burp Suite, Snort, Nessus, and Aircrack-ng.',
      lessons: [{ title: 'Industry-Standard Tooling', content: 'Hands-on familiarity with Nmap, Wireshark, Burp Suite, Snort, Nessus, and Aircrack-ng.' }],
    },
    {
      title: '21. Career Path and Certifications',
      description: 'CEH, OSCP, CISSP, and CompTIA Security+.',
      lessons: [{ title: 'Building a Cybersecurity Career', content: 'Mapping a certification pathway: Certified Ethical Hacker (CEH), Offensive Security Certified Professional (OSCP), CISSP, and CompTIA Security+.' }],
    },
  ],
};

// ─── 8. Mobile App Development (React Native & Expo) — self-authored, no source outline provided ───
const mobileAppDevelopment: CourseSeed = {
  title: 'Mobile App Development (React Native & Expo)',
  slug: 'mobile-app-development-react-native-expo',
  code: 'MOB-INT-201',
  category: 'Mobile',
  difficulty: 'Intermediate',
  durationWeeks: 8,
  price: 3500,
  shortDescription: 'Build and publish cross-platform mobile apps with React Native, Expo, and native device APIs.',
  description:
    'This course takes a working React developer and builds them into a confident cross-platform mobile developer using React Native and Expo. Students move from project setup and core native components, through navigation, forms and state management, device APIs (camera, location, notifications), networking and local storage, animation and polish, and finish with testing, performance, and publishing a real app to app stores via EAS Build — culminating in a capstone week and live demo, mirroring the structure of the Intermediate Frontend Developer course.',
  syllabusSummary:
    'Eight-week intermediate mobile track: React Native & Expo fundamentals, navigation, forms & state management, device APIs, networking & storage, styling & animation, testing/performance/publishing, and a capstone demo week.',
  skills: ['React Native', 'Expo', 'React Navigation', 'Zustand', 'Expo Camera/Location/Notifications', 'Axios', 'AsyncStorage', 'React Native Reanimated', 'Jest', 'EAS Build'],
  prerequisites: ['Completion of an Intermediate Frontend Developer course (React fundamentals, hooks, state management) or equivalent experience'],
  learningOutcomes: [
    'Scaffold and run a React Native app using Expo across iOS, Android, and web.',
    'Build native-feeling UIs with core components, styling, and responsive layout.',
    'Implement multi-screen navigation with React Navigation, including tabs and stacks.',
    'Build controlled forms and manage app-wide state with Zustand.',
    'Access native device capabilities: camera, location, and push notifications.',
    'Fetch and cache remote data and persist local data with AsyncStorage.',
    'Add polished animations with React Native Reanimated.',
    'Write basic automated tests and profile app performance.',
    'Build and submit a production app using EAS Build.',
  ],
  modules: [
    {
      title: 'Week 1: React Native & Expo Fundamentals',
      description: 'Weekly goal: Students can scaffold an Expo app and build screens with core native components.',
      lessons: [
        { title: 'Day 1: Introduction to React Native & Expo — Project Setup', content: 'Why React Native, the Expo workflow, and running an app on a simulator/device with Expo Go.' },
        { title: 'Day 2: Core Components & Layout with Flexbox', content: 'View, Text, Image, ScrollView, and Flexbox-based layout in React Native.' },
        { title: 'Day 3: Styling — StyleSheet, Theming & Responsive Units', content: 'StyleSheet API, platform-specific styling, and responsive sizing across device sizes.' },
        {
          title: 'Day 4: Building a Multi-Screen Static App + Weekly Graded Project',
          content:
            'Graded Project: Build a 3-screen static app (e.g. a profile, list, and details screen) using only core components and Flexbox layout, styled consistently and tested on both iOS and Android simulators via Expo Go.',
        },
      ],
    },
    {
      title: 'Week 2: Navigation',
      description: 'Weekly goal: Students can build a multi-screen app with tab and stack navigation.',
      lessons: [
        { title: 'Day 1: React Navigation Setup — Stack Navigator', content: 'Install and configure React Navigation with a stack navigator and screen params.' },
        { title: 'Day 2: Tab & Drawer Navigation', content: 'Bottom tab navigation and an optional drawer for secondary navigation.' },
        { title: 'Day 3: Passing Data Between Screens & Deep Linking Basics', content: 'Route params, nested navigators, and basic deep linking.' },
        {
          title: 'Day 4: Weekly Graded Project — Navigable App Shell',
          content:
            'Graded Project: Build a tab + stack navigation shell (e.g. Home, Search, Profile tabs, each with its own stack) with at least one screen that receives and displays params passed from another screen.',
        },
      ],
    },
    {
      title: 'Week 3: Forms & State Management',
      description: 'Weekly goal: Students can build validated forms and manage global app state.',
      lessons: [
        { title: 'Day 1: Controlled Inputs & Forms in React Native', content: 'TextInput, controlled form state, and keyboard-aware layout.' },
        { title: 'Day 2: Form Validation Patterns', content: 'Client-side validation and inline error messaging for mobile forms.' },
        { title: 'Day 3: Global State with Zustand', content: 'Model shared app state (e.g. auth, cart, favorites) with a Zustand store.' },
        {
          title: 'Day 4: Weekly Graded Project — Login + Preferences Flow',
          content:
            'Graded Project: Build a mock login form with validation that, on success, stores a user object in a Zustand store and unlocks a preferences screen reading/writing that shared state.',
        },
      ],
    },
    {
      title: 'Week 4: Device APIs',
      description: 'Weekly goal: Students can access camera, location, and push notification APIs via Expo.',
      lessons: [
        { title: 'Day 1: Camera & Media Library (expo-camera, expo-image-picker)', content: 'Request permissions and capture/select photos from the camera or gallery.' },
        { title: 'Day 2: Location Services (expo-location)', content: 'Request location permissions and read the device\'s current position.' },
        { title: 'Day 3: Push Notifications (expo-notifications)', content: 'Request notification permissions and schedule/receive local push notifications.' },
        {
          title: 'Day 4: Weekly Graded Project — Device-Aware Feature',
          content:
            'Graded Project: Build a feature combining at least 2 device APIs (e.g. a check-in app that captures a photo and tags it with the current location, or a reminders app using local notifications), with graceful handling of denied permissions.',
        },
      ],
    },
    {
      title: 'Week 5: Networking & Local Storage',
      description: 'Weekly goal: Students can fetch remote data and persist data locally.',
      lessons: [
        { title: 'Day 1: Fetching Data with Axios — Loading & Error States', content: 'Axios setup, async/await data fetching, and loading/error UI states.' },
        { title: 'Day 2: AsyncStorage for Local Persistence', content: 'Persist and rehydrate simple app data (tokens, preferences, cached lists) with AsyncStorage.' },
        { title: 'Day 3: Pull-to-Refresh & Pagination Patterns', content: 'FlatList with pull-to-refresh and infinite-scroll pagination against a real or mock API.' },
        {
          title: 'Day 4: Weekly Graded Project — Data-Driven List App',
          content:
            'Graded Project: Build an app that fetches a paginated list from a public API (e.g. a movie or product browser), supports pull-to-refresh, and persists a "favorites" list locally with AsyncStorage.',
        },
      ],
    },
    {
      title: 'Week 6: Styling, Animation & UI Polish',
      description: 'Weekly goal: Students can add production-quality animations and polish to a mobile UI.',
      lessons: [
        { title: 'Day 1: Advanced Styling — Themes & Dark Mode', content: 'A token-based theme system supporting light/dark mode across the app.' },
        { title: 'Day 2: React Native Reanimated Fundamentals', content: 'Shared values, basic transitions, and gesture-driven animation with Reanimated.' },
        { title: 'Day 3: Micro-Interactions & Loading Skeletons', content: 'Button press feedback, animated loading skeletons, and transition polish.' },
        {
          title: 'Day 4: Weekly Graded Project — Polished UI Pass',
          content:
            'Graded Project: Take the Week 5 list app and add a dark mode toggle, at least one Reanimated-powered transition, and a loading skeleton state — with a short written note on the UX improvement each change made.',
        },
      ],
    },
    {
      title: 'Week 7: Testing, Performance & Publishing',
      description: 'Weekly goal: Students can test, profile, and publish a React Native app.',
      lessons: [
        { title: 'Day 1: Testing with Jest & React Native Testing Library', content: 'Write component and logic tests for a React Native screen.' },
        { title: 'Day 2: Performance — FlatList Optimization & Re-render Profiling', content: 'FlatList performance props and using the profiler to catch unnecessary re-renders.' },
        { title: 'Day 3: App Icons, Splash Screens & App Config', content: 'Configure app.json/app.config for icons, splash screens, and build metadata.' },
        {
          title: 'Day 4: Weekly Graded Project — Build & Submit with EAS',
          content:
            'Graded Project: Add 2+ automated tests to your capstone-in-progress app, apply one profiling-driven performance fix, and produce a working EAS preview build (internal distribution) with a working install link.',
        },
      ],
    },
    {
      title: 'Week 8: Review, Capstone Build & Demo Day',
      description: 'Weekly goal: Consolidate all 7 weeks of material, complete and polish the final capstone app, and present it in a live demo. No new lecture content.',
      lessons: [
        { title: 'Day 1: Cumulative Review & Capstone Proposal Check-in', content: 'Review of common bugs/misconceptions from Weeks 1-7; each student confirms their capstone app idea and scope.' },
        { title: 'Day 2: Final Project Build Day', content: 'Dedicated build time with 1:1 instructor pairing and live code review on request.' },
        { title: 'Day 3: Peer Code Review & Polish', content: 'Peer review against the final rubric; bug fixes and a basic accessibility pass (labels, contrast, touch target sizes).' },
        {
          title: 'Day 4: Demo Day',
          content:
            'Final Project (Capstone): combine navigation, forms & state, device APIs, networking & storage, animation, testing, and an EAS build into one polished mobile app. Requirements: multi-screen navigation (tabs + stack); a validated form; global state via Zustand; at least one device API; real or mock API integration with loading/error handling; local persistence; at least one Reanimated animation; 2+ passing tests; a working EAS build/install link; a README with setup, features, and screenshots. Each student presents a 5-10 minute live demo, followed by instructor feedback and final grading.',
        },
      ],
    },
  ],
};

export const COURSE_SEEDS: CourseSeed[] = [
  webDevFoundations,
  intermediateFrontend,
  advancedFrontend,
  backendFundamentals,
  backendNestJS,
  networkingFoundations,
  cybersecurityRoadmap,
  mobileAppDevelopment,
];

export { withIds };
