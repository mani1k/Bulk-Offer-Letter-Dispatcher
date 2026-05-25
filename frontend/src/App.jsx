import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import UploadStep from './components/UploadStep';
import ReviewStep from './components/ReviewStep';
import TemplateStep from './components/TemplateStep';
import PreviewStep from './components/PreviewStep';

const defaultTemplate = {
  id: 'fulltime',
  name: 'Full-Time Offer',
  description: 'Clean professional layout for salaried hires.',
  subject: 'Your Full-Time Offer',
  body: 'Hello {name},\n\nWe are excited to offer you the {Role} position starting {Start Date}. Your duration will be {Duration}.\n\nPlease confirm and we will send your official paperwork.\n\nBest,\nTalent Team'
};

const stepMeta = [
  { id: 1, label: 'Upload CSV', description: 'Import your candidate roster and auto-map fields.' },
  { id: 2, label: 'Review Data', description: 'Validate emails, edit rows, and choose recipients.' },
  { id: 3, label: 'Edit Template', description: 'Select a premium layout and personalize the message.' },
  { id: 4, label: 'Preview & Send', description: 'Review previews, configure dispatch, and send.' }
];

const emailRegex = /^[^\s@]+@[^^\s@]+\.[^\s@]+$/;

export default function App() {
  const [step, setStep] = useState(1);
  const [rows, setRows] = useState([]);
  const [fieldMap, setFieldMap] = useState({});
  const [template, setTemplate] = useState(defaultTemplate);
  const [customBody, setCustomBody] = useState(defaultTemplate.body);
  const [customSubject, setCustomSubject] = useState(defaultTemplate.subject);
  const [selectedTab, setSelectedTab] = useState('mail');
  const [dispatchSettings, setDispatchSettings] = useState({ delayMs: 750, retryOnFail: true });
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const templateTextAreaRef = useRef(null);

  const stats = useMemo(() => {
    const total = rows.length;
    const selected = rows.filter((row) => row.selected).length;
    const valid = rows.filter((row) => emailRegex.test(row.Email || '')).length;
    return {
      total,
      selected,
      valid,
      invalid: total - valid
    };
  }, [rows]);

  const availablePlaceholders = useMemo(() => {
    const dynamic = Object.keys(fieldMap).map((key) => `{${key}}`);
    const base = ['{name}', '{Role}', '{Duration}', '{Start Date}', '{Email}', '{phone}', '{organization}'];
    return Array.from(new Set([...dynamic, ...base]));
  }, [fieldMap]);

  const handleRowsChange = (nextRows, mapping = {}) => {
    setRows(nextRows.map((row) => ({ ...row, selected: row.selected ?? true })));
    if (Object.keys(mapping).length) {
      setFieldMap(mapping);
    }
  };

  const handleSend = async () => {
    const verifiedRecipients = rows.filter((row) => row.selected && emailRegex.test(row.Email || ''));
    if (!verifiedRecipients.length) {
      setStatusMessage('No verified recipients available. Please fix invalid emails or select rows.');
      return;
    }
    setLoading(true);
    setStatusMessage('Sending offer letters...');

    try {
      const response = await fetch('http://localhost:4000/api/send-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: verifiedRecipients,
          template: { ...template, body: customBody, subject: customSubject },
          dispatchSettings
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to dispatch');
      setStatusMessage(`Dispatch complete. Sent ${result.sentCount}/${verifiedRecipients.length}.`);
    } catch (error) {
      setStatusMessage(`Send failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const stepComponents = {
    1: <UploadStep rows={rows} onDataParsed={handleRowsChange} onNext={() => setStep(2)} />,
    2: <ReviewStep rows={rows} setRows={handleRowsChange} stats={stats} onBack={() => setStep(1)} onNext={() => setStep(3)} />,
    3: (
      <TemplateStep
        template={template}
        setTemplate={(templateData) => {
          setTemplate(templateData);
          setCustomSubject(templateData.subject);
        }}
        customBody={customBody}
        setCustomBody={setCustomBody}
        subject={customSubject}
        setSubject={setCustomSubject}
        availableFields={availablePlaceholders}
        onNext={() => setStep(4)}
        onBack={() => setStep(2)}
        insertPlaceholder={(token) => {
          const textarea = templateTextAreaRef.current;
          if (!textarea) return;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newText = `${customBody.slice(0, start)}${token}${customBody.slice(end)}`;
          setCustomBody(newText);
          window.requestAnimationFrame(() => {
            textarea.setSelectionRange(start + token.length, start + token.length);
            textarea.focus();
          });
        }}
        textAreaRef={templateTextAreaRef}
      />
    ),
    4: (
      <PreviewStep
        rows={rows}
        template={template}
        subject={customSubject}
        body={customBody}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        dispatchSettings={dispatchSettings}
        setDispatchSettings={setDispatchSettings}
        onBack={() => setStep(3)}
        onSend={handleSend}
        loading={loading}
        statusMessage={statusMessage}
      />
    )
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-br from-indigo-500/30 via-violet-500/10 to-transparent blur-3xl opacity-90" />
      <div className="relative mx-auto w-full max-w-[95%] px-4 pb-16 pt-10 sm:px-6 lg:px-10">
        <header className="mb-10 rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.3)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-200">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
                HR Automation Suite
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Bulk Offer Letter Dispatcher</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                Convert candidate data into polished offer letters with a premium workflow, intelligent validation, and beautifully designed templates.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-flow-col sm:auto-cols-max">
              <button onClick={() => setStep(1)} className="rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(99,102,241,0.25)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_22px_80px_rgba(99,102,241,0.35)]">
                Restart workflow
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          <section className="rounded-[32px] border border-white/10 bg-slate-950/75 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Wizard steps</p>
                <p className="mt-2 text-lg font-semibold text-white">Setup your campaign</p>
              </div>
              <span className="inline-flex rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-violet-200">Premium</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stepMeta.map((item) => {
                const isActive = item.id === step;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setStep(item.id)}
                    whileHover={{ y: -2 }}
                    className={`group w-full rounded-[28px] border px-5 py-5 text-left transition duration-300 ${isActive ? 'border-indigo-400/40 bg-indigo-500/15 shadow-[0_20px_50px_rgba(99,102,241,0.18)]' : 'border-white/10 bg-slate-950/70 hover:border-white/20 hover:bg-slate-900/80'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.label}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">{item.description}</p>
                      </div>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-3xl text-white transition ${isActive ? 'bg-gradient-to-br from-indigo-400 to-violet-500 shadow-[0_10px_30px_rgba(99,102,241,0.3)]' : 'bg-slate-900/80 group-hover:bg-slate-800'}`}>
                        {item.id}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <main className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[32px] border border-white/10 bg-white/95 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.18)]">
              {stepComponents[step]}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
