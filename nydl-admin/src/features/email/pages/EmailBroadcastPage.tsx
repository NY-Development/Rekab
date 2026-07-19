import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { emailApi } from '@/api/email.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Search, Mail, Send, Eye, Edit2, Users, User, CheckSquare, Layers, Bold, Italic, Link as LinkIcon, Heading1, Heading2, List, X } from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'mentor', label: 'Mentor' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
];

export function EmailBroadcastPage() {
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const users = usersData?.docs || [];

  const [mode, setMode] = useState<'all' | 'selected' | 'byRole' | 'individual'>('all');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [searchText, setSearchText] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [individualUserId, setIndividualUserId] = useState('');
  
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isSending, setIsSending] = useState(false);

  // Helper to format content
  const formatText = (command: string) => {
    const textarea = document.getElementById('email-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    let replacement = '';

    switch (command) {
      case 'bold':
        replacement = `<strong>${selected || 'bold text'}</strong>`;
        break;
      case 'italic':
        replacement = `<em>${selected || 'italic text'}</em>`;
        break;
      case 'h1':
        replacement = `<h1 style="color:#0f172a; margin: 16px 0 8px;">${selected || 'Header 1'}</h1>`;
        break;
      case 'h2':
        replacement = `<h2 style="color:#1e293b; margin: 14px 0 6px;">${selected || 'Header 2'}</h2>`;
        break;
      case 'link':
        const url = prompt('Enter URL:', 'https://');
        if (url) replacement = `<a href="${url}" style="color:#4f46e5; text-decoration:underline;">${selected || 'Link Text'}</a>`;
        else return;
        break;
      case 'bullet':
        replacement = `<ul style="margin:8px 0; padding-left:20px;">\n  <li>${selected || 'Item'}</li>\n</ul>`;
        break;
      default:
        return;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    textarea.focus();
    // Reset selection after state updates
    setTimeout(() => {
      textarea.setSelectionRange(start, start + replacement.length);
    }, 0);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };
  
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchText.toLowerCase()) ||
    u.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error('Subject is required');
      return;
    }
    if (!content.trim()) {
      toast.error('Email content is required');
      return;
    }

    let recipientIds: string[] = [];
    if (mode === 'selected') {
      recipientIds = selectedUserIds;
      if (recipientIds.length === 0) {
        toast.error('Please select at least one recipient');
        return;
      }
    } else if (mode === 'individual') {
      if (!individualUserId) {
        toast.error('Please select an individual recipient');
        return;
      }
      recipientIds = [individualUserId];
    }

    const confirmSend = window.confirm(
      `Are you sure you want to send this email to resolved recipients matches?`
    );
    if (!confirmSend) return;

    setIsSending(true);
    try {
      const res = await emailApi.sendBroadcast({
        mode,
        subject,
        content,
        recipientIds: mode === 'selected' || mode === 'individual' ? recipientIds : undefined,
        role: mode === 'byRole' ? selectedRole : undefined,
      });

      toast.success(res.data?.message || 'Email broadcast sent successfully!');
      
      // Cleanup on success
      if (mode === 'selected') setSelectedUserIds([]);
      setSubject('');
      setContent('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send email broadcast.');
    } finally {
      setIsSending(false);
    }
  };

  // Build simulated preview body
  const previewHtml = `
    <div style="max-width:600px;margin:20px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);font-family:sans-serif;color:#0f172a;text-align:left;">
      <div style="background:linear-gradient(135deg,#3b1fd6 0%,#6366f1 100%);padding:24px 20px;text-align:center;">
        <div style="font-size:24px;font-weight:850;color:#ffffff;letter-spacing:-0.5px;">NYDEV Learning</div>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:12px;">Learning Management Platform</p>
      </div>
      <div style="padding:28px 24px;">
        <h2 style="font-size:18px;font-weight:700;margin:0 0 16px;color:#0f172a;">${subject || '[Subject Placeholder]'}</h2>
        <div style="font-size:14px;line-height:1.6;color:#334155;">${content || '<p style="color:#94a3b8;">Email content preview will appear here. Write content in HTML format or use the quick format tools.</p>'}</div>
      </div>
      <div style="padding:16px;background:#f1f5f9;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#64748b;">
        NYDEV Learning · nydevofficial@gmail.com · 0902142767
      </div>
    </div>
  `;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Compose Form */}
      <div className="space-y-6">
        <Card className="border-slate-800 bg-[#0f172a]/45 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-400" />
              Compose Broadcast Email
            </CardTitle>
            <CardDescription className="text-slate-400">
              Send customized emails to users, selected cohorts, roles, or single accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Mode Select */}
            <div className="space-y-2">
              <Label className="text-slate-200">Recipient Mode</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Button
                  type="button"
                  variant={mode === 'all' ? 'default' : 'outline'}
                  className="w-full text-xs font-semibold py-2"
                  onClick={() => setMode('all')}
                >
                  <Users className="mr-1 h-3.5 w-3.5" /> All Users
                </Button>
                <Button
                  type="button"
                  variant={mode === 'selected' ? 'default' : 'outline'}
                  className="w-full text-xs font-semibold py-2"
                  onClick={() => setMode('selected')}
                >
                  <CheckSquare className="mr-1 h-3.5 w-3.5" /> Check List
                </Button>
                <Button
                  type="button"
                  variant={mode === 'byRole' ? 'default' : 'outline'}
                  className="w-full text-xs font-semibold py-2"
                  onClick={() => setMode('byRole')}
                >
                  <Layers className="mr-1 h-3.5 w-3.5" /> By Role
                </Button>
                <Button
                  type="button"
                  variant={mode === 'individual' ? 'default' : 'outline'}
                  className="w-full text-xs font-semibold py-2"
                  onClick={() => setMode('individual')}
                >
                  <User className="mr-1 h-3.5 w-3.5" /> Individual
                </Button>
              </div>
            </div>

            {/* Conditionally Render Mode Pickers */}
            {mode === 'byRole' && (
              <div className="space-y-2 border border-slate-800 bg-[#0b0f19] p-3 rounded-lg">
                <Label className="text-slate-300">Select Role</Label>
                <Select value={selectedRole} onValueChange={(val) => val && setSelectedRole(val)}>
                  <SelectTrigger className="bg-slate-900 border-slate-800 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    {ROLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {mode === 'individual' && (
              <div className="space-y-2 border border-slate-800 bg-[#0b0f19] p-3 rounded-lg">
                <Label className="text-slate-300">Select Individual User</Label>
                <Select value={individualUserId} onValueChange={(val) => val && setIndividualUserId(val)}>
                  <SelectTrigger className="bg-slate-900 border-slate-800 text-white">
                    <SelectValue placeholder={usersLoading ? "Loading users..." : "Search & Select User"} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-60">
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.email} - {u.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {mode === 'selected' && (
              <div className="space-y-3 border border-slate-800 bg-[#0b0f19] p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <Label className="text-slate-300 font-semibold">Select Target Users ({selectedUserIds.length} chosen)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                    onClick={() => {
                      if (selectedUserIds.length === filteredUsers.length) {
                        setSelectedUserIds([]);
                      } else {
                        setSelectedUserIds(filteredUsers.map((u) => u.id));
                      }
                    }}
                  >
                    {selectedUserIds.length === filteredUsers.length ? 'Clear All' : 'Select All Filtered'}
                  </Button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search users..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-9 bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500"
                  />
                </div>

                {/* Dropdown Select for Users */}
                <div className="space-y-2">
                  <Select
                    value=""
                    onValueChange={(val) => {
                      if (val) {
                        handleSelectUser(val);
                      }
                    }}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white w-full">
                      <SelectValue placeholder="Click to choose a user..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-60">
                      {filteredUsers.length === 0 ? (
                        <div className="text-xs text-slate-500 p-2 text-center">No matching accounts found</div>
                      ) : (
                        filteredUsers.map((u) => {
                          const isSelected = selectedUserIds.includes(u.id);
                          return (
                            <SelectItem key={u.id} value={u.id}>
                              {isSelected ? '✓ ' : ''}{u.name} ({u.email} - {u.role})
                            </SelectItem>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Render Selected Users below in a scroll area */}
                {selectedUserIds.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Selected Recipients</Label>
                    <div className="max-h-32 overflow-y-auto border border-slate-800/60 bg-slate-950/40 p-2 rounded flex flex-wrap gap-1.5 items-start">
                      {users
                        .filter((u) => selectedUserIds.includes(u.id))
                        .map((u) => (
                          <div
                            key={u.id}
                            className="flex items-center gap-1.5 text-xs bg-indigo-950/60 border border-indigo-800/40 text-indigo-200 px-2 py-0.5 rounded-full"
                          >
                            <span className="max-w-28 truncate font-medium">{u.name}</span>
                            <button
                              type="button"
                              onClick={() => handleSelectUser(u.id)}
                              className="text-indigo-400 hover:text-indigo-200 font-bold shrink-0 focus:outline-none"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Subject Input */}
            <div className="space-y-1">
              <Label htmlFor="email-subject" className="text-slate-300">Subject</Label>
              <Input
                id="email-subject"
                placeholder="Enter email subject line..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white placeholder-slate-500"
              />
            </div>

            {/* Rich Editor Quick Formatting Panel & Textarea */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label htmlFor="email-content-textarea" className="text-slate-300">Message Custom Content (HTML supported)</Label>
                <div className="flex items-center gap-1 border border-slate-800 p-0.5 rounded bg-slate-900">
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => formatText('bold')} title="Bold">
                    <Bold className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => formatText('italic')} title="Italic">
                    <Italic className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => formatText('h1')} title="Heading 1">
                    <Heading1 className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => formatText('h2')} title="Heading 2">
                    <Heading2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => formatText('bullet')} title="Bullet List">
                    <List className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => formatText('link')} title="Insert Link">
                    <LinkIcon className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <Textarea
                id="email-content-textarea"
                placeholder="Write your email body here... HTML markup like <p>, <br>, <strong> and lists are rendered."
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white placeholder-slate-500 font-mono text-xs"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="default"
                className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
                disabled={isSending}
                onClick={handleSend}
              >
                {isSending ? (
                  <>Sending Broadcast...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send Email
                  </>
                )}
              </Button>
            </div>
            
          </CardContent>
        </Card>
      </div>

      {/* Realtime Live Preview */}
      <div className="space-y-6">
        <Card className="border-slate-800 bg-[#0f172a]/45 backdrop-blur-md h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Eye className="h-5 w-5 text-indigo-400" />
                Live Email Template Preview
              </CardTitle>
              <CardDescription className="text-slate-400">
                This is exactly what the email looks like in user inboxes.
              </CardDescription>
            </div>
            <div className="flex items-center border border-slate-800 rounded bg-slate-950 p-1">
              <Button
                variant={activeTab === 'edit' ? 'default' : 'ghost'}
                size="sm"
                className="text-xs h-7"
                onClick={() => setActiveTab('edit')}
              >
                <Edit2 className="mr-1 h-3 w-3" /> Designer Code
              </Button>
              <Button
                variant={activeTab === 'preview' ? 'default' : 'ghost'}
                size="sm"
                className="text-xs h-7"
                onClick={() => setActiveTab('preview')}
              >
                <Eye className="mr-1 h-3 w-3" /> Viewer
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-start">
            {activeTab === 'edit' ? (
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-lg flex-1 min-h-75 overflow-auto text-left">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Email Payload Structure</h4>
                <pre className="text-[10px] text-indigo-300 font-mono whitespace-pre-wrap">
{JSON.stringify({
  to: mode === 'all' 
    ? 'All active users' 
    : mode === 'byRole' 
      ? `All users with role: ${selectedRole.toUpperCase()}`
      : mode === 'individual'
        ? users.find(u => u.id === individualUserId)?.email || 'None selected'
        : `${selectedUserIds.length} custom selected recipients`,
  subject: subject || '(No Subject)',
  template: 'Branded NYDEV HTML Template',
  logoEmbedded: 'cid:nydev-logo',
  bodyContentLength: `${content.length} characters`
}, null, 2)}
                </pre>
                
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest my-4 font-mono">Rendered HTML Source Code (Simulated)</h4>
                <textarea
                  readOnly
                  value={previewHtml.trim()}
                  className="w-full h-48 bg-slate-900 border border-slate-800 text-[10px] text-indigo-400 p-2 font-mono rounded"
                />
              </div>
            ) : (
              <div className="bg-[#0b0c16] border border-slate-800 rounded-lg p-2 flex-1 min-h-100 flex items-center justify-center overflow-auto shadow-inner">
                <div 
                  className="w-full scale-90 origin-top overflow-x-hidden"
                  dangerouslySetInnerHTML={{ __html: previewHtml }} 
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EmailBroadcastPage;
