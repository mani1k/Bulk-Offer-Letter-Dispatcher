import { motion } from 'framer-motion';

const templates = [
  {
    id: 'webdev',
    name: 'Web Dev Intern',
    description: 'A friendly offer letter for development intern roles.',
    subject: 'Your Web Dev Intern offer',
    body: 'Hello {name},\n\nWe are pleased to offer you the Web Development Intern role. Your official start date is {Start Date}, with a commitment of {Duration}.\n\nPlease confirm and we will follow up with your onboarding details.\n\nRegards,\nRecruiting Team'
  },
  {
    id: 'marketing',
    name: 'Marketing Specialist',
    description: 'A concise offer for marketing and communications hires.',
    subject: 'Your Marketing Specialist offer',
    body: 'Dear {name},\n\nWe would like to extend an offer for the Marketing Specialist position. Your team will benefit from your experience in {Role} starting on {Start Date}.\n\nWe look forward to working together.\n\nSincerely,\nPeople Operations'
  },
  {
    id: 'fulltime',
    name: 'Full-Time Offer',
    description: 'A polished full-time offer layout for salaried roles.',
    subject: 'Your Full-Time Offer',
    body: 'Hello {name},\n\nWe are happy to offer you the {Role} position at our company. Your contract begins on {Start Date} and the program duration is {Duration}.\n\nPlease reply to confirm, and we will send the official agreement.\n\nBest,\nHR Team'
  },
  {
    id: 'contract',
    name: 'Contract Role',
    description: 'A flexible contract-based letter for fixed-term hires.',
    subject: 'Your Contract Role offer',
    body: 'Hi {name},\n\nWe are excited to offer you a contract engagement as {Role}. Your assignment begins on {Start Date} and spans {Duration}.\n\nLet us know if you have any questions before we finalize your paperwork.\n\nThanks,\nOperations'
  }
];

const placeholders = ['{name}', '{Role}', '{Duration}', '{Start Date}', '{Email}', '{phone}', '{organization}'];

export default function TemplateStep({ template, setTemplate, customBody, setCustomBody, subject, setSubject, onBack, onNext, availableFields = [], insertPlaceholder, textAreaRef }) {
  const displayedPlaceholders = availableFields.length ? availableFields : placeholders;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-[30px] border border-white/10 bg-slate-950/85 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Step 3</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Select a polished template</h2>
          <p className="mt-2 text-slate-400">Choose a professional layout that matches your employer brand.</p>

          <div className="mt-6 space-y-4">
            {templates.map((item) => {
              const selected = template.id === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={{ y: -2 }}
                  onClick={() => {
                    setTemplate(item);
                    setCustomBody(item.body);
                    setSubject(item.subject);
                  }}
                  className={`w-full rounded-[26px] border p-5 text-left transition ${selected ? 'border-indigo-400/40 bg-indigo-500/12 shadow-[0_20px_60px_rgba(99,102,241,0.2)]' : 'border-white/10 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900/90'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                    </div>
                    {selected && <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-100">Selected</span>}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-slate-950/85 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)] backdrop-blur-xl flex min-h-[650px] flex-col">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Template editor</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Customize your email</h3>
            </div>
            <label className="block w-full">
              <span className="text-sm font-semibold text-slate-300">Email Subject</span>
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="mt-3 w-full rounded-[24px] border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white shadow-[0_20px_50px_rgba(15,23,42,0.2)] outline-none transition duration-200 focus:border-indigo-500/70 focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Your Web Dev Intern offer"
              />
            </label>
            <div>
              <p className="text-sm font-semibold text-slate-300">Placeholders</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {displayedPlaceholders.map((token) => (
                  <button
                    key={token}
                    type="button"
                    onClick={() => insertPlaceholder(token)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-200 transition duration-200 hover:border-indigo-400 hover:bg-indigo-500/15"
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-200">+</span>
                    {token}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex-1">
            <textarea
              ref={textAreaRef}
              value={customBody}
              onChange={(event) => setCustomBody(event.target.value)}
              className="h-full min-h-[420px] w-full rounded-[28px] border border-white/10 bg-slate-900/95 px-5 py-5 text-sm leading-7 text-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.22)] outline-none transition duration-200 focus:border-indigo-500/70 focus:ring-4 focus:ring-indigo-500/10 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <button onClick={onBack} className="rounded-[24px] border border-white/10 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:border-white/20 hover:bg-slate-900">
          Back
        </button>
        <button onClick={onNext} className="rounded-[24px] bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_24px_70px_rgba(99,102,241,0.22)] transition duration-300 hover:scale-[1.01]">
          Continue to Preview
        </button>
      </div>
    </div>
  );
}
