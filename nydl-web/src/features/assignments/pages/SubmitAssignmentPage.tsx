import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssignment, useSubmitAssignment } from '@/hooks/useAssignments';
import { toast } from 'sonner';

export default function SubmitAssignmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: assignmentRes, isLoading, error } = useAssignment(id || '');
  const submitMutation = useSubmitAssignment();

  // Inputs
  const [linkUrl, setLinkUrl] = useState('');
  const [content, setContent] = useState('');

  const assignment = assignmentRes?.data;

  const requiresLink = assignment?.submissionType === 'github' || assignment?.submissionType === 'file';
  const requiresText = assignment?.submissionType === 'text';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (requiresLink && !linkUrl) {
      toast.error('Please provide a submission link.');
      return;
    }
    if (requiresText && !content) {
      toast.error('Submission content is required.');
      return;
    }

    try {
      await submitMutation.mutateAsync({
        assignmentId: id,
        data: {
          repoUrl: linkUrl || undefined,
          content: content || undefined,
        }
      });
      toast.success('Assignment submitted successfully!');
      navigate('/assignments');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit assignment.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-0 py-10">
      {/* Back action */}
      <button
        onClick={() => navigate('/assignments')}
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors mb-8 group"
      >
        <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">arrow_back</span>
        <span className="text-xs font-semibold uppercase tracking-wider">Back to Assignments</span>
      </button>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error || !assignment ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm">
          Failed to load assignment details.
        </div>
      ) : (
        <>
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-105 text-xs font-semibold uppercase tracking-wider">
                {assignment.assignmentType}
              </span>
              <span className="text-slate-500 text-xs">• Due {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              {assignment.title}
            </h1>
            <p className="text-slate-550 text-sm leading-relaxed">
              {assignment.description}
            </p>
          </header>

          {/* Main Submission Card */}
          <main className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guidelines Banner */}
              <div className="bg-slate-50 rounded p-4 flex items-start gap-3 border border-slate-150">
                <span className="material-symbols-outlined text-blue-600 mt-0.5">info</span>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Submission Guidelines</h3>
                  <ul className="list-disc pl-4 text-xs text-slate-500 space-y-1">
                    <li>Ensure your links are correct, public, and accessible to instructors.</li>
                    <li>Double check requirements before hitting Submit.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                {requiresLink && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5" htmlFor="github_link">
                      {assignment.submissionType === 'file' ? 'Submission Link *' : 'GitHub / Repo link *'}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">link</span>
                      <input
                        className="w-full pl-10 pr-3 py-2 bg-white border border-slate-205 rounded focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-sm text-slate-900 placeholder-slate-400/70 transition-shadow"
                        id="github_link"
                        placeholder="https://github.com/username/repo"
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {requiresText && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5" htmlFor="content">Submission Content *</label>
                    <textarea
                      className="w-full p-3 bg-white border border-slate-205 rounded focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-sm text-slate-900 placeholder-slate-400/70 transition-shadow resize-y"
                      id="content"
                      placeholder="Write your text submission here..."
                      rows={6}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Submission Action */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/assignments')}
                  className="px-4 py-2 rounded-md border border-slate-200 text-slate-650 bg-white hover:bg-slate-50 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                  type="submit"
                  disabled={submitMutation.isPending}
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </div>
            </form>
          </main>
        </>
      )}
    </div>
  );
}
