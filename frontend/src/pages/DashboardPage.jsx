import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core';
import { useAuth } from '../hooks/useAuth';
import { jobService } from '../services/jobService';
import { Column } from '../components/Column';
import { JobCard } from '../components/JobCard';
import { JobDetailsModal } from '../components/JobDetailsModal';

const VALID_STATUSES = ['applied', 'interview', 'offer', 'rejected'];

const STATUS_META = {
  applied: { label: 'Applied', tone: 'from-violet-500 to-fuchsia-500', chip: 'bg-violet-50 text-violet-700' },
  interview: { label: 'Interview', tone: 'from-amber-500 to-orange-500', chip: 'bg-amber-50 text-amber-700' },
  offer: { label: 'Offer', tone: 'from-emerald-500 to-teal-500', chip: 'bg-emerald-50 text-emerald-700' },
  rejected: { label: 'Rejected', tone: 'from-rose-500 to-red-500', chip: 'bg-rose-50 text-rose-700' },
};

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, statsRes] = await Promise.all([
          jobService.getJobs(),
          jobService.getJobStats(),
        ]);

        const jobsData = Array.isArray(jobsRes.data?.jobs)
          ? jobsRes.data.jobs
          : [];

        const statsData = statsRes.data?.stats || {
          total: 0,
          applied: 0,
          screening: 0,
          interview: 0,
          offer: 0,
          rejected: 0,
        };

        setJobs(jobsData);
        setStats(statsData);
      } catch (err) {
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    const jobToDelete = jobs.find((j) => j._id === jobId);
    const statusOfJob = jobToDelete?.status;

    try {
      await jobService.deleteJob(jobId);
      const filteredJobs = jobs.filter((j) => j._id !== jobId);
      setJobs(filteredJobs);
      setError(''); // Clear error on success
      
      // Update stats
      if (statusOfJob && stats) {
        setStats((prevStats) => ({
          ...prevStats,
          total: Math.max(0, prevStats.total - 1),
          [statusOfJob]: Math.max(0, prevStats[statusOfJob] - 1),
        }));
      }
    } catch (err) {
      setError('Failed to delete job');
      console.error('Delete error:', err);
    }
  };

  const handleEditJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
  };

  const handleCloseJobDetails = () => {
    setSelectedJob(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const jobId = active.id;
    const job = jobs.find((j) => j._id === jobId);
    if (!job) return;

    // `over.id` can be a column status OR another job id.
    // If we drop over a card, resolve status from that card.
    const overId = String(over.id);
    let newStatus = overId;

    if (!VALID_STATUSES.includes(overId)) {
      const overJob = jobs.find((j) => j._id === overId);
      newStatus = overJob?.status || '';
    }

    if (!VALID_STATUSES.includes(newStatus) || job.status === newStatus) return;

    const oldStatus = job.status;

    // Optimistic UI update
    const updatedJobs = jobs.map((j) =>
      j._id === jobId ? { ...j, status: newStatus } : j
    );
    setJobs(updatedJobs);
    setError(''); // Clear error on new action

    // API update
    try {
      await jobService.updateJobStatus(jobId, newStatus);
      
      // Update stats based on status change
      setStats((prevStats) => {
        const newStats = { ...prevStats, total: prevStats.total };
        newStats[oldStatus] = Math.max(0, newStats[oldStatus] - 1);
        newStats[newStatus] = newStats[newStatus] + 1;
        return newStats;
      });
    } catch (err) {
      // Revert on error
      setJobs(
        jobs.map((j) =>
          j._id === jobId ? { ...j, status: oldStatus } : j
        )
      );
      setError('Failed to update job status');
      console.error('Status update error:', err);
    }
  };

  // Group jobs by status
  const jobsByStatus = {
    applied: jobs.filter((j) => j.status === 'applied'),
    interview: jobs.filter((j) => j.status === 'interview'),
    offer: jobs.filter((j) => j.status === 'offer'),
    rejected: jobs.filter((j) => j.status === 'rejected'),
  };

  const activeDraggedJob = activeId ? jobs.find((j) => j._id === activeId) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 shadow-2xl backdrop-blur">
          <div className="h-3 w-3 animate-pulse rounded-full bg-violet-400" />
          <div className="text-sm font-medium tracking-wide text-slate-200">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-0 h-72 w-72 rounded-full bg-violet-300/25 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-lg font-bold text-white shadow-lg shadow-violet-500/25">
              JT
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">Career dashboard</p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Job Tracker</h1>
              <p className="text-sm text-slate-500">Welcome back, {user?.name}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/jobs/new')}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <span className="text-base leading-none">+</span>
              Add job
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                Live pipeline
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Drag and drop enabled
              </span>
            </div>
            <div className="mt-5 max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                A cleaner way to track applications, interviews, and offers.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Move cards through the pipeline, keep status changes in sync instantly, and get a better view of where every application stands.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Active roles</span>
                <span className="mt-1 block text-lg font-semibold text-slate-900">{stats?.total ?? 0}</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Best momentum</span>
                <span className="mt-1 block text-lg font-semibold text-slate-900">{stats?.offer ?? 0} offers</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Pipeline focus</span>
                <span className="mt-1 block text-lg font-semibold text-slate-900">{stats?.interview ?? 0} interviews</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Highlights</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Object.entries(STATUS_META).map(([key, meta]) => (
                  <div key={key} className={`rounded-2xl border border-slate-200 px-4 py-3 ${meta.chip}`}>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">{meta.label}</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900">{stats?.[key] ?? 0}</div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700 shadow-xl shadow-rose-900/5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">Attention</p>
                <p className="mt-2 text-sm leading-6">{error}</p>
              </div>
            )}
          </div>
        </section>

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            <StatCard label="Total" value={stats.total} tone="from-slate-900 to-slate-700" />
            <StatCard label="Applied" value={stats.applied || 0} tone="from-violet-600 to-fuchsia-600" />
            <StatCard label="Interview" value={stats.interview || 0} tone="from-amber-500 to-orange-500" />
            <StatCard label="Rejected" value={stats.rejected || 0} tone="from-rose-500 to-red-500" />
            <StatCard label="Offer" value={stats.offer || 0} tone="from-emerald-500 to-teal-500" />
          </div>
        )}

        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Application pipeline</h3>
            <p className="text-sm text-slate-500">Drag a card across stages. Cards stay actionable, and the layout stays readable.</p>
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto pb-4">
            <div className="flex min-w-max gap-6">
              <Column
                status="applied"
                label="Applied"
                jobs={jobsByStatus.applied}
                onDelete={handleDeleteJob}
                onEdit={handleEditJob}
                onView={handleViewJob}
                color="from-violet-500 via-violet-400 to-fuchsia-500"
              />
              <Column
                status="interview"
                label="Interview"
                jobs={jobsByStatus.interview}
                onDelete={handleDeleteJob}
                onEdit={handleEditJob}
                onView={handleViewJob}
                color="from-amber-500 via-orange-400 to-yellow-500"
              />
              <Column
                status="offer"
                label="Offer"
                jobs={jobsByStatus.offer}
                onDelete={handleDeleteJob}
                onEdit={handleEditJob}
                onView={handleViewJob}
                color="from-emerald-500 via-teal-400 to-cyan-500"
              />
              <Column
                status="rejected"
                label="Rejected"
                jobs={jobsByStatus.rejected}
                onDelete={handleDeleteJob}
                onEdit={handleEditJob}
                onView={handleViewJob}
                color="from-rose-500 via-red-400 to-pink-500"
              />
            </div>
          </div>

          {/* Dragged card overlay */}
          <DragOverlay>
            {activeDraggedJob ? (
              <div className="w-72 rounded-2xl border border-white/60 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.25)] ring-1 ring-violet-200">
                <div className="mb-3 inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">
                  {activeDraggedJob.status}
                </div>
                <h3 className="truncate text-sm font-semibold text-slate-900">{activeDraggedJob.company}</h3>
                <p className="truncate text-xs text-slate-500">{activeDraggedJob.role}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <JobDetailsModal job={selectedJob} onClose={handleCloseJobDetails} />
      </main>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  tone,
}) => (
  <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl">
    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone}`} />
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
  </div>
);
