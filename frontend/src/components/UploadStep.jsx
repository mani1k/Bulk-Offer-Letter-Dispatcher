import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';

const friendlyKeys = {
  name: ['name', 'candidate name', 'full name', 'full_name', 'student name', 'applicant name'],
  email: ['email', 'mail', 'mail address', 'email address', 'contact email'],
  phone: ['phone', 'phone number', 'phone no', 'phone no.', 'mobile', 'mobile no', 'mobile number'],
  organization: ['organization', 'company', 'company name', 'employer', 'business', 'school', 'institution'],
  role: ['role', 'position', 'designation', 'job title'],
  duration: ['duration', 'term', 'period', 'contract length'],
  startDate: ['start date', 'start', 'joining date', 'start_date']
};

const targetFields = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'organization', label: 'Organization' },
  { key: 'role', label: 'Role' },
  { key: 'duration', label: 'Duration' },
  { key: 'startDate', label: 'Start Date' }
];

const normalizeHeader = (header = '') => header.toString().trim().toLowerCase();

const findMatch = (header, aliases) => {
  const normalized = normalizeHeader(header);
  return aliases.some((alias) => {
    const normalizedAlias = normalizeHeader(alias);
    return normalized === normalizedAlias || normalized.includes(normalizedAlias) || normalizedAlias.includes(normalized);
  });
};

const mapHeaders = (headers) => {
  return targetFields.reduce((map, field) => {
    const matched = headers.find((header) => findMatch(header, friendlyKeys[field.key] || []));
    if (matched) map[field.key] = matched;
    return map;
  }, {});
};

const getValue = (raw, mapping, key, fallback) => {
  if (mapping[key] && raw[mapping[key]] !== undefined) return raw[mapping[key]];
  if (raw[fallback] !== undefined) return raw[fallback];
  return '';
};

const createRow = (raw, mapping) => ({
  id: crypto.randomUUID(),
  Name: getValue(raw, mapping, 'name', 'Name'),
  Email: getValue(raw, mapping, 'email', 'Email'),
  Phone: getValue(raw, mapping, 'phone', 'Phone'),
  Organization: getValue(raw, mapping, 'organization', 'Organization'),
  Role: getValue(raw, mapping, 'role', 'Role'),
  Duration: getValue(raw, mapping, 'duration', 'Duration'),
  'Start Date': getValue(raw, mapping, 'startDate', 'Start Date'),
  selected: true
});

export default function UploadStep({ rows, onDataParsed, onNext }) {
  const [helpMessage, setHelpMessage] = useState('Drop a CSV file or click to browse. The parser will auto-map columns.');
  const [mapping, setMapping] = useState({});
  const [headers, setHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [mappingUpdated, setMappingUpdated] = useState(false);

  const parsedRows = useMemo(() => rawRows.map((row) => createRow(row, mapping)), [rawRows, mapping]);

  useEffect(() => {
    if (!rawRows.length) return;
    onDataParsed(parsedRows, mapping);
  }, [parsedRows, mapping, onDataParsed, rawRows]);

  const parseFile = (file) => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data, errors, meta }) => {
        if (errors.length) {
          setHelpMessage(`CSV parse error: ${errors[0].message}`);
          return;
        }
        const fileHeaders = meta.fields || [];
        const autoMap = mapHeaders(fileHeaders);
        setHeaders(fileHeaders);
        setMapping(autoMap);
        setRawRows(data);
        setMappingUpdated(false);
        setHelpMessage('Smart mapping complete. Review mapped fields below before continuing.');
      }
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    parseFile(file);
  };

  const handleInputChange = (event) => {
    parseFile(event.target.files?.[0]);
  };

  const handleMappingChange = (key, selectedHeader) => {
    setMapping((current) => ({ ...current, [key]: selectedHeader }));
    setMappingUpdated(true);
    setHelpMessage('Mapping updated. Preview has been refreshed automatically.');
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Step 1</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Upload your candidate CSV</h2>
            <p className="mt-2 text-slate-400">Import your roster, then validate and map columns instantly.</p>
          </div>

          <a
            href="data:text/csv;charset=utf-8,Full%20Name,Email%20Address,Mobile,Company,Role,Duration,Start%20Date%0AJohn%20Doe,john.doe%40example.com,555-0123,FutureWorks,Product%20Manager,6%20months,2026-07-01"
            download="sample-offer-data.csv"
            className="mt-6 inline-flex items-center gap-2 rounded-3xl border border-indigo-400/20 bg-indigo-500/10 px-5 py-3 text-sm font-semibold text-indigo-100 transition hover:border-indigo-300 hover:bg-indigo-500/15"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-400/10 text-indigo-200">⇩</span>
            Download sample CSV
          </a>

          <motion.label
            whileHover={{ translateY: -4 }}
            className="mt-6 flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-[30px] border-2 border-dashed border-slate-600/70 bg-slate-900/80 px-8 py-8 text-center transition duration-300 hover:border-violet-400/70 hover:bg-violet-500/5"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 p-4 text-white shadow-[0_20px_60px_rgba(99,102,241,0.25)]"
            >
              <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="M9 12l3 3 3-3" />
                <path d="M4 19h16" />
              </svg>
            </motion.div>
            <span className="mt-6 text-lg font-semibold text-white">Drag & drop your CSV here</span>
            <span className="mt-3 text-sm text-slate-400">or click to browse from your device</span>
            <input type="file" accept=".csv" className="sr-only" onChange={handleInputChange} />
          </motion.label>

          <p className="mt-4 text-sm text-slate-400">{helpMessage}</p>

          <div className="mt-6 rounded-[26px] border border-white/10 bg-slate-900/90 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Expected columns</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {targetFields.map((field) => (
                <span key={field.key} className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-xs text-slate-300">{field.label}</span>
              ))}
            </div>
          </div>
        </aside>

        <main className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.28)] backdrop-blur-xl flex flex-col gap-6 min-h-[740px]">
          <section className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">Recognized columns</h3>
                <p className="mt-2 text-sm text-slate-400">See the auto-mapped fields from your CSV instantly.</p>
              </div>
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-200">Auto-mapped</span>
            </div>

            {headers.length ? (
              <div className="mt-6 grid gap-4">
                {targetFields.map((field) => (
                  <div key={field.key} className="grid gap-2 rounded-[24px] border border-white/10 bg-slate-950/80 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{field.label}</p>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${mapping[field.key] ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/15 text-rose-200'}`}>
                        {mapping[field.key] ? 'Mapped' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-slate-200">{mapping[field.key] || 'Not assigned yet'}</p>
                      <select
                        value={mapping[field.key] || ''}
                        onChange={(event) => handleMappingChange(field.key, event.target.value)}
                        className="w-full rounded-[24px] border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-500/70 focus:ring-4 focus:ring-indigo-500/10 sm:w-auto"
                      >
                        <option value="">Select source column</option>
                        {headers.map((header) => (
                          <option key={header} value={header}>{header}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] bg-slate-900/80 p-6 text-sm text-slate-400">Upload a CSV to reveal the recognized columns and mapping badges.</div>
            )}
          </section>

          <section className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 flex-1 overflow-hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">Mapping preview</h3>
                <p className="mt-2 text-sm text-slate-400">Review the first rows and confirm the parsed values.</p>
              </div>
              <span className="rounded-3xl bg-slate-800/90 px-4 py-2 text-sm font-semibold text-slate-300">Showing up to 4 rows</span>
            </div>

            <div className="mt-6 h-full overflow-x-auto rounded-[24px] border border-white/10 bg-slate-950/95">
              <table className="min-w-full table-auto text-left text-sm text-slate-300">
                <thead className="bg-slate-950/95 text-slate-400">
                  <tr className="border-b border-slate-800">
                    {['Name', 'Email', 'Phone', 'Organization', 'Role', 'Duration', 'Start Date'].map((label) => (
                      <th key={label} className="px-5 py-4 font-medium uppercase tracking-[0.18em]">{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(parsedRows.length ? parsedRows.slice(0, 4) : [{ id: 'sample', Name: 'Jane Doe', Email: 'jane.doe@example.com', Phone: '555-0123', Organization: 'FutureWorks', Role: 'Product Designer', Duration: '6 months', 'Start Date': '2026-06-15' }]).map((row) => (
                    <tr key={row.id} className="border-b border-slate-800 transition duration-200 hover:bg-white/5">
                      <td className="px-5 py-4">{row.Name}</td>
                      <td className="px-5 py-4">{row.Email}</td>
                      <td className="px-5 py-4">{row.Phone}</td>
                      <td className="px-5 py-4">{row.Organization}</td>
                      <td className="px-5 py-4">{row.Role}</td>
                      <td className="px-5 py-4">{row.Duration}</td>
                      <td className="px-5 py-4">{row['Start Date']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <div className="flex justify-end">
        <button onClick={onNext} disabled={!parsedRows.length} className="rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(99,102,241,0.25)] transition duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:opacity-60">
          Continue to Review
        </button>
      </div>
    </div>
  );
}
