import React, { useState, useEffect } from 'react';
import { useUserProfile, useStudentProfile, useUpdateProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { data: userRes, isLoading: isUserLoading } = useUserProfile();
  const { data: studentRes, isLoading: isStudentLoading } = useStudentProfile();
  const updateProfileMutation = useUpdateProfile();

  const user = userRes?.data?.user;
  const student = studentRes?.data;

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({
        name,
      });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">My Profile</h2>
        <p className="text-sm text-slate-550 mt-1">Manage your account information, student record details, and metrics.</p>
      </div>

      {isUserLoading || isStudentLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - General & Edit profile */}
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">Personal Information</CardTitle>
                <CardDescription>Update your general contact details here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5" htmlFor="full_name">Full Name</label>
                    <input
                      className="w-full px-3 py-2 bg-white border border-slate-205 rounded focus:ring-1 focus:ring-blue-600 text-sm text-slate-900"
                      id="full_name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5" htmlFor="email">Email Address</label>
                    <input
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-500 cursor-not-allowed"
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Academic record statistics */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-slate-50 border border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-bold">Academic Record</CardTitle>
                <CardDescription>Official registration code and course statistics.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <span className="block text-[10px] font-bold text-slate-405 uppercase tracking-widest">Student Code</span>
                  <span className="text-sm font-semibold text-slate-800">{student?.studentCode || 'PENDING'}</span>
                </div>
                <div className="border-b border-slate-200 pb-3">
                  <span className="block text-[10px] font-bold text-slate-405 uppercase tracking-widest">Academic Level</span>
                  <span className="text-sm font-semibold text-slate-800">{student?.currentLevel || 'Level 1'}</span>
                </div>
                <div className="border-b border-slate-200 pb-3">
                  <span className="block text-[10px] font-bold text-slate-405 uppercase tracking-widest">Attendance Status</span>
                  <span className="text-sm font-semibold text-slate-800">{student?.attendanceAverage ? `${student.attendanceAverage}%` : 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-405 uppercase tracking-widest">Graduation Status</span>
                  <span className="bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest mt-1 inline-block">
                    {student?.graduationStatus || 'IN STUDENTSHIP'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
