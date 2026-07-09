import { Toaster } from "sonner";
import WaitlistHero from "../components/WaitListHero";
import WaitlistForm from "../components/Waitlistform";
import FooterInfo from "../components/FooterInfo";

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster richColors position="top-right" />
      <main className="container mx-auto px-6 py-24">
        <WaitlistHero />
        <section className="mt-16 max-w-md mx-auto">
          <WaitlistForm />
        </section>
      </main>
      <FooterInfo />
    </div>
  );
}