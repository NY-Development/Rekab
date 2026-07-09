import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast, Toaster } from 'sonner';
import { joinWaitlist } from '@/services/api';

const WaitlistPage: React.FC = () => {
  const [email, setEmail] = useState('');

  const mutation = useMutation({
    mutationFn: joinWaitlist,
    onSuccess: () => {
      toast.success('You are on the list! We will notify you when cohorts open.', {duration : 3000});
      setEmail('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to join. Please try again.', {duration : 3000});
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(email);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-['Inter'] relative overflow-hidden">
      <Toaster richColors position="top-right" />
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#DBE1FF] blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#FFDBCD] blur-[120px] opacity-30"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 max-w-md w-full bg-white/70 backdrop-blur-xl p-10 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center space-y-8">
        
        {/* Brand Header */}
        <div className="flex justify-center">
          <div className="bg-[#2563EB] text-white font-bold text-lg px-5 py-1.5 rounded-xl tracking-tight">NYDL</div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Join the Waitlist</h1>
          <p className="text-[#434655] text-base leading-relaxed">
            Secure your spot for the upcoming Summer cohort. Be the first to know when applications open.
          </p>
        </div>

        {/* Waitlist Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full px-5 py-4 rounded-xl border border-[#C3C6D7] bg-white/50 focus:bg-white focus:ring-2 focus:ring-[#2563EB] outline-none transition-all duration-200 text-[#0F172A]"
            required
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-[#2563EB]/20 hover:bg-[#1D4ED8] disabled:opacity-50 active:scale-[0.98] transition-all duration-200"
          >
            {mutation.isPending ? 'Processing...' : 'Get Early Access'}
          </button>
        </form>
        
        <p className="text-xs text-[#94A3B8]">No spam, just important cohort updates.</p>
      </div>
    </div>
  );
};

export default WaitlistPage;