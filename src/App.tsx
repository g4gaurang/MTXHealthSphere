import { useEffect, useRef, useState } from 'react'
import {
  Activity, AlertTriangle, ArrowRight, Building2, Check, CheckCircle2,
  ChevronDown, CircleDot, Database, HeartHandshake, Layers3, LockKeyhole,
  Menu, MessageSquareText, Network, RefreshCw, Route, Send, Settings2, ShieldCheck,
  SlidersHorizontal, Sparkles, Users, X,
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'

type Detail = { title: string; summary: string; meta?: string[] }

const challenges: Detail[] = [
  { title: 'Fragmented patient information', summary: 'Clinical events, patient records, risk files, historical data, and engagement history may reside in separate systems.', meta: ['Who: Care, population, and data teams', 'Effect: Time spent locating relevant context', 'MTX response: Organize approved information from HIEs, clinical systems, legacy platforms, secure files, and engagement channels.', 'Monitor: Connected sources · Records processed · Delivery status · Unresolved exceptions'] },
  { title: 'Delayed awareness of care events', summary: 'Care teams may learn about an admission, discharge, transfer, or encounter after a useful follow-up window.', meta: ['Who: Care managers and clinical coordinators', 'Effect: Follow-up can begin later than intended', 'MTX response: Process configured event feeds and create permitted notifications, tasks, or care-management updates.', 'Monitor: Events received · Processing latency · Failed events · Tasks created'] },
  { title: 'Identity and duplicate-record issues', summary: 'Patient and subscriber records may contain incomplete, conflicting, or duplicated information.', meta: ['Who: Data stewards and care teams', 'Effect: Records require authorized review', 'MTX response: Apply configurable matching, validation, duplicate indicators, survivorship, and exception review.', 'Monitor: Potential duplicates · Matched records · Identity exceptions · Contact-data quality'] },
  { title: 'Disconnected clinical and engagement activity', summary: 'Care-management and engagement teams may work with different patient lists, histories, or program information.', meta: ['Who: Clinical and engagement operations', 'Effect: Outreach and follow-up can become disconnected', 'MTX response: Connect approved program information with governed audiences, journeys, and follow-up workflows.', 'Monitor: Audience eligibility · Outreach status · Responses · Follow-up completion'] },
  { title: 'Manual market or program onboarding', summary: 'Adding a market, provider network, source, or program may repeat interface and mapping work.', meta: ['Who: Architecture and implementation teams', 'Effect: Repeated configuration and review', 'MTX response: Reuse configurable interface patterns, mapping templates, workflows, and dashboards.', 'Monitor: Interfaces configured · Mappings reused · Onboarding exceptions · Release readiness'] },
  { title: 'Limited interface visibility', summary: 'Operational teams may not know whether a message, file, transformation, or delivery failed.', meta: ['Who: Integration support and supervisors', 'Effect: Exceptions may remain unresolved', 'MTX response: Provide monitoring, exception queues, retry controls, reconciliation, and reporting.', 'Monitor: Processing status · Exceptions · Retries · Reconciliation · Unresolved failures'] },
]

const journey: Detail[] = [
  { title: 'Connect', summary: 'Configure approved HIE, EHR, legacy, secure-file, provider-network, risk-data, and engagement connections.', meta: ['Capabilities: Connection profiles · Credentials references · Schedules', 'Human responsibility: Approve source, purpose, and access', 'Data considerations: Minimum necessary scope and transport security', 'Monitor: Connection readiness and source availability'] },
  { title: 'Receive', summary: 'Accept messages, files, documents, API payloads, and scheduled extracts through approved interfaces.', meta: ['Capabilities: API, HL7 v2, C-CDA, event, queue, and file patterns', 'Human responsibility: Monitor expected arrivals', 'Data considerations: Encryption and ingress validation', 'Monitor: Volume, latency, and receipt status'] },
  { title: 'Transform', summary: 'Map source information to configured HealthSphere structures and downstream requirements.', meta: ['Capabilities: Mapping, terminology, enrichment, and version control', 'Human responsibility: Review mapping changes', 'Data considerations: Source traceability', 'Monitor: Mapping errors and version use'] },
  { title: 'Match and Validate', summary: 'Apply identity matching, required-field checks, terminology mappings, duplicate indicators, and exception rules.', meta: ['Capabilities: Configurable thresholds and review queues', 'Human responsibility: Resolve uncertain identity results', 'Data considerations: No automatic merge without authorized review', 'Monitor: Match outcomes and unresolved exceptions'] },
  { title: 'Organize', summary: 'Associate permitted information with patient, provider, encounter, program, risk, or engagement context.', meta: ['Capabilities: Contextual profiles and relationships', 'Human responsibility: Confirm configured use', 'Data considerations: Role-based visibility', 'Monitor: Association and data-quality status'] },
  { title: 'Activate', summary: 'Create authorized notifications, tasks, audience membership, care workflows, files, or approved communications.', meta: ['Capabilities: Rules, workflows, journeys, and templates', 'Human responsibility: Approve sensitive actions', 'Data considerations: Consent and preference checks', 'Monitor: Tasks, deliveries, and responses'] },
  { title: 'Monitor', summary: 'Track processing, exceptions, data quality, delivery, consent, engagement activity, and operations.', meta: ['Capabilities: Dashboards, queues, reconciliation, and history', 'Human responsibility: Review and act on exceptions', 'Data considerations: Masking and logging controls', 'Monitor: Operational measures by source and program'] },
]

const dataTypes: Detail[] = [
  { title: 'Patients and Members', summary: 'Demographics, identifiers, program relationships, and contact attributes.', meta: ['Sources: HIE, EHR, eligibility file, legacy database', 'Validations: Required fields, format, duplicate indicators', 'Uses: Patient context, matching, permitted workflows', 'Privacy: Minimum necessary views and masking', 'Destinations: Care workspace, approved downstream system'] },
  { title: 'Healthcare Providers', summary: 'Provider identity, affiliations, specialties, and routing context.', meta: ['Sources: Provider directory, EHR, network source', 'Validations: Identifier and affiliation checks', 'Uses: Routing, attribution, relationship context', 'Privacy: Limit sensitive provider metadata', 'Destinations: Workflows and directory synchronization'] },
  { title: 'Admissions, Discharges, and Transfers', summary: 'Configured HL7 v2 ADT message events, such as a synthetic ADT^A04 registration.', meta: ['Sources: Hospital ADT feed or HIE', 'Validations: Event type, patient fields, facility mapping', 'Uses: Permitted notification and transition tasks', 'Privacy: Event visibility by role', 'Destinations: Care workflow and event history'] },
  { title: 'Encounters', summary: 'Encounter type, location category, timestamps, and provider context.', meta: ['Sources: EHR, HIE, clinical extract', 'Validations: Required context and source mapping', 'Uses: Longitudinal event context', 'Privacy: Approved clinical access only', 'Destinations: Patient and population views'] },
  { title: 'Clinical Documents', summary: 'Document metadata and configured C-CDA content.', meta: ['Sources: HIE, EHR, document repository', 'Validations: Document type and required sections', 'Uses: Permitted care context', 'Privacy: Sensitive content controls', 'Destinations: Authorized clinical workspace'] },
  { title: 'Risk and Population Files', summary: 'Program rosters, risk categories, attribution, and effective periods.', meta: ['Sources: Health plan, analytics platform, secure file', 'Validations: Layout, date, program, and value mapping', 'Uses: Program operations and work queues', 'Privacy: Approved program purpose', 'Destinations: Population workspace and outbound file'] },
  { title: 'Subscriber and Contact Information', summary: 'Channel address, preference, consent status, and subscriber state.', meta: ['Sources: Engagement platform, portal, approved patient source', 'Validations: Contact format, consent, and preference', 'Uses: Governed audience and journey operations', 'Privacy: Engagement receives approved attributes only', 'Destinations: Salesforce Marketing Cloud'] },
  { title: 'Engagement and Communication Activity', summary: 'Journey, delivery, response, opt-out, and follow-up activity.', meta: ['Sources: Engagement channel and contact center', 'Validations: Journey and subscriber correlation', 'Uses: Communication history and care follow-up', 'Privacy: Purpose-based visibility', 'Destinations: Engagement and care workspaces'] },
]

const roles: Detail[] = [
  { title: 'Care Managers', summary: 'Review permitted patient events, encounter information, risk context, outreach history, assigned tasks, and follow-up activity.' },
  { title: 'Clinical Coordinators', summary: 'Monitor care transitions, coordinate follow-up, document actions, and work with assigned patient populations.' },
  { title: 'Population-Health Teams', summary: 'Manage program rosters, risk files, work queues, measures, and regional activity.' },
  { title: 'Patient Engagement Teams', summary: 'Build approved segments, manage preferences, configure journeys, and monitor campaign operations.' },
  { title: 'Data and Integration Teams', summary: 'Monitor interfaces, mappings, message processing, file delivery, data-quality exceptions, and reconciliation.' },
  { title: 'Supervisors', summary: 'Review workload, escalation, transition status, exception age, and operating measures.' },
  { title: 'Privacy and Security Teams', summary: 'Review access, consent, data movement, retention settings, audit activity, and approved-use configuration.' },
  { title: 'Executives', summary: 'View population, utilization, care-transition, engagement, and data-operations measures based on authorized information.' },
]

const capabilities: Detail[] = [
  { title: 'Healthcare Data Exchange', summary: 'HIE connectivity · Clinical-system interfaces · API integration · Secure file exchange · HL7 v2 and C-CDA processing · Batch ingestion · Outbound files · Acknowledgement · Reconciliation' },
  { title: 'Transformation and Mapping', summary: 'Source-to-target mappings · Field transformation · Terminology mapping · Validation · Version control · Market configurations · Enrichment · Exceptions' },
  { title: 'Patient and Provider Data Management', summary: 'Patient and provider profiles · Identity matching · Duplicate indicators · Contact validation · Relationships · Program enrollment · Data-quality review' },
  { title: 'Care and Population-Health Workflows', summary: 'Event notifications · Care-transition tasks · Work queues · Risk-list processing · Follow-up · Assignments · Escalations · Program tracking' },
  { title: 'Patient Engagement', summary: 'Audience segmentation · Subscriber management · Preferences · Outreach journeys · Approved templates · Digital communications · Responses · Follow-up tasks' },
  { title: 'Analytics and Administration', summary: 'Interface dashboards · Exception monitoring · Population views · Care-event trends · Engagement operations · Data quality · Roles · Configuration · Audit history' },
]

const interfaces = [
  ['Regional HIE feed', 'Event feed', '21:42', '1,248', '1,241', '7', 'Review required', 'Pending', 'Integration operations'],
  ['Hospital ADT feed', 'Near-real-time event feed', '21:39', '864', '862', '2', 'Retry scheduled', 'Reconciled', 'Interface support'],
  ['Historical clinical-data migration', 'Secure batch files', '18:10', '18 files', '17', '1', 'Awaiting source', 'Pending', 'Migration team'],
  ['Risk-file intake', 'Scheduled secure file', '20:05', '4 files', '4', '0', 'Operating', 'Reconciled', 'Population data'],
  ['Provider-directory synchronization', 'API batch', '19:30', '2,106', '2,106', '0', 'Operating', 'Reconciled', 'Data stewardship'],
  ['Engagement subscriber synchronization', 'Scheduled API', '20:45', '3,420', '3,411', '9', 'Review required', 'Pending', 'Engagement operations'],
  ['Outbound risk-file delivery', 'Secure batch file', '17:00', '2 files', '2', '0', 'Operating', 'Reconciled', 'Integration operations'],
]

const qualityItems = [
  ['Potential duplicate patient', 'Identity', 'Compare two synthetic demographic records; authorized review required.'],
  ['Missing provider identifier', 'Provider', 'Source record lacks the configured network identifier.'],
  ['Conflicting contact information', 'Contact', 'Clinical and engagement sources contain different values.'],
  ['Unmapped source value', 'Mapping', 'Source program code is not mapped in the active version.'],
  ['Incomplete encounter record', 'Clinical event', 'Configured encounter context is missing.'],
  ['Subscriber without valid consent status', 'Consent', 'Subscriber cannot enter an outreach journey pending review.'],
  ['Outbound-file reconciliation difference', 'Delivery', 'Destination acknowledgement differs from sent count.'],
]

const analytics = [
  { name: 'Mon', received: 420, completed: 407, exceptions: 13 },
  { name: 'Tue', received: 510, completed: 496, exceptions: 14 },
  { name: 'Wed', received: 470, completed: 461, exceptions: 9 },
  { name: 'Thu', received: 620, completed: 598, exceptions: 22 },
  { name: 'Fri', received: 560, completed: 548, exceptions: 12 },
  { name: 'Sat', received: 280, completed: 274, exceptions: 6 },
  { name: 'Sun', received: 305, completed: 298, exceptions: 7 },
]

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'good' | 'warn' }) {
  return <span className={`badge ${tone}`}>{children}</span>
}

function SectionHead({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <div className="section-head"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{copy}</p></div>
}

function Selector({ items, active, onSelect, label }: { items: Detail[]; active: number; onSelect: (i: number) => void; label: string }) {
  return <div className="selector" role="tablist" aria-label={label}>
    {items.map((item, i) => <button key={item.title} role="tab" aria-selected={active === i} className={active === i ? 'active' : ''} onClick={() => onSelect(i)}>{item.title}</button>)}
  </div>
}

function DetailPanel({ item, kicker }: { item: Detail; kicker?: string }) {
  return <div className="detail-panel" role="tabpanel">
    {kicker && <span className="micro">{kicker}</span>}<h3>{item.title}</h3><p>{item.summary}</p>
    {item.meta && <ul>{item.meta.map(m => <li key={m}><CheckCircle2 size={16} />{m}</li>)}</ul>}
  </div>
}

function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement
    const node = dialog.current
    node?.querySelector<HTMLElement>('button, input, select, textarea')?.focus()
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && node) {
        const focusable = [...node.querySelectorAll<HTMLElement>('button, input, select, textarea')]
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', handle)
    document.body.classList.add('modal-open')
    return () => { document.removeEventListener('keydown', handle); document.body.classList.remove('modal-open'); previous?.focus() }
  }, [open, onClose])
  if (!open) return null
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="demo-title" ref={dialog}>
      <button className="icon-button close" onClick={onClose} aria-label="Close demonstration request"><X /></button>
      {submitted ? <div className="confirmation"><div className="success-mark"><Check /></div><span className="eyebrow">Prototype confirmation</span><h2 id="demo-title">Request prepared.</h2><p>This demonstration does not transmit or retain information. In a production experience, your request would move through an approved MTX intake process.</p><button className="button primary" onClick={() => { setSubmitted(false); onClose() }}>Close</button></div> :
      <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
        <span className="eyebrow">Product demonstration</span><h2 id="demo-title">Start a focused conversation.</h2><p className="form-note">Prototype only. Information entered here is not transmitted or retained.</p>
        <div className="form-grid">
          <label>Name<input required autoComplete="name" /></label><label>Organization<input required autoComplete="organization" /></label>
          <label>Work email<input required type="email" autoComplete="email" /></label><label>Role<input required /></label>
          <label>Organization type<select required defaultValue=""><option value="" disabled>Select one</option><option>Health system</option><option>Health plan</option><option>Provider network</option><option>Public-health agency</option><option>Other healthcare organization</option></select></label>
          <label>Current healthcare platforms<input placeholder="Optional" /></label>
          <label>Priority data sources<input placeholder="HIE, EHR, secure files…" /></label><label>Primary exchange or engagement need<input required /></label>
          <label>Approximate market or program scope<input placeholder="Optional" /></label><label className="wide">Optional message<textarea rows={3} /></label>
        </div>
        <button className="button primary" type="submit">Prepare request <ArrowRight size={18} /></button>
      </form>}
    </div>
  </div>
}

function HeroVisual() {
  const [side, setSide] = useState<'exchange' | 'engagement'>('exchange')
  const exchange = [
    ['Source connection', 'Regional HIE feed', 'Operating'], ['Clinical event', 'Discharge event received', 'Processed'],
    ['Patient match', 'Candidate reviewed', 'Matched'], ['Transformation', 'ADT mapping v4.2', 'Complete'],
    ['Data quality', '2 fields routed', 'Review required'], ['Delivery', 'Care workspace', 'Acknowledged'],
  ]
  const engagement = [
    ['Audience segment', 'Care-transition follow-up', '312 eligible'], ['Preference', 'Approved digital channel', 'Applied'],
    ['Outreach journey', 'Transition check-in', 'Active'], ['Delivery', 'Synthetic batch 08', 'Prepared'],
    ['Response activity', '32 simulated responses', 'Recorded'], ['Follow-up task', 'Coordinator review', 'Open'],
  ]
  return <div className="hero-visual">
    <div className="visual-top"><div><span className="live-dot" /> Illustrative product view</div><Badge>Synthetic demonstration data</Badge></div>
    <div className="visual-tabs" role="tablist" aria-label="Hero product view">
      <button className={side === 'exchange' ? 'active' : ''} onClick={() => setSide('exchange')}>Information exchange</button>
      <button className={side === 'engagement' ? 'active' : ''} onClick={() => setSide('engagement')}>Engagement</button>
    </div>
    <div className="signal-flow"><span>Approved source</span><i /><span>HealthSphere</span><i /><span>{side === 'exchange' ? 'Care workflow' : 'Engagement journey'}</span></div>
    <div className="status-list">{(side === 'exchange' ? exchange : engagement).map(([a,b,c], i) =>
      <button key={a} className="status-row" style={{ '--delay': `${i * 50}ms` } as React.CSSProperties}><span className="status-icon">{i % 3 === 0 ? <Database size={16}/> : i % 3 === 1 ? <Activity size={16}/> : <Route size={16}/>}</span><span><small>{a}</small><strong>{b}</strong></span><Badge tone={c.includes('Review') ? 'warn' : 'good'}>{c}</Badge></button>)}</div>
  </div>
}

function App() {
  const [menu, setMenu] = useState(false)
  const [modal, setModal] = useState(false)
  const [challenge, setChallenge] = useState(0)
  const [step, setStep] = useState(0)
  const [dataType, setDataType] = useState(0)
  const [role, setRole] = useState(0)
  const [capability, setCapability] = useState(0)
  const [patientEvent, setPatientEvent] = useState(0)
  const [connection, setConnection] = useState(0)
  const [quality, setQuality] = useState(0)
  const [resolution, setResolution] = useState('Route to identity steward')
  const [note, setNote] = useState('')
  const [audience, setAudience] = useState('Recently discharged patients')
  const [objective, setObjective] = useState('Care-transition follow-up')
  const [channel, setChannel] = useState('Email')
  const [transition, setTransition] = useState(0)
  const [analyticsView, setAnalyticsView] = useState('Exchange')
  const [architecture, setArchitecture] = useState(1)
  const [profile, setProfile] = useState('Harbor Market')
  const [phase, setPhase] = useState(0)
  const nav = [['Product','product'],['Challenges','challenges'],['Information Journey','information-journey'],['Experiences','experiences'],['Capabilities','capabilities'],['Engagement','engagement'],['Analytics','analytics'],['Architecture','architecture'],['Adoption','adoption']]
  const patientEvents = [
    ['Admission event', 'Hospital ADT feed', 'Today · 08:42', 'Transformed', 'Matched after configured review'],
    ['Discharge event', 'Regional HIE feed', 'Today · 15:18', 'Transformed', 'Matched'],
    ['Program enrollment', 'Care-management platform', 'Previous cycle', 'Validated', 'Associated'],
    ['Approved communication', 'Engagement platform', 'Today · 16:05', 'Recorded', 'Subscriber linked'],
  ]
  const transitionSteps = [
    ['Admission event received','Hospital event feed','Configured ADT event rule','Integration operations'],
    ['Patient matched','Identity service','Configured threshold plus review','Data steward'],
    ['Program eligibility checked','Program configuration','Approved eligibility criteria','Population-health team'],
    ['Care coordinator notified','HealthSphere workflow','Role and assignment rule','Clinical supervisor'],
    ['Follow-up task created','Care workspace','Transition task template','Care coordinator'],
    ['Approved outreach prepared','Engagement workspace','Consent, preference, template','Engagement reviewer'],
    ['Response recorded','Approved channel','Response correlation','Engagement operations'],
    ['Journey updated','HealthSphere timeline','Configured completion rule','Care coordinator'],
  ]
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="nav-shell">
      <a className="brand" href="#top" aria-label="MTX HealthSphere home"><span>MTX</span><i /><b>HealthSphere</b></a>
      <button className="nav-toggle" aria-expanded={menu} aria-controls="main-nav" onClick={() => setMenu(!menu)}><Menu /><span className="sr-only">Toggle navigation</span></button>
      <nav id="main-nav" className={menu ? 'open' : ''} aria-label="Main navigation">{nav.map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}<button className="button nav-cta" onClick={() => { setMenu(false); setModal(true) }}>Request a Demo</button></nav>
    </header>

    <main id="main">
      <section className="hero" id="top"><div className="hero-grid">
        <div className="hero-copy"><span className="eyebrow light">MTX Healthcare</span><h1>Connect healthcare information with the people and workflows that act on it.</h1><p>MTX HealthSphere brings clinical events, patient and provider information, risk data, and engagement activity into a connected operating environment for care coordination, population-health programs, and patient communications.</p>
          <div className="actions"><button className="button primary" onClick={() => setModal(true)}>Request a Product Demonstration <ArrowRight size={18}/></button><a className="button secondary" href="#information-journey">Explore the Information Journey</a></div>
          <div className="trust"><ShieldCheck size={20}/><span>Designed for governed data exchange, role-based access, and coordinated patient engagement.</span></div>
        </div><HeroVisual />
      </div></section>

      <section className="foundation" id="product" aria-label="Product foundation"><div className="foundation-intro"><span className="micro">Information Exchange &amp; Engagement Platform</span><p>Clinical and engagement data integration for connected patient and population-health operations. HealthSphere connects with health information exchanges and existing clinical systems.</p></div>
        {[[Network,'Connected healthcare information'],[HeartHandshake,'Coordinated care-team workflows'],[MessageSquareText,'Governed patient engagement'],[Layers3,'Reusable integration patterns']].map(([Icon,label]) => { const I = Icon as typeof Network; return <div className="foundation-item" key={label as string}><I/><span>{label as string}</span></div> })}
      </section>

      <section id="challenges" className="section">
        <SectionHead eyebrow="Challenges and responses" title="Patient information loses value when it remains fragmented across systems and channels." copy="Explore how configured exchange, workflow, data-quality, and engagement capabilities respond to common operating constraints." />
        <div className="interactive-grid"><Selector items={challenges} active={challenge} onSelect={setChallenge} label="Healthcare challenges" /><DetailPanel item={challenges[challenge]} kicker={`Challenge ${challenge + 1} of 6`} /></div>
      </section>

      <section id="information-journey" className="section tinted">
        <SectionHead eyebrow="Information journey" title="From approved source to permitted action." copy="Each stage combines technical processing, governance, and human responsibility." />
        <div className="stepper" role="tablist" aria-label="Information journey stages">{journey.map((item,i) => <button key={item.title} className={step === i ? 'active' : ''} role="tab" aria-selected={step === i} onClick={() => setStep(i)}><span>{i+1}</span>{item.title}</button>)}</div>
        <DetailPanel item={journey[step]} kicker={`Stage ${step + 1} of 7`} />
      </section>

      <section className="section" id="data-explorer">
        <SectionHead eyebrow="Data-type explorer" title="Connect the information each workflow is permitted to use." copy="Support depends on source capabilities, configured mappings, privacy review, and deployed architecture." />
        <div className="interactive-grid reverse"><DetailPanel item={dataTypes[dataType]} kicker="Selected data type" /><Selector items={dataTypes} active={dataType} onSelect={setDataType} label="Healthcare data types" /></div>
      </section>

      <section id="experiences" className="section dark">
        <SectionHead eyebrow="Role-based experiences" title="Context shaped for the work at hand." copy="Workspaces can present permitted information, tasks, exceptions, and measures based on role and purpose." />
        <div className="persona-grid" role="tablist" aria-label="User experiences">{roles.map((item,i) => <button key={item.title} className={role === i ? 'active' : ''} onClick={() => setRole(i)} role="tab" aria-selected={role === i}><Users/><span>{item.title}</span></button>)}</div>
        <DetailPanel item={roles[role]} kicker="Illustrative role view" />
      </section>

      <section id="capabilities" className="section">
        <SectionHead eyebrow="Product capabilities" title="A configurable foundation for exchange, operations, and engagement." copy="Select a capability family to view the reusable components available to an implementation." />
        <div className="capability-wheel"><div className="capability-list" role="tablist">{capabilities.map((item,i) => <button role="tab" aria-selected={capability===i} className={capability===i?'active':''} key={item.title} onClick={()=>setCapability(i)}><span>0{i+1}</span>{item.title}</button>)}</div><div className="capability-focus"><Layers3/><span className="micro">Capability family</span><h3>{capabilities[capability].title}</h3><p>{capabilities[capability].summary}</p></div></div>
      </section>

      <section className="section tinted" id="patient-journey">
        <SectionHead eyebrow="Connected patient journey" title="Bring permitted events, program context, and follow-up into one timeline." copy="Synthetic patient journey — no real health information." />
        <div className="workspace"><div className="workspace-bar"><div><Badge>Synthetic profile</Badge><h3>Journey profile HX–Sample</h3><p>Care-management program · Elevated program category · Digital communication permitted</p></div><div className="owner"><span>Assigned care manager</span><b>Demo Care Team A</b></div></div>
          <div className="timeline">{patientEvents.map((e,i)=><button key={e[0]} className={patientEvent===i?'active':''} onClick={()=>setPatientEvent(i)}><CircleDot/><span><small>{e[2]}</small><b>{e[0]}</b></span></button>)}</div>
          <div className="event-detail"><div><span>Source category</span><b>{patientEvents[patientEvent][1]}</b></div><div><span>Received</span><b>{patientEvents[patientEvent][2]}</b></div><div><span>Transformation</span><b>{patientEvents[patientEvent][3]}</b></div><div><span>Matching</span><b>{patientEvents[patientEvent][4]}</b></div></div>
          <div className="workspace-actions"><button className="button secondary dark-text">Open associated task</button><button className="button secondary dark-text">View permitted engagement activity</button></div>
        </div>
      </section>

      <section className="section" id="monitoring">
        <SectionHead eyebrow="Interface monitoring" title="See processing, exceptions, retries, and reconciliation in one workspace." copy="Fictional connections and synthetic operating data illustrate support workflows." />
        <div className="monitor-layout"><div className="connection-list" role="tablist">{interfaces.map((row,i)=><button key={row[0]} onClick={()=>setConnection(i)} className={connection===i?'active':''}><span className={`health ${row[6]==='Operating'?'ok':'attention'}`} /><span><b>{row[0]}</b><small>{row[1]} · Last processing {row[2]}</small></span><ChevronDown/></button>)}</div>
          <div className="monitor-card"><div className="monitor-head"><div><span className="micro">Connection detail</span><h3>{interfaces[connection][0]}</h3></div><Badge tone={interfaces[connection][6]==='Operating'?'good':'warn'}>{interfaces[connection][6]}</Badge></div><div className="metric-grid"><div><span>Received</span><b>{interfaces[connection][3]}</b></div><div><span>Completed</span><b>{interfaces[connection][4]}</b></div><div><span>Exceptions</span><b>{interfaces[connection][5]}</b></div><div><span>Reconciliation</span><b>{interfaces[connection][7]}</b></div></div><div className="owner-row"><Settings2/><span>Support owner</span><b>{interfaces[connection][8]}</b></div><button className="button tertiary"><RefreshCw size={17}/> Review retry controls</button></div>
        </div>
      </section>

      <section className="section dark" id="data-quality">
        <SectionHead eyebrow="Data quality and identity" title="Route uncertain data to authorized review." copy="Patient records cannot be merged automatically in this demonstration." />
        <div className="quality-layout"><div className="quality-list">{qualityItems.map((q,i)=><button key={q[0]} className={quality===i?'active':''} onClick={()=>setQuality(i)}><AlertTriangle/><span><b>{q[0]}</b><small>{q[1]}</small></span><ArrowRight/></button>)}</div>
          <div className="review-card"><span className="micro">Review queue item</span><h3>{qualityItems[quality][0]}</h3><p>{qualityItems[quality][2]}</p><div className="compare"><div><small>Source A</small><b>Configured source value</b><span>Received and traceable</span></div><div><small>Source B</small><b>Different source value</b><span>Requires permitted resolution</span></div></div><label>Permitted resolution<select value={resolution} onChange={e=>setResolution(e.target.value)}><option>Route to identity steward</option><option>Request source correction</option><option>Accept configured source priority</option><option>Mark for later review</option></select></label><label>Review note<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a synthetic review note" rows={2}/></label><div className="review-actions"><button className="button primary" onClick={()=>setNote('Routed for authorized review — demonstration only.')}>Route exception</button><button className="button tertiary">View resolution history</button></div></div>
        </div>
      </section>

      <section className="section" id="engagement">
        <SectionHead eyebrow="Patient engagement studio" title="Coordinate approved audiences, preferences, and outreach journeys." copy="Demonstration only — no messages will be sent." />
        <div className="studio"><div className="studio-config"><label>Audience<select value={audience} onChange={e=>setAudience(e.target.value)}>{['Recently discharged patients','Care-management participants','Preventive outreach population','Program members requiring follow-up','Patients with a recorded communication preference'].map(x=><option key={x}>{x}</option>)}</select></label><label>Objective<select value={objective} onChange={e=>setObjective(e.target.value)}>{['Care-transition follow-up','Appointment reminder','Program education','Missing-information request','General wellness outreach'].map(x=><option key={x}>{x}</option>)}</select></label><label>Channel<select value={channel} onChange={e=>setChannel(e.target.value)}>{['Email','SMS where approved','Portal message','Care-team task','Contact-center follow-up'].map(x=><option key={x}>{x}</option>)}</select></label>
          <fieldset><legend>Configured controls</legend>{['Consent requirement','Communication preference','Quiet hours','Approved template','Human approval','Exit condition','Frequency limit'].map((x,i)=><label className="check" key={x}><input type="checkbox" defaultChecked={i<5}/><span>{x}</span></label>)}</fieldset></div>
          <div className="audience-preview"><span className="micro">Synthetic audience estimate</span><b className="big-number">{270 + audience.length * 3}</b><span>eligible demonstration records</span><div className="journey-card"><Send/><div><small>Prepared journey</small><b>{objective}</b><span>{channel} · {audience}</span></div></div><div className="guardrail"><LockKeyhole/><span>Consent, preferences, approval, and frequency controls are checked before permitted activation.</span></div><button className="button disabled" disabled>Sending disabled in prototype</button></div></div>
      </section>

      <section className="section tinted" id="care-transition">
        <SectionHead eyebrow="Care-transition demonstration" title="Follow a configured event from receipt to coordinated action." copy="Rules support operations; authorized staff retain responsibility for clinical decisions and patient contact." />
        <div className="transition-flow" role="tablist">{transitionSteps.map((s,i)=><button role="tab" aria-selected={transition===i} className={transition===i?'active':''} key={s[0]} onClick={()=>setTransition(i)}><span>{i+1}</span><b>{s[0]}</b></button>)}</div>
        <div className="transition-detail"><div><span>Source</span><b>{transitionSteps[transition][1]}</b></div><div><span>Rule or configuration</span><b>{transitionSteps[transition][2]}</b></div><div><span>Responsible role</span><b>{transitionSteps[transition][3]}</b></div><div><span>Processing status</span><Badge tone="good">Illustrative complete</Badge></div><div><span>Audit record</span><b>Configuration and action history recorded</b></div></div>
      </section>

      <section className="section ai-section" id="responsible-ai">
        <SectionHead eyebrow="Responsible AI" title="AI assistance grounded in approved healthcare information." copy="Potential assistance is bounded by configured access, validation, human review, and permitted action." />
        <div className="ai-process">{['Approved healthcare information','AI-assisted preparation','Configured validation','Authorized staff review','Permitted action','Recorded history'].map((x,i)=><div key={x}><span>{i+1}</span><b>{x}</b>{i<5&&<ArrowRight/>}</div>)}</div>
        <div className="ai-grid"><div><Sparkles/><h3>Potential assistance</h3><p>Summarize permitted event history · Prepare a transition chronology · Classify integration exceptions · Identify inconsistent data · Draft from approved outreach templates · Suggest an operational next step · Support audience analysis · Forecast operating volume</p></div><div><ShieldCheck/><h3>Configured controls</h3><p>Minimum necessary data · Role-based access · Source traceability · Approved prompts and templates · Human review · Model versioning · Override capture · Output monitoring · Data boundaries · Environment separation</p></div></div>
        <p className="callout">AI assistance does not diagnose conditions, recommend treatment, determine clinical risk independently, or contact a patient without configured authorization.</p>
      </section>

      <section id="analytics" className="section dark">
        <SectionHead eyebrow="Operational analytics" title="Measure the health of exchange, care operations, engagement, and data quality." copy="Synthetic, illustrative analytics — not MTX or customer results." />
        <div className="analytics-tabs" role="tablist">{['Exchange','Patient & population','Engagement','Data quality'].map(x=><button role="tab" aria-selected={analyticsView===x} className={analyticsView===x?'active':''} key={x} onClick={()=>setAnalyticsView(x)}>{x}</button>)}</div>
        <div className="analytics-grid"><div className="chart-card"><div className="chart-title"><div><span className="micro">7-day illustrative view</span><h3>{analyticsView} activity</h3></div><Badge>Synthetic</Badge></div><ResponsiveContainer width="100%" height={260}><AreaChart data={analytics}><defs><linearGradient id="received" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#62d6c5" stopOpacity={.45}/><stop offset="95%" stopColor="#62d6c5" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#29465b"/><XAxis dataKey="name" stroke="#a9c1cf"/><YAxis stroke="#a9c1cf"/><Tooltip/><Area type="monotone" dataKey="received" stroke="#62d6c5" fill="url(#received)"/><Area type="monotone" dataKey="completed" stroke="#5aa8e6" fill="transparent"/></AreaChart></ResponsiveContainer><p className="chart-summary">Text summary: synthetic received volume varies from 280 to 620 units; completed volume follows closely, with exceptions recorded each day.</p></div>
          <div className="analytics-metrics">{(analyticsView==='Exchange'?['Messages received','Files processed','Exceptions','Retries','Reconciliation','Mapping errors','Delivery acknowledgements']:analyticsView==='Patient & population'?['Patients in configured programs','Admission events','Discharge events','Follow-up tasks','Care-transition status','Risk-file processing','Regional activity']:analyticsView==='Engagement'?['Eligible audience','Active journeys','Delivery status','Responses','Opt-outs','Contact-data exceptions','Follow-up activity']:['Potential duplicates','Missing required information','Unmapped values','Patient-matching exceptions','Subscriber-data corrections']).map((x,i)=><div key={x}><span>{x}</span><b>{[2480,24,37,11,96,8,2412][i] ?? 14}</b><small>Illustrative count</small></div>)}</div></div>
      </section>

      <section className="section security" id="security">
        <SectionHead eyebrow="Security, privacy, and consent" title="Governance designed into data movement and use." copy="MTX HealthSphere provides configurable capabilities that can support an organization’s HIPAA, privacy, security, consent, and records-management responsibilities." />
        <div className="security-grid">{['Role-based access','Minimum necessary access','Identity and authentication','Encryption','Data masking','Consent and communication preferences','Sensitive-data logging controls','Retention configuration','Audit history','Environment separation','Integration security','Monitoring','Backup and recovery','Data-residency configuration'].map(x=><div key={x}><ShieldCheck/><span>{x}</span></div>)}</div>
      </section>

      <section id="architecture" className="section tinted">
        <SectionHead eyebrow="Salesforce-centered architecture" title="A connected layer around designated systems of record." copy="The current MTX HealthSphere implementation foundation uses Salesforce Health Cloud, Salesforce Marketing Cloud, MuleSoft, approved secure file-transfer services, and configurable healthcare integration and mapping components." />
        <div className="architecture"><div className="arch-layers" role="tablist">{[
          ['Experience Layer','Care-manager workspace · Clinical coordinator workspace · Engagement workspace · Dashboards · Administration'],
          ['MTX HealthSphere Product Layer','Patient and provider context · Event workflows · Population programs · Engagement journeys · Tasks · Exceptions · Analytics'],
          ['Salesforce Foundation','Salesforce Health Cloud · Salesforce Marketing Cloud · Platform workflow and security capabilities'],
          ['Integration and Orchestration','MuleSoft · APIs · HL7 interfaces · Events · Secure files · Message queues · Scheduled processing'],
          ['Healthcare Data Sources','HIEs · EHRs · ADT feeds · Clinical documents · Legacy databases · Provider sources · Risk files · Repositories'],
          ['Governance and Operations','Identity · Consent · Access · Monitoring · Reconciliation · Retention · Audit history · Release management'],
        ].map((l,i)=><button key={l[0]} role="tab" aria-selected={architecture===i} className={architecture===i?'active':''} onClick={()=>setArchitecture(i)}><span>{l[0]}</span><small>{l[1]}</small></button>)}</div><div className="arch-note"><Network/><h3>Connected, not replaced</h3><p>HIEs and EHRs remain external authoritative sources where designated. MTX HealthSphere coordinates information, workflows, and engagement. Marketing Cloud receives only data approved for engagement use.</p><p>The deployed architecture depends on source capabilities and organizational standards.</p></div></div>
      </section>

      <section className="section" id="ecosystem">
        <SectionHead eyebrow="Integration ecosystem" title="Connect through standards and patterns appropriate to each source." copy="Supported patterns may include REST and FHIR APIs where available, HL7 v2 messages, C-CDA documents, events, secure file exchange, message queues, approved middleware, and batch synchronization." />
        <div className="ecosystem">{['Health information exchanges','Electronic health record systems','Hospital ADT feeds','Clinical-document repositories','Provider directories','Master patient index services','Care-management systems','Claims and risk-data platforms','Data warehouses and lakehouses','Identity and access services','Contact-center platforms','Secure file-transfer services','Consent-management services','Analytics platforms'].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b></div>)}</div>
        <p className="disclaimer">Interface support is configured for the implementation. This view does not claim universal support for each FHIR resource, HL7 version, C-CDA template, or vendor interface.</p>
      </section>

      <section className="section dark" id="configuration">
        <SectionHead eyebrow="Configuration studio" title="Adapt shared patterns to market and program needs." copy="Select a fictional profile to see its mapping, workflow, audience, and monitoring configuration." />
        <div className="profile-tabs" role="tablist">{['Harbor Market','Pine Program','Summit Network'].map(x=><button role="tab" aria-selected={profile===x} className={profile===x?'active':''} key={x} onClick={()=>setProfile(x)}>{x}</button>)}</div>
        <div className="config-grid">{[
          ['Mappings', profile==='Harbor Market'?'ADT event map v4.2 · Provider map v2.1':profile==='Pine Program'?'Risk roster map v3.0 · Contact map v1.8':'Clinical document map v2.4 · Directory map v3.2'],
          ['Workflow', profile==='Harbor Market'?'Care-transition review and follow-up':profile==='Pine Program'?'Population roster review and assignment':'Network onboarding and source validation'],
          ['Audience', profile==='Harbor Market'?'Approved post-discharge segment':profile==='Pine Program'?'Program participants with recorded preference':'No engagement audience configured'],
          ['Monitoring', profile==='Harbor Market'?'Event receipt · Match status · Task age':profile==='Pine Program'?'File receipt · Validation · Program association':'Connection readiness · Mapping exceptions'],
        ].map(([a,b])=><div key={a}><SlidersHorizontal/><span>{a}</span><b>{b}</b></div>)}</div>
        <div className="config-list">{['Data sources','Interface schedules','Message and file types','Source-to-target mappings','Validation rules','Identity-match thresholds','Exception queues','Program definitions','Risk-file structures','Event-triggered tasks','Audience criteria','Consent rules','Communication templates','Regional configurations','Retention settings','Dashboard measures'].map(x=><span key={x}><Check/>{x}</span>)}</div>
      </section>

      <section id="adoption" className="section">
        <SectionHead eyebrow="Modular adoption roadmap" title="Begin with a priority exchange or engagement use case, then extend." copy="Sequencing depends on organizational priorities, source-system readiness, privacy review, and operating capacity." />
        <div className="roadmap-tabs" role="tablist">{['Establish Priority Connections','Activate Care Workflows','Coordinate Engagement','Expand the Network'].map((x,i)=><button role="tab" aria-selected={phase===i} className={phase===i?'active':''} key={x} onClick={()=>setPhase(i)}><span>Phase {i+1}</span><b>{x}</b></button>)}</div>
        <div className="roadmap-detail"><span className="micro">Phase {phase+1}</span><h3>{['Establish Priority Connections','Activate Care Workflows','Coordinate Engagement','Expand the Network'][phase]}</h3><div>{[
          ['Select high-value data sources','Configure initial mappings','Establish patient and provider context','Define data-quality controls','Introduce interface monitoring'],
          ['Configure event notifications','Create care-team tasks','Connect population programs','Introduce exception management','Establish operational dashboards'],
          ['Configure approved audiences','Synchronize subscriber data','Apply consent and preferences','Introduce outreach journeys','Monitor engagement operations'],
          ['Add markets or regions','Connect additional providers','Introduce new data types','Expand analytics','Refine workflows and governance'],
        ][phase].map(x=><span key={x}><CheckCircle2/>{x}</span>)}</div></div>
      </section>

      <section className="section tinted" id="delivery-model">
        <SectionHead eyebrow="Product and delivery model" title="Clear boundaries for product, implementation, and ongoing operations." copy="Scope and commercial terms determine which services are included." />
        <div className="model-grid"><div><Layers3/><h3>MTX HealthSphere Product</h3><p>Reusable healthcare data structures, integration mappings, event workflows, patient and provider views, engagement configurations, monitoring dashboards, exception handling, and documentation.</p></div><div><Building2/><h3>Implementation Services</h3><p>Discovery, architecture, mapping, interface development, data migration, Salesforce configuration, security preparation, testing, training, and deployment.</p></div><div><Settings2/><h3>Managed Services</h3><p>Interface monitoring, incident support, data-quality oversight, release coordination, campaign operations support, mapping changes, and workflow refinement.</p></div></div>
        <p className="disclaimer">Implementation and managed services are separate from the product subscription unless contract terms state otherwise.</p>
      </section>

      <section className="section why" id="why">
        <SectionHead eyebrow="Why MTX HealthSphere" title="One operating model for connected information and action." copy="Reusable patterns help organizations connect priority use cases while preserving local configuration and governance." />
        <div className="why-grid">{[
          ['Clinical exchange and engagement in one operating model','Connect permitted clinical events with care workflows and governed outreach activity.'],
          ['Reusable healthcare integration patterns','Apply configurable mappings, validation, and monitoring assets across related sources.'],
          ['Connected clinical-event and outreach workflows','Carry permitted event context into tasks, audiences, and follow-up history.'],
          ['Configurable regional and program structures','Preserve market, network, and program differences within shared governance.'],
          ['Data-quality and interface monitoring','Give operating teams queues, status, reconciliation, and traceability.'],
          ['Modular expansion','Start with a priority connection or journey and add approved use cases over time.'],
        ].map(([a,b],i)=><div key={a}><span>0{i+1}</span><h3>{a}</h3><p>{b}</p></div>)}</div>
      </section>

      <section className="final-cta"><div><span className="eyebrow light">MTX HealthSphere</span><h2>Connect healthcare information with coordinated action.</h2><p>Explore how MTX HealthSphere can connect approved healthcare data, support care-team workflows, and coordinate governed patient engagement across programs and markets.</p><div className="actions"><button className="button primary" onClick={()=>setModal(true)}>Request a Product Demonstration <ArrowRight/></button><button className="button secondary" onClick={()=>setModal(true)}>Discuss Your Information Exchange Roadmap</button></div></div><div className="cta-graphic" aria-hidden="true"><Network/><span /><Activity/><span /><HeartHandshake/></div></section>
    </main>
    <footer><a className="brand" href="#top"><span>MTX</span><i/><b>HealthSphere</b></a><p>Information Exchange &amp; Engagement Platform</p><p>Illustrative product prototype · Synthetic data only</p></footer>
    <DemoModal open={modal} onClose={()=>setModal(false)} />
  </>
}

export default App
