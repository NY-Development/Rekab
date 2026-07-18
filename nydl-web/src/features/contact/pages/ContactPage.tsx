import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, HelpCircle, Phone, Clock, ArrowRight } from 'lucide-react';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '@/components/common/SupportContactModal';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interest: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    toast.success("Thanks! Your message has been sent — we'll get back to you shortly.");
    setFormData({ firstName: '', lastName: '', email: '', interest: '', message: '' });
  };

  const inputClass =
    'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-muted-foreground';

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Form */}
        <div className="lg:col-span-7">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Get in touch</h1>
            <p className="text-muted-foreground">
              We'd love to hear from you. Fill out the form below or reach us directly.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className={labelClass} htmlFor="first-name">First name</label>
                  <input
                    className={inputClass}
                    id="first-name"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass} htmlFor="last-name">Last name</label>
                  <input
                    className={inputClass}
                    id="last-name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass} htmlFor="email">Email</label>
                <input
                  className={inputClass}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass} htmlFor="interest">What can we help you with?</label>
                <select
                  className={inputClass}
                  id="interest"
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  required
                >
                  <option value="" disabled>Select a topic</option>
                  <option value="courses">Course Information</option>
                  <option value="admissions">Registration & Enrollment</option>
                  <option value="billing">Payments</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelClass} htmlFor="message">Message</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  id="message"
                  placeholder="Leave us a message…"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Send message
              </button>
            </form>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-6 pt-6 lg:col-span-5 lg:pt-0">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-6">
            <h3 className="text-lg font-semibold text-foreground">Reach us directly</h3>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-start gap-3 group">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Email us</p>
                <p className="text-xs text-muted-foreground group-hover:text-primary">{SUPPORT_EMAIL}</p>
              </div>
            </a>
            <a href={`tel:${SUPPORT_PHONE}`} className="flex items-start gap-3 group">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Phone className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Call or text</p>
                <p className="text-xs text-muted-foreground group-hover:text-primary">{SUPPORT_PHONE}</p>
              </div>
            </a>
            <div className="flex items-start gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HelpCircle className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Help Center</p>
                <p className="mb-1 text-xs text-muted-foreground">Find answers to common questions.</p>
                <Link to="/help" className="flex items-center gap-1 text-xs text-primary hover:underline">
                  Visit Help Center <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Clock className="size-5 text-primary" />
              Availability
            </h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>We're an online-first program serving students across Ethiopia and beyond.</p>
              <p className="pt-2 font-semibold text-foreground">Support hours:</p>
              <p>Monday – Saturday, 9:00 AM – 7:00 PM (EAT)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
