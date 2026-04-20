import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-violet-300/25 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-300/10 blur-3xl" />
      </div>

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-lg font-bold text-white shadow-lg shadow-violet-500/25">
            JT
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">Career dashboard</p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Job Tracker</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Go to dashboard
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="relative mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 px-4 pb-10 pt-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <section className="rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-2xl shadow-slate-900/5 backdrop-blur-xl sm:p-10 lg:p-12">
          <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Welcome
          </span>
          <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Track every application in one clean pipeline.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Job Tracker keeps your applications organized, your statuses in sync, and your next move clear. Sign in to continue or create an account to get started.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50"
            >
              Register
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Focus</p>
              <p className="mt-1 text-base font-semibold text-slate-900">Applied jobs</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Flow</p>
              <p className="mt-1 text-base font-semibold text-slate-900">Move cards fast</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Signal</p>
              <p className="mt-1 text-base font-semibold text-slate-900">Track offers</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">What you get</p>
            <div className="mt-5 space-y-4">
              <FeatureItem title="Kanban pipeline" text="Move applications through applied, interview, offer, and rejected stages." />
              <FeatureItem title="Instant updates" text="Status changes update immediately and stay in sync with the API." />
              <FeatureItem title="Clean overview" text="A dashboard that highlights progress without clutter." />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-2xl shadow-slate-900/15 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-200">Simple entry point</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">Ready to organize your search?</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Sign in if you already have an account, or register in a minute and start tracking applications right away.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/login"
                className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Register
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const FeatureItem = ({ title, text }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
    <p className="text-sm font-semibold text-slate-900">{title}</p>
    <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
  </div>
);
