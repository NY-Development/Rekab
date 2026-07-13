import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssignments, useSubmissions } from '@/hooks/useAssignments';
import type { Assignment } from '@/types';

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [sortOrder, setSortOrder] = useState('Due Date (Soonest)');

  const { data: assignmentsRes, isLoading: isAssignmentsLoading, error: assignmentsError } = useAssignments();
  const { data: submissionsRes, isLoading: isSubmissionsLoading } = useSubmissions();

  const assignmentsList: Assignment[] = assignmentsRes?.data?.docs || [];
  const submissionsList = submissionsRes?.data?.submissions || [];

  // Map submissions by assignmentId
  const submissionMap = React.useMemo(() => {
    const map = new Map<string, any>();
    if (Array.isArray(submissionsList)) {
      submissionsList.forEach((sub: any) => {
        if (sub && sub.assignmentId) {
          map.set(sub.assignmentId, sub);
        }
      });
    }
    return map;
  }, [submissionsList]);

  // Filter list
  const filteredAssignments = assignmentsList.filter((item) => {
    if (typeFilter === 'Individual') return item.assignmentType === 'INDIVIDUAL';
    if (typeFilter === 'Team') return item.assignmentType === 'TEAM';
    return true;
  });

  // Sort list
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    if (sortOrder === 'Due Date (Soonest)') {
      return dateA - dateB;
    } else if (sortOrder === 'Due Date (Latest)') {
      return dateB - dateA;
    }
    return 0;
  });

  // Compute stats
  const totalCount = assignmentsList.length;
  const completedCount = sortedAssignments.filter(item => {
    const sub = submissionMap.get(item.id);
    return sub && (sub.status === 'submitted' || sub.status === 'graded' || sub.status === 'late');
  }).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Page Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Assignments</h2>
          <p className="text-sm text-slate-500">Manage and track your active coursework.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-700"
          >
            <option>All Types</option>
            <option>Individual</option>
            <option>Team</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-700"
          >
            <option>Due Date (Soonest)</option>
            <option>Due Date (Latest)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Assignments List */}
        <div className="lg:col-span-8 space-y-4">
          {isAssignmentsLoading || isSubmissionsLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : assignmentsError ? (
            <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm">
              Failed to load assignments.
            </div>
          ) : sortedAssignments.length === 0 ? (
            <div className="bg-white border border-slate-205 rounded-lg p-12 text-center text-slate-500">
              No assignments found matching the criteria.
            </div>
          ) : (
            sortedAssignments.map((assignment) => {
              const submission = submissionMap.get(assignment.id);
              const isOverdue = new Date(assignment.dueDate).getTime() < Date.now();
              
              let statusLabel = 'In Progress';
              let statusClass = 'bg-yellow-50 text-yellow-700 border-yellow-200';
              
              if (submission) {
                if (submission.status === 'graded') {
                  statusLabel = 'Graded';
                  statusClass = 'bg-green-50 text-green-700 border-green-200';
                } else {
                  statusLabel = 'Submitted';
                  statusClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                }
              } else if (isOverdue) {
                statusLabel = 'Late';
                statusClass = 'bg-red-50 text-red-700 border-red-200';
              }

              return (
                <div
                  key={assignment.id}
                  onClick={() => navigate(`/assignments/${assignment.id}/submit`)}
                  className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-slate-350 transition-all cursor-pointer relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${statusClass}`}>
                          {statusLabel}
                        </span>
                        <span className="bg-slate-100 text-slate-550 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest">
                          {assignment.assignmentType}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-905 mt-2 group-hover:text-blue-600 transition-colors">
                        {assignment.title}
                      </h3>
                      <p className="text-xs text-slate-450">Max Score: {assignment.maxScore} points</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-semibold block ${isOverdue && !submission ? 'text-red-600' : 'text-slate-500'}`}>
                        Due {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {assignment.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      <span>Requires {assignment.submissionType || 'github'} submission</span>
                    </div>
                    {submission && submission.points !== undefined && (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                        Score: {submission.points} / {assignment.maxScore}
                      </span>
                    )}
                    {!submission && (
                      <button className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                        Submit Now <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Column 4: Stats Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-lg border border-slate-205 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent pointer-events-none"></div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Total Progress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-150 rounded-md p-3 text-center">
                <span className="block text-2xl font-bold text-blue-600">{totalCount}</span>
                <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Assigned</span>
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded-md p-3 text-center">
                <span className="block text-2xl font-bold text-emerald-600">{completedCount}</span>
                <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
              </div>
            </div>
            {totalCount > 0 && (
              <div className="mt-6 space-y-1">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Completion Rate</span>
                  <span>{Math.round((completedCount / totalCount) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${(completedCount / totalCount) * 100}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
