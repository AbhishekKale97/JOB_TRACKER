import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const JobCard = ({ job, onDelete, onEdit, onView }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const appliedDate = job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : 'Recently added';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${
        isDragging ? 'scale-[0.98] opacity-60 shadow-2xl' : ''
      }`}
    >
      {/* Draggable header */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing border-b border-slate-100 bg-gradient-to-r from-slate-50 to-violet-50 px-4 py-3 transition group-hover:from-violet-50 group-hover:to-fuchsia-50"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900">{job.company}</h3>
            <p className="mt-1 truncate text-xs text-slate-500">{job.role}</p>
          </div>
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-700 shadow-sm">
            Drag
          </span>
        </div>
      </div>

      {/* Non-draggable content */}
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {job.location && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{job.location}</span>
          )}
          <span className="rounded-full bg-violet-50 px-2.5 py-1 font-medium text-violet-700">{appliedDate}</span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
            <div>
              <p className="uppercase tracking-[0.16em]">Salary</p>
              <p className="mt-1 font-semibold text-slate-900">{job.salary || 'Not set'}</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.16em]">Link</p>
              {job.url ? (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block truncate font-semibold text-violet-700 transition hover:text-violet-800"
                >
                  {job.url}
                </a>
              ) : (
                <p className="mt-1 font-semibold text-slate-900">Not available</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onView(job);
            }}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View details
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(job._id);
            }}
            className="flex-1 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(job._id);
            }}
            className="flex-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
