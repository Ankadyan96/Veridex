/* Veridex Underwriting Engine — clickable prototype. Sample data only, no backend. */

/* ---------------- ICONS ---------------- */
const ICONS = {
  queue:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  case:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="7" width="16" height="12" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>',
  portfolio:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 17l5-6 4 3 5-7 4 5"/><path d="M3 20h18"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>',
  inbox:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h4l2 3h4l2-3h4"/><path d="M4 12l1.5-6.5A2 2 0 0 1 7.44 4h9.12a2 2 0 0 1 1.94 1.5L20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6z"/></svg>',
};

/* ---------------- PERSONAS ---------------- */
const TIER = { ANALYST:0, UW:1, SENIOR_UW:2, SUPERVISOR:3, MGA_MANAGER:3, CHIEF:4, REINSURER:5 };
const TIER_LABEL = { 0:'No decision authority', 1:'Underwriter', 2:'Senior Underwriter / Specialist', 3:'Supervisor / MGA Manager', 4:'Chief Underwriter / Committee', 5:'Reinsurer (Facultative)' };

const PERSONAS = [
  { id:'priya', name:'Priya Nandakumar', role:'Senior Underwriter', line:'Commercial Property & Casualty', org:'Southlake Insurance', tier:TIER.SENIOR_UW, tierLabel:'Senior Underwriter', premiumCap:5000000, scoreCap:80, initials:'PN' },
  { id:'marcus', name:'Marcus Webb', role:'Chief Underwriting Officer', line:'All Lines', org:'Southlake Insurance', tier:TIER.CHIEF, tierLabel:'Chief Underwriter', premiumCap:50000000, scoreCap:100, initials:'MW' },
  { id:'ishant', name:'Ishant P.', role:'Underwriting Manager', line:'Commercial Auto (Delegated Authority)', org:'Futuristic Underwriters (MGA)', tier:TIER.MGA_MANAGER, tierLabel:'MGA Underwriting Manager', premiumCap:2000000, scoreCap:70, initials:'IP' },
  { id:'dana', name:'Dana Reyes', role:'Underwriting Operations Analyst', line:'Portfolio Oversight', org:'Southlake Insurance', tier:TIER.ANALYST, tierLabel:'Analyst (view only)', premiumCap:0, scoreCap:0, initials:'DR' },
];

/* ---------------- OVERRIDE PERMISSION MATRIX ---------------- */
// What tier is required to override the AI's own recommendation, and whether it always pings a supervisor.
const OVERRIDE_RULES = {
  standard: { minTier: TIER.SUPERVISOR, label:'Standard override (any direction change from AI recommendation)' },
  drastic:  { minTier: TIER.CHIEF, label:'Drastic override (AI Decline → Accept, or Accept outside appetite)', alwaysNotify:true },
};
function overrideSeverity(aiOutcome, chosenOutcome, appetite){
  if(chosenOutcome === aiOutcome) return null;
  const drastic = (aiOutcome === 'DECLINE' && chosenOutcome === 'ACCEPT') || (appetite === 'OUTSIDE_APPETITE' && chosenOutcome === 'ACCEPT');
  return drastic ? 'drastic' : 'standard';
}

/* ---------------- CASES ---------------- */
const CASES = [
  { id:'C-1001', insured:'Highland Foods Distribution LLC', accountId:'ACC-HIGHLAND', line:'Commercial Auto — Fleet', agency:'Links Insurance Services, Inc', agencyCode:'900038', broker:'Sam Okafor', premium:1200000, effDate:'2026-09-15', refNumber:'123782', status:'Ready to Decide', priority:'High', complexity:'Assisted', requiredTier:TIER.SENIOR_UW, riskScore:64, appetite:'IN_APPETITE', age:4, owner:'Priya Nandakumar', state:'TX' },
  { id:'C-1002', insured:'Bayview Marine Terminal', line:'Commercial Property — Cat Wind/Flood', agency:'Gulf Coast Agency', agencyCode:'900041', broker:'R. Alvarez', premium:8400000, effDate:'2026-10-01', refNumber:'123799', status:'Referred — Chief Underwriter', priority:'High', complexity:'Specialist Review', requiredTier:TIER.CHIEF, riskScore:77, appetite:'CONDITIONAL', age:9, owner:'Priya Nandakumar', state:'TX' },
  { id:'C-1003', insured:'Vela Freight Co', line:'Commercial Auto', agency:'Links Insurance Services, Inc', agencyCode:'900038', broker:'Sam Okafor', premium:640000, effDate:'2026-08-20', refNumber:'123650', status:'Bound (Straight-Through)', priority:'Low', complexity:'Straight-Through', requiredTier:TIER.UW, riskScore:41, appetite:'IN_APPETITE', age:1, owner:'System (Auto)', state:'TX' },
  { id:'C-1004', insured:'Crestpoint Manufacturing', line:'General Liability + Products', agency:'Lone Star Brokerage', agencyCode:'900052', broker:'K. Mensah', premium:2100000, effDate:'2026-09-05', refNumber:'123711', status:'Referred — Supervisor', priority:'Medium', complexity:'Senior Review', requiredTier:TIER.SUPERVISOR, riskScore:69, appetite:'IN_APPETITE', age:6, owner:'Priya Nandakumar', state:'OK' },
  { id:'C-1005', insured:'Northgate Logistics', line:'Commercial Auto — Fleet', agency:'Links Insurance Services, Inc', agencyCode:'900038', broker:'Sam Okafor', premium:3400000, effDate:'2026-08-28', refNumber:'123604', status:'Declined', priority:'Medium', complexity:'Senior Review', requiredTier:TIER.SENIOR_UW, riskScore:88, appetite:'OUTSIDE_APPETITE', age:14, owner:'Priya Nandakumar', state:'TX' },
  { id:'C-1006', insured:'Summit Data Systems', line:'Cyber Liability', agency:'Lone Star Brokerage', agencyCode:'900052', broker:'K. Mensah', premium:950000, effDate:'2026-09-22', refNumber:'123782', status:'Info Requested', priority:'Medium', complexity:'Assisted', requiredTier:TIER.SUPERVISOR, riskScore:58, appetite:'UNCERTAIN', age:3, owner:'Priya Nandakumar', state:'TX' },
  { id:'C-1007', insured:'Ishant Ventures Trucking', line:'Commercial Auto', agency:'Links Insurance Services, Inc', agencyCode:'900038', broker:'Sam Okafor', premium:1800000, effDate:'2026-09-30', refNumber:'123778', status:'Ready to Decide', priority:'Medium', complexity:'Assisted', requiredTier:TIER.MGA_MANAGER, riskScore:55, appetite:'IN_APPETITE', age:2, owner:'Ishant P.', state:'TX' },
  { id:'C-1008', insured:'Coastal Grain Storage', line:'Commercial Property — Cat Wildfire/Flood', agency:'Gulf Coast Agency', agencyCode:'900041', broker:'R. Alvarez', premium:6200000, effDate:'2026-10-10', refNumber:'123805', status:'Assessment', priority:'High', complexity:'Specialist Review', requiredTier:TIER.CHIEF, riskScore:82, appetite:'CONDITIONAL', age:1, owner:'Priya Nandakumar', state:'TX' },
  { id:'C-1009', insured:'Riverside Manufacturing Co', line:"Workers' Compensation", agency:'Lone Star Brokerage', agencyCode:'900052', broker:'K. Mensah', premium:480000, effDate:'2026-09-18', refNumber:'123822', status:'Ready to Decide', priority:'Medium', complexity:'Assisted', requiredTier:TIER.SENIOR_UW, riskScore:60, appetite:'IN_APPETITE', age:2, owner:'Priya Nandakumar', state:'TX' },
  { id:'C-1010', insured:'Highland Foods Distribution LLC', accountId:'ACC-HIGHLAND', line:'General Liability + Products', agency:'Links Insurance Services, Inc', agencyCode:'900038', broker:'Sam Okafor', premium:340000, effDate:'2026-09-15', refNumber:'123783', status:'Assessment', priority:'Low', complexity:'Assisted', requiredTier:TIER.UW, riskScore:48, appetite:'IN_APPETITE', age:4, owner:'Priya Nandakumar', state:'TX' },
];

/* ---------------- LOW-CODE CONFIG (business-managed thresholds, editable from the Configuration page) ---------------- */
let CONFIG = { discountTierSupervisor:10, discountTierChief:20, fastTrackScoreMax:50, slaWarnDays:5, slaBadDays:10 };
const CONFIG_DEFAULTS = { ...CONFIG };
let CONFIG_HISTORY = [];

/* ---------------- DISCOUNT AUTHORITY MATRIX ---------------- */
// Underwriters can self-approve small discounts; bigger ones escalate for money-approval, same ladder as decisions.
function discountRequiredTier(pct){
  if(pct <= CONFIG.discountTierSupervisor) return 0;            // within every underwriter's own authority
  if(pct <= CONFIG.discountTierChief) return TIER.SUPERVISOR;
  return TIER.CHIEF;                 // "Admin" — anything larger needs the top of the ladder
}

/* ---------------- COVERAGE BREAKDOWN + FORMS (per line) ---------------- */
function coverageBreakdownFor(c, requestedPremium){
  const p = requestedPremium;
  if(/Auto/.test(c.line)) return [
    {coverage:'Liability', premium:Math.round(p*0.58)},
    {coverage:'Physical Damage', premium:Math.round(p*0.27)},
    {coverage:'Cargo', premium:Math.round(p*0.11)},
    {coverage:'Medical Payments', premium:Math.round(p*0.04)},
  ];
  if(/Property/.test(c.line)) return [
    {coverage:'Property (Building)', premium:Math.round(p*0.64)},
    {coverage:'Wind & Hail', premium:Math.round(p*0.24)},
    {coverage:'Flood (Excess)', premium:Math.round(p*0.09)},
    {coverage:'Business Income', premium:Math.round(p*0.03)},
  ];
  if(/Cyber/.test(c.line)) return [
    {coverage:'Liability', premium:Math.round(p*0.4)},
    {coverage:'Breach Response', premium:null},
    {coverage:'Cyber Crime', premium:null},
    {coverage:'Business Loss', premium:null},
  ];
  return [ {coverage:'General Liability', premium:Math.round(p*0.7)}, {coverage:'Products/Completed Ops', premium:Math.round(p*0.3)} ];
}
function formsFor(c){
  if(/Auto/.test(c.line)) return [
    {name:'Declaration Page', edition:'10/13', desc:'Declarations', order:0, checked:true},
    {name:'AUTO 001', edition:'12/25', desc:'Commercial Auto Base Policy', order:11, checked:true},
    {name:'AUTO 014', edition:'06/24', desc:'Hired & Non-Owned Auto Endorsement', order:20, checked:true},
    {name:'AUTO 022', edition:'12/25', desc:'Owner-Operator Endorsement', order:30, checked:false},
    {name:'MCS-90', edition:'05/22', desc:'Federal Financial Responsibility Endorsement', order:40, checked:true},
  ];
  if(/Property/.test(c.line)) return [
    {name:'Declaration Page', edition:'10/13', desc:'Declarations', order:0, checked:true},
    {name:'PROP 001', edition:'12/25', desc:'Commercial Property Base Policy', order:11, checked:true},
    {name:'PROP 010', edition:'01/25', desc:'Named Storm Percentage Deductible Endorsement', order:22, checked:true},
    {name:'PROP 017', edition:'12/25', desc:'Flood Exclusion Buy-Back Endorsement', order:35, checked:false},
  ];
  if(/Cyber/.test(c.line)) return [
    {name:'SSIC CYB 10 26', edition:'10/13', desc:'Declaration Page', order:0, checked:true},
    {name:'CYB 001', edition:'06/26', desc:'Cyber Claims Reporting Notice', order:5, checked:true},
    {name:'SSIC RCF 04 24', edition:'04/24', desc:'Read Your Policy Carefully Fraud Statement', order:10, checked:true},
    {name:'SSIC CYB 1001', edition:'12/25', desc:'Cyber Base Policy', order:11, checked:true},
    {name:'SSIC CYB 1021', edition:'12/25', desc:'Exclude Professional Services Endorsement', order:42, checked:false},
  ];
  return [
    {name:'Declaration Page', edition:'10/13', desc:'Declarations', order:0, checked:true},
    {name:'GL 001', edition:'12/25', desc:'Commercial General Liability Base Policy', order:11, checked:true},
    {name:'GL 009', edition:'12/25', desc:'Products/Completed Operations Endorsement', order:25, checked:true},
  ];
}

/* ---------------- BROKER BOOK LOSS-RATIO HISTORY (for pattern monitoring) ---------------- */
const BROKER_BOOK = {
  'Sam Okafor':  { agency:'Links', trend:[54,61,69,81] },
  'R. Alvarez':  { agency:'Gulf Coast Agency', trend:[58,55,52,49] },
  'K. Mensah':   { agency:'Lone Star Brokerage', trend:[44,46,45,47] },
};
// baseline accepted-in-a-row counts before this session starts (so the flag is already close to tripping)
let brokerAcceptStreak = { 'priya|Sam Okafor':4, 'priya|R. Alvarez':2, 'priya|K. Mensah':2, 'ishant|Sam Okafor':1 };

/* ---------------- OMNICHANNEL INTAKE ---------------- */
const INTAKE_ITEMS = [
  {id:'IN-01', source:'Email', from:'sam.okafor@linksinsurance.com', subject:"Highland Foods — General Liability Add-On", received:'2026-08-03 07:12', status:'Ready for Review', linkedCase:'C-1010'},
  {id:'IN-02', source:'Portal', from:'Lone Star Brokerage (K. Mensah)', subject:"Riverside Manufacturing — Workers' Comp New Business", received:'2026-08-03 07:40', status:'Ready for Review', linkedCase:'C-1009'},
  {id:'IN-03', source:'API', from:'Gulf Coast Agency — Submission API', subject:'Coastal Grain Storage — Property Renewal', received:'2026-08-03 08:02', status:'Auto-Processed', linkedCase:'C-1008'},
  {id:'IN-04', source:'Upload', from:'Direct Upload — Underwriting Ops', subject:'Northgate Logistics — Loss Run Update', received:'2026-08-02 16:20', status:'Exception — Needs Review', linkedCase:'C-1005'},
  {id:'IN-05', source:'Email', from:'k.mensah@lonestarbrokerage.com', subject:'Summit Data Systems — Security Questionnaire', received:'2026-08-01 09:10', status:'Auto-Processed', linkedCase:'C-1006'},
];
const INTAKE_DOCS = {
  'IN-01': [ {name:'ACORD_125.pdf', type:'ACORD 125 — Applicant Information', confidence:97}, {name:'ACORD_126.pdf', type:'ACORD 126 — Commercial General Liability', confidence:94}, {name:'loss_run_3yr.pdf', type:'Loss Run', confidence:61} ],
  'IN-02': [ {name:'WC_Application.pdf', type:'ACORD 130 — Workers Comp Application', confidence:95}, {name:'Payroll_by_class.xlsx', type:'Payroll / Class Code Schedule', confidence:88}, {name:'Loss_Run_WC.pdf', type:'Loss Run', confidence:73}, {name:'EMR_worksheet.pdf', type:'Experience Mod Worksheet', confidence:91} ],
  'IN-03': [ {name:'SOV_update.xlsx', type:'Schedule of Values', confidence:99}, {name:'renewal_app.pdf', type:'Renewal Application', confidence:96} ],
  'IN-04': [ {name:'loss_run_scan.pdf', type:'Loss Run (scanned, low quality)', confidence:42} ],
  'IN-05': [ {name:'security_questionnaire.pdf', type:'Cyber Security Questionnaire', confidence:89} ],
};
const ENRICHMENT_CATALOG = [
  {source:'Internal Policy & Claims History', kind:'Internal', desc:'Prior terms, premiums, and loss experience for this insured'},
  {source:'NIPR / Producer Licensing', kind:'Internal', desc:'Broker license and appointment verification'},
  {source:'FMCSA SAFER', kind:'External', desc:'DOT/MC safety rating, out-of-service history', lines:['Auto']},
  {source:'LexisNexis MVR', kind:'External', desc:'Driver violation and license history', lines:['Auto']},
  {source:'Verisk Property Intelligence', kind:'External', desc:'COPE, replacement cost, roof condition', lines:['Property']},
  {source:"Moody's Catastrophe Models", kind:'External', desc:'Wind, flood, wildfire hazard scores', lines:['Property']},
  {source:'NCCI / State Bureau', kind:'External', desc:'Class code rates and experience mod validation', lines:['Workers']},
  {source:'D&B Financial', kind:'External', desc:'Financial stability and credit indicators', lines:['General','Cyber']},
  {source:'Security Ratings Provider', kind:'External', desc:'External attack-surface and posture score', lines:['Cyber']},
];
function enrichmentFor(line){ return ENRICHMENT_CATALOG.filter(e=>!e.lines || e.lines.some(l=>line.includes(l))); }
let selectedIntake = INTAKE_ITEMS[0].id;
const ENTITY_MATCHES = {
  'IN-01': [ {type:'Existing Account', label:'Highland Foods Distribution LLC — Account ACC-HIGHLAND (C-1001, Commercial Auto)', confidence:98, badge:'ok', action:'Link to existing account — same legal entity, same FEIN'} ],
  'IN-02': [ {type:'Broker Record', label:'Lone Star Brokerage (K. Mensah) — appointed, in good standing', confidence:100, badge:'ok', action:'Broker verified — no action needed'}, {type:'Account Match', label:'No existing account found for Riverside Manufacturing Co', confidence:0, badge:'grey', action:'Proceed as new account'} ],
  'IN-03': [ {type:'Open Renewal', label:'Coastal Grain Storage — prior term found (C-1008)', confidence:99, badge:'ok', action:'Auto-linked as renewal — expiring data pulled forward'} ],
  'IN-04': [ {type:'Existing Case', label:'Northgate Logistics — C-1005, currently Declined', confidence:95, badge:'warn', action:'Review before proceeding — this account was previously declined'} ],
  'IN-05': [ {type:'Existing Case', label:'Summit Data Systems — C-1006, currently Info Requested', confidence:97, badge:'ok', action:'Continuing an open submission — auto-linked'} ],
};

/* ---------------- HAND-AUTHORED CASE DETAIL (flagship: C-1001 trucking; lighter detail on others) ---------------- */
const DETAIL = {
  'C-1001': {
    applicant:{
      legalName:'Highland Foods Distribution LLC', dba:'Highland Foods', entityType:'LLC, TX-domiciled', fein:'74-1928837',
      yearsInBusiness:9, dot:'DOT 2841057', mc:'MC 918422', priorCarrier:'Westgate Mutual (competitor, non-renewing for market exit, not risk)',
      yearsWithPrior:6, radius:'≤ 400 mi average (regional)', commodities:'Refrigerated & dry food distribution, no hazmat',
      terminals:'Dallas, TX (HQ) · Tulsa, OK (satellite)', revenue:'$18.4M (stable, 3-yr trend)',
    },
    summary:[
      "24-vehicle regional food-distribution fleet, TX-domiciled, 9 years in business, 6 years with current carrier (non-renewing for market exit — not risk-related).",
      "Loss history is clean: 1 at-fault claim (rear-end, $8,400) in 36 months, no frequency pattern.",
      "MVR pull flags one driver with a 2024 speeding violation — resolved, driver still active.",
      "Fits Commercial Auto Fleet appetite on every configured rule; no outstanding subjectivities.",
    ],
    requirements:[ {label:'Signed application', status:'received'}, {label:'3-year loss run', status:'received'}, {label:'MVR — all drivers', status:'received'}, {label:'Vehicle schedule', status:'received'} ],
    riskProfile:{ exposures:'24 units — box trucks & tractors, TX/OK/LA operating radius ≤400mi', financial:'Revenue $18.4M, stable 3-yr trend, no D&B concerns', hazard:'N/A — auto line', fleet:'Avg vehicle age 4.1 yrs, GPS-tracked, no ELD hours-of-service violations in 12mo' },
    fleetSchedule:[
      {unit:'01', vin:'…4F71', year:2022, make:'Freightliner M2', type:'Box Truck 26ft', value:98000, garage:'Dallas, TX'},
      {unit:'02', vin:'…2C08', year:2021, make:'Freightliner M2', type:'Box Truck 26ft', value:91000, garage:'Dallas, TX'},
      {unit:'03', vin:'…9A45', year:2023, make:'International MV', type:'Reefer Box 24ft', value:112000, garage:'Dallas, TX'},
      {unit:'04', vin:'…7B19', year:2019, make:'Kenworth T680', type:'Tractor', value:76000, garage:'Tulsa, OK'},
      {unit:'05', vin:'…3D62', year:2020, make:'Kenworth T680', type:'Tractor', value:82000, garage:'Tulsa, OK'},
      {unit:'…', vin:'—', year:null, make:'19 more units', type:'Mixed box/tractor', value:null, garage:'Dallas / Tulsa'},
    ],
    driverSchedule:[
      {name:'R. Castillo', license:'TX-•••4471', years:11, mvr:0, viol:'None', status:'Active'},
      {name:'D. Whitfield', license:'TX-•••2298', years:6, mvr:2, viol:'2024 — 12mph over posted limit (resolved)', status:'Active'},
      {name:'M. Okonjo', license:'OK-•••8815', years:14, mvr:0, viol:'None', status:'Active'},
      {name:'J. Ferraro', license:'TX-•••5502', years:3, mvr:0, viol:'None', status:'Active'},
      {name:'… 20 more drivers', license:'—', years:null, mvr:null, viol:'Aggregate: 1 violation across 24 drivers', status:'Active'},
    ],
    lossRuns:[
      {period:'2023', claims:1, incurred:8400, paid:8400, reserve:0, largest:8400, cause:'At-fault rear-end, no injury'},
      {period:'2024', claims:0, incurred:0, paid:0, reserve:0, largest:0, cause:'—'},
      {period:'2025', claims:0, incurred:0, paid:0, reserve:0, largest:0, cause:'—'},
    ],
    experience:{
      manualPremium:1340000, expectedLossRatio:58, actualLossRatio:12,
      mod:0.79, modNote:'3-yr actual losses ($8,400) vs. expected losses at this exposure — favorable, capped at 0.79 per program floor',
      credits:[ {factor:'Loss-free credit (2 of 3 years)', amount:-8}, {factor:'GPS telematics on 100% of fleet', amount:-4}, {factor:'Driver tenure > 5yrs avg', amount:-3}, {factor:'1 MVR violation on file (debit)', amount:2} ],
      technicalPremium:1058000, indicatedPremium:1150000, requestedPremium:1200000,
    },
    appetiteRules:[
      {rule:'Operating radius ≤ 500 miles', result:'PASS', detail:'400 mile average radius'},
      {rule:'Fleet size 5–50 units (program band)', result:'PASS', detail:'24 units'},
      {rule:'No DOT out-of-service order in 24 months', result:'PASS', detail:'Verified via FMCSA SAFER'},
      {rule:'Driver violation frequency ≤ 1 per 10 drivers/yr', result:'PASS', detail:'1 violation across 24 drivers, resolved'},
      {rule:'Loss ratio (3yr) ≤ 55%', result:'PASS', detail:'Actual: 12%'},
    ],
    score:{ value:64, band:'Standard', drivers:[
      {name:'Loss history', detail:'1 minor claim in 36 months', weight:32, color:'ok'},
      {name:'Driver quality', detail:'1 resolved violation, otherwise clean', weight:22, color:'warn'},
      {name:'Fleet condition', detail:'Avg age 4.1yrs, well maintained', weight:20, color:'ok'},
      {name:'Financial stability', detail:'Stable revenue, no D&B flags', weight:16, color:'ok'},
      {name:'Operating radius', detail:'Regional, moderate exposure', weight:10, color:'ok'},
    ]},
    recommendation:{ outcome:'ACCEPT', confidence:92, rationale:'All appetite rules pass, loss history is clean, experience mod is favorable (0.79), and the risk score (64) sits well inside the Standard band. No subjectivities or terms restrictions indicated.' },
    subjectivities:[],
    customerHistory:{
      tenureYears:0, newToCarrier:true,
      priorTerms:[
        {term:'2023–2024 (Westgate Mutual)', premium:1180000, lossRatio:9, renewed:true},
        {term:'2024–2025 (Westgate Mutual)', premium:1245000, lossRatio:0, renewed:true},
        {term:'2025–2026 (Westgate Mutual)', premium:1290000, lossRatio:0, renewed:'Non-renewing — market exit'},
      ],
      underwriterNotes:[
        {date:'2026-07-31', who:'Priya Nandakumar', note:'Called prior carrier UW contact — confirmed non-renewal is a book-wide market exit from regional trucking, not risk-specific. No red flags raised.'},
      ],
    },
    talkLog:[
      {date:'2026-07-30 09:40', who:'Priya Nandakumar', channel:'Email', withWhom:'Sam Okafor (Links)', summary:'Requested 3-yr loss run and full MVR pull for all 24 drivers.'},
      {date:'2026-07-31 11:15', who:'Priya Nandakumar', channel:'Phone', withWhom:'Prior carrier underwriting desk', summary:'Confirmed non-renewal reason is a regional-trucking market exit, not this account. No claims disputes on file.'},
      {date:'2026-08-01 08:30', who:'Priya Nandakumar', channel:'Note', withWhom:'File note', summary:'All requirements complete, AI recommendation reviewed, proceeding to decision.'},
    ],
    audit:[
      {t:'2026-07-30 09:12', who:'System', what:'Submission received from Links (Agency) via Distribution intake'},
      {t:'2026-07-30 09:14', who:'AI Classification', what:'Routed to Assisted path — Commercial Auto Fleet, mid-complexity'},
      {t:'2026-07-30 09:20', who:'Risk Data Enrichment', what:'Pulled FMCSA SAFER, MVR (24 drivers), 3-yr loss run'},
      {t:'2026-07-30 09:40', who:'Priya Nandakumar', what:'Requested loss run + MVR pull from broker (logged in Talk Log)'},
      {t:'2026-07-31 11:15', who:'Priya Nandakumar', what:'Called prior carrier to confirm non-renewal reason (logged in Talk Log)'},
      {t:'2026-07-31 14:02', who:'Priya Nandakumar', what:'Reviewed Risk 360, confirmed no additional information needed'},
      {t:'2026-08-01 08:44', who:'AI Recommendation', what:'Generated ACCEPT recommendation, confidence 92%'},
    ],
  },
  'C-1002': {
    applicant:{
      legalName:'Bayview Marine Terminal LLC', dba:'Bayview Marine', entityType:'LLC, TX-domiciled', fein:'82-3341190',
      yearsInBusiness:22, dot:'N/A', mc:'N/A', priorCarrier:'Coastal Underwriters (non-renewed after 2024 loss)',
      yearsWithPrior:11, radius:'N/A — fixed location', commodities:'Marine cargo handling & bulk storage',
      terminals:'Single waterfront terminal, Gulf Coast TX', revenue:'$61M (moderate leverage, stable)',
    },
    summary:[
      "Marine cargo terminal, 3 waterfront buildings + open storage yard, Gulf Coast TX — high wind/flood/named-storm exposure.",
      "TIV $42M; requested limit $8.4M excess of $2M SIR. Prior carrier non-renewed after 2024 hurricane loss ($3.1M).",
      "Elevation certificates and wind mitigation report received; flood zone AE confirmed via FEMA maps.",
      "Falls outside standard property appetite on TIV concentration in a single cat zone — conditional acceptance possible with facultative support.",
    ],
    requirements:[ {label:'Elevation certificate', status:'received'}, {label:'Wind mitigation report', status:'received'}, {label:'SOV with replacement values', status:'received'}, {label:'Business continuity plan', status:'outstanding'} ],
    propertySchedule:[
      {loc:'01', address:'4200 Port Rd, Gulf Coast, TX', construction:'Reinforced masonry', occupancy:'Cargo warehouse', protection:'Sprinklered, on-site hydrants', tiv:24000000, hazard:81, catZone:'Wind Tier 1 / Flood AE', x:38, y:44},
      {loc:'02', address:'4210 Port Rd, Gulf Coast, TX', construction:'Steel frame', occupancy:'Office & operations', protection:'Sprinklered', tiv:9500000, hazard:74, catZone:'Wind Tier 1 / Flood AE', x:46, y:52},
      {loc:'03', address:'4220 Port Rd, Gulf Coast, TX', construction:'Pre-engineered metal', occupancy:'Maintenance shop', protection:'Non-sprinklered', tiv:5300000, hazard:69, catZone:'Wind Tier 1 / Flood AE', x:55, y:40},
      {loc:'04', address:'Open storage yard, Port Rd', construction:'N/A — open yard', occupancy:'Bulk storage', protection:'Perimeter fencing only', tiv:3200000, hazard:58, catZone:'Wind Tier 1', x:63, y:58},
    ],
    riskProfile:{ exposures:'3 buildings (TIV $42M) + open storage yard, waterfront', financial:'Revenue $61M, moderate leverage, D&B rating stable', hazard:'FEMA Zone AE (flood), wind Tier 1 coastal, high named-storm frequency', fleet:'N/A — property line' },
    lossRuns:[
      {period:'2023', claims:0, incurred:0, paid:0, reserve:0, largest:0, cause:'—'},
      {period:'2024', claims:1, incurred:3100000, paid:2400000, reserve:700000, largest:3100000, cause:'Hurricane — wind & storm surge, non-renewed by prior carrier'},
      {period:'2025', claims:0, incurred:0, paid:0, reserve:0, largest:0, cause:'—'},
    ],
    experience:{ manualPremium:7100000, expectedLossRatio:52, actualLossRatio:97, mod:1.28, modNote:'2024 named-storm loss drives actual loss ratio well above expected — mod capped at treaty ceiling of 1.28', credits:[ {factor:'Wind mitigation features verified', amount:-6}, {factor:'Elevation above BFE +2ft', amount:-4}, {factor:'Single named-storm loss in 3yrs (debit)', amount:14} ], technicalPremium:8950000, indicatedPremium:8700000, requestedPremium:8400000 },
    appetiteRules:[
      {rule:'Single-location TIV ≤ $25M in Tier 1 coastal zone', result:'FAIL', detail:'TIV is $42M — exceeds by $17M'},
      {rule:'No named-storm loss > $1M in trailing 3 years', result:'FAIL', detail:'2024 hurricane loss of $3.1M'},
      {rule:'Wind mitigation features present', result:'PASS', detail:'Verified via engineering report'},
      {rule:'Flood zone acceptable with elevation cert', result:'PASS', detail:'Elevation cert on file, structure above BFE +2ft'},
      {rule:'Facultative capacity available for excess', result:'UNCERTAIN', detail:'Pending reinsurance treaty check'},
    ],
    score:{ value:77, band:'Elevated', drivers:[
      {name:'Catastrophe concentration', detail:'TIV exceeds Tier 1 coastal threshold', weight:38, color:'bad'},
      {name:'Prior named-storm loss', detail:'$3.1M loss, non-renewed', weight:28, color:'bad'},
      {name:'Mitigation quality', detail:'Strong wind & flood mitigation on file', weight:18, color:'ok'},
      {name:'Financial stability', detail:'Stable revenue, moderate leverage', weight:16, color:'warn'},
    ]},
    recommendation:{ outcome:'REFER', confidence:74, rationale:'Two appetite rules fail on catastrophe concentration and prior named-storm loss. Mitigation is strong, so a conditional accept with facultative placement and a higher retention is plausible, but this requires Chief Underwriter and Reinsurance sign-off — it is outside Senior Underwriter authority.' },
    subjectivities:[ {label:'Facultative reinsurance placement confirmed before bind', owner:'Reinsurance', due:'2026-09-20', status:'pending'}, {label:'Business continuity plan received', owner:'Insured', due:'2026-09-10', status:'pending'} ],
    customerHistory:{ tenureYears:0, newToCarrier:true, priorTerms:[ {term:'2024–2025 (prior carrier)', premium:6800000, lossRatio:97, renewed:'Non-renewed after loss'} ], underwriterNotes:[ {date:'2026-07-27', who:'Priya Nandakumar', note:'Prior carrier confirmed non-renewal was directly loss-driven, not a market withdrawal.'} ] },
    talkLog:[
      {date:'2026-07-24 14:10', who:'Priya Nandakumar', channel:'Email', withWhom:'R. Alvarez (Gulf Coast Agency)', summary:'Requested elevation certificate and wind mitigation engineering report.'},
      {date:'2026-07-27 15:12', who:'Priya Nandakumar', channel:'Phone', withWhom:'R. Alvarez (Gulf Coast Agency)', summary:'Discussed facultative placement options given TIV concentration; broker open to higher retention.'},
    ],
    audit:[
      {t:'2026-07-22 10:03', who:'System', what:'Submission received from Gulf Coast Agency'},
      {t:'2026-07-22 10:05', who:'AI Classification', what:'Routed to Specialist Review — Property Cat, high complexity'},
      {t:'2026-07-24 11:40', who:'Risk Data Enrichment', what:'Pulled FEMA flood zone, catastrophe model output, D&B financial report'},
      {t:'2026-07-27 15:12', who:'Priya Nandakumar', what:'Requested elevation certificate and wind mitigation report'},
      {t:'2026-07-29 09:30', who:'AI Recommendation', what:'Generated REFER recommendation — 2 appetite rules failed, confidence 74%'},
      {t:'2026-07-29 09:31', who:'Underwriting Authority Management', what:'Case premium ($8.4M) and appetite result exceed Senior Underwriter authority — routed to Chief Underwriter'},
    ],
  },
  'C-1006': {
    applicant:{
      legalName:'Summit Data Systems Inc.', dba:'Summit Data', entityType:'C-Corp, DE-incorporated / TX-operating', fein:'46-7719203',
      yearsInBusiness:5, dot:'N/A', mc:'N/A', priorCarrier:'None — first cyber policy',
      yearsWithPrior:'N/A', radius:'N/A — SaaS', commodities:'Payment data processing for ~60 retail clients',
      terminals:'Dallas, TX (HQ) — cloud-hosted infrastructure', revenue:'$22M (VC-backed, pre-profitability)',
    },
    summary:[
      "SaaS data-processing company, ~140 employees, handles payment card data for mid-market retail clients.",
      "Requested limit $5M cyber, primary. No prior cyber claims on file.",
      "Security questionnaire incomplete — missing MFA enforcement and endpoint detection responses.",
      "Appetite result is Uncertain, not Outside — the gap is missing evidence, not a failed rule.",
    ],
    requirements:[ {label:'Signed application', status:'received'}, {label:'Security questionnaire', status:'outstanding'}, {label:'SOC 2 report (if available)', status:'outstanding'}, {label:'Prior cyber policy / loss run', status:'received'} ],
    riskProfile:{ exposures:'140 employees, processes PCI data for ~60 retail clients', financial:'Revenue $22M, VC-backed, 2 years to profitability', hazard:'N/A', fleet:'N/A' },
    lossRuns:[ {period:'2024', claims:0, incurred:0, paid:0, reserve:0, largest:0, cause:'—'}, {period:'2025', claims:0, incurred:0, paid:0, reserve:0, largest:0, cause:'—'} ],
    experience:{ manualPremium:1010000, expectedLossRatio:40, actualLossRatio:0, mod:0.9, modNote:'No loss history to credit further — mod held near 1.0 pending completed security questionnaire', credits:[ {factor:'No prior claims', amount:-6}, {factor:'Security controls unverified (holding debit)', amount:4} ], technicalPremium:965000, indicatedPremium:980000, requestedPremium:950000 },
    appetiteRules:[
      {rule:'No prior cyber/data-breach claims', result:'PASS', detail:'None on file'},
      {rule:'MFA enforced on all privileged accounts', result:'UNCERTAIN', detail:'Security questionnaire section incomplete'},
      {rule:'Endpoint detection & response deployed', result:'UNCERTAIN', detail:'Security questionnaire section incomplete'},
      {rule:'PCI-DSS scope documented', result:'PASS', detail:'Confirmed via application narrative'},
    ],
    score:{ value:58, band:'Standard (provisional)', drivers:[
      {name:'Data sensitivity', detail:'PCI data for 60 clients', weight:30, color:'warn'},
      {name:'Security controls — unverified', detail:'MFA/EDR responses missing', weight:34, color:'warn'},
      {name:'Loss history', detail:'No prior claims', weight:20, color:'ok'},
      {name:'Financial stability', detail:'VC-backed, pre-profitability', weight:16, color:'warn'},
    ]},
    recommendation:{ outcome:'REQUEST_INFO', confidence:65, rationale:'Score and appetite are provisional — the security questionnaire gaps are the only thing between this case and a clean Accept. Recommend requesting the two missing sections before scoring is finalized.' },
    subjectivities:[ {label:'Completed security questionnaire (MFA, EDR sections)', owner:'Insured', due:'2026-08-15', status:'pending'} ],
    customerHistory:{ tenureYears:0, newToCarrier:true, priorTerms:[], underwriterNotes:[] },
    talkLog:[ {date:'2026-08-01 09:10', who:'Priya Nandakumar', channel:'Email', withWhom:'K. Mensah (Lone Star Brokerage)', summary:'Requested completed MFA and EDR sections of the security questionnaire.'} ],
    audit:[
      {t:'2026-07-31 13:20', who:'System', what:'Submission received from Lone Star Brokerage'},
      {t:'2026-07-31 13:22', who:'AI Classification', what:'Routed to Assisted path — Cyber Liability'},
      {t:'2026-08-01 09:05', who:'Underwriting Requirements', what:'Flagged 2 incomplete sections in security questionnaire'},
      {t:'2026-08-01 09:06', who:'AI Recommendation', what:'Generated REQUEST_INFO recommendation, confidence 65%'},
    ],
  },
  'C-1009': {
    applicant:{
      legalName:'Riverside Manufacturing Co', dba:'Riverside Mfg', entityType:'LLC, TX-domiciled', fein:'81-4402219',
      yearsInBusiness:14, dot:'N/A', mc:'N/A', priorCarrier:'Texas Mutual (non-renewing, moving to admitted market)',
      yearsWithPrior:5, radius:'N/A — fixed location', commodities:'Light metal fabrication, 3 shifts',
      terminals:'Single plant, Fort Worth, TX', revenue:'$26.1M (stable, 3-yr trend)',
    },
    summary:[
      "Light metal fabrication plant, 84 employees across 3 shifts, 14 years in business.",
      "3-year experience mod of 0.91 — favorable, driven by an active safety program and low claim frequency.",
      "One open indemnity claim (shoulder strain, 2024) in reserve; otherwise medical-only, low severity.",
      "Fits Workers' Compensation appetite on every configured rule; no outstanding subjectivities.",
    ],
    requirements:[ {label:'Signed application (ACORD 130)', status:'received'}, {label:'4-year loss run', status:'received'}, {label:'Payroll by class code', status:'received'}, {label:'Experience mod worksheet', status:'received'} ],
    riskProfile:{ exposures:'84 employees, light metal fabrication, single TX location', financial:'Revenue $26.1M, stable, no D&B concerns', hazard:'Moderate — powered machinery, standard PPE program', fleet:'N/A — WC line' },
    classCodes:[
      {code:'3122', desc:'Sheet Metal Products Mfg', payroll:3200000, rate:4.85},
      {code:'8810', desc:'Clerical Office Employees', payroll:640000, rate:0.32},
      {code:'8742', desc:'Outside Sales', payroll:210000, rate:0.58},
      {code:'7380', desc:'Drivers — Local Delivery', payroll:380000, rate:5.90},
    ],
    lossRuns:[
      {period:'2022', claims:2, incurred:18400, paid:18400, reserve:0, largest:14200, cause:'Medical-only — lacerations'},
      {period:'2023', claims:1, incurred:6100, paid:6100, reserve:0, largest:6100, cause:'Medical-only — strain'},
      {period:'2024', claims:1, incurred:42000, paid:19000, reserve:23000, largest:42000, cause:'Indemnity — shoulder strain, open reserve'},
      {period:'2025', claims:0, incurred:0, paid:0, reserve:0, largest:0, cause:'—'},
    ],
    experience:{
      manualPremium:512000, expectedLossRatio:55, actualLossRatio:19,
      mod:0.91, modNote:'NCCI-style experience rating: 4-yr actual losses vs. expected losses at this payroll/class mix — favorable, driven by low frequency and an active return-to-work program',
      credits:[ {factor:'Experience mod credit (0.91)', amount:-9}, {factor:'Active safety program & return-to-work', amount:-4}, {factor:'1 open indemnity claim (debit)', amount:5} ],
      technicalPremium:466000, indicatedPremium:472000, requestedPremium:480000,
    },
    appetiteRules:[
      {rule:'Experience mod ≤ 1.10', result:'PASS', detail:'Actual mod: 0.91'},
      {rule:'No class code above program hazard ceiling', result:'PASS', detail:'Highest-hazard code 3122 within program band'},
      {rule:'Single-state payroll ≤ $10M', result:'PASS', detail:'Total payroll $4.43M, TX only'},
      {rule:'No more than 1 open indemnity claim', result:'PASS', detail:'1 open indemnity claim (shoulder strain), reserve adequate'},
    ],
    score:{ value:60, band:'Standard', drivers:[
      {name:'Experience mod', detail:'0.91 — favorable vs. expected', weight:34, color:'ok'},
      {name:'Claim severity', detail:'1 open indemnity claim, moderate reserve', weight:24, color:'warn'},
      {name:'Class code mix', detail:'Light fabrication, moderate hazard', weight:22, color:'warn'},
      {name:'Safety program', detail:'Active return-to-work program on file', weight:20, color:'ok'},
    ]},
    recommendation:{ outcome:'ACCEPT', confidence:88, rationale:'Experience mod is favorable, all appetite rules pass, and the one open indemnity claim has an adequate reserve with an active return-to-work program in place. Standard band, no subjectivities required.' },
    subjectivities:[],
    customerHistory:{
      tenureYears:0, newToCarrier:true,
      priorTerms:[
        {term:'2023–2024 (Texas Mutual)', premium:498000, lossRatio:9, renewed:true},
        {term:'2024–2025 (Texas Mutual)', premium:505000, lossRatio:31, renewed:true},
        {term:'2025–2026 (Texas Mutual)', premium:515000, lossRatio:12, renewed:'Non-renewing — carrier exiting segment'},
      ],
      underwriterNotes:[ {date:'2026-08-02', who:'Priya Nandakumar', note:'Confirmed with prior carrier that non-renewal is a segment exit, not account-specific.'} ],
    },
    talkLog:[
      {date:'2026-08-01 10:05', who:'Priya Nandakumar', channel:'Email', withWhom:'K. Mensah (Lone Star Brokerage)', summary:'Requested experience mod worksheet and 4-year loss run.'},
      {date:'2026-08-02 09:20', who:'Priya Nandakumar', channel:'Phone', withWhom:'Prior carrier underwriting desk', summary:'Confirmed non-renewal is a WC segment exit, not risk-specific.'},
    ],
    audit:[
      {t:'2026-08-01 07:40', who:'System', what:'Submission received from Lone Star Brokerage via Broker Portal'},
      {t:'2026-08-01 07:42', who:'AI Classification', what:'Routed to Assisted path — Workers\' Compensation, mid-complexity'},
      {t:'2026-08-01 07:55', who:'Risk Data Enrichment', what:'Pulled NCCI class code rates, experience mod validation, 4-yr loss run'},
      {t:'2026-08-02 09:20', who:'Priya Nandakumar', what:'Called prior carrier to confirm non-renewal reason (logged in Notes)'},
      {t:'2026-08-02 14:10', who:'AI Recommendation', what:'Generated ACCEPT recommendation, confidence 88%'},
    ],
  },
};

function genericDetail(c){
  const inApp = c.appetite === 'IN_APPETITE';
  const outApp = c.appetite === 'OUTSIDE_APPETITE';
  const lossRuns = [ {period:'2024', claims: outApp?2:0, incurred: outApp?214000:0, paid: outApp?190000:0, reserve: outApp?24000:0, largest: outApp?140000:0, cause: outApp?'Frequency pattern flagged':'—'}, {period:'2025', claims:0, incurred:0, paid:0, reserve:0, largest:0, cause:'—'} ];
  const actualLR = outApp ? 68 : inApp ? 14 : 35;
  return {
    applicant:{ legalName:c.insured, dba:c.insured, entityType:'On file', fein:'On file', yearsInBusiness:'—', dot:'—', mc:'—', priorCarrier:'On file', yearsWithPrior:'—', radius:'—', commodities:c.line, terminals:'—', revenue:'On file' },
    summary:[ `${c.line} risk for ${c.insured}, submitted via ${c.agency}.`, `Risk score ${c.riskScore} — ${c.riskScore<50?'Preferred':c.riskScore<75?'Standard':'Elevated'} band.`, `Appetite result: ${c.appetite.replace('_',' ')}.` ],
    requirements:[ {label:'Signed application', status:'received'}, {label:'Loss run', status:'received'} ],
    riskProfile:{ exposures:c.line, financial:'On file, no material concerns flagged', hazard:'Line-appropriate hazard review complete', fleet:'—' },
    fleetSchedule:null, driverSchedule:null,
    classCodes: /Workers/.test(c.line) ? [ {code:'8810', desc:'Clerical Office Employees', payroll:500000, rate:0.35}, {code:'8742', desc:'Outside Sales', payroll:200000, rate:0.55} ] : null,
    propertySchedule: /Property/.test(c.line) ? [ {loc:'01', address:c.insured+' — primary location, '+c.state, construction:'On file', occupancy:'Commercial', protection:'On file', tiv:Math.round(c.premium*22), hazard:c.riskScore, catZone:'On file', x:50, y:50} ] : null,
    lossRuns,
    experience:{ manualPremium:Math.round(c.premium*1.05), expectedLossRatio:50, actualLossRatio:actualLR, mod: outApp?1.3:inApp?0.85:1.0, modNote:'Derived from trailing loss run vs. expected losses at this exposure.', credits:[ {factor:'Loss history factor', amount: outApp?12:inApp?-8:0} ], technicalPremium:Math.round(c.premium*(outApp?1.15:0.96)), indicatedPremium:Math.round(c.premium*(outApp?1.1:0.98)), requestedPremium:c.premium },
    appetiteRules:[ {rule:'Core program appetite criteria', result: inApp?'PASS':outApp?'FAIL':'UNCERTAIN', detail:'See AI Risk & Recommendation for detail'} ],
    score:{ value:c.riskScore, band:c.riskScore<50?'Preferred':c.riskScore<75?'Standard':'Elevated', drivers:[ {name:'Loss history', detail:'See loss runs', weight:34, color: outApp?'bad':'ok'}, {name:'Exposure profile', detail:c.line, weight:33, color:'warn'}, {name:'Financial stability', detail:'Stable', weight:33, color:'ok'} ] },
    recommendation:{ outcome: outApp?'DECLINE':inApp?'ACCEPT':'REFER', confidence: outApp?81:inApp?88:60, rationale: outApp? 'Loss history and risk score fall outside configured appetite for this line.' : inApp ? 'Appetite rules pass and risk score is within the Standard band.' : 'Additional evidence or authority-level review is required before this case can proceed.' },
    subjectivities:[],
    customerHistory:{ tenureYears:0, newToCarrier:true, priorTerms:[], underwriterNotes:[] },
    talkLog:[ {date:'2026-07-2'+Math.max(1,c.age)+' 10:00', who:c.owner, channel:'Note', withWhom:'File note', summary:'Standard intake review, no broker discussion logged yet.'} ],
    audit:[ {t:'2026-07-2'+Math.max(1,c.age)+' 10:00', who:'System', what:'Submission received from '+c.agency}, {t:'2026-07-3'+Math.max(0,9-c.age)+' 09:00', who:'AI Recommendation', what:'Generated '+(outApp?'DECLINE':inApp?'ACCEPT':'REFER')+' recommendation'} ],
  };
}
function getDetail(c){
  const base = DETAIL[c.id] || genericDetail(c);
  if(!base.coverageBreakdown) base.coverageBreakdown = coverageBreakdownFor(c, base.experience.requestedPremium);
  if(!base.forms) base.forms = formsFor(c);
  return base;
}

/* ---------------- STATE ---------------- */
let persona = PERSONAS[0];
let page = 'queue';
let openCaseId = null;
let caseTab = 'action';
let queueFilters = { line:'', status:'', q:'', triage:'' };
let queueView = 'list'; // 'list' | 'kanban'
function triageOf(c){
  if(c.appetite==='OUTSIDE_APPETITE' || c.requiredTier>=TIER.CHIEF) return 'refer';
  if(c.appetite==='IN_APPETITE' && c.riskScore<CONFIG.fastTrackScoreMax) return 'fastTrack';
  return 'fullReview';
}
const TRIAGE_LABEL = { fastTrack:'Fast-Track', fullReview:'Full Review', refer:'Refer / Decline' };
let homeFilters = { period:'MTD', line:'', state:'' };
let decisionLog = {}; // caseId -> {outcome, note, at, override, drastic, reason, routedTo}
let pendingDecision = null; // {outcome}
let talkLogExtra = {}; // caseId -> extra talk log entries added this session
let negotiationThreads = {
  'C-1001': [ {who:'broker', name:'Sam Okafor (Links)', text:"Client is asking if we can lower the auto physical damage deductible from $2,500 to $1,000 — is there room on price?", at:'2026-07-31 15:20'} ],
  'C-1004': [ {who:'broker', name:'K. Mensah (Lone Star Brokerage)', text:'Insured wants to know if a $500K/$1M split limit would come down meaningfully from the $1M/$2M quote.', at:'2026-08-01 10:05'} ],
}; // caseId -> [{who:'broker'|'uw', name, text, at}]
let discountState = {}; // caseId -> {pct, status:'approved'|'pending', approvedBy, requiredTier}
let formsOverride = {}; // caseId -> { formName: boolean }
let vehiclesExtra = {}; // caseId -> [] extra vehicle rows added this session
let driversExtra = {}; // caseId -> [] extra driver rows added this session
let classCodesExtra = {}; // caseId -> [] extra class code rows added this session
let propertyExtra = {}; // caseId -> [] extra property location rows added this session
let bulkPanelOpenFor = null; // which schedule tab currently has the bulk-upload panel open
let bulkPreviewData = null; // {type, mapping, rows} once "Map & Preview" has run
const BULK_FIELD_MAP = {
  vehicles: {Year:'year', Make:'make', Type:'type', Value:'value', Garaging:'garage'},
  drivers: {Name:'name', License:'license', YearsExp:'years', MVRPoints:'mvr', Violations:'viol'},
  classcodes: {Code:'code', Description:'desc', Payroll:'payroll', Rate:'rate'},
  property: {Address:'address', Construction:'construction', Occupancy:'occupancy', Protection:'protection', TIV:'tiv', Hazard:'hazard', CATZone:'catZone'},
};
const BULK_SAMPLES = {
  vehicles: "Year,Make,Type,Value,Garaging\n2024,Freightliner M2,Box Truck 26ft,102000,Dallas TX\n2023,Kenworth T680,Tractor,79000,Tulsa OK",
  drivers: "Name,License,YearsExp,MVRPoints,Violations\nJ. Alvarez,TX-1234,7,0,None\nM. Chen,OK-5566,3,1,2025 speeding (resolved)",
  classcodes: "Code,Description,Payroll,Rate\n8810,Clerical,150000,0.32\n3400,Metal Stamping,900000,6.10",
  property: "Address,Construction,Occupancy,Protection,TIV,Hazard,CATZone\n500 Main St,Masonry,Warehouse,Sprinklered,4500000,55,Wind Tier 2",
};
function parseCsv(text){
  const lines = text.trim().split('\n').map(l=>l.split(',').map(s=>s.trim()));
  return { header: lines[0]||[], rows: lines.slice(1) };
}
function bulkPreview(type){
  const text = document.getElementById('bulkCsvInput').value;
  const { header, rows } = parseCsv(text);
  const map = BULK_FIELD_MAP[type];
  const mapping = header.map(h=>({ source:h, field: map[h]||'(unmapped)' }));
  bulkPreviewData = { type, mapping, rows: rows.filter(r=>r.length===header.length && r[0]) };
  renderPage();
}
function bulkImport(){
  if(!bulkPreviewData) return;
  const { type, mapping, rows } = bulkPreviewData;
  const fieldNames = mapping.map(m=>m.field);
  const parsedRows = rows.map(r=>{ const obj={}; fieldNames.forEach((f,i)=>{ if(f!=='(unmapped)') obj[f]=r[i]; }); return obj; });
  if(type==='vehicles'){
    if(!vehiclesExtra[openCaseId]) vehiclesExtra[openCaseId]=[];
    parsedRows.forEach(r=> vehiclesExtra[openCaseId].push({unit:'BULK', year:+r.year||null, make:r.make, type:r.type, value:+r.value||null, garage:r.garage}));
  } else if(type==='drivers'){
    if(!driversExtra[openCaseId]) driversExtra[openCaseId]=[];
    parsedRows.forEach(r=> driversExtra[openCaseId].push({name:r.name, license:r.license, years:+r.years||null, mvr:+r.mvr||null, viol:r.viol||'—', status:'Active'}));
  } else if(type==='classcodes'){
    if(!classCodesExtra[openCaseId]) classCodesExtra[openCaseId]=[];
    parsedRows.forEach(r=> classCodesExtra[openCaseId].push({code:r.code, desc:r.desc, payroll:+r.payroll||0, rate:+r.rate||0}));
  } else if(type==='property'){
    if(!propertyExtra[openCaseId]) propertyExtra[openCaseId]=[];
    parsedRows.forEach((r,i)=> propertyExtra[openCaseId].push({loc:'BULK', address:r.address, construction:r.construction, occupancy:r.occupancy, protection:r.protection, tiv:+r.tiv||0, hazard:+r.hazard||0, catZone:r.catZone, x:20+i*12, y:75}));
  }
  toast(`Imported ${parsedRows.length} row(s) via bulk mapping`);
  bulkPreviewData = null; bulkPanelOpenFor = null;
  renderPage();
}
function bulkPanelHtml(type){
  if(bulkPanelOpenFor!==type) return '';
  let inner = `<div class="bulk-panel"><div class="sectionlabel" style="margin-top:0">Paste or upload a spreadsheet (CSV)</div>
    <textarea id="bulkCsvInput">${BULK_SAMPLES[type]}</textarea>
    <div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm primary" data-bulk-preview="${type}">Map & Preview</button><button class="btn sm ghost" id="bulkCancelBtn">Cancel</button></div>`;
  if(bulkPreviewData && bulkPreviewData.type===type){
    inner += `<div class="sectionlabel">Column Mapping</div>
      <table class="map-preview-table"><thead><tr><th>Source Column</th><th>Mapped Field</th></tr></thead>
      <tbody>${bulkPreviewData.mapping.map(m=>`<tr><td>${m.source}</td><td class="mono">${m.field}</td></tr>`).join('')}</tbody></table>
      <div class="subtle" style="margin-top:8px">${bulkPreviewData.rows.length} row(s) ready to import.</div>
      <button class="btn sm primary" id="bulkImportBtn" style="margin-top:8px">Import ${bulkPreviewData.rows.length} Row(s)</button>`;
  }
  inner += `</div>`;
  return inner;
}
let quotePrinted = {}; // caseId -> true once Print Quote has succeeded
let boundCases = {}; // caseId -> {at, by} — set once the policy is fully ISSUED
let policyDocs = {}; // caseId -> {generatedAt, status:'drafted'|'sent'|'signed'|'issued', signMethod, sentAt, signedAt, issuedAt}
let notifSeq = 100;
let NOTIFICATIONS = [
  {id:1, at:'2026-07-29 09:31', type:'referral', text:'C-1002 Bayview Marine Terminal referred to Chief Underwriter — exceeds Senior Underwriter authority.', read:false, target:{caseId:'C-1002', tab:'underwriting'}},
  {id:2, at:'2026-07-15 08:00', type:'pattern', text:"Pattern watch: Sam Okafor's book (Links) loss ratio trending up — 54% → 61% → 69% → 81% over the last 4 terms. Monitoring upcoming submissions.", read:false, target:{page:'governance'}},
];

/* ---------------- HELPERS ---------------- */
function fmtMoney(n){ if(n==null) return '—'; return '$'+(n>=1000000? (n/1000000).toFixed(2).replace(/0$/,'')+'M' : (n/1000).toFixed(0)+'K'); }
function el(html){ const d=document.createElement('div'); d.innerHTML=html.trim(); return d.firstElementChild; }
function toast(msg){
  const t = el(`<div class="toast"><span class="tdot"></span>${msg}</div>`);
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.transition='opacity .3s'; t.style.opacity='0'; setTimeout(()=>t.remove(),300); }, 3200);
}
function nowStr(){ return '2026-08-03 '+String(10+Object.keys(decisionLog).length).padStart(2,'0')+':0'+(Object.keys(talkLogExtra).length%6)+' '; }
let clockTick = 0;
function nowStamp(){ clockTick++; return '2026-08-03 '+String(9+clockTick%12).padStart(2,'0')+':'+String((clockTick*7)%60).padStart(2,'0'); }
function appetiteBadge(a){
  const map = { IN_APPETITE:['b-ok','In Appetite'], OUTSIDE_APPETITE:['b-bad','Outside Appetite'], CONDITIONAL:['b-warn','Conditional'], UNCERTAIN:['b-grey','Uncertain'] };
  const m = map[a] || ['b-grey', a];
  return `<span class="badge ${m[0]}">${m[1]}</span>`;
}
function statusBadge(s){
  let cls='b-grey';
  if(/Ready/.test(s)) cls='b-accent';
  else if(/Referred/.test(s)) cls='b-warn';
  else if(/Bound/.test(s)) cls='b-ok';
  else if(/Declined/.test(s)) cls='b-bad';
  else if(/Info/.test(s)) cls='b-warn';
  return `<span class="badge ${cls}">${s}</span>`;
}
function tierName(t){ return TIER_LABEL[t]; }
function scoreColor(v){ return v<50?'var(--ok)':v<75?'var(--warn)':'var(--bad)'; }
function driverColor(c){ return c==='ok'?'var(--ok)':c==='warn'?'var(--warn)':'var(--bad)'; }
function trendHtml(arr){
  const rising = arr[arr.length-1] > arr[0];
  return `<span class="trend">${arr.join('% → ')}%</span> <span class="trend ${rising?'arrow-up':'arrow-down'}">${rising?'▲':'▼'} ${Math.abs(arr[arr.length-1]-arr[0])}pts</span>`;
}

/* ================= NOTIFICATIONS ================= */
// target: {caseId, tab} to jump into a case's sub-nav, or {page} to jump to a top-level page. Omit for informational-only.
function pushNotification(text, type, target){
  NOTIFICATIONS.unshift({ id:++notifSeq, at:'2026-08-03 '+String(9+NOTIFICATIONS.length%8).padStart(2,'0')+':1'+(NOTIFICATIONS.length%9), type, text, read:false, target: target||null });
  renderBell();
}
function renderBell(){
  const unread = NOTIFICATIONS.filter(n=>!n.read).length;
  const dot = document.getElementById('notifDot');
  if(dot) dot.style.display = unread ? 'block' : 'none';
  const menu = document.getElementById('notifMenu');
  if(!menu) return;
  const colorFor = t => t==='drastic' ? 'var(--bad)' : t==='pattern' ? 'var(--warn)' : t==='referral' ? 'var(--accent)' : 'var(--grey)';
  menu.innerHTML = `<div class="nh">Notifications</div>` + (NOTIFICATIONS.length ? NOTIFICATIONS.map((n,i)=>`
      <div class="notif-item" data-notif="${i}" style="${n.target?'cursor:pointer':''}"><span class="ndot" style="background:${colorFor(n.type)}"></span>
        <div><div>${n.text}${n.target?' <span class="subtle" style="font-size:10.5px">→ open</span>':''}</div><div class="nt">${n.at}</div></div>
      </div>`).join('') : `<div class="notif-empty">No notifications</div>`);
  menu.querySelectorAll('[data-notif]').forEach(el=> el.addEventListener('click', ()=>{
    const n = NOTIFICATIONS[+el.dataset.notif];
    if(!n || !n.target) return;
    menu.classList.remove('open');
    if(n.target.caseId){ openCaseId = n.target.caseId; caseTab = n.target.tab || 'referrals'; pendingDecision = null; go('case'); }
    else if(n.target.page){ go(n.target.page); }
  }));
}
function wireBell(){
  const menu = document.getElementById('notifMenu');
  document.getElementById('notifBtn').onclick = (e)=>{ e.stopPropagation(); menu.classList.toggle('open'); if(menu.classList.contains('open')){ NOTIFICATIONS.forEach(n=>n.read=true); setTimeout(renderBell, 400); } };
  document.addEventListener('click', (e)=>{ if(!e.target.closest('#notifWrap')) menu.classList.remove('open'); });
}

/* ================= GATE ================= */
function renderGate(){
  const host = document.getElementById('personaList');
  host.innerHTML = PERSONAS.map(p => `
    <button class="persona-card" data-p="${p.id}">
      <div class="persona-ic">${p.initials}</div>
      <div>
        <div class="pt">${p.name}</div>
        <div class="pd">${p.role} · ${p.org}</div>
      </div>
      <div class="pco">${p.tier===0?'View only':'Authority ≤ '+fmtMoney(p.premiumCap)}</div>
      <div class="chev">→</div>
    </button>`).join('');
  host.querySelectorAll('.persona-card').forEach(b=>{
    b.addEventListener('click', ()=>{
      persona = PERSONAS.find(p=>p.id===b.dataset.p);
      document.getElementById('gate').classList.add('hidden');
      document.getElementById('app').classList.add('on');
      mountTop(); renderNav(); renderBell(); wireBell(); go('home');
    });
  });
}

/* ================= TOP BAR / SWITCHER ================= */
function mountTop(){
  document.getElementById('switchBadge').textContent = persona.initials;
  document.getElementById('switchName').textContent = persona.name;
  document.getElementById('switchRole').textContent = persona.tierLabel;
  document.getElementById('topAvatar').textContent = persona.initials;
  document.getElementById('ctxOrg').textContent = persona.org;
  document.getElementById('ctxRole').textContent = persona.role + ' · ' + persona.line;
  document.getElementById('ctxAuth').innerHTML = persona.tier===0
    ? 'View-only — no bind authority'
    : `Authority up to <b>${fmtMoney(persona.premiumCap)}</b> / risk score ≤ ${persona.scoreCap}`;

  const menu = document.getElementById('switchMenu');
  menu.innerHTML = PERSONAS.map(p=>`
    <button class="switch-item" data-p="${p.id}">
      <span class="si">${p.initials}</span>
      <span><span style="font-weight:600;font-size:13px;display:block">${p.name}</span><small>${p.tierLabel}</small></span>
    </button>`).join('');
  menu.querySelectorAll('.switch-item').forEach(b=>{
    b.addEventListener('click', ()=>{
      persona = PERSONAS.find(p=>p.id===b.dataset.p);
      mountTop(); renderNav(); menu.classList.remove('open');
      toast(`Switched to ${persona.name} — ${persona.tierLabel}`);
      renderPage();
    });
  });
  document.getElementById('switchBtn').onclick = ()=> menu.classList.toggle('open');
  document.addEventListener('click', (e)=>{ if(!e.target.closest('.switcher')) menu.classList.remove('open'); });
}

/* ================= NAV ================= */
const NAV = [
  { group:'Underwriting Desk', items:[
    { id:'home', label:'My Dashboard', icon:'chart' },
    { id:'intake', label:'Omnichannel Intake', icon:'inbox', badge: ()=>INTAKE_ITEMS.filter(i=>i.status!=='Auto-Processed').length },
    { id:'queue', label:'Work Queue', icon:'queue', badge: ()=>CASES.filter(c=>/Ready|Referred|Info/.test(c.status)).length },
    { id:'case', label:'Case Workspace', icon:'case', badge: ()=> openCaseId ? '1' : null },
  ]},
  { group:'Portfolio Intelligence', items:[
    { id:'portfolio', label:'Portfolio & Capacity', icon:'portfolio' },
  ]},
  { group:'Governance', items:[
    { id:'governance', label:'Automation & Governance', icon:'shield' },
    { id:'analytics', label:'Performance Analytics', icon:'chart' },
    { id:'config', label:'Configuration', icon:'bolt' },
  ]},
];
function renderNav(){
  const host = document.getElementById('navHost');
  host.innerHTML = NAV.map(g=>`
    <div class="nav-group">
      <div class="gl">${g.group}</div>
      ${g.items.map(it=>{
        const badge = it.badge ? it.badge() : null;
        return `<button class="nav-item ${page===it.id?'active':''}" data-nav="${it.id}">${ICONS[it.icon]}<span>${it.label}</span>${badge?`<span class="badge">${badge}</span>`:''}</button>`;
      }).join('')}
    </div>`).join('');
  host.querySelectorAll('[data-nav]').forEach(b=> b.addEventListener('click', ()=> go(b.dataset.nav)));
}
function go(p){ page = p; renderNav(); renderPage(); document.getElementById('main').scrollTop = 0; }

/* ================= PAGE ROUTER ================= */
function renderPage(){
  const main = document.getElementById('main');
  if(page==='home') main.innerHTML = pageHome();
  else if(page==='intake') main.innerHTML = pageIntake();
  else if(page==='queue') main.innerHTML = pageQueue();
  else if(page==='case') main.innerHTML = pageCase();
  else if(page==='portfolio') main.innerHTML = pagePortfolio();
  else if(page==='governance') main.innerHTML = pageGovernance();
  else if(page==='analytics') main.innerHTML = pageAnalytics();
  else if(page==='config') main.innerHTML = pageConfig();
  wirePage();
  renderBell();
}

/* ================= HOME / ROLE DASHBOARDS ================= */
const PERIOD_KPI = {
  MTD:{bound:'$3.6M', lossRatio:'52.1%', capacity:'71%', turnaround:'2.1d', referralRate:'26%', overrideRate:'6%'},
  QTD:{bound:'$11.9M', lossRatio:'53.4%', capacity:'75%', turnaround:'2.3d', referralRate:'29%', overrideRate:'8%'},
  YTD:{bound:'$41.2M', lossRatio:'54.3%', capacity:'78%', turnaround:'2.4d', referralRate:'31%', overrideRate:'9%'},
};
function periodMult(){ return {MTD:1, QTD:3.1, YTD:11.4}[homeFilters.period] || 1; }
function homeFilteredCases(base){
  return base.filter(c => (!homeFilters.line || c.line===homeFilters.line) && (!homeFilters.state || c.state===homeFilters.state));
}
function homeFilterBar(showState){
  const lines = [...new Set(CASES.map(c=>c.line))];
  const states = [...new Set(CASES.map(c=>c.state))];
  return `<div class="filters">
    <select id="hfPeriod">${['MTD','QTD','YTD'].map(p=>`<option ${homeFilters.period===p?'selected':''}>${p}</option>`).join('')}</select>
    <select id="hfLine"><option value="">All lines</option>${lines.map(l=>`<option ${homeFilters.line===l?'selected':''}>${l}</option>`).join('')}</select>
    ${showState ? `<select id="hfState"><option value="">All states</option>${states.map(s=>`<option ${homeFilters.state===s?'selected':''}>${s}</option>`).join('')}</select>` : ''}
    <button class="btn sm" id="hfClear">Clear filters</button>
  </div>`;
}
function miniCaseTable(rows){
  return `<div class="card" style="padding:0"><table>
    <thead><tr><th>Insured</th><th>Line</th><th>Premium</th><th>Status</th><th>Required Authority</th></tr></thead>
    <tbody>${rows.map(c=>`<tr class="rowlink" data-case="${c.id}">
      <td><div class="tname">${c.insured}</div><div class="tsub">${c.agency} · ${c.id}</div></td>
      <td>${c.line}</td><td class="mono">${fmtMoney(c.premium)}</td><td>${statusBadge(c.status)}</td>
      <td class="subtle mono" style="font-size:11.5px">${tierName(c.requiredTier)}</td></tr>`).join('') || `<tr><td colspan="5" class="subtle" style="text-align:center;padding:20px">No matching cases</td></tr>`}</tbody></table></div>`;
}

function pipelineCard(rows){
  const items = rows.filter(c=>!decisionLog[c.id]).map(c=>({c, d:getDetail(c)}));
  return `<div class="card">
    <h3>AI Rating Assistant <span class="authority-pill pill-ai" style="margin-left:4px">Factors → Rating Engine</span></h3>
    <p class="subtle" style="margin-bottom:12px">For every open case, the engine pulls loss history and MVR/financial factors, scores the risk, and runs the rating engine's experience mod and credits before it reaches you — you're reviewing a derived rate, not building one from scratch.</p>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      <span class="tag">📋 Loss History & MVR</span><span class="subtle">→</span>
      <span class="tag">✦ AI Risk Score</span><span class="subtle">→</span>
      <span class="tag">⚙ Rating Engine (mod + credits)</span><span class="subtle">→</span>
      <span class="tag">💲 Indicated Premium</span>
    </div>
    <div class="tablescroll"><table><thead><tr><th>Insured</th><th>Risk Score</th><th>Exp. Mod</th><th>Indicated Premium</th><th>Requested Premium</th><th>Rate Adequacy</th><th></th></tr></thead>
    <tbody>${items.map(({c,d})=>{
      const e = d.experience;
      const adequate = e.requestedPremium >= e.indicatedPremium;
      return `<tr><td class="tname">${c.insured}</td><td style="color:${scoreColor(d.score.value)};font-weight:700">${d.score.value}</td><td class="mono">${e.mod.toFixed(2)}</td><td class="mono">${fmtMoney(e.indicatedPremium)}</td><td class="mono">${fmtMoney(e.requestedPremium)}</td><td>${adequate?'<span class="badge b-ok">Adequate</span>':'<span class="badge b-warn">Below Indicated</span>'}</td><td><button class="btn sm" data-case="${c.id}" data-case-tab="loss">Open Rating →</button></td></tr>`;
    }).join('') || `<tr><td colspan="7" class="subtle" style="text-align:center;padding:16px">No open cases pending rating</td></tr>`}</tbody></table></div>
  </div>`;
}

function pageHome(){
  if(persona.id==='priya') return pageHomeUW();
  if(persona.id==='marcus') return pageHomeChief();
  if(persona.id==='ishant') return pageHomeMGA();
  return pageHomeAnalyst();
}

function pageHomeUW(){
  const pk = PERIOD_KPI[homeFilters.period];
  const mine = homeFilteredCases(CASES.filter(c=>c.owner===persona.name));
  const ready = mine.filter(c=>/Ready/.test(c.status)).length;
  const referred = mine.filter(c=>/Referred/.test(c.status)).length;
  const acceptedPremium = mine.filter(c=>decisionLog[c.id]?.outcome==='ACCEPT').reduce((a,c)=>a+c.premium,0) * periodMult();
  const avgAge = mine.length ? Math.round(mine.reduce((a,c)=>a+c.age,0)/mine.length) : 0;
  return `<div class="page">
    <div class="ph"><div><div class="crumb">My Dashboard · Senior Underwriter</div><h1>My Desk — ${persona.name}</h1>
      <p>Decisions within your delegated authority (≤ ${fmtMoney(persona.premiumCap)}, risk score ≤ ${persona.scoreCap}) bind directly; anything beyond routes to Supervisor or Chief automatically.</p></div></div>
    ${homeFilterBar(true)}
    <div class="grid g4" style="margin-bottom:16px">
      <div class="kpi"><div class="kl">Ready to decide</div><div class="kv">${ready}</div><div class="kd subtle">In your queue now</div></div>
      <div class="kpi"><div class="kl">Referred / escalated</div><div class="kv">${referred}</div><div class="kd subtle">Awaiting higher authority</div></div>
      <div class="kpi"><div class="kl">Accepted premium (${homeFilters.period})</div><div class="kv">${fmtMoney(acceptedPremium)}</div><div class="kd subtle">This session's accepts, period-scaled</div></div>
      <div class="kpi"><div class="kl">Avg case age</div><div class="kv">${avgAge}d</div><div class="kd up">On service target</div></div>
    </div>
    ${pipelineCard(mine)}
    <h3 style="margin:16px 0 10px">My Open Cases</h3>
    ${miniCaseTable(mine)}
  </div>`;
}

// Chief's oversight roster: every decision-maker in the shop (human or automated), with the
// performance/claims picture Chief needs to manage the team — not just what's routed to them personally.
const UNDERWRITER_STATS = {
  'Priya Nandakumar': { role:'Senior Underwriter', casesDecidedYTD:142, referralRate:28, overrideRate:7, lossRatio:51, claimsYTD:34, premiumBoundYTD:18400000 },
  'Ishant P.':         { role:'MGA Underwriting Manager', casesDecidedYTD:96,  referralRate:19, overrideRate:4, lossRatio:47, claimsYTD:21, premiumBoundYTD:9200000 },
  'System (Auto)':     { role:'Straight-Through (AI)', casesDecidedYTD:58,  referralRate:0,  overrideRate:0, lossRatio:22, claimsYTD:3,  premiumBoundYTD:2100000 },
};
function pageHomeChief(){
  const pk = PERIOD_KPI[homeFilters.period];
  const pending = CASES.filter(c=>{
    const decided = decisionLog[c.id];
    const dr = discountState[c.id];
    return (decided && decided.outcome==='REFER' && decided.routedTo===tierName(TIER.CHIEF)) || (dr && dr.status==='pending' && dr.requiredTier===TIER.CHIEF);
  });
  const filteredPending = homeFilteredCases(pending);
  const roster = Object.keys(UNDERWRITER_STATS).map(name=>{
    const s = UNDERWRITER_STATS[name];
    const openNow = CASES.filter(c=>c.owner===name && !decisionLog[c.id]).length;
    const decidedNow = CASES.filter(c=>c.owner===name && decisionLog[c.id]).length;
    return { name, ...s, openNow, decidedNow };
  });
  return `<div class="page">
    <div class="ph"><div><div class="crumb">My Dashboard · Chief Underwriting Officer</div><h1>Portfolio Command — ${persona.name}</h1>
      <p>Full technical and capacity authority — sees every underwriter's book, claims picture, and performance, not only what's escalated to Chief. Drastic overrides and discounts above 20% still land here for sign-off.</p></div></div>
    ${homeFilterBar(true)}
    <div class="grid g4" style="margin-bottom:16px">
      <div class="kpi"><div class="kl">Bound premium (${homeFilters.period})</div><div class="kv">${pk.bound}</div><div class="kd up">▲ vs plan</div></div>
      <div class="kpi"><div class="kl">Portfolio loss ratio</div><div class="kv">${pk.lossRatio}</div><div class="kd subtle">All lines blended</div></div>
      <div class="kpi"><div class="kl">Awaiting my approval</div><div class="kv" style="color:${filteredPending.length?'var(--bad)':'var(--ok)'}">${filteredPending.length}</div><div class="kd subtle">Drastic overrides & large discounts</div></div>
      <div class="kpi"><div class="kl">Capacity utilized — TX coastal</div><div class="kv">${pk.capacity}</div><div class="kd" style="color:var(--warn)">Approaching treaty limit</div></div>
    </div>
    <div class="card"><h3>All Underwriters — Performance & Claims</h3>
      <div class="tablescroll"><table><thead><tr><th>Underwriter</th><th>Role</th><th>Open Now</th><th>Decided (YTD)</th><th>Referral Rate</th><th>Override Rate</th><th>Claims (YTD)</th><th>Loss Ratio</th><th>Premium Bound (YTD)</th></tr></thead>
      <tbody>${roster.map(r=>`<tr><td class="tname">${r.name}</td><td class="subtle">${r.role}</td><td class="mono">${r.openNow}</td><td class="mono">${r.casesDecidedYTD+r.decidedNow}</td><td class="mono">${r.referralRate}%</td><td class="mono">${r.overrideRate}%</td><td class="mono">${r.claimsYTD}</td><td class="mono" style="color:${r.lossRatio>55?'var(--bad)':r.lossRatio>45?'var(--warn)':'var(--ok)'}">${r.lossRatio}%</td><td class="mono">${fmtMoney(r.premiumBoundYTD)}</td></tr>`).join('')}</tbody></table></div>
    </div>
    <h3 style="margin:16px 0 10px">Awaiting My Approval</h3>
    ${miniCaseTable(filteredPending)}
    <div class="card" style="margin-top:14px"><h3>Portfolio Fit by Line of Business</h3>
      <table><thead><tr><th>Line</th><th>Bound Premium</th><th>Loss Ratio</th><th>Target Mix</th><th>Actual Mix</th></tr></thead>
      <tbody>
        <tr><td>Commercial Auto</td><td class="mono">$14.6M</td><td>48%</td><td>30%</td><td>35%</td></tr>
        <tr><td>Commercial Property</td><td class="mono">$18.1M</td><td>61%</td><td>40%</td><td>44%</td></tr>
        <tr><td>General Liability</td><td class="mono">$6.2M</td><td>52%</td><td>20%</td><td>15%</td></tr>
        <tr><td>Cyber</td><td class="mono">$2.3M</td><td>29%</td><td>10%</td><td>6%</td></tr>
      </tbody></table>
    </div>
  </div>`;
}

function pageHomeMGA(){
  const mgaCases = homeFilteredCases(CASES.filter(c=>/Links/.test(c.agency)));
  const boundPremium = mgaCases.filter(c=>decisionLog[c.id]?.outcome==='ACCEPT' || /Bound/.test(c.status)).reduce((a,c)=>a+c.premium,0);
  const utilization = Math.min(100, Math.round(boundPremium/persona.premiumCap*100));
  const exceedsDAA = mgaCases.filter(c=>c.requiredTier > persona.tier);
  return `<div class="page">
    <div class="ph"><div><div class="crumb">My Dashboard · MGA Underwriting Manager</div><h1>MGA Book — Futuristic Underwriters</h1>
      <p>Runs the agency's own downline (Links) under a delegated authority agreement — up to ${fmtMoney(persona.premiumCap)} / risk score ≤ ${persona.scoreCap}. Anything beyond that escalates to the carrier, same as any other tier gap.</p></div></div>
    ${homeFilterBar(false)}
    <div class="grid g4" style="margin-bottom:16px">
      <div class="kpi"><div class="kl">Open cases in book</div><div class="kv">${mgaCases.length}</div><div class="kd subtle">Links Insurance Services</div></div>
      <div class="kpi"><div class="kl">Bound premium</div><div class="kv">${fmtMoney(boundPremium)}</div><div class="kd subtle">Within delegated authority</div></div>
      <div class="kpi"><div class="kl">Delegated authority utilized</div><div class="kv">${utilization}%</div><div class="progress" style="margin-top:6px"><i style="width:${utilization}%;background:${utilization>80?'var(--warn)':'var(--ok)'}"></i></div></div>
      <div class="kpi"><div class="kl">Cases exceeding DAA</div><div class="kv" style="color:${exceedsDAA.length?'var(--bad)':'var(--ok)'}">${exceedsDAA.length}</div><div class="kd subtle">Requires carrier escalation</div></div>
    </div>
    ${pipelineCard(mgaCases)}
    <h3 style="margin:16px 0 10px">My Agency's Cases</h3>
    ${miniCaseTable(mgaCases)}
  </div>`;
}

function pageHomeAnalyst(){
  const pk = PERIOD_KPI[homeFilters.period];
  return `<div class="page">
    <div class="ph"><div><div class="crumb">My Dashboard · Underwriting Operations Analyst</div><h1>Operations Oversight — ${persona.name}</h1>
      <p>View-only oversight across every underwriter: turnaround, referral and override rates, and which files are due for quality review. No bind authority — this role watches the system, it doesn't decide cases.</p></div></div>
    ${homeFilterBar(false)}
    <div class="grid g4" style="margin-bottom:16px">
      <div class="kpi"><div class="kl">Avg turnaround</div><div class="kv">${pk.turnaround}</div><div class="kd up">On target</div></div>
      <div class="kpi"><div class="kl">Referral rate</div><div class="kv">${pk.referralRate}</div><div class="kd subtle">Of all new business</div></div>
      <div class="kpi"><div class="kl">Override rate</div><div class="kv">${pk.overrideRate}</div><div class="kd subtle">Of AI recommendations</div></div>
      <div class="kpi"><div class="kl">Model drift alerts</div><div class="kv">1</div><div class="kd" style="color:var(--warn)">uw-risk-score-v2.3 — cyber segment</div></div>
    </div>
    <div class="card"><h3>Decision Consistency by Underwriter</h3>
      <table><thead><tr><th>Underwriter</th><th>Cases Decided</th><th>Referral Rate</th><th>Override Rate</th><th>Loss Ratio (bound)</th></tr></thead>
      <tbody>
        <tr><td>Priya Nandakumar</td><td>142</td><td>28%</td><td>7%</td><td>51%</td></tr>
        <tr><td>Ishant P. (MGA)</td><td>96</td><td>19%</td><td>4%</td><td>47%</td></tr>
        <tr><td>Marcus Webb (Chief)</td><td>22</td><td>—</td><td>11%</td><td>58%</td></tr>
      </tbody></table>
    </div>
    <div class="card" style="margin-top:14px"><h3>Underwriting Quality Review — Sample Queue</h3>
      <div class="evrow"><span class="el">C-1002 · Bayview Marine Terminal</span><span class="er"><span class="badge b-warn">Exception review</span></span></div>
      <div class="evrow"><span class="el">C-1005 · Northgate Logistics</span><span class="er"><span class="badge b-bad">Decline review</span></span></div>
      <div class="evrow"><span class="el">C-1003 · Vela Freight Co</span><span class="er"><span class="badge b-grey">Random sample — straight-through</span></span></div>
    </div>
  </div>`;
}

/* ================= OMNICHANNEL INTAKE ================= */
function pageIntake(){
  const item = INTAKE_ITEMS.find(i=>i.id===selectedIntake) || INTAKE_ITEMS[0];
  const docs = INTAKE_DOCS[item.id] || [];
  const linkedCase = CASES.find(c=>c.id===item.linkedCase);
  const needsReview = docs.filter(d=>d.confidence<75);
  const autoExtracted = docs.filter(d=>d.confidence>=75);
  const confColor = v => v>=85 ? 'var(--ok)' : v>=65 ? 'var(--warn)' : 'var(--bad)';
  return `<div class="page">
    <div class="ph"><div><div class="crumb">Submission Operations · Intelligent Intake</div><h1>Omnichannel Intake</h1>
      <p>Email, broker portal, API, and manual upload all land in one operating queue — one submission ID regardless of source, with documents and broker context attached immediately.</p></div></div>
    <div class="grid g2" style="align-items:start">
      <div class="card" style="padding:0">
        <div style="padding:16px 18px 4px"><h3 style="margin-bottom:0">Incoming Submissions — All Channels</h3></div>
        <div style="padding:0 18px 14px">
          ${INTAKE_ITEMS.map(i=>`<div class="intake-row ${i.id===item.id?'active':''}" data-intake="${i.id}">
            <span class="src-badge src-${i.source}">${i.source}</span>
            <div class="it"><div class="subj">${i.subject}</div><div class="meta">${i.from} · ${i.received}</div></div>
            ${i.status==='Exception — Needs Review'?'<span class="badge b-bad">Exception</span>':i.status==='Ready for Review'?'<span class="badge b-warn">Ready for Review</span>':'<span class="badge b-ok">Auto-Processed</span>'}
          </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <h3>Document Classification & Extraction <span class="authority-pill pill-ai" style="margin-left:4px">IDP / OCR</span></h3>
        <p class="subtle" style="margin-bottom:10px">${item.subject} — ${docs.length} attachment(s) classified automatically.</p>
        ${docs.map(dc=>`<div class="doc-row"><div class="dtype">${dc.type}<small>${dc.name}</small></div>
          <span class="confbar"><i style="width:${dc.confidence}%;background:${confColor(dc.confidence)}"></i></span>
          <span class="mono" style="width:34px;text-align:right;font-size:11.5px">${dc.confidence}%</span>
          ${dc.confidence<75 ? '<span class="badge b-warn">Needs Review</span>' : '<span class="badge b-ok">Auto-Extracted</span>'}</div>`).join('')}
        ${needsReview.length ? `<div class="callout warn" style="margin-top:12px"><div><b class="ctitle">Exception queue</b>${needsReview.length} document(s) fell below the confidence threshold and need human validation before this submission can advance.</div></div>` : ''}
        <div style="margin-top:14px;display:flex;gap:10px">
          ${linkedCase ? `<button class="btn primary" data-case="${linkedCase.id}">Open Case ${linkedCase.id} →</button>` : `<button class="btn primary" disabled>No linked case</button>`}
          <button class="btn ghost" id="confirmIntakeBtn" data-intake-confirm="${item.id}">Confirm & Route</button>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:14px">
      <h3>Submission Clearance & Entity Matching <span class="authority-pill pill-ai" style="margin-left:4px">Entity resolution</span></h3>
      <p class="subtle" style="margin-bottom:10px">Before any work starts, the new submission is matched against existing insureds, open renewals, and prior declinations — never auto-merged on weak confidence.</p>
      ${(ENTITY_MATCHES[item.id]||[]).map(m=>`<div class="match-row"><div class="mic" style="background:${m.badge==='ok'?'var(--ok)':m.badge==='warn'?'var(--warn)':'var(--grey)'}">${m.badge==='ok'?'✓':m.badge==='warn'?'⚑':'—'}</div>
        <div style="flex:1"><b>${m.type}</b> <span class="subtle">— ${m.label}</span><div class="subtle" style="margin-top:2px;font-size:11px">${m.action}</div></div>
        ${m.confidence>0?`<span class="confbar"><i style="width:${m.confidence}%;background:${m.badge==='ok'?'var(--ok)':m.badge==='warn'?'var(--warn)':'var(--grey)'}"></i></span><span class="mono" style="font-size:11px">${m.confidence}%</span>`:''}</div>`).join('')}
    </div>
    <div class="card" style="margin-top:14px">
      <h3>Enrichment & Prefill Applied <span class="authority-pill pill-ai" style="margin-left:4px">Internal + external</span></h3>
      <p class="subtle" style="margin-bottom:10px">${linkedCase ? `For ${linkedCase.line}, the workbench pulls:` : 'Representative enrichment sources for this submission type:'}</p>
      ${enrichmentFor(linkedCase?linkedCase.line:'').map(e=>`<div class="enrich-row"><div class="eic">${e.kind==='Internal'?'◆':'✦'}</div><div style="flex:1"><b>${e.source}</b> <span class="subtle">— ${e.desc}</span></div><span class="badge ${e.kind==='Internal'?'b-grey':'b-accent'}">${e.kind}</span></div>`).join('')}
    </div>
  </div>`;
}

/* ================= WORK QUEUE ================= */
function pageQueue(){
  const lines = [...new Set(CASES.map(c=>c.line))];
  const statuses = [...new Set(CASES.map(c=>c.status))];
  let rows = CASES.filter(c =>
    (!queueFilters.line || c.line===queueFilters.line) &&
    (!queueFilters.status || c.status===queueFilters.status) &&
    (!queueFilters.triage || triageOf(c)===queueFilters.triage) &&
    (!queueFilters.q || (c.insured+c.agency+c.line).toLowerCase().includes(queueFilters.q.toLowerCase()))
  );
  const triageCounts = { fastTrack:0, fullReview:0, refer:0 };
  CASES.forEach(c=> triageCounts[triageOf(c)]++);
  const slaClass = age => age>CONFIG.slaBadDays ? 'var(--bad)' : age>CONFIG.slaWarnDays ? 'var(--warn)' : 'var(--ok)';

  const kanbanCols = statuses.map(s=>({ status:s, items: rows.filter(c=>c.status===s) }));

  return `
  <div class="page">
    <div class="ph">
      <div><div class="crumb">Underwriting Desk & Case Control</div><h1>Work Queue</h1><p>Organized by owner, status, age, complexity and premium potential. AI recommends best-fit assignment and highlights cases nearing their service target.</p></div>
      <div class="sp">
        <button class="btn ${queueView==='list'?'primary':''} sm" id="viewListBtn">List</button>
        <button class="btn ${queueView==='kanban'?'primary':''} sm" id="viewKanbanBtn">Kanban</button>
        <button class="btn" id="clearQF">Clear filters</button><button class="btn primary" id="askQueueBtn">✦ Ask about this queue</button>
      </div>
    </div>
    <div class="grid g4" style="margin-bottom:16px">
      <div class="kpi"><div class="kl">Open cases</div><div class="kv">${CASES.length}</div><div class="kd subtle">${CASES.filter(c=>/Ready/.test(c.status)).length} ready to decide</div></div>
      <div class="kpi"><div class="kl">Referred / escalated</div><div class="kv">${CASES.filter(c=>/Referred/.test(c.status)).length}</div><div class="kd subtle">Awaiting higher authority</div></div>
      <div class="kpi"><div class="kl">Avg case age</div><div class="kv">${Math.round(CASES.reduce((a,c)=>a+c.age,0)/CASES.length)}d</div><div class="kd up">On service target</div></div>
      <div class="kpi"><div class="kl">Straight-through this month</div><div class="kv">38%</div><div class="kd up">▲ 6pts vs last month</div></div>
    </div>
    <div class="triage-strip">
      <div class="triage-chip ${queueFilters.triage==='fastTrack'?'active':''}" data-triage="fastTrack"><div class="tn">Fast-Track (STP-eligible)</div><div class="tv" style="color:var(--ok)">${triageCounts.fastTrack}</div></div>
      <div class="triage-chip ${queueFilters.triage==='fullReview'?'active':''}" data-triage="fullReview"><div class="tn">Full Review</div><div class="tv" style="color:var(--warn)">${triageCounts.fullReview}</div></div>
      <div class="triage-chip ${queueFilters.triage==='refer'?'active':''}" data-triage="refer"><div class="tn">Refer / Decline</div><div class="tv" style="color:var(--bad)">${triageCounts.refer}</div></div>
    </div>
    <div class="filters">
      <select id="fLine"><option value="">All lines</option>${lines.map(l=>`<option ${queueFilters.line===l?'selected':''}>${l}</option>`).join('')}</select>
      <select id="fStatus"><option value="">All statuses</option>${statuses.map(s=>`<option ${queueFilters.status===s?'selected':''}>${s}</option>`).join('')}</select>
      <input id="fQ" placeholder="Search insured, agency, line…" value="${queueFilters.q}"/>
      <span class="subtle" style="align-self:center">${rows.length} of ${CASES.length} cases</span>
    </div>
    ${queueView==='kanban' ? `
    <div class="kanban-board">
      ${kanbanCols.map(col=>`<div class="kanban-col"><div class="kh"><span>${col.status}</span><span>${col.items.length}</span></div>
        ${col.items.map(c=>`<div class="kanban-card" data-case="${c.id}"><div class="kt">${c.insured}</div><div class="ks">${c.line} · ${fmtMoney(c.premium)}</div><div class="ks" style="color:${slaClass(c.age)}">${c.age}d old</div></div>`).join('') || '<div class="ks subtle">No cases</div>'}
      </div>`).join('')}
    </div>` : `
    <div class="card" style="padding:0">
      <table>
        <thead><tr><th>Insured</th><th>Line</th><th>Premium</th><th>Score</th><th>Appetite</th><th>Status</th><th>Required Authority</th><th>Age (SLA)</th></tr></thead>
        <tbody>
        ${rows.map(c=>`
          <tr class="rowlink" data-case="${c.id}">
            <td><div class="tname">${c.insured}</div><div class="tsub">${c.agency} · ${c.id}</div></td>
            <td>${c.line}</td>
            <td class="mono">${fmtMoney(c.premium)}</td>
            <td><span style="color:${scoreColor(c.riskScore)};font-weight:700">${c.riskScore}</span></td>
            <td>${appetiteBadge(c.appetite)}</td>
            <td>${statusBadge(c.status)}</td>
            <td class="subtle mono" style="font-size:11.5px">${tierName(c.requiredTier)}</td>
            <td class="mono" style="color:${slaClass(c.age)};font-weight:700">${c.age}d</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`}
  </div>`;
}

/* ================= CASE WORKSPACE ================= */
const CASE_NAV = [
  {id:'action', label:'Action Items'},
  {id:'geninfo', label:'General Info'},
  {id:'vehicles', label:'Vehicles'},
  {id:'drivers', label:'Drivers'},
  {id:'property', label:'Property Schedule & CAT'},
  {id:'classcodes', label:'Class Codes & Payroll'},
  {id:'loss', label:'Loss History'},
  {id:'quotehistory', label:'Quote History'},
  {id:'renewal', label:'Renewal & Change Comparison'},
  {id:'anomaly', label:'Anomaly Detection'},
  {id:'underwriting', label:'Underwriting'},
  {id:'negotiation', label:'Broker Negotiation'},
  {id:'selectforms', label:'Select Forms'},
  {id:'premium', label:'Premium Estimate'},
  {id:'referrals', label:'Approvals'},
  {id:'bind', label:'Bind / Post Invoice'},
  {id:'documents', label:'Documents'},
  {id:'notes', label:'Notes'},
  {id:'audit', label:'Audit Trail'},
];
function isAutoLine(c){ return /Auto/.test(c.line); }
function isPropertyLine(c){ return /Property/.test(c.line); }
function isWCLine(c){ return /Workers/.test(c.line); }
function expDateOf(c){ const [y,m,dd]=c.effDate.split('-').map(Number); return `${y+1}-${String(m).padStart(2,'0')}-${String(dd).padStart(2,'0')}`; }

/* Every open condition standing between this case and a printable quote / bind. */
function blockingReasons(c,d){
  const reasons = [];
  const decided = decisionLog[c.id];
  if(!decided) reasons.push({label:'Underwriting decision not yet recorded', tab:'underwriting', kind:'ai'});
  else if(decided.outcome==='REFER') reasons.push({label:`Referred to ${decided.routedTo} — awaiting their decision`, tab:'referrals', kind: decided.override?'ai':'manual'});
  else if(decided.outcome==='DECLINE') reasons.push({label:'Case was declined — cannot quote', tab:'underwriting', kind:'ai'});
  else if(decided.outcome==='REQUEST_INFO') reasons.push({label:'Additional information requested — pending broker response', tab:'action', kind:'manual'});
  const dr = discountState[c.id];
  if(dr && dr.status==='pending') reasons.push({label:`${dr.pct}% discount pending ${tierName(dr.requiredTier)} approval`, tab:'referrals', kind:'manual'});
  const pendingSubj = (d.subjectivities||[]).filter(s=>s.status==='pending');
  if(pendingSubj.length) reasons.push({label:`${pendingSubj.length} subjectivity(ies) unresolved`, tab:'referrals', kind:'manual'});
  const missingReq = (d.requirements||[]).filter(r=>r.status!=='received');
  if(missingReq.length) reasons.push({label:`${missingReq.length} requirement(s) outstanding: ${missingReq.map(r=>r.label).join(', ')}`, tab:'action', kind:'manual'});
  return reasons;
}
function isBoundOrDeclined(c){ const decided = decisionLog[c.id]; return boundCases[c.id] || (decided && decided.outcome==='DECLINE'); }

/* Shared premium math — used by both the Premium Estimate tab and the generated policy document, so the numbers never drift apart. */
function computePremium(c,d){
  const e = d.experience;
  const dr = discountState[c.id];
  const discountFactor = dr && dr.status==='approved' ? (1 - dr.pct/100) : 1;
  const finalPremium = Math.round(e.requestedPremium * discountFactor);
  const policyFee = 500, surplusTaxRate = 0.0485, stampingFeeRate = 0.0004; // TX surplus lines tax + stamping fee, matching statutory rates
  const surplusTax = Math.round(finalPremium*surplusTaxRate*100)/100;
  const stampingFee = Math.round(finalPremium*stampingFeeRate*100)/100;
  const totalWithFees = Math.round((finalPremium + policyFee + surplusTax + stampingFee)*100)/100;
  return { dr, finalPremium, policyFee, surplusTax, stampingFee, totalWithFees };
}
function money2(n){ return '$'+n.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}); }
function checkedForms(c,d){
  const overrides = formsOverride[c.id] || {};
  return d.forms.filter(f => overrides.hasOwnProperty(f.name) ? overrides[f.name] : f.checked);
}

/* Renewal recommender — retain / re-price / escalate, driven by the expiring term's own loss ratio and the current indication. */
function renewalRecommendation(c,d){
  const terms = d.customerHistory.priorTerms||[];
  if(!terms.length) return null;
  const last = terms[terms.length-1];
  const e = d.experience;
  if(last.lossRatio>70) return { action:'ESCALATE', color:'bad', rationale:`Expiring term's loss ratio (${last.lossRatio}%) is well above target — recommend senior/committee review before quoting renewal terms.` };
  if(last.lossRatio>40 || e.requestedPremium<e.indicatedPremium) return { action:'RE-PRICE', color:'warn', rationale:`Expiring loss ratio (${last.lossRatio}%) and/or the current rate falling below indicated (${fmtMoney(e.indicatedPremium)}) suggest adjusting price at renewal rather than a flat rollover.` };
  return { action:'RETAIN', color:'ok', rationale:`Expiring loss ratio (${last.lossRatio}%) is favorable and current pricing meets or exceeds indicated — recommend retaining on comparable terms.` };
}

/* Broker negotiation copilot — drafts a reply with the exact premium offset for the requested change. */
function draftNegotiationResponse(c,d){
  const thread = negotiationThreads[c.id] || [];
  const lastBroker = thread.filter(m=>m.who==='broker').slice(-1)[0];
  const { finalPremium } = computePremium(c,d);
  let text, impact;
  if(lastBroker && /deductible/i.test(lastBroker.text)){
    const fullAsk = Math.round(finalPremium*0.04);
    const compromise = Math.round(fullAsk/2);
    text = `Lowering the deductible as requested increases expected loss cost by roughly 4% (+${fmtMoney(fullAsk)}, to ${fmtMoney(finalPremium+fullAsk)}). We can offer a mid-point deductible for about half that impact (+${fmtMoney(compromise)}) — this broker's book has historically closed near the midpoint on deductible asks.`;
    impact = `+${fmtMoney(compromise)} (compromise) / +${fmtMoney(fullAsk)} (full ask)`;
  } else if(lastBroker && /limit/i.test(lastBroker.text)){
    const reduction = Math.round(finalPremium*0.06);
    text = `Splitting to the lower limit reduces expected loss cost by roughly 6% (-${fmtMoney(reduction)}, to ${fmtMoney(finalPremium-reduction)}). Recommend confirming coverage adequacy with the insured before committing to the lower split.`;
    impact = `-${fmtMoney(reduction)}`;
  } else {
    text = `Reviewed against current pricing — no material premium offset identified without more specifics on the requested change.`;
    impact = null;
  }
  return { text, impact };
}

/* Anomaly detection — simple, explainable rule checks rather than an opaque model score. */
function anomalyChecksFor(c,d){
  const checks = [];
  const e = d.experience;
  if(isWCLine(c) && d.classCodes){
    const avgRate = d.classCodes.reduce((a,cc)=>a+cc.rate,0)/d.classCodes.length;
    const totalPayroll = d.classCodes.reduce((a,cc)=>a+cc.payroll,0);
    checks.push({ label:'Payroll-to-class mix vs. peer average', flagged:false, detail:`Blended rate $${avgRate.toFixed(2)}/$100 across ${d.classCodes.length} class codes on ${fmtMoney(totalPayroll)} payroll — within normal range for this industry.` });
  }
  if(d.lossRuns.length>=2){
    const recent = d.lossRuns[d.lossRuns.length-2];
    const priorYr = d.lossRuns[d.lossRuns.length-3] || null;
    const spike = priorYr && recent.incurred > 0 && priorYr.incurred===0;
    checks.push({ label:'Loss frequency/severity pattern vs. own trailing history', flagged: !!spike, detail: spike ? `A loss appeared in ${recent.period} after a clean prior period — not disqualifying, but worth a second look at cause.` : 'No material deviation from this account\'s own trailing loss pattern.' });
  }
  const scoreVsAppetite = c.appetite==='UNCERTAIN' && d.score.value>65;
  checks.push({ label:'Risk score vs. appetite result consistency', flagged: scoreVsAppetite, detail: scoreVsAppetite ? 'Score sits in the Elevated range while appetite is still Uncertain — evidence gap should be closed before this drifts into a false Accept.' : 'Score and appetite result are consistent with each other.' });
  const priceGap = e.requestedPremium < e.technicalPremium*0.9;
  checks.push({ label:'Requested premium vs. technical premium gap', flagged: priceGap, detail: priceGap ? `Requested premium is more than 10% below technical premium (${fmtMoney(e.technicalPremium)}) — check for a pricing or data entry error before quoting.` : 'Requested premium is within a normal band of technical premium.' });
  return checks;
}

function pageCase(){
  if(!openCaseId){
    return `<div class="page"><div class="ph"><div><div class="crumb">Underwriting Desk & Case Control</div><h1>Case Workspace</h1><p>Select a case from the Work Queue to open its full workspace.</p></div></div>
    <div class="card"><p class="subtle">No case is currently open. Go to <b>Work Queue</b> and click any row.</p><button class="btn primary" style="margin-top:12px" onclick="window.__uwGo('queue')">Go to Work Queue</button></div></div>`;
  }
  const c = CASES.find(x=>x.id===openCaseId);
  const d = getDetail(c);
  const decided = decisionLog[c.id];
  const reasons = blockingReasons(c,d);
  const pdForQs = policyDocs[c.id];
  const qs = pdForQs?.status==='issued' ? 'ISSUED'
    : pdForQs?.status==='signed' ? 'SIGNED'
    : pdForQs?.status==='sent' ? 'PENDING SIGNATURE'
    : pdForQs?.status==='drafted' ? 'BOUND-DRAFT'
    : decided ? (decided.outcome==='ACCEPT' ? (quotePrinted[c.id]?'QUOTED':'ACCEPTED') : decided.outcome==='DECLINE' ? 'DECLINED' : decided.outcome==='REFER' ? 'UW REVIEW' : decided.outcome)
    : 'RECEIVED';

  return `
  <div class="case-dark-bar">
    <span class="seg">${c.id.replace('C-','1071') /* dummy long ref */}</span><span class="sep">|</span>
    <span class="seg">${c.insured}</span><span class="sep">|</span>
    <span class="seg">${c.agencyCode}-${c.agency}</span><span class="sep">|</span>
    <span class="seg">${c.owner}</span><span class="sep">|</span>
    <span class="qs">QS:${qs}</span><span class="sep">|</span>
    <span class="seg">${c.state}</span><span class="sep">|</span>
    <span class="seg">${c.refNumber}</span>
    <span class="winctl">⊟ ⛶ ✕</span>
  </div>
  <div class="page" style="padding-top:16px">
    <div class="case-layout">
      <div class="case-nav">
        ${CASE_NAV.filter(n=>{
          if(n.id==='vehicles'||n.id==='drivers') return isAutoLine(c);
          if(n.id==='property') return isPropertyLine(c);
          if(n.id==='classcodes') return isWCLine(c);
          if(n.id==='renewal') return (d.customerHistory.priorTerms||[]).length>0;
          return true;
        }).map(n=>{
          let cnt = null;
          if(n.id==='action') cnt = reasons.length || null;
          if(n.id==='referrals') cnt = reasons.length || null;
          return `<button class="case-navitem ${caseTab===n.id?'active':''}" data-tab="${n.id}">${n.label}${cnt?`<span class="cnt">${cnt}</span>`:''}</button>`;
        }).join('')}
      </div>
      <div class="case-content" id="caseTabBody">${renderCaseTab(c,d,decided,reasons)}</div>
    </div>
  </div>`;
}

function renderCaseTab(c,d,decided,reasons){
  if(caseTab==='action'){
    const items = [];
    (d.requirements||[]).filter(r=>r.status!=='received').forEach(r=> items.push({icon:'!', color:'var(--warn)', text:`Outstanding requirement: ${r.label}`, sub:'Application & Operations', tab:'geninfo'}));
    reasons.forEach(r=> items.push({icon: r.kind==='ai'?'✦':'⚑', color: r.kind==='ai'?'var(--accent)':'var(--bad)', text:r.label, sub:'Blocks quote printing', tab:r.tab}));
    (d.subjectivities||[]).filter(s=>s.status!=='pending').forEach(s=> items.push({icon:'✓', color:'var(--ok)', text:`Cleared: ${s.label}`, sub:'Approvals', tab:'referrals'}));
    return `<div class="card"><h3>Action Items</h3>
      ${items.length ? items.map(it=>`<div class="actionrow"><div class="aic" style="background:${it.color}">${it.icon}</div><div class="at">${it.text}<div class="as">${it.sub}</div></div><button class="btn sm ghost" data-jump="${it.tab}">Open</button></div>`).join('')
        : `<p class="subtle">Nothing outstanding — this case is clear to quote.</p>`}
    </div>
    <div class="card"><h3>AI Case Summary</h3><ul style="padding-left:18px;display:flex;flex-direction:column;gap:8px">${d.summary.map(s=>`<li style="font-size:13px">${s}</li>`).join('')}</ul></div>`;
  }

  if(caseTab==='geninfo'){
    const a = d.applicant;
    return `
    <div class="card">
      <div class="sectionlabel">Broker Info</div>
      <div class="formgrid">
        <div class="fitem"><div class="fl">Agency Name</div><div class="fv">[${c.agencyCode}] ${c.agency}</div></div>
        <div class="fitem"><div class="fl">Producer / Broker</div><div class="fv">${c.broker}</div></div>
        <div class="fitem"><div class="fl">Current Underwriter</div><div class="fv">${c.owner}</div></div>
      </div>
      <div class="sectionlabel">Insured Info</div>
      <div class="formgrid">
        <div class="fitem"><div class="fl">Legal Name</div><div class="fv">${a.legalName}</div></div>
        <div class="fitem"><div class="fl">DBA</div><div class="fv">${a.dba}</div></div>
        <div class="fitem"><div class="fl">Entity Type</div><div class="fv">${a.entityType}</div></div>
        <div class="fitem"><div class="fl">FEIN</div><div class="fv mono">${a.fein}</div></div>
        <div class="fitem"><div class="fl">Years in Business</div><div class="fv">${a.yearsInBusiness}</div></div>
        <div class="fitem"><div class="fl">DOT / MC</div><div class="fv mono">${a.dot} / ${a.mc}</div></div>
        <div class="fitem"><div class="fl">Prior Carrier</div><div class="fv">${a.priorCarrier}</div></div>
        <div class="fitem"><div class="fl">Years w/ Prior Carrier</div><div class="fv">${a.yearsWithPrior}</div></div>
        <div class="fitem"><div class="fl">Annual Revenue</div><div class="fv">${a.revenue}</div></div>
      </div>
      <div class="sectionlabel">Primary Location & Operations</div>
      <div class="formgrid">
        <div class="fitem"><div class="fl">State</div><div class="fv">${c.state}</div></div>
        <div class="fitem"><div class="fl">Operating Radius</div><div class="fv">${a.radius}</div></div>
        <div class="fitem"><div class="fl">Commodities / Operations</div><div class="fv">${a.commodities}</div></div>
        <div class="fitem"><div class="fl">Terminals</div><div class="fv">${a.terminals}</div></div>
      </div>
      <div class="sectionlabel">General Info</div>
      <div class="formgrid">
        <div class="fitem"><div class="fl">Effective Date</div><div class="fv">${c.effDate}</div></div>
        <div class="fitem"><div class="fl">Expiration Date</div><div class="fv">${expDateOf(c)}</div></div>
        <div class="fitem"><div class="fl">Policy Type</div><div class="fv">New</div></div>
      </div>
    </div>
    <div class="card"><h3>Requirements & Information Requests</h3><div class="checklist">${d.requirements.map(r=>`
      <div class="chk"><div class="ci" style="background:${r.status==='received'?'var(--ok)':'var(--warn)'}">${r.status==='received'?'✓':'!'}</div>
      <div style="flex:1">${r.label}</div><span class="subtle mono" style="font-size:11px;text-transform:uppercase">${r.status}</span></div>`).join('')}</div></div>
    ${(()=>{ if(!c.accountId) return ''; const siblings = CASES.filter(x=>x.accountId===c.accountId && x.id!==c.id); if(!siblings.length) return '';
      return `<div class="card"><h3>Account — Other Lines <span class="authority-pill pill-manual" style="margin-left:4px">Unified account record</span></h3>
        <p class="subtle" style="margin-bottom:8px">${c.insured} carries other lines under the same account (${c.accountId}) — one case file, not a bespoke integration per line.</p>
        <div class="tablescroll"><table><thead><tr><th>Case</th><th>Line</th><th>Premium</th><th>Status</th></tr></thead>
        <tbody>${siblings.map(s=>`<tr class="rowlink" data-case="${s.id}"><td class="mono">${s.id}</td><td>${s.line}</td><td class="mono">${fmtMoney(s.premium)}</td><td>${statusBadge(s.status)}</td></tr>`).join('')}</tbody></table></div>
      </div>`; })()}`;
  }

  if(caseTab==='vehicles'){
    if(!d.fleetSchedule) return `<div class="card"><h3>Vehicles</h3><p class="subtle">No vehicle schedule applies to this line of business.</p></div>`;
    const extra = vehiclesExtra[c.id] || [];
    const rows = [...d.fleetSchedule, ...extra];
    return `
    <div class="card"><h3>Vehicle Schedule</h3>
      <div class="tablescroll"><table><thead><tr><th>#</th><th>Year/Make</th><th>Type</th><th>Stated Value</th><th>Garaging</th></tr></thead>
      <tbody>${rows.map((f,i)=>`<tr><td class="mono">${f.unit||i+1}</td><td>${f.year?f.year+' '+f.make:f.make}</td><td>${f.type}</td><td class="mono">${f.value?fmtMoney(f.value):'—'}</td><td class="subtle">${f.garage}</td></tr>`).join('')}</tbody></table></div>
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn sm" id="addVehicleBtn">+ Add Vehicle</button><button class="btn sm ghost" data-bulk-open="vehicles">⇪ Bulk Upload</button></div>
      ${bulkPanelHtml('vehicles')}
    </div>`;
  }

  if(caseTab==='drivers'){
    if(!d.driverSchedule) return `<div class="card"><h3>Drivers</h3><p class="subtle">No driver schedule applies to this line of business.</p></div>`;
    const extra = driversExtra[c.id] || [];
    const rows = [...d.driverSchedule, ...extra];
    return `
    <div class="card"><h3>Driver Schedule</h3>
      <div class="tablescroll"><table><thead><tr><th>Driver</th><th>License</th><th>Yrs Exp.</th><th>MVR Pts</th><th>Violations</th><th>Status</th></tr></thead>
      <tbody>${rows.map(dr=>`<tr><td>${dr.name}</td><td class="mono">${dr.license}</td><td>${dr.years??'—'}</td><td>${dr.mvr??'—'}</td><td class="subtle">${dr.viol}</td><td><span class="badge b-ok">${dr.status}</span></td></tr>`).join('')}</tbody></table></div>
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn sm" id="addDriverBtn">+ Add Driver</button><button class="btn sm ghost" data-bulk-open="drivers">⇪ Bulk Upload</button></div>
      ${bulkPanelHtml('drivers')}
    </div>`;
  }

  if(caseTab==='property'){
    if(!d.propertySchedule) return `<div class="card"><h3>Property Schedule & CAT</h3><p class="subtle">No property schedule applies to this line of business.</p></div>`;
    const rows = [...d.propertySchedule, ...(propertyExtra[c.id]||[])];
    const totalTiv = rows.reduce((a,l)=>a+l.tiv,0);
    return `
    <div class="card"><h3>Property Schedule <span class="authority-pill pill-ai" style="margin-left:4px">COPE + CAT enrichment</span></h3>
      <div class="tablescroll"><table><thead><tr><th>Loc</th><th>Address</th><th>Construction</th><th>Occupancy</th><th>Protection</th><th>TIV</th><th>Hazard Score</th><th>CAT Zone</th></tr></thead>
      <tbody>${rows.map(l=>`<tr><td class="mono">${l.loc}</td><td>${l.address}</td><td>${l.construction}</td><td>${l.occupancy}</td><td>${l.protection}</td><td class="mono">${fmtMoney(l.tiv)}</td><td style="color:${scoreColor(l.hazard)};font-weight:700">${l.hazard}</td><td class="subtle">${l.catZone}</td></tr>`).join('')}</tbody></table></div>
      <div class="evrow" style="margin-top:6px"><span class="el"><b>Total Insured Value</b></span><span class="er mono" style="font-weight:700">${fmtMoney(totalTiv)}</span></div>
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn sm ghost" data-bulk-open="property">⇪ Bulk Upload</button></div>
      ${bulkPanelHtml('property')}
    </div>
    <div class="card"><h3>Location Map <span class="authority-pill pill-ai" style="margin-left:4px">Geospatial</span></h3>
      <div class="mini-map">${rows.map(l=>`<div class="pin" data-label="Loc ${l.loc} — Hazard ${l.hazard}" style="left:${l.x}%;top:${l.y}%;background:${scoreColor(l.hazard)}"></div>`).join('')}</div>
      <div class="heatmap-legend"><span class="sw" style="background:var(--ok)"></span>Low hazard <span class="sw" style="background:var(--warn)"></span>Moderate <span class="sw" style="background:var(--bad)"></span>High hazard</div>
    </div>
    <div class="card"><h3>Catastrophe & Accumulation Context</h3>
      <p class="subtle" style="margin-bottom:8px">This schedule's contribution to portfolio wind/flood accumulation is checked automatically before bind — see Portfolio & Capacity for the full concentration view.</p>
      <button class="btn sm ghost" data-nav-jump="portfolio">Open Portfolio & Capacity</button>
    </div>`;
  }

  if(caseTab==='classcodes'){
    if(!d.classCodes) return `<div class="card"><h3>Class Codes & Payroll</h3><p class="subtle">No class code schedule applies to this line of business.</p></div>`;
    const rows = [...d.classCodes, ...(classCodesExtra[c.id]||[])];
    const manualTotal = rows.reduce((a,cc)=>a+Math.round(cc.payroll/100*cc.rate),0);
    return `
    <div class="card"><h3>Class Codes & Payroll <span class="authority-pill pill-ai" style="margin-left:4px">NCCI-style rating</span></h3>
      <div class="tablescroll"><table><thead><tr><th>Class Code</th><th>Description</th><th>Payroll</th><th>Rate / $100</th><th>Manual Premium</th></tr></thead>
      <tbody>${rows.map(cc=>`<tr><td class="mono">${cc.code}</td><td>${cc.desc}</td><td class="mono">${fmtMoney(cc.payroll)}</td><td class="mono">$${(+cc.rate).toFixed(2)}</td><td class="mono">${fmtMoney(Math.round(cc.payroll/100*cc.rate))}</td></tr>`).join('')}</tbody></table></div>
      <div class="evrow" style="margin-top:6px"><span class="el"><b>Manual Premium (sum of classes)</b></span><span class="er mono" style="font-weight:700">${fmtMoney(manualTotal)}</span></div>
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn sm ghost" data-bulk-open="classcodes">⇪ Bulk Upload</button></div>
      ${bulkPanelHtml('classcodes')}
    </div>
    <div class="card"><h3>Experience Modification</h3>
      <div class="evrow"><span class="el">Experience mod factor</span><span class="er mono" style="font-weight:700">${d.experience.mod.toFixed(2)}</span></div>
      <div class="subtle" style="margin-top:6px;font-size:11.5px">${d.experience.modNote}</div>
    </div>`;
  }

  if(caseTab==='loss') return `
    <div class="card"><h3>Loss History & Claims Analysis</h3>
      <div class="tablescroll"><table><thead><tr><th>Period</th><th>Claims</th><th>Incurred</th><th>Paid</th><th>Reserve</th><th>Largest</th><th>Cause</th></tr></thead>
      <tbody>${d.lossRuns.map(l=>`<tr><td>${l.period}</td><td>${l.claims}</td><td class="mono">${l.incurred?fmtMoney(l.incurred):'—'}</td><td class="mono">${l.paid?fmtMoney(l.paid):'—'}</td><td class="mono">${l.reserve?fmtMoney(l.reserve):'—'}</td><td class="mono">${l.largest?fmtMoney(l.largest):'—'}</td><td class="subtle">${l.cause}</td></tr>`).join('')}</tbody></table></div>
    </div>`;

  if(caseTab==='quotehistory'){
    const h = d.customerHistory;
    const bb = BROKER_BOOK[c.broker];
    return `
    <div class="card"><h3>Quote / Policy History</h3>
      <div class="evrow"><span class="el">Tenure with this carrier</span><span class="er">${h.newToCarrier ? 'New business — not previously written' : h.tenureYears+' years'}</span></div>
      ${h.priorTerms.length ? `<table style="margin-top:10px"><thead><tr><th>Term</th><th>Premium</th><th>Loss Ratio</th><th>Renewed</th></tr></thead>
        <tbody>${h.priorTerms.map(t=>`<tr><td>${t.term}</td><td class="mono">${fmtMoney(t.premium)}</td><td class="mono">${t.lossRatio}%</td><td>${t.renewed===true?'<span class="badge b-ok">Yes</span>':`<span class="badge b-warn">${t.renewed}</span>`}</td></tr>`).join('')}</tbody></table>`
        : `<p class="subtle" style="margin-top:8px">No prior policy history with this carrier — treated as new business.</p>`}
    </div>
    <div class="card"><h3>Prior Underwriting Notes</h3>
      ${h.underwriterNotes.length ? h.underwriterNotes.map(n=>`<div class="evrow"><span class="el mono" style="font-size:11px">${n.date} · ${n.who}</span><span class="er" style="text-align:left;font-weight:400">${n.note}</span></div>`).join('') : `<p class="subtle">No prior notes on file.</p>`}
    </div>
    ${bb ? `<div class="card"><h3>Broker Book Context — ${c.broker} (${bb.agency})</h3>
      <div class="evrow"><span class="el">Loss ratio trend, last 4 terms</span><span class="er">${trendHtml(bb.trend)}</span></div>
      <div class="subtle" style="margin-top:8px">This is broker/book-level context. See Governance → Underwriter & Broker Pattern Monitoring for the full flag.</div>
    </div>` : ''}`;
  }

  if(caseTab==='renewal'){
    const terms = d.customerHistory.priorTerms||[];
    const last = terms[terms.length-1];
    const e = d.experience;
    const premiumDelta = Math.round((e.requestedPremium-last.premium)/last.premium*100);
    const lrDelta = (e.actualLossRatio - last.lossRatio);
    const rec = renewalRecommendation(c,d);
    const flagRow = (label, prior, current, flagged) => `<tr><td>${label}</td><td class="mono">${prior}</td><td class="mono">${current}</td><td class="diff-flag ${flagged?'up':'same'}">${flagged?'⚑ Material change':'—'}</td></tr>`;
    return `
    <div class="card"><h3>Expiring Term vs. Current Submission <span class="authority-pill pill-ai" style="margin-left:4px">Auto-compared</span></h3>
      <div class="tablescroll"><table class="diff-table"><thead><tr><th>Metric</th><th>Expiring (${last.term})</th><th>Current Submission</th><th>Flag</th></tr></thead>
      <tbody>
        ${flagRow('Premium', fmtMoney(last.premium), fmtMoney(e.requestedPremium), Math.abs(premiumDelta)>=15)}
        ${flagRow('Loss ratio', last.lossRatio+'%', e.actualLossRatio+'%', Math.abs(lrDelta)>=15)}
        ${flagRow('Risk score', '—', d.score.value, d.score.value>=75)}
        ${flagRow('Appetite result', 'In Appetite', c.appetite.replace('_',' '), c.appetite!=='IN_APPETITE')}
      </tbody></table></div>
      <div class="subtle" style="margin-top:8px">Premium change: <b style="color:${premiumDelta>=0?'var(--warn)':'var(--ok)'}">${premiumDelta>=0?'+':''}${premiumDelta}%</b> · Loss ratio change: <b style="color:${lrDelta>=0?'var(--bad)':'var(--ok)'}">${lrDelta>=0?'+':''}${lrDelta}pts</b></div>
    </div>
    <div class="card"><h3>Renewal Recommendation <span class="authority-pill pill-ai" style="margin-left:4px">AI-assisted</span></h3>
      <div class="callout ${rec.color==='ok'?'ok':rec.color==='warn'?'warn':'bad'}"><div><b class="ctitle">${rec.action}</b>${rec.rationale}</div></div>
    </div>`;
  }

  if(caseTab==='anomaly'){
    const checks = anomalyChecksFor(c,d);
    const flagged = checks.filter(ck=>ck.flagged);
    return `
    <div class="card"><h3>Anomaly Detection <span class="authority-pill ${flagged.length?'pill-blocked':'pill-auto'}" style="margin-left:4px">${flagged.length?flagged.length+' flagged':'Clean'}</span></h3>
      <p class="subtle" style="margin-bottom:10px">Explainable, rule-based checks against this account's own history and peer norms — surfaced as its own signal rather than buried inside a single opaque score.</p>
      ${checks.map(ck=>`<div class="rule"><div class="ric" style="background:${ck.flagged?'var(--bad)':'var(--ok)'}">${ck.flagged?'⚑':'✓'}</div><div><div style="font-weight:600">${ck.label}</div><div class="subtle">${ck.detail}</div></div></div>`).join('')}
    </div>`;
  }

  if(caseTab==='underwriting'){
    const e = d.experience;
    const gap = c.requiredTier > persona.tier || c.premium > persona.premiumCap || (persona.scoreCap && d.score.value > persona.scoreCap);
    const canDecide = persona.tier > 0;
    return `
    <div class="card"><h3>Appetite & Eligibility Assessment <span class="authority-pill pill-ai" style="margin-left:8px">AI evaluated</span></h3>
      ${d.appetiteRules.map(r=>{
        const c2 = r.result==='PASS'?'var(--ok)':r.result==='FAIL'?'var(--bad)':'var(--warn)';
        const sym = r.result==='PASS'?'✓':r.result==='FAIL'?'✕':'?';
        return `<div class="rule"><div class="ric" style="background:${c2}">${sym}</div><div><div style="font-weight:600">${r.rule}</div><div class="subtle">${r.detail}</div></div></div>`;
      }).join('')}
    </div>
    <div class="grid g2">
      <div class="card">
        <h3>Risk Scoring — Explainability</h3>
        <div class="score-ring" style="background:conic-gradient(${scoreColor(d.score.value)} ${d.score.value*3.6}deg, var(--grey-soft) 0)">
          <div style="background:#fff;width:74px;height:74px;border-radius:50%;display:grid;place-items:center">
            <div><div class="num" style="color:${scoreColor(d.score.value)}">${d.score.value}</div><div class="lab">${d.score.band}</div></div>
          </div>
        </div>
        <div style="margin-top:16px">${d.score.drivers.map(dr=>`
          <div class="driver"><div class="dn">${dr.name}<small>${dr.detail}</small></div><div class="dw"><i style="width:${dr.weight}%;background:${driverColor(dr.color)}"></i></div><div class="dv">${dr.weight}%</div></div>`).join('')}</div>
        <div class="sectionlabel">Experience Modification</div>
        <div class="evrow"><span class="el">Expected loss ratio</span><span class="er mono">${e.expectedLossRatio}%</span></div>
        <div class="evrow"><span class="el">Actual loss ratio</span><span class="er mono" style="color:${e.actualLossRatio>e.expectedLossRatio?'var(--bad)':'var(--ok)'}">${e.actualLossRatio}%</span></div>
        <div class="evrow"><span class="el">Mod factor</span><span class="er mono" style="font-weight:700">${e.mod.toFixed(2)}</span></div>
      </div>
      <div class="card">
        <h3>AI Underwriting Recommendation <span class="authority-pill pill-ai" style="margin-left:4px">AI</span></h3>
        <div class="callout ${d.recommendation.outcome==='ACCEPT'?'ok':d.recommendation.outcome==='DECLINE'?'bad':'accent'}">
          <div><b class="ctitle">${d.recommendation.outcome.replace('_',' ')} — ${d.recommendation.confidence}% confidence</b>${d.recommendation.rationale}</div>
        </div>
        <hr class="sep"/>
        <div class="subtle" style="font-size:12px">Model: uw-risk-score-v2.3 · Rules: appetite-ruleset-2026.1 · Data as of ${c.effDate}.</div>
      </div>
    </div>
    <div class="card">
      <h3>Underwriting Decision & Override <span class="authority-pill pill-manual" style="margin-left:4px">Human decision</span></h3>
      ${gap ? `<div class="callout warn"><div><b class="ctitle">Approval required</b>Premium, risk score, or product places this case at <b>${tierName(c.requiredTier)}</b> authority. Choosing Accept below will route it there instead of binding — enforced automatically.</div></div>`
           : `<div class="callout ok"><div><b class="ctitle">No approval needed</b>This case is within your delegated authority.</div></div>`}
      ${decided ? `
        ${decided.override ? `<div class="override-flag">⚠ ${decided.drastic?'Drastic':'Standard'} override of AI recommendation (${d.recommendation.outcome.replace('_',' ')} → ${(decided.attemptedOutcome||decided.outcome).replace('_',' ')})</div>` : ''}
        <div class="callout ${decided.outcome==='ACCEPT'?'ok':decided.outcome==='DECLINE'?'bad':'accent'}">
          <div><b class="ctitle">Recorded: ${decided.outcome.replace('_',' ')}${decided.routedTo?` → routed to ${decided.routedTo}`:''}</b>${decided.note}</div>
        </div>
        ${decided.reason ? `<div class="reasonbox"><div class="sectionlabel" style="margin-top:0">Underwriter Rationale (logged)</div>${decided.reason}</div>` : ''}
      ` : pendingDecision ? `
        ${(() => { const sev = overrideSeverity(d.recommendation.outcome, pendingDecision.outcome, c.appetite); return sev ? `<div class="override-flag">⚠ This is a ${sev} override of the AI recommendation (${d.recommendation.outcome.replace('_',' ')} → ${pendingDecision.outcome.replace('_',' ')}). A reason is required${sev==='drastic'?' and your supervisor will be notified automatically.':'.'}</div>` : ''; })()}
        <div class="reasonbox">
          <div class="sectionlabel" style="margin-top:0">Confirm decision: ${pendingDecision.outcome.replace('_',' ')}</div>
          <textarea id="decisionReason" placeholder="${pendingDecision.outcome===d.recommendation.outcome ? 'Confirm or add to the rationale…' : 'Required: explain why you are overriding the AI recommendation…'}">${pendingDecision.outcome===d.recommendation.outcome ? d.recommendation.rationale : ''}</textarea>
          <div style="display:flex;gap:10px;margin-top:10px">
            <button class="btn primary" id="confirmDecisionBtn">Confirm ${pendingDecision.outcome.replace('_',' ')}</button>
            <button class="btn ghost" id="cancelDecisionBtn">Cancel</button>
          </div>
        </div>
      ` : `
        <p class="subtle" style="margin-bottom:12px">AI recommendation: <b>${d.recommendation.outcome.replace('_',' ')}</b> (${d.recommendation.confidence}% confidence) — "${d.recommendation.rationale}"</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn primary" data-decide="ACCEPT" ${!canDecide?'disabled':''}>Accept</button>
          <button class="btn" data-decide="CONDITIONAL" ${!canDecide?'disabled':''}>Conditional Accept</button>
          <button class="btn" data-decide="REQUEST_INFO" ${!canDecide?'disabled':''}>Request Info</button>
          <button class="btn danger" data-decide="DECLINE" ${!canDecide?'disabled':''}>Decline</button>
        </div>
        ${!canDecide ? '<div class="subtle" style="margin-top:10px">Your role is view-only — decisions must be made by an underwriter or above.</div>':''}
      `}
    </div>`;
  }

  if(caseTab==='negotiation'){
    const thread = negotiationThreads[c.id] || [];
    return `
    <div class="card"><h3>Broker Negotiation <span class="authority-pill pill-ai" style="margin-left:4px">Copilot-drafted replies</span></h3>
      <div class="neg-thread">
        ${thread.length ? thread.map(m=>`<div class="neg-msg ${m.who}"><div class="nh">${m.name} · ${m.at}</div>${m.text}${m.impact?`<div class="neg-impact">Premium impact: ${m.impact}</div>`:''}</div>`).join('') : `<p class="subtle">No negotiation activity on this case yet.</p>`}
      </div>
      <div class="talk-add" style="margin-top:14px">
        <input id="negReply" placeholder="Type a reply to the broker…" style="flex:1"/>
        <button class="btn sm" id="negSendBtn">Send</button>
        <button class="btn sm primary" id="negDraftBtn">✦ Draft AI Response</button>
      </div>
    </div>
    <div class="card"><h3>Broker Portal Preview <span class="authority-pill pill-manual" style="margin-left:4px">What Links sees</span></h3>
      <p class="subtle" style="margin-bottom:10px">This is the read-only view that syncs to the broker's self-service portal — no separate system, no re-keying.</p>
      <div class="evrow"><span class="el">Submission status</span><span class="er">${statusBadge(c.status)}</span></div>
      <div class="evrow"><span class="el">Outstanding requirements</span><span class="er">${d.requirements.filter(r=>r.status!=='received').length || 'None'}</span></div>
      <div class="evrow"><span class="el">Last message from underwriter</span><span class="er">${(thread.filter(m=>m.who==='uw').slice(-1)[0]||{text:'—'}).text}</span></div>
      <button class="btn sm ghost" style="margin-top:8px" disabled>Upload document (broker-side, preview only)</button>
    </div>`;
  }

  if(caseTab==='selectforms'){
    const overrides = formsOverride[c.id] || {};
    return `<div class="card"><h3>Forms</h3>
      <div style="display:flex;gap:8px;margin-bottom:12px"><button class="btn sm" id="resetFormsBtn">Reset Forms</button></div>
      <div class="tablescroll"><table><thead><tr><th></th><th>Form Name</th><th>Edition</th><th>Form Description</th><th>Order</th></tr></thead>
      <tbody>${d.forms.map(f=>{
        const checked = overrides.hasOwnProperty(f.name) ? overrides[f.name] : f.checked;
        return `<tr><td><input type="checkbox" data-form="${f.name}" ${checked?'checked':''}/></td><td class="mono">${f.name}</td><td>${f.edition}</td><td>${f.desc}</td><td>${f.order}</td></tr>`;
      }).join('')}</tbody></table></div>
    </div>`;
  }

  if(caseTab==='premium'){
    const e = d.experience;
    const { dr, finalPremium, policyFee, surplusTax, stampingFee, totalWithFees } = computePremium(c,d);
    const cb = d.coverageBreakdown;
    const blocked = reasons.length>0;
    return `
    <div class="card"><h3>Premium Build-Up <span class="authority-pill pill-ai" style="margin-left:4px">AI-derived from experience mod</span></h3>
      <div class="evrow"><span class="el">Manual premium</span><span class="er mono">${fmtMoney(e.manualPremium)}</span></div>
      <div class="evrow"><span class="el">Technical premium (after mod & credits)</span><span class="er mono">${fmtMoney(e.technicalPremium)}</span></div>
      <div class="evrow"><span class="el">Indicated premium</span><span class="er mono">${fmtMoney(e.indicatedPremium)}</span></div>
      <div class="evrow"><span class="el">Requested premium</span><span class="er mono">${fmtMoney(e.requestedPremium)}</span></div>
      <div class="progress" style="margin-top:8px"><i style="width:${Math.min(100,Math.round(e.requestedPremium/e.indicatedPremium*100))}%;background:${e.requestedPremium>=e.indicatedPremium?'var(--ok)':'var(--warn)'}"></i></div>
    </div>
    <div class="grid g2">
      <div class="card"><h3>Coverage / Premium</h3>
        <table><thead><tr><th>Coverage</th><th>Premium</th></tr></thead>
        <tbody>${cb.map(x=>`<tr><td>${x.coverage}</td><td class="mono">${x.premium!=null?fmtMoney(x.premium):'Not Covered'}</td></tr>`).join('')}</tbody></table>
      </div>
      <div class="card"><h3>Premium Breakdown</h3>
        <div class="evrow"><span class="el">Total Premium${dr&&dr.status==='approved'?` (after ${dr.pct}% discount)`:''}</span><span class="er mono">${fmtMoney(finalPremium)}</span></div>
        <div class="evrow"><span class="el">Policy Fee</span><span class="er mono">${money2(policyFee)}</span></div>
        <div class="evrow"><span class="el">Surplus Lines Tax</span><span class="er mono">${money2(surplusTax)}</span></div>
        <div class="evrow"><span class="el">Stamping Fee</span><span class="er mono">${money2(stampingFee)}</span></div>
        <div class="evrow"><span class="el"><b>Total Premium and Fees</b></span><span class="er mono" style="font-weight:700">${money2(totalWithFees)}</span></div>
      </div>
    </div>
    <div class="card"><h3>Underwriter Discount Authority</h3>
      <p class="subtle" style="margin-bottom:10px">You may apply up to <b>10%</b> on your own authority. 10–20% requires Supervisor / MGA Manager approval. Above 20% requires Chief Underwriter (Admin) approval.</p>
      ${dr ? `<div class="callout ${dr.status==='approved'?'ok':'warn'}"><div><b class="ctitle">${dr.pct}% discount — ${dr.status==='approved'?`Approved by ${dr.approvedBy}`:`Pending ${tierName(dr.requiredTier)} approval`}</b>${dr.status==='approved' ? 'Applied to the premium above.' : 'Print Quote is blocked until this clears — see Approvals.'}</div></div>`
        : `<div class="callout ok"><div><b class="ctitle">No discount applied</b>Requested premium stands as filed.</div></div>`}
      <div style="display:flex;gap:8px;margin-top:12px;align-items:center">
        <input type="number" id="discountPct" min="0" max="50" step="1" placeholder="Discount %" style="width:120px;height:34px;border:1px solid var(--line);border-radius:9px;padding:0 10px"/>
        <button class="btn primary sm" id="applyDiscountBtn">Apply Discount</button>
      </div>
    </div>
    <div class="card">
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <button class="btn" id="getPremiumBtn">Get Premium</button>
        <button class="btn" data-jump="underwriting">Factors</button>
        <button class="btn notify" id="notifyBrokerBtn">Notify Broker</button>
        <button class="btn primary" id="printQuoteBtn" ${blocked?'disabled':''}>Print Quote</button>
      </div>
      ${blocked ? `<div class="gate-msg">Please resolve open approvals to print quote.</div>` : quotePrinted[c.id] ? `<div class="subtle" style="margin-top:10px;color:var(--ok)">Quote printed — proceed to Bind / Post Invoice.</div>` : ''}
    </div>`;
  }

  if(caseTab==='referrals'){
    const dr = discountState[c.id];
    const pendingSubj = (d.subjectivities||[]).map((s,i)=>({...s, idx:i})).filter(s=>s.status==='pending');
    const missingReq = (d.requirements||[]).filter(r=>r.status!=='received');

    let sections = '';

    // 1. Underwriting decision referral — a human sign-off on the case outcome itself.
    if(decided && decided.outcome==='REFER'){
      const canDecideHere = persona.tier >= c.requiredTier; // rough guard; real gate re-checked when they act on Underwriting tab
      sections += `<div class="card"><h3>Underwriting Decision Approval <span class="authority-pill pill-manual" style="margin-left:4px">Requires ${decided.routedTo}</span></h3>
        <p class="subtle" style="margin-bottom:10px">${decided.note}</p>
        ${decided.reason ? `<div class="reasonbox" style="margin-bottom:10px"><div class="sectionlabel" style="margin-top:0">Underwriter's Rationale</div>${decided.reason}</div>` : ''}
        <button class="btn sm ${canDecideHere?'primary':'ghost'}" data-jump="underwriting">${canDecideHere?'Review & Decide on Underwriting Tab':'Go to Underwriting Tab'}</button>
      </div>`;
    }

    // 2. Discount approval — money authority, separate from the underwriting decision itself.
    if(dr){
      sections += `<div class="card"><h3>Discount Approval <span class="authority-pill ${dr.status==='approved'?'pill-auto':'pill-pending'}" style="margin-left:4px">${dr.status==='approved'?'Approved':'Requires '+tierName(dr.requiredTier)}</span></h3>
        <div class="evrow"><span class="el">Requested discount</span><span class="er mono">${dr.pct}%</span></div>
        <div class="evrow"><span class="el">Status</span><span class="er">${dr.status==='approved' ? `Approved by ${dr.approvedBy}` : `Pending ${tierName(dr.requiredTier)} approval`}</span></div>
        ${dr.status==='pending' ? (persona.tier>=dr.requiredTier
          ? `<button class="btn sm primary" style="margin-top:10px" data-approve-discount="${c.id}">Approve Discount</button>`
          : `<div class="subtle mono" style="font-size:11px;margin-top:8px">Awaiting a ${tierName(dr.requiredTier)} — you are ${persona.tierLabel}</div>`) : ''}
      </div>`;
    }

    // 3. Subjectivities / conditions — things the insured/broker must satisfy, not an authority question.
    if(pendingSubj.length){
      sections += `<div class="card"><h3>Subjectivities & Conditions <span class="authority-pill pill-manual" style="margin-left:4px">Broker/Insured action</span></h3>
        ${pendingSubj.map(s=>`<div class="actionrow"><div class="aic" style="background:var(--warn)">⚑</div><div class="at">${s.label}<div class="as">Owner: ${s.owner} · Due ${s.due}</div></div>${persona.tier>0?`<button class="btn sm" data-resolve-subj="${s.idx}">Mark Resolved</button>`:''}</div>`).join('')}
      </div>`;
    }

    // 4. Missing requirements — pure data gaps, not an approval at all.
    if(missingReq.length){
      sections += `<div class="card"><h3>Missing Requirements <span class="authority-pill pill-manual" style="margin-left:4px">Information gap</span></h3>
        ${missingReq.map(r=>`<div class="actionrow"><div class="aic" style="background:var(--grey)">!</div><div class="at">${r.label}<div class="as">Outstanding</div></div><button class="btn sm ghost" data-jump="geninfo">Go to General Info</button></div>`).join('')}
      </div>`;
    }

    if(!sections) sections = `<div class="card"><p class="subtle">No open approvals. This case is clear to quote.</p></div>`;

    return sections + `<div class="card"><h3>Underwriting Authority & Override Permissions <span class="authority-pill pill-manual" style="margin-left:4px">Live from Configuration</span></h3>
      <table><thead><tr><th>Action</th><th>Minimum Tier</th></tr></thead>
      <tbody>
        <tr><td>Discount up to ${CONFIG.discountTierSupervisor}%</td><td>Underwriter (self)</td></tr>
        <tr><td>Discount ${CONFIG.discountTierSupervisor}–${CONFIG.discountTierChief}%</td><td>Supervisor / MGA Manager</td></tr>
        <tr><td>Discount above ${CONFIG.discountTierChief}%</td><td>Chief Underwriter (Admin)</td></tr>
        <tr><td>Override AI Decline → Accept</td><td>Chief Underwriter (Admin)</td></tr>
      </tbody></table>
      <button class="btn sm ghost" data-nav-jump="config" style="margin-top:10px">Edit in Configuration →</button>
    </div>`;
  }

  if(caseTab==='bind'){
    const blocked = reasons.length>0;
    const pd = policyDocs[c.id];
    let body;
    if(blocked){
      body = `<div class="gate-msg">Please resolve open approvals before binding.</div>`;
    } else if(!quotePrinted[c.id]){
      body = `<p class="subtle">Print the quote from Premium Estimate before binding.</p>`;
    } else if(!pd){
      body = `<p class="subtle" style="margin-bottom:12px">All conditions cleared and quote printed. Generate the policy document to begin the bind process.</p>
        <button class="btn primary" id="genPolicyBtn">Bind — Generate Policy Document</button>`;
    } else if(pd.status==='drafted'){
      body = `
        <div class="callout accent"><div><b class="ctitle">Policy document generated</b>System-generated draft, produced ${pd.generatedAt}. Review it, then send to the client for signature.</div></div>
        <div style="display:flex;gap:10px;margin:14px 0;flex-wrap:wrap"><button class="btn" id="viewPolicyBtn">View / Print Policy PDF</button></div>
        <div class="sectionlabel">Send for Signature</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn primary sm" data-send-sig="digital">Send for Digital Signature</button>
          <button class="btn sm" data-send-sig="manual">Send for Manual Signature</button>
        </div>`;
    } else if(pd.status==='sent'){
      body = `
        <div class="callout warn"><div><b class="ctitle">Awaiting signature</b>Sent to ${c.insured} for ${pd.signMethod} signature on ${pd.sentAt}.</div></div>
        <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">
          <button class="btn" id="viewPolicyBtn">View / Print Policy PDF</button>
          ${pd.signMethod==='digital'
            ? `<button class="btn primary sm" id="simulateEsignBtn">Simulate Client E-Sign</button>`
            : `<button class="btn primary sm" id="uploadSignedBtn">Upload Signed Copy</button>`}
        </div>`;
    } else if(pd.status==='signed'){
      body = `
        <div class="callout ok"><div><b class="ctitle">Signed document received</b>${pd.signMethod==='digital'?'Digitally signed':'Manually signed, uploaded'} on ${pd.signedAt}. Ready to issue.</div></div>
        <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">
          <button class="btn" id="viewPolicyBtn">View / Print Policy PDF</button>
          <button class="btn primary" id="issuePolicyBtn">Issue Policy</button>
        </div>`;
    } else {
      body = `
        <div class="callout ok"><div><b class="ctitle">Policy Issued</b>Issued ${pd.issuedAt} · Signed ${pd.signedAt} (${pd.signMethod}) · Posted to Policy Administration and Billing.</div></div>
        <button class="btn" id="viewPolicyBtn" style="margin-top:12px">View / Print Final Policy PDF</button>`;
    }
    return `<div class="card"><h3>Bind / Post Invoice</h3>${body}</div>`;
  }

  if(caseTab==='documents'){
    const pd = policyDocs[c.id];
    const qp = quotePrinted[c.id];
    const submitted = d.requirements.filter(r=>r.status==='received').map(r=>({name:r.label, icon:'📄', versions:[{v:1, date:c.effDate, who:c.broker, note:'Received with submission'}]}));
    const generated = [];
    if(qp) generated.push({name:`Quote — ${c.id}`, icon:'🧾', generated:true, versions:[{v:1, date:qp.at, who:qp.by, note:'Printed from Premium Estimate'}]});
    if(pd){
      const versions = [{v:1, date:pd.generatedAt, who:persona.name, note:'System-generated draft'}];
      if(pd.sentAt) versions.push({v:2, date:pd.sentAt, who:persona.name, note:`Sent for ${pd.signMethod} signature`});
      if(pd.signedAt) versions.push({v:3, date:pd.signedAt, who:c.insured, note:`Signed (${pd.signMethod})`});
      if(pd.issuedAt) versions.push({v:4, date:pd.issuedAt, who:persona.name, note:'Issued — posted to Policy Administration'});
      generated.push({name:`Policy Document — ${c.id}`, icon:'📜', generated:true, versions});
    }
    const outstanding = d.requirements.filter(r=>r.status!=='received');
    const allDocs = [...submitted, ...generated];
    return `
    <div class="card"><h3>Document Repository <span class="authority-pill pill-manual" style="margin-left:4px">Versioned</span></h3>
      <p class="subtle" style="margin-bottom:6px">Submitted files and every generated artifact (quotes, policy documents) live under this one case record with full version history — not a second, unmanaged repository.</p>
      ${allDocs.map(doc=>`<div class="doc-repo-row ${doc.generated?'generated':''}"><div class="doc-repo-ic">${doc.icon}</div>
        <div style="flex:1"><b>${doc.name}</b> <span class="ver-chip">v${doc.versions[doc.versions.length-1].v}</span>
          <div class="ver-history">${doc.versions.map(v=>`<div>v${v.v} · ${v.date} · ${v.who} — ${v.note}</div>`).join('')}</div>
        </div></div>`).join('') || `<p class="subtle">No documents on file yet.</p>`}
    </div>
    ${outstanding.length ? `<div class="card"><h3>Outstanding</h3><div class="checklist">${outstanding.map(r=>`
      <div class="chk"><div class="ci" style="background:var(--warn)">!</div><div style="flex:1">${r.label}</div><span class="subtle mono" style="font-size:11px;text-transform:uppercase">${r.status}</span></div>`).join('')}</div></div>` : ''}`;
  }

  if(caseTab==='notes'){
    const extra = talkLogExtra[c.id] || [];
    const all = [...d.talkLog, ...extra];
    return `
    <div class="card"><h3>Communications & Notes</h3>
      ${all.map(t=>`<div class="talk-entry"><div class="talk-ic">${t.channel==='Phone'?'📞':t.channel==='Email'?'✉️':'📝'}</div>
        <div><div>${t.summary}</div><div class="talk-meta">${t.date} · ${t.who} · ${t.channel} with ${t.withWhom}</div></div></div>`).join('')}
      <div class="talk-add">
        <select id="talkChannel"><option>Phone</option><option>Email</option><option>Note</option></select>
        <input id="talkWith" placeholder="With whom (e.g. broker name)"/>
        <input id="talkSummary" placeholder="What was discussed…"/>
        <button class="btn primary sm" id="talkAddBtn">Log</button>
      </div>
    </div>`;
  }

  if(caseTab==='audit') return `
    <div class="card"><h3>Underwriting Audit & Traceability</h3>
      ${d.audit.map(a=>`<div class="evrow"><span class="el mono" style="font-size:11px">${a.t} · ${a.who}</span><span class="er" style="text-align:left;font-weight:400">${a.what}</span></div>`).join('')}
      ${(talkLogExtra[c.id]||[]).map(t=>`<div class="evrow"><span class="el mono" style="font-size:11px">${t.date} · ${t.who}</span><span class="er" style="text-align:left;font-weight:400">Logged ${t.channel.toLowerCase()} with ${t.withWhom}: ${t.summary}</span></div>`).join('')}
      ${decided ? `<div class="evrow"><span class="el mono" style="font-size:11px">${decided.at} · ${persona.name}</span><span class="er" style="text-align:left;font-weight:600">Decision recorded: ${decided.outcome.replace('_',' ')}${decided.routedTo?' → '+decided.routedTo:''}${decided.override?' (override)':''}</span></div>` : ''}
      ${quotePrinted[c.id] ? `<div class="evrow"><span class="el mono" style="font-size:11px">${persona.name}</span><span class="er" style="text-align:left;font-weight:600">Quote printed</span></div>` : ''}
      ${(()=>{ const pd = policyDocs[c.id]; if(!pd) return ''; let rows = `<div class="evrow"><span class="el mono" style="font-size:11px">${pd.generatedAt}</span><span class="er" style="text-align:left;font-weight:600">Policy document generated (system, draft)</span></div>`;
        if(pd.sentAt) rows += `<div class="evrow"><span class="el mono" style="font-size:11px">${pd.sentAt}</span><span class="er" style="text-align:left;font-weight:600">Sent to ${c.insured} for ${pd.signMethod} signature</span></div>`;
        if(pd.signedAt) rows += `<div class="evrow"><span class="el mono" style="font-size:11px">${pd.signedAt}</span><span class="er" style="text-align:left;font-weight:600">Signed document received (${pd.signMethod})</span></div>`;
        if(pd.issuedAt) rows += `<div class="evrow"><span class="el mono" style="font-size:11px">${pd.issuedAt} · ${persona.name}</span><span class="er" style="text-align:left;font-weight:600">Policy issued — posted to Policy Administration and Billing</span></div>`;
        return rows; })()}
    </div>`;
}

/* ================= POLICY DOCUMENT (system-generated PDF) ================= */
function buildPolicyDocHtml(c,d,pd){
  const pr = computePremium(c,d);
  const forms = checkedForms(c,d);
  let statusLine = '';
  if(pd.status==='drafted') statusLine = `<p style="color:#B7791F"><b>DRAFT — Not yet signed.</b> System-generated by the Veridex Underwriting Engine on ${pd.generatedAt}.</p>`;
  else if(pd.status==='sent') statusLine = `<p style="color:#B7791F"><b>PENDING SIGNATURE.</b> Sent to the insured for ${pd.signMethod} signature on ${pd.sentAt}.</p>`;
  else if(pd.status==='signed') statusLine = `<p style="color:#17795E"><b>SIGNED — Pending issuance.</b> ${pd.signMethod==='digital'?'Digitally signed':'Manually signed and uploaded'} on ${pd.signedAt}.</p>`;
  else if(pd.status==='issued') statusLine = `<p style="color:#17795E"><b>ISSUED.</b> Signed via ${pd.signMethod} on ${pd.signedAt}. Issued ${pd.issuedAt}. System-generated by the Veridex Underwriting Engine.</p>`;
  return `
    <div style="max-width:720px;margin:40px auto;font-family:Georgia,'Times New Roman',serif;color:#182230;line-height:1.5">
      <div style="text-align:center;border-bottom:3px solid #0D1B4B;padding-bottom:14px;margin-bottom:20px">
        <div style="font-size:22px;font-weight:700;color:#0D1B4B;letter-spacing:.05em">SOUTHLAKE INSURANCE</div>
        <div style="font-size:14px;color:#5C6B7F;margin-top:4px">Policy Declarations</div>
      </div>
      ${statusLine}
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">
        <tr><td style="padding:4px 0;color:#5C6B7F">Policy Number</td><td style="text-align:right;font-weight:600">${c.refNumber}</td></tr>
        <tr><td style="padding:4px 0;color:#5C6B7F">Named Insured</td><td style="text-align:right;font-weight:600">${c.insured}</td></tr>
        <tr><td style="padding:4px 0;color:#5C6B7F">Agency</td><td style="text-align:right">${c.agencyCode} - ${c.agency}</td></tr>
        <tr><td style="padding:4px 0;color:#5C6B7F">Line of Business</td><td style="text-align:right">${c.line}</td></tr>
        <tr><td style="padding:4px 0;color:#5C6B7F">Effective Date</td><td style="text-align:right">${c.effDate}</td></tr>
        <tr><td style="padding:4px 0;color:#5C6B7F">Expiration Date</td><td style="text-align:right">${expDateOf(c)}</td></tr>
      </table>
      <h3 style="border-bottom:1px solid #ccc;padding-bottom:4px">Coverage & Premium</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        ${d.coverageBreakdown.map(x=>`<tr><td style="padding:4px 0">${x.coverage}</td><td style="text-align:right">${x.premium!=null?fmtMoney(x.premium):'Not Covered'}</td></tr>`).join('')}
        <tr><td style="padding:6px 0;font-weight:700;border-top:1px solid #ccc">Total Premium and Fees</td><td style="text-align:right;font-weight:700;border-top:1px solid #ccc">${money2(pr.totalWithFees)}</td></tr>
      </table>
      <h3 style="border-bottom:1px solid #ccc;padding-bottom:4px;margin-top:20px">Forms & Endorsements Attached</h3>
      <ul>${forms.map(f=>`<li>${f.name} (${f.edition}) — ${f.desc}</li>`).join('')}</ul>
      <p style="margin-top:30px;font-size:11px;color:#8A97A8">This is a system-generated document produced by the Veridex Underwriting Engine prototype for demonstration purposes.</p>
    </div>`;
}
function openPolicyDoc(c,d,pd){
  const w = window.open('', '_blank');
  if(!w){ toast('Pop-up blocked — allow pop-ups to view the policy document'); return; }
  w.document.write(`<!DOCTYPE html><html><head><title>Policy ${c.refNumber}</title></head><body>${buildPolicyDocHtml(c,d,pd)}
    <div style="text-align:center;margin:20px 0" class="noprint"><button onclick="window.print()" style="background:#0E6E5C;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-size:14px;cursor:pointer">Print / Save as PDF</button></div>
    <style>@media print{.noprint{display:none}}</style>
  </body></html>`);
  w.document.close();
}
function generatePolicyDoc(caseId){
  policyDocs[caseId] = { generatedAt: nowStamp(), status:'drafted' };
  toast('Policy document generated');
  pushNotification(`Policy document generated for ${caseId} — ready to send for signature.`, 'referral', {caseId, tab:'bind'});
  renderPage();
}
function sendForSignature(caseId, method){
  const pd = policyDocs[caseId]; if(!pd) return;
  pd.status='sent'; pd.signMethod=method; pd.sentAt = nowStamp();
  toast(`Sent to client for ${method} signature`);
  renderPage();
}
function simulateSign(caseId){
  const pd = policyDocs[caseId]; if(!pd) return;
  const c = CASES.find(x=>x.id===caseId);
  pd.status='signed'; pd.signedAt = nowStamp();
  pushNotification(`${c.insured} signed the policy document (${pd.signMethod}) — ready to issue.`, 'referral', {caseId, tab:'bind'});
  toast('Signed document received');
  renderPage();
}
function issuePolicy(caseId){
  const pd = policyDocs[caseId]; if(!pd) return;
  pd.status='issued'; pd.issuedAt = nowStamp();
  boundCases[caseId] = { at: pd.issuedAt, by: persona.name };
  pushNotification(`Policy ${caseId} issued — posted to Policy Administration and Billing.`, 'referral', {caseId, tab:'bind'});
  toast('Policy issued');
  renderPage();
}

function decide(outcome, reason){
  const c = CASES.find(x=>x.id===openCaseId);
  const d = getDetail(c);
  const atClean = '2026-08-03 ' + String(10 + Object.keys(decisionLog).length).padStart(2,'0') + ':15';
  const binding = outcome==='ACCEPT' || outcome==='CONDITIONAL';
  const capGap = c.premium > persona.premiumCap || (persona.scoreCap && d.score.value > persona.scoreCap);
  const sev = overrideSeverity(d.recommendation.outcome, outcome, c.appetite);
  const overrideMinTier = sev ? OVERRIDE_RULES[sev].minTier : 0;

  // The tier required for THIS specific action is the highest of: the case's own required tier,
  // one tier above the persona's own (if their personal premium/score cap is breached on a binding action),
  // and whatever tier the override matrix demands. Never route "up" to a tier the persona already holds.
  let requiredTierForThisAction = c.requiredTier;
  if(binding && capGap) requiredTierForThisAction = Math.max(requiredTierForThisAction, persona.tier + 1);
  if(sev) requiredTierForThisAction = Math.max(requiredTierForThisAction, overrideMinTier);

  if(binding && requiredTierForThisAction > persona.tier){
    const reasonBits = [];
    if(c.requiredTier > persona.tier || capGap) reasonBits.push('exceeds your personal authority');
    if(sev) reasonBits.push(`is a ${sev} override of the AI's ${d.recommendation.outcome.replace('_',' ')} recommendation`);
    decisionLog[c.id] = { outcome:'REFER', attemptedOutcome:outcome, routedTo:tierName(requiredTierForThisAction), reason, note:`This decision ${reasonBits.join(' and ')} — routed to ${tierName(requiredTierForThisAction)} for review.`, at:atClean, override: !!sev, drastic: sev==='drastic' };
    pushNotification(`${c.id} (${c.insured}) referred to ${tierName(requiredTierForThisAction)} — ${reasonBits.join(' and ')}.`, sev==='drastic'?'drastic':'referral', {caseId:c.id, tab:'underwriting'});
    toast(`Beyond your authority — routed to ${tierName(requiredTierForThisAction)}`);
    pendingDecision = null; renderPage(); return;
  }

  if(sev){
    decisionLog[c.id] = { outcome, reason, note:`Underwriter overrode the AI's ${d.recommendation.outcome.replace('_',' ')} recommendation. Reason logged and retained for quality review.`, at:atClean, override:true, drastic: sev==='drastic' };
    if(OVERRIDE_RULES[sev].alwaysNotify){
      pushNotification(`${persona.name} overrode the AI's ${d.recommendation.outcome.replace('_',' ')} recommendation to ${outcome.replace('_',' ')} on ${c.id} (${c.insured}) — auto-flagged for review.`, 'drastic', {caseId:c.id, tab:'underwriting'});
      toast('Drastic override recorded — supervisor notified automatically');
    } else {
      toast(`Override recorded: ${outcome.replace('_',' ')}`);
    }
    pendingDecision = null; renderPage(); return;
  }

  // agrees with AI recommendation
  decisionLog[c.id] = { outcome, reason, note: outcome==='DECLINE' ? 'Declined — rationale recorded, insured and broker notified.' : outcome==='CONDITIONAL' ? 'Conditional accept recorded — subjectivities must clear before bind.' : outcome==='REQUEST_INFO' ? 'Additional information requested from broker/insured.' : 'Accepted within authority — handed off to Rating & Quote Management.', at:atClean, override:false };
  toast(outcome==='ACCEPT' ? 'Accepted — proceed to Premium Estimate' : `Recorded: ${outcome.replace('_',' ')}`);

  if(outcome==='ACCEPT'){
    const key = persona.id+'|'+c.broker;
    brokerAcceptStreak[key] = (brokerAcceptStreak[key]||0) + 1;
    const bb = BROKER_BOOK[c.broker];
    if(bb && brokerAcceptStreak[key] >= 5){
      const rising = bb.trend[bb.trend.length-1] - bb.trend[0];
      if(rising >= 15){
        pushNotification(`Pattern alert: ${persona.name} has now accepted ${brokerAcceptStreak[key]} consecutive submissions from ${c.broker} (${bb.agency}) while that book's loss ratio has risen from ${bb.trend[0]}% to ${bb.trend[bb.trend.length-1]}% — flagged for supervisor review.`, 'pattern', {page:'governance'});
        toast(`Pattern flagged: ${brokerAcceptStreak[key]} straight accepts from ${c.broker} — supervisor notified`);
      }
    }
  }
  pendingDecision = null; renderPage();
}

function applyDiscount(caseId, pct){
  const requiredTier = discountRequiredTier(pct);
  const c = CASES.find(x=>x.id===caseId);
  if(persona.tier >= requiredTier){
    discountState[caseId] = { pct, status:'approved', approvedBy:persona.name, requiredTier };
    toast(pct<=10 ? 'Discount applied — within your authority' : `Discount approved by ${persona.tierLabel}`);
  } else {
    discountState[caseId] = { pct, status:'pending', approvedBy:null, requiredTier };
    pushNotification(`${persona.name} requested a ${pct}% discount on ${caseId} (${c.insured}) — requires ${tierName(requiredTier)} approval.`, 'referral', {caseId, tab:'referrals'});
    toast(`Discount request routed to ${tierName(requiredTier)} for approval`);
  }
  renderPage();
}
function approveDiscount(caseId){
  const dr = discountState[caseId];
  if(!dr || dr.status==='approved') return;
  if(persona.tier < dr.requiredTier){ toast('You do not have sufficient authority to approve this'); return; }
  dr.status = 'approved'; dr.approvedBy = persona.name;
  toast('Discount approved');
  renderPage();
}

/* ================= PORTFOLIO ================= */
const CAT_ZONES = [
  {zone:'Coast-1', tiv:52000000, cap:56000000, pct:93}, {zone:'Coast-2', tiv:38000000, cap:56000000, pct:68}, {zone:'Coast-3', tiv:21000000, cap:56000000, pct:38}, {zone:'Inland-1', tiv:9000000, cap:56000000, pct:16},
  {zone:'Coast-4', tiv:41000000, cap:56000000, pct:73}, {zone:'Inland-2', tiv:12000000, cap:56000000, pct:21}, {zone:'Inland-3', tiv:6000000, cap:56000000, pct:11}, {zone:'North-1', tiv:3000000, cap:56000000, pct:5},
  {zone:'Coast-5', tiv:29000000, cap:56000000, pct:52}, {zone:'Inland-4', tiv:8000000, cap:56000000, pct:14}, {zone:'North-2', tiv:4000000, cap:56000000, pct:7}, {zone:'North-3', tiv:2000000, cap:56000000, pct:4},
  {zone:'Coast-6', tiv:33000000, cap:56000000, pct:59}, {zone:'Inland-5', tiv:10000000, cap:56000000, pct:18}, {zone:'North-4', tiv:1500000, cap:56000000, pct:3}, {zone:'North-5', tiv:1000000, cap:56000000, pct:2},
];
function pagePortfolio(){
  return `
  <div class="page">
    <div class="ph"><div><div class="crumb">Portfolio, Capacity & Reinsurance Intelligence</div><h1>Portfolio & Capacity</h1><p>No decision is made in isolation from capacity, concentration, or profitability — every case shows its portfolio effect before approval.</p></div></div>
    <div class="grid g4" style="margin-bottom:14px">
      <div class="kpi"><div class="kl">Bound premium (YTD)</div><div class="kv">$41.2M</div><div class="kd up">▲ 12% vs plan</div></div>
      <div class="kpi"><div class="kl">Loss ratio</div><div class="kv">54.3%</div><div class="kd up">▼ 3.1pts vs prior year</div></div>
      <div class="kpi"><div class="kl">Capacity utilized — TX coastal</div><div class="kv">78%</div><div class="kd" style="color:var(--warn)">Approaching treaty limit</div></div>
      <div class="kpi"><div class="kl">Facultative placements pending</div><div class="kv">2</div><div class="kd subtle">Bayview Marine, Coastal Grain</div></div>
    </div>
    <div class="grid g2">
      <div class="card"><h3>Concentration & Catastrophe Accumulation — TX Coastal Wind/Flood</h3>
        <div class="evrow"><span class="el">Aggregate TIV in zone</span><span class="er mono">$186M</span></div>
        <div class="evrow"><span class="el">Treaty capacity</span><span class="er mono">$240M</span></div>
        <div class="progress" style="margin-top:8px"><i style="width:78%;background:var(--warn)"></i></div>
        <div class="subtle" style="margin-top:8px">Adding Bayview Marine ($42M TIV) would bring the zone to 95% of treaty capacity — facultative placement required, already flagged on that case.</div>
        <div class="sectionlabel">Accumulation Heatmap — TX Grid Zones</div>
        <div class="heatmap-grid">${CAT_ZONES.map(z=>`<div class="heatmap-cell" style="background:${z.pct>=85?'var(--bad)':z.pct>=60?'var(--warn)':z.pct>=30?'var(--accent)':'var(--grey-soft)'};color:${z.pct>=30?'#fff':'var(--muted)'}" title="${z.zone}: ${fmtMoney(z.tiv)} of ${fmtMoney(z.cap)} capacity"><b>${z.pct}%</b>${z.zone}</div>`).join('')}</div>
        <div class="heatmap-legend"><span class="sw" style="background:var(--grey-soft)"></span>Light <span class="sw" style="background:var(--accent)"></span>Moderate <span class="sw" style="background:var(--warn)"></span>High <span class="sw" style="background:var(--bad)"></span>Near/At capacity</div>
      </div>
      <div class="card"><h3>Reinsurance & Treaty Alignment</h3>
        <div class="evrow"><span class="el">Property per-risk treaty</span><span class="er">$25M xs $2M — 82% utilized</span></div>
        <div class="evrow"><span class="el">Auto liability treaty</span><span class="er">$10M xs $1M — 41% utilized</span></div>
        <div class="evrow"><span class="el">Cyber treaty</span><span class="er">$15M xs $1M — 22% utilized</span></div>
      </div>
    </div>
    <div class="card"><h3>Portfolio Fit by Line of Business</h3>
      <table><thead><tr><th>Line</th><th>Bound Premium</th><th>Loss Ratio</th><th>Target Mix</th><th>Actual Mix</th></tr></thead>
      <tbody>
        <tr><td>Commercial Auto</td><td class="mono">$14.6M</td><td>48%</td><td>30%</td><td>35%</td></tr>
        <tr><td>Commercial Property</td><td class="mono">$18.1M</td><td>61%</td><td>40%</td><td>44%</td></tr>
        <tr><td>General Liability</td><td class="mono">$6.2M</td><td>52%</td><td>20%</td><td>15%</td></tr>
        <tr><td>Cyber</td><td class="mono">$2.3M</td><td>29%</td><td>10%</td><td>6%</td></tr>
      </tbody></table>
    </div>
  </div>`;
}

/* ================= GOVERNANCE ================= */
function pageGovernance(){
  const rows = Object.keys(brokerAcceptStreak).map(key=>{
    const [pid, broker] = key.split('|');
    const p = PERSONAS.find(x=>x.id===pid);
    const bb = BROKER_BOOK[broker];
    if(!bb) return null;
    const count = brokerAcceptStreak[key];
    const rising = bb.trend[bb.trend.length-1] - bb.trend[0];
    const flagged = count>=5 && rising>=15;
    return {p, broker, bb, count, rising, flagged};
  }).filter(Boolean).sort((a,b)=> (b.flagged - a.flagged) || (b.count - a.count));

  return `
  <div class="page">
    <div class="ph"><div><div class="crumb">Automation, Monitoring & Governance</div><h1>Automation & Governance</h1><p>What AI is allowed to do alone, what it must hand back, and the trail proving it stayed inside those lines.</p></div></div>
    <div class="grid g3" style="margin-bottom:14px">
      <div class="kpi"><div class="kl">Straight-through rate</div><div class="kv">38%</div><div class="kd up">▲ 6pts MoM</div></div>
      <div class="kpi"><div class="kl">Model drift alerts (30d)</div><div class="kv">1</div><div class="kd" style="color:var(--warn)">uw-risk-score-v2.3 — cyber segment</div></div>
      <div class="kpi"><div class="kl">Cases requiring human confirmation</div><div class="kv">62%</div><div class="kd subtle">By policy — never auto-decided</div></div>
    </div>

    <div class="card"><h3>Underwriter & Broker Pattern Monitoring</h3>
      <p class="subtle" style="margin-bottom:10px">Flags when the same underwriter repeatedly accepts submissions from the same broker while that broker's book loss ratio is rising — a pattern that can indicate complacency or undisclosed relationship risk, not just bad luck.</p>
      <table><thead><tr><th>Underwriter</th><th>Broker (Agency)</th><th>Consecutive Accepts</th><th>Loss Ratio Trend</th><th>Status</th></tr></thead>
      <tbody>${rows.map(r=>`<tr><td>${r.p.name}</td><td>${r.broker} (${r.bb.agency})</td><td class="mono">${r.count}</td><td>${trendHtml(r.bb.trend)}</td><td>${r.flagged?'<span class="badge b-bad">Flagged — supervisor notified</span>':r.count>=3?'<span class="badge b-warn">Watch</span>':'<span class="badge b-ok">Normal</span>'}</td></tr>`).join('')}</tbody></table>
    </div>

    <div class="card"><h3>Underwriting Authority & Override Permissions</h3>
      <table><thead><tr><th>Action</th><th>Minimum Tier Required</th><th>Auto-notifies Supervisor</th></tr></thead>
      <tbody>
        <tr><td>Accept/bind within own authority, agreeing with AI</td><td>Underwriter</td><td>No</td></tr>
        <tr><td>Standard override (any outcome change from AI recommendation)</td><td>Supervisor / MGA Manager</td><td>No — logged only</td></tr>
        <tr><td>Drastic override (AI Decline → Accept, or Accept outside appetite)</td><td>Chief Underwriter</td><td><span class="badge b-bad">Yes — always</span></td></tr>
        <tr><td>Case above personal premium/score cap</td><td>Auto-routed to required tier</td><td>Yes — referral notice</td></tr>
      </tbody></table>
    </div>

    <div class="card"><h3>AI, Model & Rule Governance</h3>
      <table><thead><tr><th>Model / Ruleset</th><th>Version</th><th>Status</th><th>Last validated</th><th>Drift</th></tr></thead>
      <tbody>
        <tr><td>uw-risk-score</td><td class="mono">v2.3</td><td><span class="badge b-ok">Approved</span></td><td>2026-07-15</td><td><span class="badge b-warn">Monitor — cyber segment</span></td></tr>
        <tr><td>appetite-ruleset</td><td class="mono">2026.1</td><td><span class="badge b-ok">Approved</span></td><td>2026-06-01</td><td><span class="badge b-ok">Stable</span></td></tr>
        <tr><td>fraud-anomaly-detector</td><td class="mono">v1.4</td><td><span class="badge b-ok">Approved</span></td><td>2026-05-20</td><td><span class="badge b-ok">Stable</span></td></tr>
        <tr><td>straight-through-router</td><td class="mono">v3.0</td><td><span class="badge b-warn">In testing</span></td><td>2026-07-28</td><td><span class="badge b-grey">N/A</span></td></tr>
      </tbody></table>
    </div>
    <div class="grid g2">
      <div class="card"><h3>Human Oversight & Decision Control</h3>
        <div class="checklist">
          <div class="chk"><div class="ci" style="background:var(--ok)">✓</div><div>High-impact decisions (premium above tier cap) always require manual confirmation</div></div>
          <div class="chk"><div class="ci" style="background:var(--ok)">✓</div><div>Low-confidence AI recommendations (&lt;70%) always require manual confirmation</div></div>
          <div class="chk"><div class="ci" style="background:var(--ok)">✓</div><div>Adverse actions (decline, non-renewal) always require manual confirmation</div></div>
          <div class="chk"><div class="ci" style="background:var(--ok)">✓</div><div>Any exception or guideline override always requires manual confirmation</div></div>
        </div>
      </div>
      <div class="card"><h3>Underwriting Quality Review — Sample Queue</h3>
        <div class="evrow"><span class="el">C-1002 · Bayview Marine Terminal</span><span class="er"><span class="badge b-warn">Exception review</span></span></div>
        <div class="evrow"><span class="el">C-1005 · Northgate Logistics</span><span class="er"><span class="badge b-bad">Decline review</span></span></div>
        <div class="evrow"><span class="el">C-1003 · Vela Freight Co</span><span class="er"><span class="badge b-grey">Random sample — straight-through</span></span></div>
      </div>
    </div>
  </div>`;
}

/* ================= LOW-CODE CONFIGURATION ================= */
function pageConfig(){
  const canPublish = persona.tier >= TIER.SUPERVISOR;
  return `<div class="page">
    <div class="ph"><div><div class="crumb">Platform Architecture · Low-Code Configuration</div><h1>Rules & Thresholds</h1>
      <p>Business-managed configuration — ops can adjust referral thresholds, triage cutoffs, and SLA targets without a software release. Changes apply immediately across the workbench.</p></div>
      <div class="sp">${canPublish ? '' : `<span class="pending-pill">View only — Supervisor+ required to publish</span>`}</div>
    </div>
    <div class="card"><h3>Discount Approval Thresholds</h3>
      <div class="config-row"><div class="cl"><b>Self-service limit (%)</b><small>Underwriters can apply up to this discount without approval</small></div><input type="number" id="cfgDiscSup" value="${CONFIG.discountTierSupervisor}" ${canPublish?'':'disabled'}/></div>
      <div class="config-row"><div class="cl"><b>Supervisor ceiling (%)</b><small>Above this, escalate to Chief Underwriter (Admin)</small></div><input type="number" id="cfgDiscChief" value="${CONFIG.discountTierChief}" ${canPublish?'':'disabled'}/></div>
    </div>
    <div class="card"><h3>Appetite Triage</h3>
      <div class="config-row"><div class="cl"><b>Fast-Track score ceiling</b><small>In-appetite cases below this risk score qualify for straight-through processing</small></div><input type="number" id="cfgFastTrack" value="${CONFIG.fastTrackScoreMax}" ${canPublish?'':'disabled'}/></div>
    </div>
    <div class="card"><h3>Work Queue SLA</h3>
      <div class="config-row"><div class="cl"><b>Warn threshold (days)</b><small>Case age turns amber in the queue</small></div><input type="number" id="cfgSlaWarn" value="${CONFIG.slaWarnDays}" ${canPublish?'':'disabled'}/></div>
      <div class="config-row"><div class="cl"><b>Breach threshold (days)</b><small>Case age turns red in the queue</small></div><input type="number" id="cfgSlaBad" value="${CONFIG.slaBadDays}" ${canPublish?'':'disabled'}/></div>
    </div>
    ${canPublish ? `<div style="display:flex;gap:10px;margin-bottom:14px"><button class="btn primary" id="cfgPublishBtn">Publish Changes</button><button class="btn ghost" id="cfgResetBtn">Reset to Defaults</button></div>` : ''}
    <div class="card"><h3>Change History</h3>
      ${CONFIG_HISTORY.length ? CONFIG_HISTORY.map(h=>`<div class="evrow"><span class="el mono" style="font-size:11px">${h.at} · ${h.by}</span><span class="er" style="text-align:left;font-weight:400">${h.what}</span></div>`).join('') : `<p class="subtle">No changes published yet — showing defaults.</p>`}
    </div>
  </div>`;
}

/* ================= ANALYTICS ================= */
function pageAnalytics(){
  return `
  <div class="page">
    <div class="ph"><div><div class="crumb">Underwriting Performance & Portfolio Analytics</div><h1>Performance Analytics</h1><p>Connects underwriting decisions with later claims and financial outcomes to identify where guidelines or models need improvement.</p></div></div>
    <div class="grid g4">
      <div class="kpi"><div class="kl">Avg turnaround time</div><div class="kv">2.4d</div><div class="kd up">▼ 0.6d vs target</div></div>
      <div class="kpi"><div class="kl">Referral rate</div><div class="kv">31%</div><div class="kd subtle">Of all new business</div></div>
      <div class="kpi"><div class="kl">Quote conversion</div><div class="kv">67%</div><div class="kd up">▲ 4pts QoQ</div></div>
      <div class="kpi"><div class="kl">Override activity</div><div class="kv">9%</div><div class="kd subtle">Of AI recommendations</div></div>
    </div>
    <div class="card" style="margin-top:14px"><h3>Decision Consistency by Underwriter</h3>
      <table><thead><tr><th>Underwriter</th><th>Cases Decided</th><th>Referral Rate</th><th>Override Rate</th><th>Loss Ratio (bound)</th></tr></thead>
      <tbody>
        <tr><td>Priya Nandakumar</td><td>142</td><td>28%</td><td>7%</td><td>51%</td></tr>
        <tr><td>Ishant P. (MGA)</td><td>96</td><td>19%</td><td>4%</td><td>47%</td></tr>
        <tr><td>Marcus Webb (Chief)</td><td>22</td><td>—</td><td>11%</td><td>58%</td></tr>
      </tbody></table>
    </div>
  </div>`;
}

/* ================= WIRING ================= */
function wirePage(){
  document.querySelectorAll('[data-case]').forEach(r=> r.addEventListener('click', ()=>{ openCaseId = r.dataset.case; caseTab = r.dataset.caseTab || 'action'; pendingDecision=null; go('case'); }));
  const fLine = document.getElementById('fLine'), fStatus = document.getElementById('fStatus'), fQ = document.getElementById('fQ');
  if(fLine) fLine.addEventListener('change', e=>{ queueFilters.line = e.target.value; renderPage(); });
  if(fStatus) fStatus.addEventListener('change', e=>{ queueFilters.status = e.target.value; renderPage(); });
  if(fQ) fQ.addEventListener('input', e=>{ queueFilters.q = e.target.value; renderPage(); });
  const hfPeriod = document.getElementById('hfPeriod'), hfLine = document.getElementById('hfLine'), hfState = document.getElementById('hfState'), hfClear = document.getElementById('hfClear');
  if(hfPeriod) hfPeriod.addEventListener('change', e=>{ homeFilters.period = e.target.value; renderPage(); });
  if(hfLine) hfLine.addEventListener('change', e=>{ homeFilters.line = e.target.value; renderPage(); });
  if(hfState) hfState.addEventListener('change', e=>{ homeFilters.state = e.target.value; renderPage(); });
  if(hfClear) hfClear.addEventListener('click', ()=>{ homeFilters={period:'MTD',line:'',state:''}; renderPage(); });
  const clearQF = document.getElementById('clearQF');
  if(clearQF) clearQF.addEventListener('click', ()=>{ queueFilters={line:'',status:'',q:'',triage:''}; renderPage(); });
  document.querySelectorAll('[data-triage]').forEach(el=> el.addEventListener('click', ()=>{ queueFilters.triage = queueFilters.triage===el.dataset.triage ? '' : el.dataset.triage; renderPage(); }));
  const viewListBtn = document.getElementById('viewListBtn');
  if(viewListBtn) viewListBtn.addEventListener('click', ()=>{ queueView='list'; renderPage(); });
  const viewKanbanBtn = document.getElementById('viewKanbanBtn');
  if(viewKanbanBtn) viewKanbanBtn.addEventListener('click', ()=>{ queueView='kanban'; renderPage(); });
  const askQueueBtn = document.getElementById('askQueueBtn');
  if(askQueueBtn) askQueueBtn.addEventListener('click', ()=> openDrawer("Which cases are referred and waiting on me?"));
  document.querySelectorAll('[data-tab]').forEach(t=> t.addEventListener('click', ()=>{ caseTab = t.dataset.tab; pendingDecision=null; renderPage(); }));
  document.querySelectorAll('[data-decide]').forEach(b=> b.addEventListener('click', ()=>{ pendingDecision = { outcome:b.dataset.decide }; renderPage(); }));
  const confirmBtn = document.getElementById('confirmDecisionBtn');
  if(confirmBtn) confirmBtn.addEventListener('click', ()=>{
    const reason = document.getElementById('decisionReason').value.trim();
    const c = CASES.find(x=>x.id===openCaseId); const d = getDetail(c);
    const sev = overrideSeverity(d.recommendation.outcome, pendingDecision.outcome, c.appetite);
    if(sev && !reason){ toast('A reason is required to override the AI recommendation'); return; }
    decide(pendingDecision.outcome, reason);
  });
  const cancelBtn = document.getElementById('cancelDecisionBtn');
  if(cancelBtn) cancelBtn.addEventListener('click', ()=>{ pendingDecision=null; renderPage(); });
  const talkAddBtn = document.getElementById('talkAddBtn');
  if(talkAddBtn) talkAddBtn.addEventListener('click', ()=>{
    const withWhom = document.getElementById('talkWith').value.trim() || 'Unnamed contact';
    const summary = document.getElementById('talkSummary').value.trim();
    if(!summary){ toast('Add a summary before logging'); return; }
    const channel = document.getElementById('talkChannel').value;
    if(!talkLogExtra[openCaseId]) talkLogExtra[openCaseId] = [];
    talkLogExtra[openCaseId].push({ date:'2026-08-03 '+String(9+talkLogExtra[openCaseId].length).padStart(2,'0')+':30', who:persona.name, channel, withWhom, summary });
    toast('Logged to Talk Log & Audit Trail');
    renderPage();
  });
  document.querySelectorAll('[data-jump]').forEach(b=> b.addEventListener('click', ()=>{ caseTab = b.dataset.jump; pendingDecision=null; renderPage(); }));
  document.querySelectorAll('[data-nav-jump]').forEach(b=> b.addEventListener('click', ()=> go(b.dataset.navJump)));
  const negSendBtn = document.getElementById('negSendBtn');
  if(negSendBtn) negSendBtn.addEventListener('click', ()=>{
    const val = document.getElementById('negReply').value.trim();
    if(!val){ toast('Type a reply first'); return; }
    if(!negotiationThreads[openCaseId]) negotiationThreads[openCaseId] = [];
    negotiationThreads[openCaseId].push({ who:'uw', name:persona.name, text:val, at:nowStamp() });
    toast('Reply sent to broker');
    renderPage();
  });
  const negDraftBtn = document.getElementById('negDraftBtn');
  if(negDraftBtn) negDraftBtn.addEventListener('click', ()=>{
    const c = CASES.find(x=>x.id===openCaseId); const d = getDetail(c);
    const draft = draftNegotiationResponse(c,d);
    if(!negotiationThreads[openCaseId]) negotiationThreads[openCaseId] = [];
    negotiationThreads[openCaseId].push({ who:'uw', name:persona.name+' (AI-drafted)', text:draft.text, impact:draft.impact, at:nowStamp() });
    toast('AI drafted a response with premium impact — review before sending');
    renderPage();
  });
  document.querySelectorAll('[data-intake]').forEach(r=> r.addEventListener('click', ()=>{ selectedIntake = r.dataset.intake; renderPage(); }));
  document.querySelectorAll('[data-intake-confirm]').forEach(b=> b.addEventListener('click', ()=>{
    const item = INTAKE_ITEMS.find(i=>i.id===b.dataset.intakeConfirm);
    if(item){ item.status = 'Auto-Processed'; toast(`${item.id} routed to case ${item.linkedCase} — enrichment applied`); renderPage(); }
  }));
  const addVehicleBtn = document.getElementById('addVehicleBtn');
  if(addVehicleBtn) addVehicleBtn.addEventListener('click', ()=>{
    if(!vehiclesExtra[openCaseId]) vehiclesExtra[openCaseId] = [];
    const n = vehiclesExtra[openCaseId].length;
    vehiclesExtra[openCaseId].push({unit:'NEW-'+(n+1), year:2026, make:'Unspecified', type:'Pending schedule', value:null, garage:'Pending'});
    toast('Vehicle row added — complete details before bind');
    renderPage();
  });
  const addDriverBtn = document.getElementById('addDriverBtn');
  if(addDriverBtn) addDriverBtn.addEventListener('click', ()=>{
    if(!driversExtra[openCaseId]) driversExtra[openCaseId] = [];
    driversExtra[openCaseId].push({name:'New driver', license:'Pending', years:null, mvr:null, viol:'MVR pull pending', status:'Pending'});
    toast('Driver row added — MVR pull required before bind');
    renderPage();
  });
  document.querySelectorAll('[data-bulk-open]').forEach(b=> b.addEventListener('click', ()=>{ bulkPanelOpenFor = b.dataset.bulkOpen; bulkPreviewData = null; renderPage(); }));
  document.querySelectorAll('[data-bulk-preview]').forEach(b=> b.addEventListener('click', ()=> bulkPreview(b.dataset.bulkPreview)));
  const bulkCancelBtn = document.getElementById('bulkCancelBtn');
  if(bulkCancelBtn) bulkCancelBtn.addEventListener('click', ()=>{ bulkPanelOpenFor=null; bulkPreviewData=null; renderPage(); });
  const bulkImportBtn = document.getElementById('bulkImportBtn');
  if(bulkImportBtn) bulkImportBtn.addEventListener('click', bulkImport);
  const cfgPublishBtn = document.getElementById('cfgPublishBtn');
  if(cfgPublishBtn) cfgPublishBtn.addEventListener('click', ()=>{
    const changes = [];
    const readNum = (id, key, label) => {
      const val = parseFloat(document.getElementById(id).value);
      if(!isNaN(val) && val !== CONFIG[key]){ changes.push(`${label}: ${CONFIG[key]} → ${val}`); CONFIG[key] = val; }
    };
    readNum('cfgDiscSup','discountTierSupervisor','Discount self-service limit');
    readNum('cfgDiscChief','discountTierChief','Discount Supervisor ceiling');
    readNum('cfgFastTrack','fastTrackScoreMax','Fast-Track score ceiling');
    readNum('cfgSlaWarn','slaWarnDays','SLA warn threshold');
    readNum('cfgSlaBad','slaBadDays','SLA breach threshold');
    if(changes.length){
      CONFIG_HISTORY.unshift({ at: nowStamp(), by: persona.name, what: changes.join('; ') });
      toast(`Published ${changes.length} change(s) — live immediately`);
    } else {
      toast('No changes to publish');
    }
    renderPage();
  });
  const cfgResetBtn = document.getElementById('cfgResetBtn');
  if(cfgResetBtn) cfgResetBtn.addEventListener('click', ()=>{
    Object.assign(CONFIG, CONFIG_DEFAULTS);
    CONFIG_HISTORY.unshift({ at: nowStamp(), by: persona.name, what: 'Reset all thresholds to defaults' });
    toast('Configuration reset to defaults');
    renderPage();
  });
  const resetFormsBtn = document.getElementById('resetFormsBtn');
  if(resetFormsBtn) resetFormsBtn.addEventListener('click', ()=>{ delete formsOverride[openCaseId]; toast('Forms reset to defaults'); renderPage(); });
  document.querySelectorAll('[data-form]').forEach(cb=> cb.addEventListener('change', e=>{
    if(!formsOverride[openCaseId]) formsOverride[openCaseId] = {};
    formsOverride[openCaseId][e.target.dataset.form] = e.target.checked;
  }));
  const applyDiscountBtn = document.getElementById('applyDiscountBtn');
  if(applyDiscountBtn) applyDiscountBtn.addEventListener('click', ()=>{
    const pct = parseFloat(document.getElementById('discountPct').value);
    if(!pct || pct<=0){ toast('Enter a discount percentage first'); return; }
    applyDiscount(openCaseId, pct);
  });
  document.querySelectorAll('[data-approve-discount]').forEach(b=> b.addEventListener('click', ()=> approveDiscount(b.dataset.approveDiscount)));
  document.querySelectorAll('[data-resolve-subj]').forEach(b=> b.addEventListener('click', ()=>{
    const c = CASES.find(x=>x.id===openCaseId); const d = getDetail(c);
    const item = (d.subjectivities||[])[+b.dataset.resolveSubj];
    if(item){ item.status='cleared'; toast(`Marked resolved: ${item.label}`); renderPage(); }
  }));
  const getPremiumBtn = document.getElementById('getPremiumBtn');
  if(getPremiumBtn) getPremiumBtn.addEventListener('click', ()=> { toast('Premium recalculated'); renderPage(); });
  const notifyBrokerBtn = document.getElementById('notifyBrokerBtn');
  if(notifyBrokerBtn) notifyBrokerBtn.addEventListener('click', ()=>{
    const c = CASES.find(x=>x.id===openCaseId);
    if(!talkLogExtra[openCaseId]) talkLogExtra[openCaseId] = [];
    talkLogExtra[openCaseId].push({ date:'2026-08-03 '+String(9+talkLogExtra[openCaseId].length).padStart(2,'0')+':30', who:persona.name, channel:'Email', withWhom:c.broker, summary:'Notified broker of current premium estimate and outstanding conditions.' });
    toast('Broker notified');
    renderPage();
  });
  const printQuoteBtn = document.getElementById('printQuoteBtn');
  if(printQuoteBtn) printQuoteBtn.addEventListener('click', ()=>{
    const c = CASES.find(x=>x.id===openCaseId); const d = getDetail(c);
    const reasons = blockingReasons(c,d);
    if(reasons.length){ toast('Blocked: '+reasons[0].label); return; }
    quotePrinted[openCaseId] = { at: nowStamp(), by: persona.name };
    toast('Quote printed');
    renderPage();
  });
  const genPolicyBtn = document.getElementById('genPolicyBtn');
  if(genPolicyBtn) genPolicyBtn.addEventListener('click', ()=> generatePolicyDoc(openCaseId));
  const viewPolicyBtn = document.getElementById('viewPolicyBtn');
  if(viewPolicyBtn) viewPolicyBtn.addEventListener('click', ()=>{
    const c = CASES.find(x=>x.id===openCaseId); const d = getDetail(c);
    openPolicyDoc(c, d, policyDocs[openCaseId]);
  });
  document.querySelectorAll('[data-send-sig]').forEach(b=> b.addEventListener('click', ()=> sendForSignature(openCaseId, b.dataset.sendSig)));
  const simulateEsignBtn = document.getElementById('simulateEsignBtn');
  if(simulateEsignBtn) simulateEsignBtn.addEventListener('click', ()=> simulateSign(openCaseId));
  const uploadSignedBtn = document.getElementById('uploadSignedBtn');
  if(uploadSignedBtn) uploadSignedBtn.addEventListener('click', ()=> simulateSign(openCaseId));
  const issuePolicyBtn = document.getElementById('issuePolicyBtn');
  if(issuePolicyBtn) issuePolicyBtn.addEventListener('click', ()=> issuePolicy(openCaseId));
}
window.__uwGo = go;

/* ================= AI ASSISTANT ================= */
const SUGGESTIONS = ["Summarize this case", "Is this risk in appetite?", "Why did the model score this?", "Who needs to approve this?", "What if we lower the limit?", "How does this compare to similar risks?", "Any pattern flags on this broker?"];

function openDrawer(prefill){
  document.getElementById('drawer-overlay').classList.add('on');
  document.getElementById('drawer').classList.add('on');
  if(prefill){ document.getElementById('drawerInput').value=''; askAI(prefill); }
}
function closeDrawer(){ document.getElementById('drawer-overlay').classList.remove('on'); document.getElementById('drawer').classList.remove('on'); }

function pushMsg(role, header, html){
  const body = document.getElementById('drawerBody');
  const m = el(`<div class="msg ${role}">${role==='bot' && header ? `<div class="mh">${header}</div>`:''}${html}</div>`);
  body.appendChild(m);
  body.scrollTop = body.scrollHeight;
}

function askAI(text){
  pushMsg('user','',text);
  const c = openCaseId ? CASES.find(x=>x.id===openCaseId) : null;
  const d = c ? getDetail(c) : null;
  const t = text.toLowerCase();
  let header='Ask Underwriting', html='';

  if(/pattern|flag.*broker|broker.*flag/.test(t) && c){
    header='Broker Pattern Check — '+c.id;
    const bb = BROKER_BOOK[c.broker];
    html = bb ? `${c.broker} (${bb.agency}) loss ratio trend: ${trendHtml(bb.trend)}. See Governance → Underwriter & Broker Pattern Monitoring for the full flag status against your acceptance streak.` : `No broker-level pattern data on file for ${c.broker}.`;
  } else if(!c && /(this case|summarize|appetite|score|approve|authority|similar|scenario|what if)/.test(t)){
    html = `No case is currently open. <div class="chip-row"><button class="chip" data-open="C-1001">Open C-1001 Highland Foods</button><button class="chip" data-open="C-1002">Open C-1002 Bayview Marine</button></div>`;
  } else if(/summar/.test(t)){
    header='Case Summary — '+c.id;
    html = `<ul style="padding-left:16px">${d.summary.map(s=>`<li style="margin-bottom:4px">${s}</li>`).join('')}</ul>` +
      (d.requirements.filter(r=>r.status!=='received').length ? `<div style="margin-top:8px"><b>Still missing:</b> ${d.requirements.filter(r=>r.status!=='received').map(r=>r.label).join(', ')}</div>` : `<div style="margin-top:8px">No outstanding requirements.</div>`);
  } else if(/appetite/.test(t)){
    header='Appetite & Eligibility — '+c.id;
    html = d.appetiteRules.map(r=>`<div>${r.result==='PASS'?'✅':r.result==='FAIL'?'❌':'❓'} <b>${r.rule}</b><br/><span style="color:var(--muted);font-size:12px">${r.detail}</span></div>`).join('<hr class="sep" style="margin:8px 0">');
  } else if(/why.*score|score.*driver|explain/.test(t)){
    header='Explainability — '+c.id;
    html = `Score <b>${d.score.value}</b> (${d.score.band}). Drivers: ` + d.score.drivers.map(dr=>`${dr.name} (${dr.weight}%)`).join(', ') + `. Model uw-risk-score-v2.3, evaluated on data as of ${c.effDate}.`;
  } else if(/who.*(approve|authority)|approval/.test(t)){
    header='Authority Check — '+c.id;
    const gap = c.requiredTier > persona.tier;
    html = `This case requires <b>${tierName(c.requiredTier)}</b> authority. You are ${persona.tierLabel}. ` + (gap ? `Beyond your limit — an Accept will auto-route to ${tierName(c.requiredTier)}.` : `You are authorized to decide this directly.`);
  } else if(/what if|scenario|lower the limit|reduce/.test(t)){
    header='Scenario Analysis — '+c.id;
    const newPremium = Math.round(c.premium*0.6);
    html = `Reducing the limit to roughly ${fmtMoney(newPremium)} would likely bring expected loss down proportionally and could shift authority requirement down one tier. Run a full Scenario & Sensitivity pass from Loss & Experience Rating for exact figures.`;
  } else if(/similar|benchmark|compare/.test(t)){
    header='Similar Risk & Benchmark — '+c.id;
    html = `Comparable ${c.line} risks in this segment show an average loss ratio of 51% and referral rate of 28%. This case's score (${d.score.value}) is ${d.score.value>60?'above':'in line with'} that peer group — similarity alone doesn't determine the decision, see AI Risk & Recommendation for the governing criteria.`;
  } else if(/referred|waiting on me|queue/.test(t)){
    header='Queue Check';
    const mine = CASES.filter(x=>/Referred/.test(x.status));
    html = mine.length ? `${mine.length} case(s) referred: ` + mine.map(x=>`${x.id} (${x.insured}) → ${tierName(x.requiredTier)}`).join('; ') : `No cases currently referred.`;
  } else {
    html = `I can help with case summaries, appetite checks, score explainability, authority/approval routing, scenario comparisons, broker pattern checks, and similar-risk benchmarking. Try one of the suggestions below, or open a case first.`;
  }
  setTimeout(()=>{ pushMsg('bot', header, html); wireDrawerChips(); }, 260);
}
function wireDrawerChips(){
  document.querySelectorAll('[data-open]').forEach(b=> b.addEventListener('click', ()=>{ openCaseId=b.dataset.open; caseTab='action'; go('case'); closeDrawer(); }));
}

function mountDrawer(){
  document.getElementById('drawerSuggest').innerHTML = SUGGESTIONS.map(s=>`<button class="chip" data-sugg="${s}">${s}</button>`).join('');
  document.querySelectorAll('[data-sugg]').forEach(c=> c.addEventListener('click', ()=> askAI(c.dataset.sugg)));
  document.getElementById('drawerOpenBtn').addEventListener('click', ()=> openDrawer());
  document.getElementById('drawerCloseBtn').addEventListener('click', closeDrawer);
  document.getElementById('drawer-overlay').addEventListener('click', closeDrawer);
  document.getElementById('drawerSendBtn').addEventListener('click', ()=>{
    const inp = document.getElementById('drawerInput');
    if(inp.value.trim()){ askAI(inp.value.trim()); inp.value=''; }
  });
  document.getElementById('drawerInput').addEventListener('keydown', e=>{
    if(e.key==='Enter'){ document.getElementById('drawerSendBtn').click(); }
  });
  document.getElementById('askInput').addEventListener('keydown', e=>{
    if(e.key==='Enter' && e.target.value.trim()){ openDrawer(e.target.value.trim()); e.target.value=''; }
  });
  pushMsg('bot','Ask Underwriting','Ask me about any open case — appetite, scoring, authority, scenarios, or broker patterns — or ask about the whole queue.');
}

/* ================= INIT ================= */
renderGate();
mountDrawer();
