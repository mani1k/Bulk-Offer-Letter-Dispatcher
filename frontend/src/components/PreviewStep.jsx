import { useMemo } from 'react';
import { motion } from 'framer-motion';

const sampleTransform = (body, recipient) => {
  const lookup = {
    name: recipient.Name || recipient.name || '',
    email: recipient.Email || recipient.email || '',
    phone: recipient.Phone || recipient.phone || '',
    organization: recipient.Organization || recipient.organization || '',
    Role: recipient.Role || recipient.role || '',
    Duration: recipient.Duration || recipient.duration || '',
    'Start Date': recipient['Start Date'] || recipient.startDate || ''
  };
  let output = body;
  Object.entries(lookup).forEach(([key, value]) => {
    output = output.replaceAll(`{${key}}`, value || '____');
  });
  return output;
};

export default function PreviewStep({ rows, template, subject, body, selectedTab, setSelectedTab, dispatchSettings, setDispatchSettings, onBack, onSend, loading, statusMessage }) {
  const firstRecipient = useMemo(() => rows.find((row) => row.selected), [rows]);

  const previewText = useMemo(() => {
    if (!firstRecipient) return 'No recipient selected. Please go back and choose at least one candidate.';
    return sampleTransform(body, firstRecipient);
  }, [body, firstRecipient]);

  return (
    <div className="space-y-8 w-full max-w-[95%] mx-auto">
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Step 4</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Preview & send your offer letters</h2>
            <p className="mt-2 text-slate-400">Review previews, configure dispatch, and launch the campaign.</p>
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-slate-900/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Preview mode</p>
            <div className="mt-4 inline-flex overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950/90">
              {['mail', 'pdf'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-3 text-sm font-semibold transition ${selectedTab === tab ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white' : 'text-slate-300 hover:bg-slate-800/80'}`}
                >
                  {tab === 'mail' ? 'Mail Preview' : 'PDF Preview'}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-300">Delay between emails (ms)</span>
                <input
                  type="number"
                  value={dispatchSettings.delayMs}
                  onChange={(event) => setDispatchSettings({ ...dispatchSettings, delayMs: Number(event.target.value) })}
                  className="mt-3 w-full rounded-[24px] border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition duration-200 focus:border-indigo-500/70 focus:ring-4 focus:ring-indigo-500/10"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-300">Retry on failure</span>
                <div className="mt-3 flex items-center gap-3 rounded-[24px] border border-slate-800 bg-slate-950/90 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={dispatchSettings.retryOnFail}
                    onChange={(event) => setDispatchSettings({ ...dispatchSettings, retryOnFail: event.target.checked })}
                    className="h-5 w-5 rounded-md text-indigo-500"
                  />
                  <span className="text-sm text-slate-300">Retry failed sends automatically</span>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {statusMessage && (
              <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-200 shadow-[0_20px_70px_rgba(16,185,129,0.15)]">
                {statusMessage}
              </div>
            )}

            <button disabled={loading} onClick={onSend} className="w-full rounded-[24px] bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_24px_70px_rgba(99,102,241,0.22)] transition duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Sending...' : 'Send Offer Letters'}
            </button>

            <button onClick={onBack} className="w-full rounded-[24px] border border-white/10 bg-slate-900/90 px-6 py-4 text-sm font-semibold text-white transition duration-200 hover:border-white/20 hover:bg-slate-900">
              Back
            </button>
          </div>
        </aside>

        <main className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Live preview</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Render your offer content</h3>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/95 p-6 min-h-[700px] shadow-[0_20px_70px_rgba(15,23,42,0.18)]">
              {selectedTab === 'mail' ? (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Subject</p>
                  <p className="mt-3 text-xl font-semibold text-white">{subject}</p>
                  <div className="mt-6 rounded-[24px] border border-slate-800 bg-slate-950/90 p-6 text-sm leading-7 text-slate-300 whitespace-pre-wrap">
                    {previewText}
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xl font-bold text-white">F</div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">FutureWorks</p>
                        <p className="mt-1 text-lg font-semibold text-white">Offer letter PDF</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-800/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Preview</span>
                  </div>
                  <div className="mt-6 space-y-5 text-sm leading-7 text-slate-300">
                    <p>Dear {firstRecipient ? firstRecipient.Name : 'Candidate'},</p>
                    <p>{previewText}</p>
                    <p>Best regards,</p>
                    <p className="font-semibold text-white">Talent Team</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
