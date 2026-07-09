import { GraduationCap, Mail, ShieldCheck } from "lucide-react";

export default function FooterInfo() {
  return (
    <footer className="mt-24 w-full bg-slate-50 py-12 px-6">
      <div className="container mx-auto flex justify-between flex-wrap gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">NYDEV Learning</h3>
          </div>
          <p className="text-sm text-slate-600 leading-6 max-w-xs">
            Preparing students for real-world careers through project-based education.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <p className="font-semibold text-slate-900">Email Support</p>
              <p className="text-sm text-slate-500">nydevofficial@gmail.com</p>
            </div>
          </div>
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <p className="font-semibold text-slate-900">Privacy</p>
              <p className="text-sm text-slate-500">Your information is kept secure.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}