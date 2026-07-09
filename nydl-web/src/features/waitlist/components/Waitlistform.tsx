import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { joinWaitlist } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: joinWaitlist,
    onSuccess: () => {
      toast.success("You're on the list! We will notify you when cohorts open.");
      setEmail("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to join. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    mutation.mutate(email);
  };

  return (
    <Card className="border-slate-100 shadow-xl bg-white p-2">
      <CardContent className="space-y-6 pt-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mutation.isPending}
            className="h-12 border-slate-200 focus:ring-blue-500 text-slate-900"
          />
          <Button 
            type="submit" 
            className="h-12 w-full bg-blue-600 hover:bg-blue-700"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Get Early Access 
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}