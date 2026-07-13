import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Notification settings saved successfully!');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    // Mock password update
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password updated successfully!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 border-none pb-0">Settings</h2>
        <p className="text-sm text-slate-550 mt-1">Configure your personal preferences, notifications, and security options.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Settings Panel */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Preferences</CardTitle>
              <CardDescription>Control how you receive program alerts and learning reminders.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveNotifications} className="space-y-4">
                <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <label className="text-sm font-semibold text-slate-800" htmlFor="email_reminders">Email Reminders</label>
                    <p className="text-xs text-slate-400">Receive class alerts and assignment due-date warnings by email.</p>
                  </div>
                  <input
                    type="checkbox"
                    id="email_reminders"
                    checked={emailNotifs}
                    onChange={(e) => setEmailNotifs(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-650 focus:ring-blue-650"
                  />
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <label className="text-sm font-semibold text-slate-800" htmlFor="push_notifications">Web Push Notifications</label>
                    <p className="text-xs text-slate-400">Get browser dashboard dynamic updates and notifications.</p>
                  </div>
                  <input
                    type="checkbox"
                    id="push_notifications"
                    checked={pushNotifs}
                    onChange={(e) => setPushNotifs(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-650 focus:ring-blue-650"
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button type="submit">
                    Save preferences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security / Password updates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Security Options</CardTitle>
              <CardDescription>Update your portal access password or session parameters.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5" htmlFor="curr_pass">Current Password</label>
                  <input
                    className="w-full px-3 py-2 bg-white border border-slate-205 rounded focus:ring-1 focus:ring-blue-655 text-sm text-slate-900"
                    id="curr_pass"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5" htmlFor="new_pass">New Password</label>
                    <input
                      className="w-full px-3 py-2 bg-white border border-slate-205 rounded focus:ring-1 focus:ring-blue-655 text-sm text-slate-900"
                      id="new_pass"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5" htmlFor="conf_pass">Confirm Password</label>
                    <input
                      className="w-full px-3 py-2 bg-white border border-slate-205 rounded focus:ring-1 focus:ring-blue-655 text-sm text-slate-900"
                      id="conf_pass"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-105 flex justify-end">
                  <Button type="submit">
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-slate-50 border border-slate-150">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Platform Information</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-500 space-y-2 leading-relaxed">
              <p>Platform version: v2.1.0-student</p>
              <p>Built with TailwindCSS v4 + React 19</p>
              <p>Secure SSL token validation enabled.</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
