import React, { useState } from 'react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interest: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    toast.success('Your message has been sent successfully!');
    setFormData({ firstName: '', lastName: '', email: '', interest: '', message: '' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Get in touch</h1>
            <p className="text-slate-600">We'd love to hear from you. Please fill out this form or shoot us an email.</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block" htmlFor="first-name">First name</label>
                  <input
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                    id="first-name"
                    placeholder="Jane"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block" htmlFor="last-name">Last name</label>
                  <input
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                    id="last-name"
                    placeholder="Doe"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block" htmlFor="email">Email</label>
                <input
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block" htmlFor="interest">What can we help you with?</label>
                <select
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  id="interest"
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  required
                >
                  <option value="" disabled>Select a topic</option>
                  <option value="courses">Course Information</option>
                  <option value="admissions">Admissions & Applications</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block" htmlFor="message">Message</label>
                <textarea
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors resize-none"
                  id="message"
                  placeholder="Leave us a message..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <button className="w-full bg-blue-650 hover:bg-blue-700 text-white rounded-md py-2 px-3 font-semibold text-sm transition-colors shadow-sm" type="submit">
                Send message
              </button>
            </form>
          </div>
        </div>

        {/* Support & Office Contact Info */}
        <div className="lg:col-span-5 space-y-6 pt-6 lg:pt-0">
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-slate-900">Support</h3>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 bg-blue-100 p-1.5 rounded-full text-base">mail</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Email Us</p>
                <a className="text-xs text-slate-500 hover:text-blue-600 transition-colors" href="mailto:support@nydl.edu">support@nydl.edu</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 bg-blue-100 p-1.5 rounded-full text-base">help_center</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Help Center</p>
                <p className="text-xs text-slate-500 mb-1">Find answers to common questions.</p>
                <a className="text-xs text-blue-600 hover:underline flex items-center gap-1" href="#/help">Visit Help Center <span className="material-symbols-outlined text-[14px]">arrow_forward</span></a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-slate-500">location_on</span>
                NYDL Headquarters
              </h3>
              <address className="text-xs text-slate-550 not-italic space-y-1">
                <p>123 Learning Avenue, Suite 400</p>
                <p>New York, NY 10012</p>
                <p className="pt-2 font-semibold">Office Hours:</p>
                <p>Mon-Fri, 9:00 AM - 6:00 PM EST (UTC-5)</p>
              </address>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
