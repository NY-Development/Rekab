// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { ArrowRight, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { joinWaitlist } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// export default function WaitlistForm() {
//   const [email, setEmail] = useState("");

//   const mutation = useMutation({
//     mutationFn: joinWaitlist,
//     onSuccess: () => {
//       toast.success("You're on the list! We will notify you when cohorts open.");
//       setEmail("");
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || "Failed to join. Please try again.");
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email.trim()) return;
//     mutation.mutate(email);
//   };

//   return (
//     <Card className="border-slate-100 shadow-xl bg-white p-2">
//       <CardContent className="space-y-6 pt-6">
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <Input
//             type="email"
//             required
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             disabled={mutation.isPending}
//             className="h-12 border-slate-200 focus:ring-blue-500 text-slate-900"
//           />
//           <Button 
//             type="submit" 
//             className="h-12 w-full bg-blue-600 hover:bg-blue-700"
//             disabled={mutation.isPending}
//           >
//             {mutation.isPending ? (
//               <Loader2 className="h-5 w-5 animate-spin" />
//             ) : (
//               <>
//                 Get Early Access 
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </>
//             )}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }
import { ArrowRight, Calendar, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const REGISTRATION_LINK =
  "https://nydev-form-generation.vercel.app/f/nydev-learning-nydl-summer-cohort-registration-2026";

export default function RegistrationForm() {
  const handleRegister = () => {
    window.open(REGISTRATION_LINK, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="overflow-hidden border-0 bg-card shadow-2xl">
      <CardContent className="space-y-8 p-8">

        {/* Badge */}
        <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          🚀 NYDL Summer Cohort 2026
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Registration is Now Open
          </h2>

          <p className="text-muted-foreground leading-7">
            Applications for the first NYDev Learning Summer Cohort are now
            available. Learn directly from experienced software engineers,
            mentors, and university students through live online classes and
            real-world projects.
          </p>
        </div>

        {/* Features */}

        <div className="grid gap-4">

          <div className="flex items-center gap-4 rounded-xl border bg-muted/40 p-4">
            <Calendar className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold">
                Cohort Starts
              </p>
              <p className="text-sm text-muted-foreground">
                Sunday • Live Online Sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border bg-muted/40 p-4">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold">
                Limited Seats
              </p>
              <p className="text-sm text-muted-foreground">
                Small cohorts with mentorship and project-based learning.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border bg-muted/40 p-4">
            <Clock className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold">
                Duration
              </p>
              <p className="text-sm text-muted-foreground">
                8–10 Weeks • Flexible Evening & Weekend Sessions
              </p>
            </div>
          </div>

        </div>

        {/* Includes */}

        <div className="rounded-xl border bg-background p-5">
          <h3 className="mb-3 font-semibold">
            Your Registration Includes
          </h3>

          <ul className="space-y-2 text-sm text-muted-foreground">

            <li>✅ Live Google Meet Classes</li>

            <li>✅ Team-based Learning</li>

            <li>✅ Discord Community Access</li>

            <li>✅ Weekly Assignments</li>

            <li>✅ Mentor Support</li>

            <li>✅ Practical Projects</li>

            <li>✅ Digital Certificates & Badges</li>

            <li>✅ Portfolio Development</li>

            <li>✅ Internship Opportunities (Performance-Based)</li>

          </ul>
        </div>

        {/* CTA */}

        <Button
          size="lg"
          onClick={handleRegister}
          className="h-14 w-full text-base font-semibold"
        >
          Register for the Summer Cohort

          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Registration takes less than <strong>5 minutes</strong>.
        </p>

      </CardContent>
    </Card>
  );
}