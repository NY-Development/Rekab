import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';

const WaitlistPage: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(`Success! ${email} has been added to the waitlist.`);
      setEmail('');
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#dbe1ff] blur-[120px] opacity-50"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#ffdbcd] blur-[120px] opacity-40"></div>
      </div>

      <Toaster richColors position="top-right" />
      
      {/* Main Card */}
      <div className="relative z-10 max-w-md w-full bg-white/70 backdrop-blur-xl p-10 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center space-y-8">
        
        {/* Brand Logo */}
        <div className="flex justify-center">
          <div className="bg-[#2563eb] text-white font-bold text-xl px-4 py-1.5 rounded-xl">NYDL</div>
        </div>
        
        {/* Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-[#191b23] tracking-tight">Join the Waitlist</h1>
          <p className="text-[#565e74] text-base leading-relaxed">
            Secure your spot for the upcoming Summer cohort. 
            <br />Be the first to know when applications open.
          </p>
        </div>

        {/* Waitlist Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-5 py-4 rounded-xl border border-[#c3c6d7] bg-white/50 focus:bg-white focus:ring-2 focus:ring-[#2563eb] outline-none transition-all duration-200 text-black placeholder:text-[#94a3b8]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#2563eb] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#2563eb]/20 hover:bg-[#1d4ed8] hover:shadow-[#2563eb]/40 active:scale-[0.98] transition-all duration-200"
          >
            Get Early Access
          </button>
        </form>
        
        <p className="text-xs text-[#94a3b8]">No spam, just important updates.</p>
      </div>
    </div>
  );
};

export default WaitlistPage;