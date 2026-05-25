import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ReviewStep({ rows, setRows, stats, onBack, onNext }) {
  const [search, setSearch] = useState('');
  const visibleRows = rows.length ? rows : [
    {
      id: 'sample-row',
      Name: 'Jane Doe',
      Email: 'jane.doe@example.com',
      Phone: '(555) 432-1000',
      Role: 'Product Designer',
      Duration: '6 months',
      'Start Date': '2026-06-15',
      selected: true,
      sample: true
    }
  ];

  const updateRow = (id, field, value) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const toggleSelect = (id) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, selected: !row.selected } : row)));
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: crypto.randomUUID(),
        Name: '',
        Email: '',
        Phone: '',
        Role: '',
        Duration: '',
        'Start Date': '',
        selected: true
      }
    ]);
  };

  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const filteredRows = useMemo(() => {
    if (!search.trim()) return visibleRows;
    const lowerSearch = search.toLowerCase();
    return visibleRows.filter((row) =>
      ['Name', 'Email', 'Phone', 'Role', 'Duration', 'Start Date'].some((field) =>
        String(row[field] ?? '').toLowerCase().includes(lowerSearch)
      )
    );
  }, [search, visibleRows]);

  return (
    <div className="space-y-8 w-full max-w-[95%] mx-auto">
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Step 2</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Review & edit your candidate list</h2>
            <p className="mt-2 text-slate-400">Validate emails, edit rows, and choose recipients.</p>
          </div>

          <div className="mt-8 space-y-5">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Search candidates</p>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, or role"
                className="mt-3 w-full rounded-[24px] border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition duration-200 focus:border-indigo-500/70 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div className="space-y-4">
              {[
                { label: 'Total rows', value: stats.total },
                { label: 'Selected', value: stats.selected },
                { label: 'Valid Emails', value: stats.valid },
                { label: 'Invalid Emails', value: stats.invalid }
              ].map((item) => (
                <div key={item.label} className="rounded-[28px] border border-white/10 bg-slate-900/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <button onClick={addRow} className="mt-4 w-full rounded-[24px] bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_24px_70px_rgba(99,102,241,0.22)] transition duration-300 hover:scale-[1.01]">
              + Add row
            </button>
          </div>
        </aside>

        <main className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.28)] backdrop-blur-xl flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Candidate roster</h3>
              <p className="mt-2 text-sm text-slate-400">Use the full table canvas to verify and edit every row.</p>
            </div>
            <span className="rounded-3xl bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-300">{filteredRows.length} rows visible</span>
          </div>

          <div className="flex-1 overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/95">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-left text-sm text-slate-300">
                <thead className="bg-slate-950/95">
                  <tr className="border-b border-slate-800">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Send</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Email</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Phone</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Role</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Duration</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Start Date</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length ? filteredRows.map((row) => (
                    <tr key={row.id} className="border-b border-slate-700/50 transition duration-200 hover:bg-white/5">
                      <td className="px-4 py-3 align-middle">
                        <input
                          type="checkbox"
                          checked={row.selected ?? true}
                          onChange={() => !row.sample && toggleSelect(row.id)}
                          disabled={row.sample}
                          className="h-5 w-5 rounded-md text-indigo-500 ring-1 ring-slate-700/50 focus:ring-indigo-400"
                        />
                      </td>
                      {['Name', 'Email', 'Phone', 'Role', 'Duration', 'Start Date'].map((field) => (
                        <td key={field} className="px-4 py-3 align-middle">
                          <input
                            value={row[field]}
                            onChange={(event) => !row.sample && updateRow(row.id, field, event.target.value)}
                            disabled={row.sample}
                            className={`w-full bg-transparent text-sm text-slate-100 outline-none transition placeholder:text-slate-500 ${row.sample ? 'cursor-not-allowed opacity-70' : 'focus:border-b focus:border-indigo-500/60'} ${field === 'Email' && !emailRegex.test(row.Email || '') ? 'border-b border-rose-500/40 text-rose-100' : 'border-b border-transparent'}`}
                            placeholder={field}
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={row.sample}
                            onClick={() => deleteRow(row.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 transition hover:border-rose-400 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                              <path d="M9 3v1H4v2h16V4h-5V3H9Zm2 5v10h2V8h-2Zm4 0v10h2V8h-2Zm-8 0v10h2V8H7Z" />
                            </svg>
                          </button>
                          {!row.sample && (
                            <button
                              type="button"
                              onClick={() => {}}
                              className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300 transition hover:border-indigo-400 hover:text-white"
                            >
                              edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">
                        No matching rows found. Try a different search term.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <button onClick={onBack} className="rounded-[24px] border border-white/10 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:border-white/20 hover:bg-slate-900">
          Back
        </button>
        <button onClick={onNext} className="rounded-[24px] bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_24px_70px_rgba(99,102,241,0.22)] transition duration-300 hover:scale-[1.01]">
          Continue to Template
        </button>
      </div>
    </div>
  );
}
