import { Link } from 'react-router-dom';
import { GraduationCap, PlayCircle, Star, Monitor, Group, ArrowRight, Shield, HeartHandshake } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground antialiased selection:bg-primary/20">
      {/* ─── 1. Hero Section ─── */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Hero Content */}
          <div className="flex flex-col gap-6 z-10">
            <div className="inline-flex items-center gap-2 bg-muted rounded-full px-3 py-1 w-max border border-border">
              <span className="bg-primary text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider">New</span>
              <span className="text-xs text-muted-foreground pr-2 font-medium">Winter 2026 Cohorts Now Open</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Learn Tech Through <span className="text-primary relative inline-block">Real Cohorts <span className="absolute left-0 bottom-1 h-2 w-full bg-primary/20 -z-10 rounded-full" /></span> & Accountability
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Master React, AI, and Cybersecurity in a structured, intense environment designed for actual skill acquisition, not just passive video watching.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/register" className={cn(buttonVariants({ size: 'lg' }))}>
                Apply Now
              </Link>
              <Link to="/courses" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), "flex items-center gap-2")}>
                <PlayCircle className="h-5 w-5" /> View Courses
              </Link>
            </div>
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-background object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=JD" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-background object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=AS" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-background object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=MJ" alt="User" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <span className="text-xs text-muted-foreground mt-0.5">4.9/5 from 50+ graduates</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative w-full aspect-square lg:aspect-auto lg:h-[500px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 rounded-full blur-[80px]" />
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full w-full relative">
              <div className="bg-muted/40 rounded-2xl border border-border overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="h-16 w-16 text-primary/40" />
                </div>
              </div>
              <div className="bg-primary/50 text-white rounded-2xl border border-border p-6 flex flex-col justify-between">
                <Monitor className="h-8 w-8" />
                <div>
                  <h3 className="text-xl font-bold">94% Placement</h3>
                  <p className="text-sm opacity-80">Within 6 months</p>
                </div>
              </div>
              <div className="bg-card rounded-2xl border border-border p-6 flex flex-col justify-between">
                <Group className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-xl font-bold">Small Group</h3>
                  <p className="text-sm text-muted-foreground">Max 15 per cohort</p>
                </div>
              </div>
              <div className="bg-muted/40 rounded-2xl border border-border overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle className="h-16 w-16 text-primary/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Courses ─── */}
      <section className="py-24 px-6 border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">Featured Courses</h2>
            <p className="text-muted-foreground">Master high-demand skills in our upcoming cohorts.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* React */}
            <div className="bg-card rounded-2xl border border-border p-6 flex flex-col hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                <span className="text-sm font-bold">React</span>
              </div>
              <h3 className="text-xl font-bold mb-2">React Mastery</h3>
              <p className="text-muted-foreground text-sm flex-grow mb-6">From fundamentals to advanced state management and performance optimization.</p>
              <Link to="/courses" className="text-primary hover:underline text-sm font-semibold flex items-center gap-1">
                View Syllabus <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {/* Backend */}
            <div className="bg-card rounded-2xl border border-border p-6 flex flex-col hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4">
                <span className="text-sm font-bold">Node</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Backend Engineering</h3>
              <p className="text-muted-foreground text-sm flex-grow mb-6">Build scalable APIs, work with databases, and understand system architecture.</p>
              <Link to="/courses" className="text-primary hover:underline text-sm font-semibold flex items-center gap-1">
                View Syllabus <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {/* Cybersecurity */}
            <div className="bg-card rounded-2xl border border-border p-6 flex flex-col hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center mb-4">
                <span className="text-sm font-bold">Cyber</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Cybersecurity</h3>
              <p className="text-muted-foreground text-sm flex-grow mb-6">Learn ethical hacking, network defense, and security protocols.</p>
              <Link to="/courses" className="text-primary hover:underline text-sm font-semibold flex items-center gap-1">
                View Syllabus <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── The NYDEV Advantage ─── */}
      <section className="py-24 px-6 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">The NYDEV Advantage</h2>
            <p className="text-muted-foreground">We abandoned the passive video model. Our system is built on accountability, peer pressure, and relentless practice.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted p-8 rounded-2xl border border-border flex gap-4">
              <Group className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Cohort-based learning</h3>
                <p className="text-muted-foreground text-sm">You start together, learn together, and graduate together. Built-in accountability means you actually finish what you start.</p>
              </div>
            </div>
            <div className="bg-muted p-8 rounded-2xl border border-border flex gap-4">
              <HeartHandshake className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Real mentorship</h3>
                <p className="text-muted-foreground text-sm">Weekly 1-on-1s with senior engineers from top tech companies to support your growth.</p>
              </div>
            </div>
            <div className="bg-muted p-8 rounded-2xl border border-border flex gap-4">
              <Group className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Team accountability</h3>
                <p className="text-muted-foreground text-sm">Work in small squads. Your success depends on your team, and theirs depends on you.</p>
              </div>
            </div>
            <div className="bg-muted p-8 rounded-2xl border border-border flex gap-4">
              <Shield className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Project-based learning</h3>
                <p className="text-muted-foreground text-sm">Build production-ready applications, not just toy examples. Build a real portfolio.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-24 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto text-center bg-card p-12 rounded-3xl border border-border relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Ready to commit to your growth?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Applications for our cohort close soon. Secure your spot and start building your future.</p>
          <Link to="/register" className={cn(buttonVariants({ size: 'lg' }))}>
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
}
