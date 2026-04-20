import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { JobCard } from './JobCard';

export const Column = ({ status, label, jobs, onDelete, onEdit, onView, color }) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: status,
  });

  return (
    <div className="flex h-full min-w-80 flex-shrink-0 flex-col rounded-3xl border border-white/70 bg-white/70 p-3 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
      <div className={`rounded-2xl bg-gradient-to-r ${color} px-4 py-4 text-white shadow-lg shadow-slate-900/10`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">Pipeline stage</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">{label}</h2>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {jobs.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`mt-3 flex-1 space-y-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 transition ${
          isOver && active ? 'border-violet-300 bg-violet-50/70 ring-2 ring-violet-200 ring-inset' : ''
        }`}
      >
        <SortableContext items={jobs.map((j) => j._id)} strategy={verticalListSortingStrategy}>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onDelete={onDelete}
                onEdit={onEdit}
                onView={onView}
              />
            ))
          ) : (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 text-sm text-slate-400">
              Drop jobs here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};
