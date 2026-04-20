import React from 'react';

export const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  const formatDate = (value) => {
    if (!value) return 'Not set';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not set';
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const detailItems = [
    { label: 'Company', value: job.company || 'Not set' },
    { label: 'Role', value: job.role || 'Not set' },
    { label: 'Status', value: job.status || 'Not set' },
    { label: 'Location', value: job.location || 'Not set' },
    { label: 'Salary', value: job.salary || 'Not set' },
    { label: 'Applied date', value: formatDate(job.appliedDate) },
    { label: 'Priority', value: job.priority || 'Not set' },
    { label: 'Created', value: formatDate(job.createdAt) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Close job details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl shadow-slate-900/20">
        <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500 px-6 py-6 text-white sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Job details</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{job.company}</h2>
              <p className="mt-1 text-sm text-white/85">{job.role}</p>
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
              {job.status}
            </span>
          </div>
        </div>

        <div className="max-h-[75vh] overflow-y-auto bg-slate-50 px-6 py-6 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {detailItems.map((item) => (
              <DetailCard key={item.label} label={item.label} value={item.value} />
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Link</p>
              {job.url ? (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex break-all text-sm font-semibold text-violet-700 transition hover:text-violet-800"
                >
                  {job.url}
                </a>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Not available</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Notes</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {job.notes || 'No notes added yet.'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
    <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
  </div>
);
