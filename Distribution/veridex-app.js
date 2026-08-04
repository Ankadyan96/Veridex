/* ============================================================
   VERIDEX · Distribution Operating System — prototype logic
   Self-contained. Sample data only. No backend.
   ============================================================ */
'use strict';

/* ---------- tiny helpers ---------- */
const $ = s => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const wait = ms => new Promise(r => setTimeout(r, ms));
const ini = n => n.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

/* ---------- icons ---------- */
const I = {
  grid:'<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
  net:'<circle cx="12" cy="5" r="2.4"/><circle cx="5" cy="19" r="2.4"/><circle cx="19" cy="19" r="2.4"/><path d="M12 7.5 6 16.8M12 7.5l6 9.3M7 19h10"/>',
  add:'<path d="M12 5v14M5 12h14"/>',
  shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
  mega:'<path d="m3 11 15-7v16l-9-4H5a2 2 0 0 1-2-2z"/><path d="M8 16v3a1 1 0 0 0 1 1h1"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="3.4"/>',
  doc:'<path d="M14 3v5h5"/><path d="M6 3h8l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>',
  chart:'<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
  chev:'<path d="m9 18 6-6-6-6"/>',
  map:'<path d="m9 4 6 2 5-2v14l-5 2-6-2-5 2V6z"/><path d="M9 4v14M15 6v14"/>',
  gift:'<path d="M20 12v9H4v-9M2 7h20v5H2zM12 7v14M12 7S9 2 6.5 3.5 8 7 12 7zM12 7s3-5 5.5-3.5S16 7 12 7z"/>',
  policy:'<path d="M9 12l2 2 4-4"/><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
  bolt:'<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  route:'<circle cx="6" cy="19" r="2.4"/><circle cx="18" cy="5" r="2.4"/><path d="M8 19h6a4 4 0 0 0 0-8H8a4 4 0 0 1 0-8h6"/>',
  palette:'<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2s-.5-1.5-.5-2.5S14 15 15 15h3a3 3 0 0 0 3-3c0-5-4-9-9-9Z"/><circle cx="7.5" cy="10.5" r="1.1"/><circle cx="9.5" cy="15" r="1.1"/><circle cx="14.5" cy="15.5" r="1.1"/>',
  plug:'<path d="M9 2v6M15 2v6M6 10h12l-1 4a5 5 0 0 1-5 4h0a5 5 0 0 1-5-4Z"/><path d="M10 18v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-2"/>',
};
const svg = (p, s=17) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

/* ============================================================
   DATA MODEL  (sample) — a real ownership tree:
   CARRIER → owns MGAs only. MGA → owns agencies. AGENCY → owns customers.
   ============================================================ */
const COLORS = { carrier:'var(--carrier)', mga:'var(--mga)', agency:'var(--agency)', insured:'var(--insured)' };
const ROLE_ACCENT = { carrier:'#0D1B4B', mga:'#0E8C6B', agency:'#B7791F', insured:'#7A3E9D' };
const SOUTHLAKE_MARK = `<svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 2 A18 18 0 0 0 2 20 A18 18 0 0 0 20 38" stroke="#0d1b4b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M20 7 A13 13 0 0 0 7 20 A13 13 0 0 0 20 33" stroke="#0d1b4b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M20 12 A8 8 0 0 0 12 20 A8 8 0 0 0 20 28" stroke="#e05470" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M20 17 A3 3 0 0 0 17 20 A3 3 0 0 0 20 23" stroke="#e05470" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M20 2 A18 18 0 0 1 38 20" stroke="#e05470" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4"/>
  <path d="M20 7 A13 13 0 0 1 33 20" stroke="#e05470" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.3"/>
</svg>`;

const CLASSES = {
  Trucking:      { lines:['19.4','21.2','17.1','9.1'], label:'Commercial auto liability, physical damage, general liability, motor-truck cargo' },
  Property:      { lines:['1','2.1','5.1'], label:'Fire, allied lines, commercial multi-peril' },
  Habitational:  { lines:['4','5.1'], label:'Homeowners, commercial multi-peril' },
  'Workers Comp':{ lines:['16'], label:'Workers compensation' },
  Contractors:   { lines:['17.1','18.1','16'], label:'General & products liability, workers comp' },
};
const LINE_NAMES = { '1':'Fire','2.1':'Allied lines','4':'Homeowners MP','5.1':'Commercial MP','9.1':'Inland marine (cargo)',
  '16':'Workers compensation','17.1':'Other liability','18.1':'Products liability','19.4':'Commercial auto liability','21.2':'Commercial auto phys. dmg' };

let ORG_SEQ = 1000;

const ORGS = {
  carrier_meridian: {
    id:'carrier_meridian', type:'CARRIER', name:'Southlake', role:'Carrier', color:'carrier',
    state:'IL', stateCount:41, stat:'Admitted · 41 states · P&C', user:'Dana Reyes', uinit:'DR',
    npn:'—', since:'2018', status:'ok', statusL:'Appointed',
    mgaIds:['mga_apex','mga_lonestar_grp','mga_summit_uw'],
    lines:['19.4','21.2','1','16'], classes:['Trucking','Property','Workers Comp'],
    trend:[58,64,71,79],
    brand:{ accent:'#0D1B4B', logoText:'SL', logoSvg:SOUTHLAKE_MARK, bg:'#F8FAFC', theme:'light', tagline:'Admitted P&C carrier · 41 states' },
  },
  mga_apex: {
    id:'mga_apex', type:'MGA', name:'Futuristic Underwriters', role:'MGA', color:'mga', parentId:'carrier_meridian',
    state:'TX', stateCount:14, stat:'Active · 14 states · 6 lines', user:'Ishant P.', uinit:'IP',
    npn:'5512207', since:'2019', status:'ok', statusL:'Active',
    agencyIds:['agency_metro','agency_lonestar','agency_gulfcoast'],
    lines:['19.4','21.2','17.1','16'], classes:['Trucking','Contractors','Workers Comp'],
    trend:[62,70,77,88],
    perf:{ prod:'$6.3M', growth:'+14%', lossRatio:'58%',
      grid:{ TX:{Trucking:2400000,Contractors:900000}, OK:{Contractors:500000,'Workers Comp':300000}, LA:{Trucking:600000}, NM:{Contractors:200000} } },
    brand:{ accent:'#0E8C6B', logoText:'FU', bg:'#F2F9F6', theme:'light', tagline:'Delegated authority · trucking & contractors specialist' },
  },
  mga_lonestar_grp: {
    id:'mga_lonestar_grp', type:'MGA', name:'Lonestar Underwriting Group', role:'MGA', color:'mga', parentId:'carrier_meridian',
    state:'OK', stateCount:6, stat:'Active · 6 states · 3 lines', user:'K. Novak', uinit:'KN',
    npn:'5518831', since:'2021', status:'ok', statusL:'Active',
    agencyIds:['agency_summit'],
    lines:['17.1','18.1','16'], classes:['Contractors','Workers Comp'],
    trend:[40,48,55,63],
    perf:{ prod:'$1.2M', growth:'+6%', lossRatio:'64%',
      grid:{ OK:{Contractors:700000,'Workers Comp':500000}, AR:{Contractors:150000} } },
    brand:{ accent:'#146C94', logoText:'LU', bg:'#EEF7FA', theme:'light', tagline:'Contractors & workers comp delegated authority' },
  },
  mga_summit_uw: {
    id:'mga_summit_uw', type:'MGA', name:'Summit Underwriting Partners', role:'MGA', color:'mga', parentId:'carrier_meridian',
    state:'NM', stateCount:2, stat:'Ramping up · 2 states', user:'T. Alvarez', uinit:'TA',
    npn:'5522190', since:'2025', status:'warn', statusL:'Ramping up',
    agencyIds:[],
    lines:['1','5.1'], classes:['Property','Habitational'],
    trend:[10,14,18,22],
    perf:{ prod:'$0.4M', growth:'+2%', lossRatio:'—', grid:{ NM:{Property:300000} } },
    brand:{ accent:'#7A3E9D', logoText:'SU', bg:'#F6F1FA', theme:'light', tagline:'New property & habitational program' },
  },

  agency_metro: {
    id:'agency_metro', type:'AGENCY', name:'Links', role:'Agency', color:'agency', parentId:'mga_apex',
    state:'TX', stateCount:6, stat:'Appointed · 4 markets', user:'Sam Okafor', uinit:'SO',
    npn:'8841207', since:'2023', status:'ok', statusL:'Active',
    customerIds:['cust_dawson','cust_vela'],
    lines:['19.4','21.2','17.1'], classes:['Trucking','Contractors'],
    licensedStates:['TX','OK','LA','NM','AR','FL'],
    trend:[50,55,66,74],
    perf:{ prod:'$2.4M', growth:'+9%', lossRatio:'52%', grid:{ TX:{Trucking:1800000,Contractors:600000} } },
    brand:{ accent:'#B7791F', logoText:'LI', bg:'#FBF5EA', theme:'light', tagline:'Trucking & contractors specialist agency' },
  },
  agency_lonestar: {
    id:'agency_lonestar', type:'AGENCY', name:'Lone Star Brokerage', role:'Agency', color:'agency', parentId:'mga_apex',
    state:'TX', stateCount:3, stat:'Active · 3 states', user:'M. Reyes', uinit:'MR',
    npn:'7730155', since:'2022', status:'ok', statusL:'Active',
    customerIds:['cust_rincon'],
    lines:['1','5.1','17.1'], classes:['Property','Habitational'],
    licensedStates:['TX','OK','NM'],
    perf:{ prod:'$1.8M', growth:'+5%', lossRatio:'49%', grid:{ TX:{Property:1200000,Habitational:600000} } },
    brand:{ accent:'#B7791F', logoText:'LS', bg:'#FBF5EA', theme:'light', tagline:'' },
  },
  agency_gulfcoast: {
    id:'agency_gulfcoast', type:'AGENCY', name:'Gulf Coast Agency', role:'Agency', color:'agency', parentId:'mga_apex',
    state:'LA', stateCount:2, stat:'E&O expiring · 2 states', user:'P. Boudreaux', uinit:'PB',
    npn:'9910488', since:'2024', status:'warn', statusL:'E&O expiring',
    customerIds:['cust_bayou'],
    lines:['19.4','21.2'], classes:['Trucking'],
    licensedStates:['LA','TX'],
    perf:{ prod:'$0.9M', growth:'-3%', lossRatio:'71%', grid:{ LA:{Trucking:900000} } },
    brand:{ accent:'#B7791F', logoText:'GC', bg:'#FBF5EA', theme:'light', tagline:'' },
  },
  agency_summit: {
    id:'agency_summit', type:'AGENCY', name:'Summit Specialty', role:'Agency', color:'agency', parentId:'mga_lonestar_grp',
    state:'OK', stateCount:5, stat:'Active · 5 states', user:'J. Mercer', uinit:'JM',
    npn:'6620931', since:'2023', status:'ok', statusL:'Active',
    customerIds:[],
    lines:['16','17.1'], classes:['Workers Comp'],
    licensedStates:['OK','AR','TX','NM','LA'],
    perf:{ prod:'$1.2M', growth:'+11%', lossRatio:'55%', grid:{ OK:{'Workers Comp':1200000} } },
    brand:{ accent:'#B7791F', logoText:'SS', bg:'#FBF5EA', theme:'light', tagline:'' },
  },

  cust_dawson: {
    id:'cust_dawson', type:'INSURED', name:'Ishant', role:'Insured', color:'insured', parentId:'agency_metro',
    state:'TX', stat:'2 active policies', user:'Ishant P.', uinit:'IP',
    since:'2023', status:'ok', statusL:'Active',
    class:'Trucking', coverages:['Commercial Auto','General Liability'], premium:'$37,500',
  },
  cust_vela: {
    id:'cust_vela', type:'INSURED', name:'Vela Freight Co', role:'Insured', color:'insured', parentId:'agency_metro',
    state:'TX', since:'2024', status:'ok', statusL:'Active',
    class:'Trucking', coverages:['Commercial Auto'], premium:'$24,000',
  },
  cust_rincon: {
    id:'cust_rincon', type:'INSURED', name:'Rincon Builders', role:'Insured', color:'insured', parentId:'agency_lonestar',
    state:'TX', since:'2022', status:'ok', statusL:'Active',
    class:'Contractors', coverages:['General Liability','Property'], premium:'$18,500',
  },
  cust_bayou: {
    id:'cust_bayou', type:'INSURED', name:'Bayou Haulage', role:'Insured', color:'insured', parentId:'agency_gulfcoast',
    state:'LA', since:'2024', status:'warn', statusL:'Claim open',
    class:'Trucking', coverages:['Commercial Auto'], premium:'$29,000',
  },
};

const TENANT_ORG = { carrier:'carrier_meridian', mga:'mga_apex', agency:'agency_metro', insured:'cust_dawson' };

const POLICIES = [
  { no:'MM-CA-4471-TX', carrier:'Southlake', line:'Commercial Auto', prem:'$28,400', status:'Active',
    start:'2025-09-10', renew:'2026-09-10', desc:'Covers your fleet\'s liability and physical damage exposure while on the road.' },
  { no:'MM-CG-2210-TX', carrier:'Southlake', line:'General Liability', prem:'$9,100', status:'Active',
    start:'2025-11-01', renew:'2026-11-01', desc:'Covers third-party bodily injury and property damage claims against your business.' },
];
function daysUntil(dateStr){ return Math.round((new Date(dateStr) - new Date())/86400000); }
function fmtDate(dateStr){ return new Date(dateStr).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }

let LEADS = [
  { name:'Ishant', origin:'Links', state:'TX', class:'Trucking', line:'19.4 / 21.2', stage:'Quoted', chain:['Links','Futuristic Underwriters'], val:'$48k', age:'2d' },
  { name:'Vela Freight Co', origin:'Direct campaign', state:'TX', class:'Trucking', line:'19.4 / 21.2', stage:'New', chain:['Futuristic Underwriters'], val:'$61k', age:'5h' },
  { name:'Rincon Builders', origin:'Lone Star Brokerage', state:'TX', class:'Contractors', line:'17.1', stage:'Bound', chain:['Lone Star Brokerage','Futuristic Underwriters'], val:'$22k', age:'1d' },
  { name:'Bayou Haulage', origin:'Referral · Ishant', state:'LA', class:'Trucking', line:'19.4', stage:'New', chain:['Gulf Coast Agency','Futuristic Underwriters'], val:'$37k', age:'3h' },
];

let CAMPAIGNS = [
  { name:'TX Trucking Q3 Push', channel:'Email + LinkedIn', leads:34, conv:'22%', crm:'HubSpot' },
  { name:'Contractor Renewal Winback', channel:'Email', leads:18, conv:'31%', crm:'HubSpot' },
  { name:'Gulf Coast Cargo Expansion', channel:'Events', leads:9, conv:'14%', crm:'Salesforce' },
];

/* ---------- hierarchy helpers ---------- */
function childrenOf(orgId){
  const o = ORGS[orgId]; if(!o) return [];
  if(o.type==='CARRIER') return (o.mgaIds||[]).map(id=>ORGS[id]);
  if(o.type==='MGA') return (o.agencyIds||[]).map(id=>ORGS[id]);
  if(o.type==='AGENCY') return (o.customerIds||[]).map(id=>ORGS[id]);
  return [];
}
function parentOf(orgId){ const o=ORGS[orgId]; return (o && o.parentId) ? ORGS[o.parentId] : null; }
function uplineChain(orgId){ const chain=[]; let p=parentOf(orgId); while(p){ chain.push(p); p=parentOf(p.id); } return chain; }
function descendantsOf(orgId){ const direct=childrenOf(orgId); return direct.concat(direct.flatMap(d=>descendantsOf(d.id))); }
function collectAlerts(org){
  return descendantsOf(org.id).filter(o=>o.status==='warn'||o.status==='bad').map(o=>({
    text:`<b>${o.name}</b> ${(o.statusL||'').toLowerCase()}`, meta:`${o.type} · ${o.state}` }));
}
function countAlerts(org){ return collectAlerts(org).length; }
function currentOrg(){ return ORGS[TENANT_ORG[CURRENT]]; }

function parseMoney(str){
  if(!str) return 0;
  const s = String(str).replace(/[$,]/g,'');
  if(/M$/i.test(s)) return parseFloat(s)*1e6;
  if(/k$/i.test(s)) return parseFloat(s)*1e3;
  return parseFloat(s)||0;
}
function fmtMoney(v){
  if(v>=1000000) return '$'+(v/1000000).toFixed(1).replace(/\.0$/,'')+'M';
  if(v>=1000) return '$'+Math.round(v/1000)+'k';
  return '$'+v;
}
function matrixHtml(grid){
  const states = Object.keys(grid||{});
  if(!states.length) return `<div class="empty">No production recorded yet.</div>`;
  const classes = [...new Set(states.flatMap(s=>Object.keys(grid[s])))];
  let html = `<div class="matrix" style="grid-template-columns:120px repeat(${classes.length},1fr)">`;
  html += `<div class="mx-cell mx-head">State</div>`;
  classes.forEach(c=>html+=`<div class="mx-cell mx-head">${c}</div>`);
  states.forEach(s=>{ html+=`<div class="mx-cell mono">${s}</div>`;
    classes.forEach(c=>{ const v=(grid[s]||{})[c]; html+=`<div class="mx-cell ${v?'mx-yes':'mx-no'}">${v?fmtMoney(v):'—'}</div>`; }); });
  html += `</div>`;
  return html;
}

/* creation from onboarding */
function targetKind(){
  if(CURRENT==='carrier') return { type:'MGA', label:'MGA', sample:'Crestline Underwriters',
    docs:['Delegated authority agreement','E&O certificate','W-9'],
    sections:[
      { title:'MGA Information', fields:[
        {label:'MGA Name', ph:'e.g. Southlake Underwriters', req:true, id:'onbPrimaryName'},
        {label:'DBA Name', ph:'Doing-business-as name'},
        {label:'MGA Code', ph:'e.g. MGA-100', req:true},
        {label:'Display Id', ph:'e.g. SU', req:true},
      ]},
      { title:'Other Names', repeat:true, addLabel:'+ Add Other Name', emptyNoun:'other names', fields:[
        {label:'State', ph:'Select state', type:'select'},
        {label:'Display Name', ph:'Display Name'},
      ]},
      { title:'Licensing & Compliance', fields:[
        {label:'FEIN/EIN', ph:'12-3456789', req:true},
        {label:'NPN', ph:'National Producer Number'},
        {label:'Domiciled State', ph:'Select state', type:'select'},
        {label:'Licensed States', ph:'Select Licensed States', type:'select'},
      ]},
      { title:'Address', fields:[
        {label:'Address', ph:'123 Main St', req:true},
        {label:'Zip', ph:'12345', req:true},
        {label:'City', ph:'Auto-filled from zip'},
        {label:'State', ph:'Auto-filled from zip', type:'select'},
      ]},
      { title:'Operational Settings', fields:[
        {label:'Open Item', type:'radio', options:['Yes','No'], default:'No'},
      ]},
      { title:'Business Contact', fields:[
        {label:'Business Email', ph:'business@mga.com', req:true},
        {label:'Official Phone Number', ph:'(555) 019-9000', req:true},
        {label:'Mobile Number', ph:'(555) 019-9000'},
      ]},
      { title:'Additional Contacts', repeat:true, addLabel:'+ Add Contact', emptyNoun:'additional contacts', fields:[
        {label:'Contact Type', ph:'Select Type', type:'select', options:['Underwriting Contact','Accounting Contact','Claims Contact','Other']},
        {label:'Name', ph:'Name'},
        {label:'Email', ph:'email@mga.com'},
        {label:'Phone', ph:'(555) 019-9000'},
      ]},
    ],
    required:'MGA name, code, FEIN/EIN, licensed states, business contact', documents:'Delegated authority agreement, E&O certificate, W-9',
    verification:'NIPR + Secretary of State + zip lookup', agreement:'Delegated underwriting authority agreement (e-sign)', result:'New MGA tenant + relationship edge' };
  if(CURRENT==='mga') return { type:'AGENCY', label:'Agency', sample:'Summit Specialty',
    docs:['State producer licence','W-9','E&O certificate'],
    sections:[
      { title:'Agency Information', fields:[
        {label:'Agency Name', ph:'e.g. Links Insurance Brokerage', req:true, id:'onbPrimaryName'},
        {label:'DBA Name', ph:'Doing-business-as name'},
        {label:'Agency Code', ph:'e.g. AG-100', req:true},
        {label:'Display Id', ph:'e.g. LK', req:true},
      ]},
      { title:'Licensing & Compliance', fields:[
        {label:'FEIN/EIN', ph:'12-3456789', req:true},
        {label:'NPN', ph:'National Producer Number'},
        {label:'Domiciled State', ph:'Select state', type:'select'},
        {label:'Licensed States', ph:'Select Licensed States', type:'select'},
      ]},
      { title:'Address', fields:[
        {label:'Address', ph:'123 Main St', req:true},
        {label:'Zip', ph:'12345', req:true},
        {label:'City', ph:'Auto-filled from zip'},
        {label:'State', ph:'Auto-filled from zip', type:'select'},
      ]},
      { title:'Business Contact', fields:[
        {label:'Business Email', ph:'business@agency.com', req:true},
        {label:'Official Phone Number', ph:'(555) 019-9000', req:true},
        {label:'Mobile Number', ph:'(555) 019-9000'},
      ]},
      { title:'Additional Contacts', repeat:true, addLabel:'+ Add Contact', emptyNoun:'additional contacts', fields:[
        {label:'Contact Type', ph:'Select Type', type:'select', options:['Producer Contact','Accounting Contact','Claims Contact','Other']},
        {label:'Name', ph:'Name'},
        {label:'Email', ph:'email@agency.com'},
        {label:'Phone', ph:'(555) 019-9000'},
      ]},
    ],
    required:'Agency name, code, FEIN/EIN, licensed states, business contact', documents:'State licence, W-9, E&O certificate',
    verification:'NIPR + Secretary of State + zip lookup', agreement:'Distribution agreement (e-sign)', result:'New agency tenant + relationship edge' };
  return { type:'INSURED', label:'Customer', sample:'Harbor Point LLC',
    fields:[['Full name','Harbor Point LLC'],['Email','ops@harborpoint.com'],['Phone','(512) 555-0110'],['Home state','TX']],
    required:'Name, email, phone', documents:'None', verification:'Email magic link',
    agreement:'Terms of use acceptance', result:'Customer portal login' };
}

/* ---------- Carrier master data (separate from the MGA/Agency distribution hierarchy) ---------- */
let CARRIER_MASTERS = [
  { code:'SLM', name:'Southlake', dba:'', naics:'6331', type:'Admitted', state:'IL', status:'ok' },
];
const CARRIER_FORM_SECTIONS = [
  { title:'Carrier Information', fields:[
    {label:'Carrier Code', ph:'ID Name', req:true},
    {label:'Carrier Name', ph:'Name', req:true, id:'onbPrimaryName'},
    {label:'DBA Name', ph:'DBA Name'},
    {label:'NAICS Number', ph:'e.g. 283', req:true},
    {label:'FEIN/EIN Number', ph:'e.g. 12-3456789'},
  ]},
  { title:'Carrier Contact Information', fields:[
    {label:'Official Phone Number', ph:'(555) 019-9000', req:true},
    {label:'Mobile Number', ph:'Enter Mobile Number'},
    {label:'Official Email Address', ph:'Enter Official Email Address', req:true},
    {label:'Licensed States', ph:'Select Licensed States', type:'select'},
    {label:'Address 1', ph:'Address 1'},
    {label:'City', ph:'City'},
    {label:'Zip', ph:'Zip'},
    {label:'State', ph:'Select state', type:'select'},
  ]},
  { title:'Additional Contacts', repeat:true, addLabel:'+ Add Contact', emptyNoun:'additional contacts', fields:[
    {label:'Contact Type', ph:'Select Type', type:'select', options:['Underwriting Contact','Accounting Contact','Claims Contact','Other']},
    {label:'Contact Name', ph:'Name'},
    {label:'Contact Email', ph:'Email'},
    {label:'Contact Phone Number', ph:'Phone'},
  ]},
  { title:'', fields:[
    {label:'Reporting Frequency', ph:'Select Reporting Frequency', type:'select', options:['Monthly','Quarterly','Annually']},
    {label:'Billing Method', ph:'Select Billing Method', type:'select', options:['Direct Bill','Agency Bill']},
  ]},
  { title:'', fields:[
    {label:'Carrier Type', type:'radio', options:['Admitted','Non Admitted'], default:'Admitted', req:true},
  ]},
];
function openAddCarrierModal(){
  const body = renderSections(CARRIER_FORM_SECTIONS);
  openModal('Add Carrier', body, [
    ['Cancel','',closeModal],
    ['Save Carrier','primary',()=>{
      const nameInput = document.getElementById('onbPrimaryName');
      const name = (nameInput && nameInput.value.trim()) || 'New Carrier';
      closeModal();
      CARRIER_MASTERS.push({ code:name.slice(0,3).toUpperCase(), name, dba:'', naics:'—', type:'Admitted', state:'TX', status:'ok' });
      toast(`${name} added`, 'Carrier master record saved');
      if(VIEW==='onboarding') render();
    }],
  ], { width:'820px', afterMount: wireRepeats });
}
function createOrgFromOnboarding(k, name, opts={}){
  const id = (k.type==='MGA'?'mga_':'agency_') + (ORG_SEQ++);
  const parent = currentOrg();
  const newOrg = {
    id, type:k.type, name, color:k.type==='MGA'?'mga':'agency', role:k.label,
    parentId: parent.id, state: opts.state||'TX', stateCount: 1, licensedStates:[opts.state||'TX'],
    lines: opts.lines||['19.4','21.2','17.1'], classes: opts.classes||['Trucking'],
    npn: opts.npn || String(6000000+Math.floor(Math.random()*999999)),
    since:'2026', status:'ok', statusL:'Active',
    perf:{ prod:'$0', growth:'—', lossRatio:'—', grid:{} },
    brand:{ accent: ROLE_ACCENT[k.type==='MGA'?'mga':'agency'], logoText: ini(name), bg:'#F4F6F9', theme:'light', tagline:'' },
  };
  if(k.type==='MGA'){ newOrg.agencyIds=[]; parent.mgaIds.push(id); }
  else { newOrg.customerIds=[]; parent.agencyIds.push(id); }
  ORGS[id] = newOrg;
  return newOrg;
}
function createCustomerOrg(name){
  const id = 'cust_'+(ORG_SEQ++);
  const parent = currentOrg();
  const newC = { id, type:'INSURED', name, color:'insured', role:'Insured', parentId:parent.id, state:parent.state,
    since:'2026', status:'ok', statusL:'Active',
    class:(parent.classes&&parent.classes[0])||'Trucking', coverages:['Commercial Auto'], premium:'$0' };
  ORGS[id]=newC; parent.customerIds.push(id); return newC;
}

/* ---------- navigation per portal ---------- */
const NAV = {
  carrier:[['dashboard','Overview',I.grid],['network','MGA network',I.net],['onboarding','Onboard an MGA',I.add],
           ['performance','MGA performance',I.chart],
           ['broadcasts','Product broadcasts',I.mega],['leads','Leads',I.route],['crm','CRM & integrations',I.plug],
           ['branding','Branding & invites',I.palette]],
  mga:[['dashboard','Overview',I.grid],['network','Agency network',I.net],['onboarding','Onboard an agency',I.add],
       ['performance','Agency performance',I.chart],
       ['leads','Marketing & leads',I.route],['broadcasts','Broadcasts',I.mega],['crm','CRM & integrations',I.plug],
       ['branding','Branding & invites',I.palette]],
  agency:[['dashboard','Overview',I.grid],['network','My markets',I.map],['onboarding','Onboard a customer',I.add],
          ['performance','Customer book',I.chart],['leads','Marketing & leads',I.route],
          ['crm','CRM & integrations',I.plug],['branding','Branding & invites',I.palette]],
  insured:[['policies','My policies',I.policy],['refer','Refer & earn',I.gift],['docs','Documents',I.doc]],
};

/* ============================================================
   APP STATE
   ============================================================ */
let CURRENT = 'mga';
let VIEW = 'dashboard';
let NET_FILTERS = { state:'', cls:'', line:'', status:'', q:'' };

/* ---------- theming ---------- */
function applyTheme(){
  const org = currentOrg();
  const accent = (org.brand && org.brand.accent) || ROLE_ACCENT[org.color] || '#2D5BA8';
  document.documentElement.style.setProperty('--accent', accent);
  document.documentElement.style.setProperty('--accent-soft', `color-mix(in srgb, ${accent} 12%, #fff)`);
  document.documentElement.style.setProperty('--canvas', (org.brand && org.brand.bg) || '#F4F6F9');
}
function nextTierLabel(org){ return org.type==='CARRIER' ? 'MGA' : org.type==='MGA' ? 'agency' : 'customer'; }

/* ============================================================
   PORTAL PICKER
   ============================================================ */
function renderGate(){
  const wrap = $('#portalCards'); wrap.innerHTML='';
  [['carrier','Underwrites the policy · appoints MGAs'],
   ['mga','Delegated authority · manages a downline of agencies'],
   ['agency','Places business with customers · the producer'],
   ['insured','Views policies · refers friends']].forEach(([key,desc])=>{
    const t = ORGS[TENANT_ORG[key]];
    const b = el('button','portal-card');
    b.style.setProperty('--pc', COLORS[t.color]);
    const mark = (t.brand&&t.brand.logoSvg) ? t.brand.logoSvg : ini(t.name);
    b.innerHTML = `<span class="portal-ic">${mark}</span>
      <span><span class="pt">${t.role} portal</span><span class="pd">${desc}</span></span>
      <span class="pco">${t.name}</span>
      <span class="chev">${svg(I.chev,18)}</span>`;
    b.onclick = ()=> enterPortal(key);
    wrap.appendChild(b);
  });
}

function enterPortal(id){
  CURRENT = id;
  VIEW = NAV[id][0][0];
  applyTheme();
  $('#gate').classList.add('hidden');
  $('#app').classList.add('on');
  buildShell();
  render();
}

/* ============================================================
   SHELL (sidebar, switcher, context)
   ============================================================ */
function buildShell(){
  const t = currentOrg();
  $('#ctxLbl').textContent = t.role.toUpperCase()+' PORTAL';
  $('#ctxCo').textContent = t.name;
  $('#ctxSt').textContent = t.stat;
  $('#swBadge').innerHTML = (t.brand&&t.brand.logoSvg) ? t.brand.logoSvg : ini(t.name);
  $('#swBadge').style.background = (t.brand&&t.brand.logoSvg) ? 'transparent' : COLORS[t.color];
  $('#swCo').textContent = t.name;
  $('#swRole').textContent = t.role;
  $('#userAv').textContent = t.uinit;
  $('#dwCtx').textContent = `${t.role} · ${t.name}`;
  const nav = $('#nav'); nav.innerHTML='';
  const grp = el('div','nav-group');
  grp.appendChild(el('div','gl','Workspace'));
  NAV[CURRENT].forEach(([id,label,icon])=>{
    const b = el('button','nav-item'+(id===VIEW?' active':''));
    b.innerHTML = svg(icon)+`<span>${label}</span>`;
    if(id==='leads' && CURRENT!=='carrier') b.innerHTML+=`<span class="badge">${LEADS.length}</span>`;
    if(id==='network'){ const n = t.type==='AGENCY' ? uplineChain(t.id).length : childrenOf(t.id).length; b.innerHTML+=`<span class="badge">${n}</span>`; }
    b.onclick=()=>{ VIEW=id; buildShell(); render(); };
    grp.appendChild(b);
  });
  nav.appendChild(grp);
  const menu = $('#switchMenu'); menu.innerHTML='';
  Object.entries(TENANT_ORG).forEach(([key,id])=>{
    const o = ORGS[id];
    const it = el('button','switch-item');
    it.innerHTML = `<span class="si" style="background:${COLORS[o.color]}">${ini(o.name)}</span>
      <span><b style="font-weight:600">${o.name}</b><small>${o.role} portal</small></span>`;
    it.onclick=()=>{ $('#switchMenu').classList.remove('open'); enterPortal(key); };
    menu.appendChild(it);
  });
}

/* ============================================================
   VIEW ROUTER
   ============================================================ */
function render(){
  const v = $('#view');
  const map = {
    dashboard:viewDashboard, network:viewNetwork, onboarding:viewOnboarding,
    leads:viewLeads, broadcasts:viewBroadcasts, crm:viewCRM,
    performance:viewPerformance, branding:viewBranding,
    policies:viewPolicies, refer:viewRefer, docs:viewDocs,
  };
  v.innerHTML='';
  v.appendChild((map[VIEW]||viewDashboard)());
  requestAnimationFrame(()=>document.querySelectorAll('.bar-fill').forEach(b=>{ const w=b.dataset.w; b.style.width='0'; requestAnimationFrame(()=>b.style.width=w); }));
}

/* ---------- shared bits ---------- */
function pageHead(crumb,title,desc,actions){
  const h = el('div','ph');
  h.innerHTML = `<div><div class="crumb">${crumb}</div><h1>${title}</h1>${desc?`<p>${desc}</p>`:''}</div>`;
  if(actions){ const sp=el('div','sp'); actions.forEach(a=>sp.appendChild(a)); h.appendChild(sp); }
  return h;
}
function btn(label,icon,cls,onclick){ const b=el('button','btn '+(cls||''),(icon?svg(icon,16):'')+`<span>${label}</span>`); if(onclick)b.onclick=onclick; return b; }
function kpi(icon,val,lbl,delta,dir){
  return `<div class="card kpi"><div class="k-top"><div class="k-ic">${svg(icon,18)}</div>
    ${delta?`<span class="k-delta ${dir}">${dir==='up'?'▲':dir==='dn'?'▼':'•'} ${delta}</span>`:''}</div>
    <div class="k-val">${val}</div><div class="k-lbl">${lbl}</div></div>`;
}
function av(name,color){ return `<span class="av" style="background:${COLORS[color]||'var(--ink)'}">${ini(name)}</span>`; }
function lineChips(lines){ return (lines||[]).map(l=>`<span class="chip code" title="${LINE_NAMES[l]||''}">${l}</span>`).join(' '); }

/* ============================================================
   EXECUTIVE DASHBOARD SYSTEM
   period / financials-view / drill filters + KPI cards + charts
   ============================================================ */
const PERIODS = ['MTD','QTD','YTD','ITD'];
const PERIOD_FACTOR = { MTD:0.085, QTD:0.26, YTD:1, ITD:3.6 };
let PERIOD = 'YTD';
let FIN_VIEW = 'Gross';
let DASH_FILTERS = { entity:'', state:'', lob:'' };
let DASH_TAB = 'home';
const CEDE_RATE = 0.30;

function scalePremium(v){
  let x = v * PERIOD_FACTOR[PERIOD];
  if(FIN_VIEW==='Ceded') x = x*CEDE_RATE;
  else if(FIN_VIEW==='Net') x = x*(1-CEDE_RATE);
  return x;
}
function kpiCard2(label, rawVal, opts={}){
  const { deltaPct, fmt='money', caption, badge, badgeKind='ok', color } = opts;
  const isRatio = fmt==='pct' || fmt==='pts' || fmt==='raw';
  const val = isRatio ? rawVal : scalePremium(rawVal);
  const dispVal = fmt==='money' ? fmtMoney(val) : fmt==='pct' ? `${val.toFixed(1)}%` : val;
  const dir = opts.dir || (deltaPct==null ? 'flat' : deltaPct>0 ? (opts.badDirection?'dn':'up') : deltaPct<0 ? (opts.badDirection?'up':'dn') : 'flat');
  const deltaTxt = deltaPct==null ? '' : `${deltaPct>0?'+':''}${deltaPct}${fmt==='pts'?'pts':'%'}`;
  return `<div class="card kpi2" style="--kc:${color||'var(--accent)'}">
    <div class="k2-lbl">${label}</div>
    <div class="k2-val">${dispVal}</div>
    ${deltaPct!=null?`<div class="k2-delta ${dir}">${dir==='up'?'▲':dir==='dn'?'▼':'→'} ${deltaTxt}<span class="k2-vs">vs Prior ${PERIOD}</span></div>`:''}
    ${caption?`<div class="k2-cap">${caption}</div>`:''}
    ${badge?`<div class="k2-badge ${badgeKind}">${badge}</div>`:''}
  </div>`;
}
function toolbarStrip(opts){
  const { entityLabel, entities, states, lobs, onChange } = opts;
  const bar = el('div','toolbar');
  const pg = el('div','tb-group');
  pg.innerHTML = `<span class="tb-lbl">Period</span>`;
  const pseg = el('div','seg');
  PERIODS.forEach(pr=>{ const b=el('button',pr===PERIOD?'on':'',pr); b.onclick=()=>{ PERIOD=pr; onChange(); }; pseg.appendChild(b); });
  pg.appendChild(pseg); bar.appendChild(pg);

  function selGroup(label, opts2, key){
    const g = el('div','tb-group');
    g.innerHTML = `<span class="tb-lbl">${label}</span>`;
    const s = el('select');
    s.innerHTML = `<option value="">All ${label==='LOB'?'LOBs':label+'s'}</option>`+opts2.map(([v,l])=>`<option value="${v}" ${DASH_FILTERS[key]===v?'selected':''}>${l}</option>`).join('');
    s.onchange=()=>{ DASH_FILTERS[key]=s.value; onChange(); };
    g.appendChild(s);
    return g;
  }
  bar.appendChild(selGroup(entityLabel, entities, 'entity'));
  bar.appendChild(selGroup('State', states.map(s=>[s,s]), 'state'));
  bar.appendChild(selGroup('LOB', lobs.map(l=>[l,l]), 'lob'));

  const sp = el('div','tb-sp');
  const active = DASH_FILTERS.entity||DASH_FILTERS.state||DASH_FILTERS.lob;
  sp.innerHTML = `<span class="tb-hint">${active?'Filters applied':'Showing all data'}</span>`;
  const clr = btn('Clear Filters','','sm',()=>{ DASH_FILTERS={entity:'',state:'',lob:''}; onChange(); });
  sp.appendChild(clr);
  bar.appendChild(sp);
  return bar;
}
function tabStrip(tabs, active, onChange, rightText){
  const strip = el('div','tabstrip');
  tabs.forEach(([id,label,count])=>{
    const b = el('button', id===active?'on':'');
    b.innerHTML = `<span>${label}</span>${count?`<span class="tct">${count}</span>`:''}`;
    b.onclick=()=>onChange(id);
    strip.appendChild(b);
  });
  if(rightText){ const sp=el('span','tsp'); sp.textContent=rightText; strip.appendChild(sp); }
  return strip;
}
function svgBarChart(labels, values, opts={}){
  const w=300, h=150, padB=22, padT=20, padX=8;
  const max = Math.max(...values, 1) * 1.2;
  const n = values.length;
  const slot = (w-padX*2)/n;
  const bw = slot*0.56;
  const color = opts.color || 'var(--accent)';
  let bars='';
  values.forEach((v,i)=>{
    const bh = Math.max(2,(v/max)*(h-padT-padB));
    const x = padX + i*slot + (slot-bw)/2;
    const y = h-padB-bh;
    bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${i===n-1&&opts.highlightLast?opts.hiColor||color:color}" opacity="${i===n-1&&opts.highlightLast?1:0.82}"/>`;
    bars += `<text class="bv-lab" x="${(x+bw/2).toFixed(1)}" y="${(y-6).toFixed(1)}" text-anchor="middle">${opts.fmt?opts.fmt(v):v}</text>`;
    bars += `<text class="ax-lab" x="${(x+bw/2).toFixed(1)}" y="${h-6}" text-anchor="middle">${labels[i]}</text>`;
  });
  return `<svg class="barchart" viewBox="0 0 ${w} ${h}" style="width:100%;height:auto">${bars}</svg>`;
}
function svgLineChart(labels, series){
  const w=300, h=150, padB=22, padT=16, padX=14;
  const allVals = series.flatMap(s=>s.values);
  const max = Math.max(...allVals)*1.08, min = Math.min(...allVals)*0.92;
  const range = (max-min)||1;
  const n = labels.length;
  const stepX = n>1 ? (w-padX*2)/(n-1) : 0;
  const y = v => h-padB-((v-min)/range)*(h-padT-padB);
  let out='';
  series.forEach(s=>{
    const pts = s.values.map((v,i)=>`${(padX+i*stepX).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    out += `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2"/>`;
    s.values.forEach((v,i)=>{ out += `<circle cx="${(padX+i*stepX).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3" fill="${s.color}"/>`; });
  });
  labels.forEach((l,i)=>{ out += `<text class="ax-lab" x="${(padX+i*stepX).toFixed(1)}" y="${h-6}" text-anchor="middle">${l}</text>`; });
  return `<svg class="linechart" viewBox="0 0 ${w} ${h}" style="width:100%;height:auto">${out}</svg>`;
}
function chartCard(title, sub, chartHtml, legend){
  const c = el('div','card chartcard');
  c.innerHTML = `<div class="cc-t">${title}</div><div class="cc-s">${sub}</div>${chartHtml}
    ${legend?`<div class="cc-legend">${legend.map(l=>`<span><span class="cc-dot" style="background:${l.color}"></span>${l.name}</span>`).join('')}</div>`:''}`;
  return c;
}
function stateLobGrid(grid, states, lobs){
  const wrap = el('div','slgrid-wrap');
  const g = el('div','slgrid'); g.style.gridTemplateColumns = `130px repeat(${lobs.length},1fr) 100px`;
  g.appendChild(el('div','sl-head lab','State'));
  lobs.forEach(l=>g.appendChild(el('div','sl-head',l)));
  g.appendChild(el('div','sl-head','Total'));
  states.forEach(s=>{
    g.appendChild(el('div','sl-cell lab',s));
    let rowTotal=0;
    lobs.forEach(l=>{ const v=(grid[s]||{})[l]||0; rowTotal+=v;
      g.appendChild(el('div','sl-cell'+(v?'':' zero'), v?fmtMoney(v):'—')); });
    g.appendChild(el('div','sl-cell tot', rowTotal?fmtMoney(rowTotal):'—'));
  });
  wrap.appendChild(g);
  return wrap;
}
function field(label,val){ return `<label style="display:block"><span style="font-size:11.5px;color:var(--muted);font-weight:500">${label}</span>
  <input style="width:100%;height:38px;border:1px solid var(--line);border-radius:9px;padding:0 11px;margin-top:5px;background:var(--surface-2)" value="${val}"></label>`; }
function fieldNode(label,val,dataf){
  const wrap = el('label'); wrap.style.display='block';
  wrap.innerHTML = `<span style="font-size:11.5px;color:var(--muted);font-weight:500">${label}</span>`;
  const input = el('input'); input.value=val; input.setAttribute('data-f',dataf);
  input.style.cssText='width:100%;height:38px;border:1px solid var(--line);border-radius:9px;padding:0 11px;margin-top:5px;background:var(--surface-2)';
  wrap.appendChild(input);
  return wrap;
}
function docIc(x){ return `<span class="fi">${x}</span>`; }
function emptyState(msg){ const e=el('div','card pad empty'); e.innerHTML = svg(I.net,34)+`<div style="margin-top:8px">${msg}</div>`; return e; }

/* ---------- form-field renderers: faithful to Southlake's real Add Carrier / Add MGA schema ---------- */
const US_STATES = ['AL','AR','AZ','CA','CO','FL','GA','IL','LA','NM','NY','OK','TX'];
function reqStar(req){ return req ? ' <span style="color:#C0392B">*</span>' : ''; }
function fieldPH(f){
  return `<label style="display:block"><span style="font-size:12.5px;color:var(--text);font-weight:600">${f.label}${reqStar(f.req)}</span>
    <input ${f.id?`id="${f.id}"`:''} placeholder="${f.ph||''}" ${f.disabled?'disabled':''}
      style="width:100%;height:38px;border:1px solid var(--line);border-radius:9px;padding:0 11px;margin-top:6px;background:${f.disabled?'var(--surface-2)':'#fff'};color:var(--text)"></label>`;
}
function selectPH(f){
  const opts = f.options || US_STATES;
  return `<label style="display:block"><span style="font-size:12.5px;color:var(--text);font-weight:600">${f.label}${reqStar(f.req)}</span>
    <select style="width:100%;height:38px;border:1px solid var(--line);border-radius:9px;padding:0 11px;margin-top:6px;background:#fff;color:var(--faint)">
      <option value="" selected disabled>${f.ph||'Select…'}</option>
      ${opts.map(o=>`<option value="${o}">${o}</option>`).join('')}
    </select></label>`;
}
function radioPH(f){
  const gname = 'r_'+f.label.replace(/\s+/g,'_')+'_'+Math.random().toString(36).slice(2,7);
  return `<div><span style="font-size:12.5px;color:var(--text);font-weight:600">${f.label}${reqStar(f.req)}</span>
    <div style="display:flex;gap:20px;margin-top:9px">${f.options.map(o=>`
      <label style="display:flex;align-items:center;gap:7px;font-size:13px;color:var(--text);cursor:pointer">
        <input type="radio" name="${gname}" ${o===f.default?'checked':''} style="accent-color:var(--ok);width:16px;height:16px;margin:0">${o}</label>`).join('')}
    </div></div>`;
}
function renderField(f){
  if(f.type==='select') return selectPH(f);
  if(f.type==='radio') return radioPH(f);
  return fieldPH(f);
}
function renderSection(sec, idx){
  let html = sec.title ? `<div style="font-family:var(--display);font-weight:700;font-size:13.5px;color:var(--text);margin:${idx===0?'0':'22px'} 0 12px;padding-bottom:8px;border-bottom:1px solid var(--line)">${sec.title}</div>` : '';
  html += `<div class="onb-row" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px 18px">${sec.fields.map(renderField).join('')}</div>`;
  if(sec.repeat){
    html += `<button type="button" class="btn sm ghost" data-repeat-add style="margin-top:12px">${sec.addLabel||'+ Add'}</button>
      <div class="onb-empty" style="font-size:12px;color:var(--faint);margin-top:8px">No ${(sec.emptyNoun||'entries')} yet.</div>`;
  }
  return html;
}
function wireRepeats(root){
  root.querySelectorAll('[data-repeat-add]').forEach(btnEl=>{
    btnEl.addEventListener('click', ()=>{
      const row = btnEl.previousElementSibling;
      const emptyMsg = btnEl.nextElementSibling && btnEl.nextElementSibling.classList.contains('onb-empty') ? btnEl.nextElementSibling : null;
      if(row && row.classList.contains('onb-row')){
        const clone = row.cloneNode(true);
        clone.querySelectorAll('input').forEach(i=>i.value='');
        clone.querySelectorAll('select').forEach(s=>s.selectedIndex=0);
        btnEl.parentElement.insertBefore(clone, btnEl);
        if(emptyMsg) emptyMsg.style.display='none';
      }
    });
  });
}
function renderSections(sections){
  return sections.map((sec,idx)=>renderSection(sec, idx)).join('');
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function viewDashboard(){
  const org = currentOrg();
  if(org.type==='INSURED') return viewDashboardSimple(org);
  return viewExecDashboard(org);
}
function viewDashboardSimple(org){
  const p = el('div','page');
  p.appendChild(pageHead(org.name, 'Overview · '+org.user.split(' ')[0],
    'Everything on this page is live sample data. Try the Ask Veridex bar up top.', []));
  const kg = el('div','kgrid');
  kg.innerHTML = kpiCard2('Active Policies',2,{fmt:'raw',caption:'See My policies for detail',color:'#2D5BA8'})+
    kpiCard2('Annual Premium',37500,{caption:'Across all policies',color:'#0E8C6B'})+
    kpiCard2('Referral Rewards',250,{fmt:'raw',deltaPct:20,caption:'points earned',color:'#7A3E9D'});
  p.appendChild(kg);
  return p;
}

function scopedGrid(org, kids){
  if(org.type==='AGENCY'){
    const g={};
    kids.forEach(c=>{ if(DASH_FILTERS.entity && c.id!==DASH_FILTERS.entity) return;
      g[c.state]=g[c.state]||{}; g[c.state][c.class]=(g[c.state][c.class]||0)+parseMoney(c.premium); });
    return g;
  }
  if(DASH_FILTERS.entity){ const e=ORGS[DASH_FILTERS.entity]; return (e&&e.perf&&e.perf.grid)||{}; }
  const g={};
  kids.forEach(k=>{ const kg=(k.perf&&k.perf.grid)||{}; Object.entries(kg).forEach(([st,cls])=>{
    g[st]=g[st]||{}; Object.entries(cls).forEach(([c,v])=>{ g[st][c]=(g[st][c]||0)+v; }); }); });
  return g;
}
function chartDataFor(org){
  if(org.type==='CARRIER') return {
    labels:['Jan','Feb','Mar','Apr','May'],
    written:[23.3,27.9,22.3,29.7,26.0], claims:[12.1,14.4,11.5,15.4,13.5],
    loss:[58,57.5,58,56.5,57.5], expense:[28,28.5,28,29,28.4], combined:[86,86,86,85.5,85.9],
  };
  const base = parseMoney(org.perf.prod)/1e6 || 1;
  const t = org.trend || [55,62,68,75];
  const written = t.map(v=>+(base*(v/100)).toFixed(1));
  const claims = t.map(v=>+(base*0.42*(v/100)).toFixed(1));
  const lr = parseFloat(org.perf.lossRatio)||55;
  const loss = t.map((v,i)=>+(lr+(i-1.5)).toFixed(1));
  const expense = loss.map(v=>+(v*0.5).toFixed(1));
  const combined = loss.map((v,i)=>+(v+expense[i]).toFixed(1));
  return { labels:t.map((v,i)=>'Q'+(i+1)), written, claims, loss, expense, combined };
}
function dashboardKPIs(org, kids){
  if(org.type==='CARRIER') return [
    kpiCard2('Written Premium', 12920000, {deltaPct:12.2, caption:'Budget: $13.76M · 94% attainment', color:'#0D1B4B'}),
    kpiCard2('Earned Premium', 11640000, {deltaPct:9.6, caption:'Earning rate 90.1%', color:'#6C3FC5'}),
    kpiCard2('Unearned Premium', 1280000, {deltaPct:2.2, caption:'Reserve adequacy: Strong', badge:'STRONG', badgeKind:'mute', color:'#146C94'}),
    kpiCard2('Claim Settlement', 6690000, {deltaPct:14.2, caption:'Avg days: 18 · Case+IBNR: $602K', badge:'MONITOR', badgeKind:'warn', color:'#C0392B'}),
    kpiCard2('Loss Ratio', 57.5, {fmt:'pct', deltaPct:-2.1, badDirection:true, caption:'Target ≤65.0%', badge:'ON TRACK', badgeKind:'ok', color:'#E05470'}),
    kpiCard2('Expense Ratio', 28.4, {fmt:'pct', deltaPct:0.3, dir:'flat', caption:'Target ≤30.0%', badge:'ON TRACK', badgeKind:'ok', color:'#7A3E9D'}),
    kpiCard2('Combined Ratio', 85.9, {fmt:'pct', deltaPct:-1.8, badDirection:true, caption:'Target ≤95.0%', badge:'EXCELLENT', badgeKind:'ok', color:'#0E8C6B'}),
  ].join('');
  if(org.type==='MGA'){
    const bound = parseMoney(org.perf.prod), growth = parseFloat(org.perf.growth)||0, lr = parseFloat(org.perf.lossRatio)||0;
    return [
      kpiCard2('Bound Premium', bound, {deltaPct:growth, caption:`${kids.length} active agencies`, color:'#0D1B4B'}),
      kpiCard2('Earned Premium', bound*0.88, {deltaPct:growth-2, caption:'Earning rate 88%', color:'#6C3FC5'}),
      kpiCard2('Commission Earned', bound*0.15, {deltaPct:growth, caption:'Avg 15% commission rate', color:'#146C94'}),
      kpiCard2('Loss Ratio', lr, {fmt:'pct', deltaPct:-1.4, badDirection:true, caption:'Target ≤65.0%', badge: lr<=60?'ON TRACK':'MONITOR', badgeKind: lr<=60?'ok':'warn', color:'#E05470'}),
      kpiCard2('Active Agencies', kids.length, {fmt:'raw', caption:'In your downline', color:'#C0392B'}),
      kpiCard2('Open Leads', LEADS.length, {fmt:'raw', caption:'Across all agencies', color:'#0E8C6B'}),
    ].join('');
  }
  const placed = parseMoney(org.perf.prod), growth = parseFloat(org.perf.growth)||0, custCount = kids.length;
  return [
    kpiCard2('Placed Premium', placed, {deltaPct:growth, caption:`${custCount} active customers`, color:'#0D1B4B'}),
    kpiCard2('Avg Policy Premium', placed/Math.max(custCount,1), {caption:'Per customer average', color:'#6C3FC5'}),
    kpiCard2('Open Leads', LEADS.length, {fmt:'raw', caption:'In your pipeline', color:'#146C94'}),
    kpiCard2('Customers', custCount, {fmt:'raw', caption:`${(org.licensedStates||[]).length} states licensed`, color:'#C0392B'}),
    kpiCard2('Markets Appointed', uplineChain(org.id).length, {fmt:'raw', caption:'MGA + carrier relationships', color:'#0E8C6B'}),
  ].join('');
}
function actionCenterPanel(org){
  const alerts = collectAlerts(org);
  const c = el('div','card');
  c.innerHTML = `<div class="card-h"><h3>Action Center</h3><span class="hint">${alerts.length} item${alerts.length===1?'':'s'} need attention</span></div>`;
  const body = el('div','pad');
  if(!alerts.length){ body.innerHTML = '<div class="empty">Nothing needs attention right now — clean bill of health.</div>'; }
  else {
    const tbl = el('table','tbl');
    tbl.innerHTML = `<thead><tr><th>Item</th><th>Entity</th><th>Priority</th><th></th></tr></thead>`;
    const tb = el('tbody');
    alerts.forEach(a=>{ const tr=el('tr');
      tr.innerHTML = `<td>${a.text}</td><td class="mono">${a.meta}</td><td><span class="pill warn">Review</span></td><td><button class="btn sm">Resolve</button></td>`;
      tb.appendChild(tr); });
    tbl.appendChild(tb); body.appendChild(tbl);
    tbl.addEventListener('click', e=>{ if(e.target.matches('button')) toast('Marked as reviewed'); });
  }
  c.appendChild(body);
  return c;
}
function contributionsPanel(org, kids, entityLabel){
  const c = el('div','card');
  c.innerHTML = `<div class="card-h"><h3>${entityLabel} Contributions</h3><span class="hint">share of total production</span></div>`;
  const body = el('div','pad');
  if(!kids.length){ body.innerHTML = `<div class="empty">No ${entityLabel.toLowerCase()}s yet — onboard your first one.</div>`; c.appendChild(body); return c; }
  const vals = kids.map(k=>parseMoney(k.perf?k.perf.prod:k.premium));
  const total = vals.reduce((a,b)=>a+b,0)||1;
  const bars = el('div','bars');
  kids.forEach((k,i)=>{ const pct=Math.round((vals[i]/total)*100); const r=el('div','bar-row');
    r.innerHTML = `<span>${k.name}</span><div class="bar-track"><div class="bar-fill" data-w="${pct}%"></div></div><span class="bv">${pct}%</span>`;
    bars.appendChild(r); });
  body.appendChild(bars);
  const cta = btn(`Open full ${entityLabel.toLowerCase()} performance`, I.chart, 'sm', ()=>{ VIEW='performance'; buildShell(); render(); });
  cta.style.marginTop='14px'; body.appendChild(cta);
  c.appendChild(body);
  return c;
}

function viewExecDashboard(org){
  const p = el('div','page');
  p.appendChild(pageHead(org.name, 'Executive Dashboard', 'Financials & Operations Overview · Updated just now',
    [ btn('Ask Veridex',I.bolt,'primary',()=>openDrawer()), btn('Refresh','','',()=>render()) ]));

  const kids = childrenOf(org.id);
  const entityLabel = org.type==='CARRIER'?'MGA':org.type==='MGA'?'Agency':'Customer';
  const entities = kids.map(k=>[k.id,k.name]);
  const allStates = [...new Set(kids.flatMap(k=>k.licensedStates||(k.state?[k.state]:[])))].sort();
  const allLobs = [...new Set(kids.flatMap(k=>k.classes||(k.class?[k.class]:[])))].sort();
  p.appendChild(toolbarStrip({ entityLabel, entities, states:allStates, lobs:allLobs, onChange:render }));

  const monthLabel = new Date().toLocaleDateString('en-US',{month:'short',year:'numeric'});
  p.appendChild(tabStrip([
    ['home','Home / Metrics'],
    ['action','Action Center', countAlerts(org)||null],
    ['contrib', entityLabel+' Contributions'],
  ], DASH_TAB, id=>{ DASH_TAB=id; render(); }, `Period: ${PERIOD} ${monthLabel}`));

  if(DASH_TAB==='action'){ p.appendChild(actionCenterPanel(org)); return p; }
  if(DASH_TAB==='contrib'){ p.appendChild(contributionsPanel(org, kids, entityLabel)); return p; }

  // ---- Home / Metrics ----
  const fvRow = el('div'); fvRow.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:10px';
  const fvLeft = el('div'); fvLeft.style.cssText='display:flex;align-items:center;gap:10px';
  fvLeft.innerHTML = `<span class="tb-lbl">Financials View</span>`;
  const fvSeg = el('div','seg');
  ['Gross','Ceded','Net'].forEach(v=>{ const b=el('button',v===FIN_VIEW?'on':'',v); b.onclick=()=>{ FIN_VIEW=v; render(); }; fvSeg.appendChild(b); });
  fvLeft.appendChild(fvSeg); fvRow.appendChild(fvLeft);
  const fvHint = el('span'); fvHint.style.cssText='font-size:11.5px;color:var(--faint)';
  fvHint.textContent = `All figures in $ · ${PERIOD} vs Prior ${PERIOD}`;
  fvRow.appendChild(fvHint);
  p.appendChild(fvRow);

  if(org.type==='AGENCY'){
    const quick = el('div','card pad'); quick.style.marginBottom='16px';
    quick.innerHTML = `<div style="font-family:var(--display);font-weight:600;font-size:14px;margin-bottom:12px">Quick actions</div>`;
    const qrow = el('div'); qrow.style.cssText='display:flex;flex-wrap:wrap;gap:10px';
    qrow.appendChild(btn('Onboard a customer',I.add,'sm primary',()=>{VIEW='onboarding';buildShell();render();}));
    qrow.appendChild(btn('View customer book',I.chart,'sm',()=>{VIEW='performance';buildShell();render();}));
    qrow.appendChild(btn('Track my leads',I.route,'sm',()=>{VIEW='leads';buildShell();render();}));
    qrow.appendChild(btn('Connect my CRM',I.plug,'sm',()=>{VIEW='crm';buildShell();render();}));
    qrow.appendChild(btn('Branding for my agency',I.palette,'sm',()=>{VIEW='branding';buildShell();render();}));
    quick.appendChild(qrow); p.appendChild(quick);
  }

  const kg = el('div','kgrid');
  kg.innerHTML = dashboardKPIs(org, kids);
  p.appendChild(kg);

  const cd = chartDataFor(org);
  const chartRow = el('div','chartrow'); chartRow.style.marginTop='16px';
  chartRow.appendChild(chartCard(org.type==='CARRIER'?'Written Premium Trend':'Premium Trend', `Gross Written · ${PERIOD} ${monthLabel}`,
    svgBarChart(cd.labels, cd.written, {color:'var(--accent)', fmt:v=>'$'+v+'M'}),
    [{name:org.type==='CARRIER'?'Written Premium':'Premium', color:'var(--accent)'}]));
  chartRow.appendChild(chartCard(org.type==='CARRIER'?'Claim Settlement Trend':'Activity Trend', `${org.type==='CARRIER'?'Gross Settlement':'Bound count index'} · ${PERIOD} ${monthLabel}`,
    svgBarChart(cd.labels, cd.claims, {color:'#0E8C6B', fmt:v=>'$'+v+'M'}),
    [{name:org.type==='CARRIER'?'Claims Settled':'Activity', color:'#0E8C6B'}]));
  chartRow.appendChild(chartCard('Ratio Trend', `Loss · Expense · Combined · ${PERIOD} ${monthLabel}`,
    svgLineChart(cd.labels, [{name:'Loss',color:'#C0392B',values:cd.loss},{name:'Expense',color:'#B7791F',values:cd.expense},{name:'Combined',color:'#14243D',values:cd.combined}]),
    [{name:'Loss',color:'#C0392B'},{name:'Expense',color:'#B7791F'},{name:'Combined',color:'#14243D'}]));
  p.appendChild(chartRow);

  const grid = scopedGrid(org, kids);
  let gStates = Object.keys(grid), gLobs = [...new Set(gStates.flatMap(s=>Object.keys(grid[s])))];
  if(DASH_FILTERS.state) gStates = gStates.filter(s=>s===DASH_FILTERS.state);
  if(DASH_FILTERS.lob) gLobs = gLobs.filter(l=>l===DASH_FILTERS.lob);
  const gc = el('div','card'); gc.style.marginTop='16px';
  gc.innerHTML = `<div class="card-h"><h3>Production by state × line of business</h3><span class="hint">${DASH_FILTERS.entity?ORGS[DASH_FILTERS.entity].name:'all '+entityLabel.toLowerCase()+'s'} · ${PERIOD}</span></div>`;
  const gcBody = el('div','pad');
  if(gStates.length && gLobs.length) gcBody.appendChild(stateLobGrid(grid, gStates, gLobs));
  else gcBody.appendChild(el('div','empty','No production recorded for this selection.'));
  gc.appendChild(gcBody); p.appendChild(gc);

  const row = el('div','grid g2'); row.style.marginTop='16px';
  const c2 = el('div','card');
  c2.innerHTML = `<div class="card-h"><h3>Recent activity</h3><span class="hint">network</span></div>`;
  const body2 = el('div','pad'); const feed = el('div','feed');
  [[I.add,'<b>Links</b> completed onboarding','TX · commercial auto · 2h ago'],
   [I.route,'New lead <b>Vela Freight Co</b> captured from campaign','TX · trucking · 5h ago'],
   [I.mega,'Broadcast <b>“TX cargo appetite”</b> delivered to 4 agencies','yesterday'],
   [I.check,'<b>Rincon Builders</b> bound · $22k premium','1d ago'],
   [I.shield,'E&O certificate for <b>Gulf Coast Agency</b> expires in 21 days','action needed']].forEach(([ic,tx,mt])=>{
    const f=el('div','feed-item'); f.innerHTML=`<span class="feed-dot">${svg(ic,15)}</span><div><div class="ft">${tx}</div><div class="fm">${mt}</div></div>`;
    feed.appendChild(f); });
  body2.appendChild(feed); c2.appendChild(body2); row.appendChild(c2);
  row.appendChild(contributionsPanel(org, kids, entityLabel));
  p.appendChild(row);

  const ex = onboardingExample(org);
  const exCard = aiExampleCard('AI onboarding, in one click', 'live example — click below to run it for real', ex.steps, ex.cta, ()=>{ openDrawer(); runIntent(ex.intent); });
  exCard.style.marginTop='16px';
  p.appendChild(exCard);
  return p;
}
function onboardingExample(org){
  if(org.type==='CARRIER') return {
    intent:'onboard Crestline Underwriters as an MGA for trucking in Texas', cta:'Try onboarding an MGA',
    steps:[['me','“Onboard Crestline Underwriters as an MGA for trucking in Texas”'],
      ['ai','Got it — I\'ll need their delegated authority agreement, E&O certificate and W-9. Drop the first one and I\'ll verify it against NIPR and the Secretary of State.'],
      ['ai','<b>Verified.</b> Crestline Underwriters LLC · TX · trucking authority confirmed. Agreement sent for e-signature — the relationship is now live.']] };
  if(org.type==='MGA') return {
    intent:'onboard Summit Specialty as an agency for trucking in Texas', cta:'Try onboarding an agency',
    steps:[['me','“Onboard Summit Specialty as an agency for trucking in Texas”'],
      ['ai','I\'ll need their state producer licence, W-9 and E&O certificate. Drop the licence and I\'ll verify it.'],
      ['ai','<b>Verified.</b> Summit Specialty LLC · TX · trucking authority confirmed. Distribution agreement sent for e-signature.']] };
  if(org.type==='AGENCY') return {
    intent:'onboard a customer and send a portal link', cta:'Try onboarding a customer',
    steps:[['me','“Onboard a customer and send a portal link”'],
      ['ai','Just a name and an email — I\'ll send a magic-link login right away.'],
      ['ai','<b>Sent.</b> Harbor Point LLC now has portal access to view policies and refer friends.']] };
  return { intent:'refer a business to my agency', cta:'Try a referral',
    steps:[['me','“Refer a business to my agency”'],
      ['ai','Tell me the business name and what they need, and I\'ll route it to your agency with your name attached.'],
      ['ai','<b>Sent.</b> If it binds, you earn referral rewards.']] };
}
function aiExampleCard(title, hint, steps, ctaLabel, ctaFn){
  const c = el('div','card');
  c.innerHTML = `<div class="card-h"><h3>${title}</h3><span class="hint">${hint}</span></div>`;
  const body = el('div','pad');
  const chat = el('div'); chat.style.cssText='display:flex;flex-direction:column;gap:10px;margin-bottom:14px';
  steps.forEach(([who,html])=>{
    const m = el('div','msg '+(who==='ai'?'ai':'me'));
    m.innerHTML = `<div class="m-av">${who==='ai'?'V':currentOrg().uinit}</div><div class="m-body"><div class="bubble">${html}</div></div>`;
    chat.appendChild(m);
  });
  body.appendChild(chat);
  body.appendChild(btn(ctaLabel, I.bolt, 'primary', ctaFn));
  c.appendChild(body);
  return c;
}

/* ============================================================
   NETWORK (hierarchy-aware, real filters)
   ============================================================ */
function applyNetFilters(list){
  return list.filter(o=>{
    if(NET_FILTERS.state && o.state!==NET_FILTERS.state) return false;
    if(NET_FILTERS.cls && !(o.classes||[]).includes(NET_FILTERS.cls)) return false;
    if(NET_FILTERS.line && !(o.lines||[]).includes(NET_FILTERS.line)) return false;
    if(NET_FILTERS.status && o.status!==NET_FILTERS.status) return false;
    if(NET_FILTERS.q && !o.name.toLowerCase().includes(NET_FILTERS.q.toLowerCase())) return false;
    return true;
  });
}
function buildFilterBar(kids, onChange){
  const states=[...new Set(kids.map(k=>k.state))].sort();
  const classes=[...new Set(kids.flatMap(k=>k.classes||[]))].sort();
  const lines=[...new Set(kids.flatMap(k=>k.lines||[]))].sort();
  const bar = el('div','card pad fbar');
  function sel(label,opts,key){
    const s = el('select');
    s.innerHTML = `<option value="">${label}: All</option>`+opts.map(o=>`<option value="${o}" ${NET_FILTERS[key]===o?'selected':''}>${o}</option>`).join('');
    s.onchange=()=>{ NET_FILTERS[key]=s.value; onChange(); };
    return s;
  }
  bar.appendChild(sel('State',states,'state'));
  bar.appendChild(sel('Class',classes,'cls'));
  bar.appendChild(sel('Line',lines,'line'));
  bar.appendChild(sel('Status',['ok','warn','bad'],'status'));
  const q = el('input'); q.type='text'; q.placeholder='Search name…'; q.value=NET_FILTERS.q;
  q.oninput=()=>{ NET_FILTERS.q=q.value; onChange(); };
  bar.appendChild(q);
  const clear = btn('Clear filters','','sm',()=>{ NET_FILTERS={state:'',cls:'',line:'',status:'',q:''}; render(); });
  bar.appendChild(clear);
  return bar;
}

function viewNetwork(){
  const org = currentOrg();
  const p = el('div','page');

  if(org.type==='AGENCY'){
    const chain = uplineChain(org.id);
    p.appendChild(pageHead('Network','My markets',
      'The MGAs and carriers you place business through. Appointments here are managed by your MGA — ask Veridex to help you request an additional market.',
      [ btn('Ask Veridex',I.bolt,'primary',()=>{ openDrawer(); runIntent('find a market for a trucking risk'); }) ]));
    const c = el('div','card');
    c.innerHTML = `<div class="card-h"><h3>Markets</h3><span class="hint">${chain.length} in your chain</span></div>`;
    const tbl = el('table','tbl');
    tbl.innerHTML = `<thead><tr><th>Market</th><th>Type</th><th>Home</th><th>Lines</th><th>Status</th></tr></thead>`;
    const tb = el('tbody');
    chain.forEach(m=>{ const tr=el('tr');
      tr.innerHTML = `<td><div class="co">${av(m.name,m.color)}<b>${m.name}</b></div></td><td><span class="pill mute plain">${m.type}</span></td>
        <td class="mono">${m.state}</td><td>${lineChips(m.lines)}</td><td><span class="pill ${m.status}">${m.statusL}</span></td>`;
      tb.appendChild(tr); });
    tbl.appendChild(tb); c.appendChild(tbl); p.appendChild(c);
    return p;
  }

  const kids = childrenOf(org.id);
  const childLabel = org.type==='CARRIER'?'MGA':'agency';
  p.appendChild(pageHead('Network', org.type==='CARRIER'?'MGA network':'Agency network',
    org.type==='CARRIER' ? 'Every connection is its own relationship carrying its own states, lines and classes. A carrier appoints MGAs; agencies sit one level below, inside each MGA\'s own downline.'
      : 'Every connection is its own relationship carrying its own states, lines and classes. An MGA appoints agencies; each agency brings its own customers.',
    [ btn(`Onboard ${childLabel==='MGA'?'an MGA':'an agency'}`,I.add,'primary',()=>{VIEW='onboarding';buildShell();render();}) ]));

  const gcard = el('div','card');
  gcard.innerHTML = `<div class="card-h"><h3>Relationship graph</h3><span class="hint">${org.name} at the centre</span></div>`;
  const gbody = el('div','pad'); const net = el('div','netwrap');
  gbody.appendChild(net); gcard.appendChild(gbody); p.appendChild(gcard);

  const fbar = buildFilterBar(kids, ()=>draw());
  p.appendChild(fbar);

  const tcard = el('div','card');
  tcard.innerHTML = `<div class="card-h"><h3>${childLabel==='MGA'?'MGAs':'Agencies'}</h3><span class="hint" id="netCount"></span></div>`;
  const table = el('table','tbl'); const twrap = el('div'); twrap.appendChild(table); tcard.appendChild(twrap);
  p.appendChild(tcard);

  function draw(){
    const filtered = applyNetFilters(kids);
    tcard.querySelector('#netCount').textContent = `${filtered.length} of ${kids.length} connected`;
    const R=38, cx=50, cy=50;
    const shown = filtered.slice(0,6);
    const nodes=[{name:org.name,color:org.color,x:cx,y:cy,center:true,role:org.role}];
    shown.forEach((o,i)=>{ const a=(Math.PI*2*i/Math.max(shown.length,1))-Math.PI/2;
      nodes.push({name:o.name,color:o.color,role:o.type,x:cx+Math.cos(a)*R,y:cy+Math.sin(a)*R*0.82}); });
    net.innerHTML = `<svg class="edges" viewBox="0 0 100 100" preserveAspectRatio="none">${nodes.slice(1).map(n=>`<line x1="${cx}" y1="${cy}" x2="${n.x}" y2="${n.y}" stroke="${n.color==='carrier'?'var(--accent)':'var(--line-strong)'}" stroke-width="${n.color==='carrier'?0.6:0.4}" stroke-dasharray="${n.color==='carrier'?'0':'1.4 1.4'}"/>`).join('')}</svg>`;
    nodes.forEach(n=>{ const d=el('div','node'); d.style.left=n.x+'%'; d.style.top=n.y+'%';
      d.innerHTML=`<div class="nd" style="background:${COLORS[n.color]};${n.center?'width:64px;height:64px;font-size:18px;':''}">${ini(n.name)}</div>
        <div class="nl">${n.name}</div><div class="nr">${n.role}</div>`;
      net.appendChild(d); });
    if(!shown.length) net.appendChild(el('div','empty','No matches for these filters.'));

    table.innerHTML = `<thead><tr><th>${childLabel==='MGA'?'MGA':'Agency'}</th><th>Type</th><th>Home</th><th>States</th><th>Lines</th><th>Classes</th><th>Status</th><th></th></tr></thead>`;
    const tb=el('tbody');
    filtered.forEach(o=>{ const tr=el('tr');
      tr.innerHTML=`<td><div class="co">${av(o.name,o.color)}<div><b>${o.name}</b><small>NPN ${o.npn}</small></div></div></td>
        <td><span class="pill mute plain">${o.type}</span></td><td class="mono">${o.state}</td><td class="mono">${o.stateCount||1}</td>
        <td><div class="tag-src">${lineChips(o.lines)}</div></td>
        <td>${(o.classes||[]).map(c=>`<span class="chip">${c}</span>`).join(' ')}</td>
        <td><span class="pill ${o.status}">${o.statusL}</span></td>
        <td><button class="btn sm rowbtn" data-n="${o.id}">Partner 360 ${svg(I.chev,13)}</button></td>`;
      tb.appendChild(tr); });
    table.appendChild(tb);
    table.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>partner360(b.dataset.n));
  }
  draw();
  return p;
}

function partner360(orgId){
  const o = ORGS[orgId]; if(!o) return;
  const kidsCount = childrenOf(o.id).length;
  const actions = o.perf ? [['Close','',closeModal],['View performance','primary',()=>{ closeModal(); VIEW='performance'; buildShell(); render(); }]] : undefined;
  openModal(`Partner 360 · ${o.name}`, `
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
      <span style="width:52px;height:52px;font-size:17px;background:${COLORS[o.color]};color:#fff;border-radius:12px;display:grid;place-items:center;font-family:var(--display);font-weight:600;flex:0 0 auto">${ini(o.name)}</span>
      <div><div style="font-family:var(--display);font-weight:600;font-size:17px">${o.name}</div>
      <div style="color:var(--muted);font-size:12.5px">${o.type} · Home ${o.state} · NPN ${o.npn} · partner since ${o.since}</div></div>
      <span class="pill ${o.status}" style="margin-left:auto">${o.statusL}</span></div>
    <div class="grid g3" style="margin-bottom:14px">
      <div class="card pad"><div class="k-lbl">States authorised</div><div class="k-val" style="font-size:22px">${o.stateCount||1}</div></div>
      <div class="card pad"><div class="k-lbl">Production YTD</div><div class="k-val" style="font-size:22px">${o.perf?o.perf.prod:(o.premium||'—')}</div></div>
      <div class="card pad"><div class="k-lbl">${o.type==='AGENCY'?'Customers':'Downline'}</div><div class="k-val" style="font-size:22px">${kidsCount}</div></div>
    </div>
    <div style="font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin:6px 0 8px">Authorised lines of business</div>
    <div class="tag-src" style="margin-bottom:14px">${(o.lines||[]).map(l=>`<span class="chip code" title="${LINE_NAMES[l]||''}">${l} · ${LINE_NAMES[l]||''}</span>`).join(' ')}</div>
    <div style="font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin:6px 0 8px">Classes of business</div>
    <div>${(o.classes||[]).map(c=>`<span class="chip on">${c}</span>`).join(' ')}</div>
    <div class="callout" style="margin-top:16px"><span class="ci">${svg(I.bolt,18)}</span><div class="ct">
      This 360 view is assembled from the relationship edge and each party's licence and appointment footprint.</div></div>
  `, actions);
}

/* ============================================================
   ONBOARDING (hierarchy-aware: carrier→MGA, MGA→agency, agency→customer)
   ============================================================ */
function viewOnboarding(){
  const p = el('div','page');
  const k = targetKind();
  const isCust = k.type==='INSURED';
  p.appendChild(pageHead('Onboarding', isCust?'Onboard a customer':`Onboard an ${k.label}`,
    isCust ? 'Add an insured to your portal manually, or send them a signup link. The AI can drive either path.'
      : `Bring a new ${k.label} onto the network. Choose manual entry or an AI-guided invite — both end in a verified, audited record. ${k.type==='MGA'?'Carriers appoint MGAs; MGAs in turn build their own agency downline.':'MGAs appoint agencies; each agency then brings on its own customers.'}`,
    [ btn('Do it with AI',I.bolt,'primary',()=>{ openDrawer(); runIntent(isCust?'onboard a customer and send a portal link':`onboard ${k.sample} as ${k.type==='MGA'?'an MGA':'an agency'} for trucking in Texas`); }) ]));

  const g = el('div','grid g2');
  [['Manual entry','Fill the fields yourself. Fastest for staff who know the details.',I.doc,'Start manual form'],
   ['AI-guided invite','Describe it in plain language. The assistant gathers details, verifies documents, and prepares the invite.',I.bolt,'Ask Veridex']].forEach(([t,d,ic,cta],i)=>{
    const c=el('div','card pad');
    c.innerHTML=`<div class="k-ic" style="width:40px;height:40px">${svg(ic,20)}</div>
      <div style="font-family:var(--display);font-weight:600;font-size:15px;margin-top:12px">${t}</div>
      <p style="color:var(--muted);font-size:13px;margin:6px 0 14px">${d}</p>`;
    const b=btn(cta, i?I.bolt:I.chev, i?'primary':'', ()=> i? (openDrawer(),runIntent(isCust?'onboard a customer and send a portal link':`onboard ${k.sample} as ${k.type==='MGA'?'an MGA':'an agency'} for trucking in Texas`)) : openManualForm(k));
    c.appendChild(b); g.appendChild(c);
  });
  p.appendChild(g);

  const pc = el('div','card'); pc.style.marginTop='16px';
  pc.innerHTML = `<div class="card-h"><h3>Onboarding profile · ${isCust?'Customer':k.label}</h3><span class="hint">configuration, not code</span></div>`;
  const pb = el('div'); const tbl=el('table','tbl');
  const rows = [['Target type', isCust?'Insured (individual)':k.label],['Required fields',k.required],['Documents',k.documents],
    ['Verification',k.verification],['Agreement',k.agreement],['Result',k.result]];
  tbl.innerHTML = `<tbody>${rows.map(([kk,v])=>`<tr><td style="color:var(--muted);width:34%">${kk}</td><td><b>${v}</b></td></tr>`).join('')}</tbody>`;
  pb.appendChild(tbl); pc.appendChild(pb); p.appendChild(pc);

  if(CURRENT==='carrier'){
    const cc = el('div','card'); cc.style.marginTop='16px';
    cc.innerHTML = `<div class="card-h"><h3>Carriers</h3><span class="hint">underlying risk-bearing carriers on file · master data</span><span class="sp"></span></div>`;
    const addBtn = btn('+ Add Carrier', I.add, 'sm primary', openAddCarrierModal);
    cc.querySelector('.sp').appendChild(addBtn);
    const cb = el('div'); const ctbl = el('table','tbl');
    ctbl.innerHTML = `<thead><tr><th>Code</th><th>Name</th><th>NAICS</th><th>Type</th><th>Home</th><th>Status</th></tr></thead>
      <tbody>${CARRIER_MASTERS.map(c=>`<tr><td class="mono">${c.code}</td><td><b>${c.name}</b></td><td class="mono">${c.naics}</td>
        <td><span class="pill mute plain">${c.type}</span></td><td class="mono">${c.state}</td><td><span class="pill ${c.status}">Active</span></td></tr>`).join('')}</tbody>`;
    cb.appendChild(ctbl); cc.appendChild(cb); p.appendChild(cc);
  }
  return p;
}

function openManualForm(k){
  const isCust = k.type==='INSURED';
  const body = isCust ? `
    <div class="grid g2" style="gap:12px">${k.fields.map(([l,v])=>field(l,v)).join('')}</div>
    <div class="callout" style="margin-top:14px"><span class="ci">${svg(I.check,18)}</span>
      <div class="ct">On save, the customer gets a magic-link login to view policies and refer friends.</div></div>`
    : renderSections(k.sections) + `
    <div style="margin:20px 0 6px;font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint)">Documents (uploaded manually)</div>
    ${k.docs.map(d=>`<div class="doc-chip">${docIc('PDF')}<span>${k.sample.replace(/\s+/g,'_')}_${d.replace(/\s+/g,'_')}.pdf</span><span class="pill ok" style="margin-left:6px">verified</span></div>`).join('')}`;
  openModal(isCust?'Manual customer onboarding':`Manual ${k.label.toLowerCase()} onboarding`, body, [
    ['Cancel','',closeModal],
    [isCust?'Add customer':'Onboard & send agreement','primary',()=>{
      const nameInput = document.getElementById('onbPrimaryName');
      const finalName = (nameInput && nameInput.value.trim()) || k.sample;
      closeModal();
      if(!isCust){ createOrgFromOnboarding(k, finalName); buildShell(); if(VIEW==='network'||VIEW==='performance') render(); }
      else { createCustomerOrg(finalName); if(VIEW==='performance') render(); }
      toast(isCust?'Customer added':`${finalName} onboarded`, isCust?'Portal invite sent':'Agreement out for e-signature'); render(); }]
  ], isCust ? {} : { width:'820px', afterMount: wireRepeats });
}

/* ============================================================
   PERFORMANCE — MGA performance / Agency performance / Customer book
   state × class-of-business breakdowns, drill-in rollups
   ============================================================ */
function showGrid(o){
  openModal(`${o.name} · state × class of business`,
    `<div style="margin-bottom:10px;color:var(--muted);font-size:12.5px">Bound premium by state and class of business.</div>${matrixHtml(o.perf&&o.perf.grid)}`);
}
function drillInto(o){
  const kids = childrenOf(o.id);
  if(!kids.length){ openModal(`${o.name} · downline`, `<div class="empty">No ${o.type==='MGA'?'agencies':'customers'} yet.</div>`); return; }
  let rows;
  if(o.type==='MGA'){
    rows = kids.map(a=>`<tr><td><div class="co">${av(a.name,a.color)}<b>${a.name}</b></div></td><td class="mono">${a.state}</td><td class="mono">${a.perf.prod}</td><td><span class="pill ${a.status}">${a.statusL}</span></td></tr>`).join('');
    openModal(`${o.name} · agencies (read-only rollup)`, `<table class="tbl"><thead><tr><th>Agency</th><th>Home</th><th>Production</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>`);
  } else {
    rows = kids.map(c=>`<tr><td><div class="co">${av(c.name,'insured')}<b>${c.name}</b></div></td><td class="mono">${c.state}</td><td><span class="chip">${c.class}</span></td><td class="mono">${c.premium}</td></tr>`).join('');
    openModal(`${o.name} · customers (read-only rollup)`, `<table class="tbl"><thead><tr><th>Customer</th><th>State</th><th>Class</th><th>Premium</th></tr></thead><tbody>${rows}</tbody></table>`);
  }
}

function viewPerformance(){
  const org = currentOrg();
  const p = el('div','page');
  const label = org.type==='CARRIER' ? 'MGA performance' : org.type==='MGA' ? 'Agency performance' : 'Customer book';
  const desc = org.type==='CARRIER' ? 'Production, growth and loss ratio for every MGA in your network, broken down by state and class of business.'
    : org.type==='MGA' ? 'Production, growth and loss ratio for every agency in your downline, broken down by state and class of business.'
    : 'Every customer in your book, with state, class of business, coverages and premium.';
  p.appendChild(pageHead('Performance', label, desc,
    [ btn('Ask Veridex',I.bolt,'primary',()=>{ openDrawer();
      runIntent(org.type==='AGENCY' ? 'show me my top customers by premium' : `which ${org.type==='CARRIER'?'MGA':'agency'} has the best loss ratio?`); }) ]));

  const kids = childrenOf(org.id);
  if(!kids.length){ p.appendChild(emptyState(`No ${org.type==='CARRIER'?'MGAs':org.type==='MGA'?'agencies':'customers'} yet. Head to Onboarding to add your first one.`)); return p; }

  if(org.type==='AGENCY'){
    const c = el('div','card');
    c.innerHTML = `<div class="card-h"><h3>Customers</h3><span class="hint">${kids.length} in book</span></div>`;
    const tbl = el('table','tbl');
    tbl.innerHTML = `<thead><tr><th>Customer</th><th>State</th><th>Class</th><th>Coverages</th><th>Premium</th><th>Status</th></tr></thead>`;
    const tb = el('tbody');
    kids.forEach(cst=>{ const tr=el('tr');
      tr.innerHTML=`<td><div class="co">${av(cst.name,'insured')}<b>${cst.name}</b></div></td><td class="mono">${cst.state}</td>
        <td><span class="chip">${cst.class}</span></td><td>${(cst.coverages||[]).map(cv=>`<span class="chip">${cv}</span>`).join(' ')}</td>
        <td class="mono">${cst.premium}</td><td><span class="pill ${cst.status}">${cst.statusL}</span></td>`;
      tb.appendChild(tr); });
    tbl.appendChild(tb); c.appendChild(tbl); p.appendChild(c);
    return p;
  }

  const cardsWrap = el('div','grid g2');
  kids.forEach(o=>{
    const c = el('div','card pad');
    const dc = childrenOf(o.id).length;
    c.innerHTML = `<div style="display:flex;align-items:center;gap:12px">
        ${av(o.name,o.color)}
        <div><div style="font-family:var(--display);font-weight:600">${o.name}</div>
        <div style="font-size:11.5px;color:var(--muted)">${o.state} · ${dc} ${org.type==='CARRIER'?'agencies':'customers'}</div></div>
        <span class="pill ${o.status}" style="margin-left:auto">${o.statusL}</span></div>
      <div class="grid g3" style="margin-top:12px;gap:8px">
        <div><div class="k-lbl">Production</div><div style="font-family:var(--display);font-weight:600;font-size:16px">${o.perf.prod}</div></div>
        <div><div class="k-lbl">Growth</div><div style="font-family:var(--display);font-weight:600;font-size:16px;color:${o.perf.growth.startsWith('-')?'var(--bad)':'var(--ok)'}">${o.perf.growth}</div></div>
        <div><div class="k-lbl">Loss ratio</div><div style="font-family:var(--display);font-weight:600;font-size:16px">${o.perf.lossRatio}</div></div>
      </div>`;
    const btnRow = el('div'); btnRow.style.cssText='margin-top:12px;display:flex;gap:8px';
    btnRow.appendChild(btn('State × class breakdown',I.chart,'sm',()=>showGrid(o)));
    btnRow.appendChild(btn(org.type==='CARRIER'?'View agencies':'View customers',I.chev,'sm ghost',()=>drillInto(o)));
    c.appendChild(btnRow);
    cardsWrap.appendChild(c);
  });
  p.appendChild(cardsWrap);
  return p;
}

/* ============================================================
   BRANDING & PARTNER INVITES
   ============================================================ */
function brandPreviewHtml(o){
  const mark1 = o.brand.logoSvg ? `<span style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,.22);display:grid;place-items:center;padding:4px">${o.brand.logoSvg}</span>`
    : `<span style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,.22);display:grid;place-items:center;font-family:var(--display);font-weight:700;font-size:12px">${o.brand.logoText||ini(o.name)}</span>`;
  const mark2 = o.brand.logoSvg ? `<span style="width:40px;height:40px;border-radius:10px;background:#fff;border:1px solid var(--line);display:grid;place-items:center;padding:5px">${o.brand.logoSvg}</span>`
    : `<span style="width:40px;height:40px;border-radius:10px;background:${o.brand.accent};color:#fff;display:grid;place-items:center;font-family:var(--display);font-weight:600">${o.brand.logoText||ini(o.name)}</span>`;
  return `<div style="border:1px solid var(--line);border-radius:14px;overflow:hidden">
    <div style="padding:14px 16px;background:${o.brand.accent};color:#fff;display:flex;align-items:center;gap:10px">
      ${mark1}
      <div><div style="font-family:var(--display);font-weight:700;font-size:14px">${o.name}</div><div style="font-size:11px;opacity:.85">${o.brand.tagline||'Powered by Veridex'}</div></div>
    </div>
    <div style="padding:16px;background:${o.brand.bg||'#F4F6F9'}">
      <div style="font-size:11.5px;color:var(--muted);margin-bottom:8px">Portal sign-in preview</div>
      <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--line);border-radius:11px;background:#fff">
        ${mark2}
        <div><div style="font-family:var(--display);font-weight:600;font-size:13.5px">${o.name} portal</div><div style="font-size:11.5px;color:var(--muted)">Theme: ${o.brand.theme}</div></div>
      </div>
    </div>
  </div>`;
}
function openInvitePreview(org){
  const link = `https://app.veridex.io/invite/${org.id}-${Math.random().toString(36).slice(2,8)}`;
  const target = nextTierLabel(org);
  openModal(`Invite preview · ${org.name}`, `
    <p style="color:var(--muted);font-size:13px;margin-bottom:12px">Share this with a prospective ${target}. This is a simulated link for review purposes.</p>
    <div class="mono" style="background:var(--surface-2);border:1px solid var(--line);border-radius:9px;padding:10px 12px;font-size:12.5px;margin-bottom:16px;word-break:break-all">${link}</div>
    ${brandPreviewHtml(org)}
  `, [ ['Close','',closeModal], ['Copy link','primary',()=>{ toast('Link copied','Ready to share with your prospect'); }] ]);
}
function viewBranding(){
  const org = currentOrg();
  const target = nextTierLabel(org);
  const p = el('div','page');
  p.appendChild(pageHead('Branding','Branding & partner invites',
    `Configure how ${org.name}'s portal looks — logo, background and colors are yours to set, independent of every other partner on the network — then share a branded preview with a prospective ${target} before they onboard.`,
    [ btn('Ask Veridex',I.bolt,'primary',()=>{ openDrawer(); runIntent('help me set up branding for a new invite'); }) ]));

  const row = el('div','grid g2');
  const form = el('div','card pad');
  form.innerHTML = `<div style="font-family:var(--display);font-weight:600;font-size:15px;margin-bottom:14px">Portal appearance</div>`;
  const grid1 = el('div','grid g2'); grid1.style.gap='12px';
  grid1.appendChild(fieldNode('Display name', org.name, 'brandName'));
  grid1.appendChild(fieldNode('Logo initials', org.brand.logoText, 'brandLogo'));
  form.appendChild(grid1);
  const tagWrap = el('div'); tagWrap.style.marginTop='12px';
  tagWrap.appendChild(fieldNode('Tagline', org.brand.tagline||'', 'brandTagline'));
  form.appendChild(tagWrap);

  function colorField(label, value, swatches){
    const wrap = el('div'); wrap.style.cssText='margin-top:14px';
    wrap.innerHTML = `<span style="font-size:11.5px;color:var(--muted);font-weight:500">${label}</span>`;
    const swatchRow = el('div'); swatchRow.style.cssText='display:flex;align-items:center;gap:8px;margin-top:8px';
    const colorInput = el('input'); colorInput.type='color'; colorInput.value=value;
    colorInput.style.cssText='width:38px;height:34px;border:1px solid var(--line);border-radius:8px;padding:2px;background:var(--surface-2)';
    swatchRow.appendChild(colorInput);
    swatches.forEach(cc=>{
      const sw = el('button','swatch'); sw.style.background=cc; sw.style.borderColor = cc.toLowerCase()===value.toLowerCase()?'var(--ink)':'transparent';
      sw.onclick=()=>{ colorInput.value=cc; colorInput.dispatchEvent(new Event('input')); swatchRow.querySelectorAll('.swatch').forEach(b=>b.style.borderColor='transparent'); sw.style.borderColor='var(--ink)'; };
      swatchRow.appendChild(sw);
    });
    wrap.appendChild(swatchRow);
    return { wrap, colorInput };
  }
  const accentField = colorField('Accent color', org.brand.accent, ['#2D5BA8','#0E8C6B','#B7791F','#7A3E9D','#C0392B','#146C94']);
  const bgField = colorField('Background color', org.brand.bg||'#F4F6F9', ['#F4F6F9','#F2F9F6','#EEF7FA','#F6F1FA','#FBF5EA','#101826']);
  form.appendChild(accentField.wrap); form.appendChild(bgField.wrap);

  const themeWrap = el('div'); themeWrap.style.cssText='margin-top:14px';
  themeWrap.innerHTML = `<span style="font-size:11.5px;color:var(--muted);font-weight:500">Theme</span><br>`;
  const seg = el('div','seg'); seg.style.marginTop='8px';
  ['light','dark','auto'].forEach(th=>{ const b=el('button', th===org.brand.theme?'on':'', th[0].toUpperCase()+th.slice(1));
    b.onclick=()=>{ seg.querySelectorAll('button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); org.brand.theme=th; toast('Theme set to '+th); };
    seg.appendChild(b); });
  themeWrap.appendChild(seg); form.appendChild(themeWrap);

  const preview = el('div','card');
  preview.innerHTML = `<div class="card-h"><h3>Live preview</h3><span class="hint">what a recipient will see</span></div>`;
  const pbody = el('div','pad'); pbody.innerHTML = brandPreviewHtml(org);
  preview.appendChild(pbody);

  function draftOrg(){
    return { ...org, name: form.querySelector('[data-f="brandName"]').value || org.name,
      brand:{ ...org.brand, logoText: form.querySelector('[data-f="brandLogo"]').value, tagline: form.querySelector('[data-f="brandTagline"]').value,
        accent: accentField.colorInput.value, bg: bgField.colorInput.value } };
  }
  ['brandName','brandLogo','brandTagline'].forEach(f=>form.querySelector(`[data-f="${f}"]`).addEventListener('input', ()=>{ pbody.innerHTML = brandPreviewHtml(draftOrg()); }));
  accentField.colorInput.addEventListener('input', ()=>{ pbody.innerHTML = brandPreviewHtml(draftOrg()); });
  bgField.colorInput.addEventListener('input', ()=>{ pbody.innerHTML = brandPreviewHtml(draftOrg()); });

  const saveBtn = btn('Save branding', I.check, 'primary', ()=>{
    const d = draftOrg();
    org.name = d.name; org.brand = d.brand;
    applyTheme(); buildShell();
    toast('Branding saved', `${org.name}'s workspace updated`);
    render();
  });
  saveBtn.style.marginTop='16px'; form.appendChild(saveBtn);

  row.appendChild(form); row.appendChild(preview); p.appendChild(row);

  const ic = el('div','card'); ic.style.marginTop='16px';
  ic.innerHTML = `<div class="card-h"><h3>Invite ${target==='MGA'?'an':'a'} ${target}</h3><span class="hint">branded, shareable preview</span></div>`;
  const ib = el('div','pad');
  ib.innerHTML = `<p style="color:var(--muted);font-size:13px;margin-bottom:12px">Generate a preview link that shows a prospective ${target} exactly what their branded workspace will look like, before they commit to onboarding.</p>`;
  ib.appendChild(btn('Generate invite preview link', I.mega, 'primary', ()=>openInvitePreview(org)));
  ic.appendChild(ib); p.appendChild(ic);

  return p;
}

/* ============================================================
   LEADS & MARKETING
   ============================================================ */
function viewLeads(){
  const p = el('div','page');
  p.appendChild(pageHead('Marketing & leads', CURRENT==='carrier'?'Leads':'Marketing & leads',
    'Each entity runs its own campaigns through its own CRM. Veridex turns them into routable leads and keeps a full custody trail — the marketing data stays in your CRM.',
    [ btn('Route a lead',I.route,'primary',()=>{ openDrawer(); runIntent('route the Vela Freight lead to the right agency'); }) ]));

  const kg=el('div','grid g4');
  kg.innerHTML = kpi(I.route,String(LEADS.length),'Open leads','+3 today','up')+kpi(I.chart,'26%','Quote→bind','+4pts','up')+
    kpi(I.mega,String(CAMPAIGNS.length),'Live campaigns',null,'flat')+kpi(I.users,'$168k','Pipeline value','+11%','up');
  p.appendChild(kg);

  const lc=el('div','card'); lc.style.marginTop='16px';
  lc.innerHTML=`<div class="card-h"><h3>Leads</h3><span class="hint">custody chain shown per lead</span></div>`;
  const tbl=el('table','tbl');
  tbl.innerHTML=`<thead><tr><th>Lead</th><th>Origin</th><th>State</th><th>Class / line</th><th>Custody chain</th><th>Value</th><th>Stage</th></tr></thead>`;
  const tb=el('tbody');
  LEADS.forEach(l=>{ const st={New:'info',Quoted:'warn',Bound:'ok'}[l.stage]||'mute';
    const tr=el('tr');
    tr.innerHTML=`<td><div class="co">${av(l.name,'insured')}<b>${l.name}</b></div></td>
      <td style="color:var(--muted)">${l.origin}</td><td class="mono">${l.state}</td>
      <td><span class="chip">${l.class}</span> <span class="chip code">${l.line}</span></td>
      <td>${chainHtml(l.chain)}</td><td class="mono">${l.val}</td><td><span class="pill ${st}">${l.stage}</span></td>`;
    tb.appendChild(tr); });
  tbl.appendChild(tb); lc.appendChild(tbl); p.appendChild(lc);

  const cc=el('div','card'); cc.style.marginTop='16px';
  cc.innerHTML=`<div class="card-h"><h3>Marketing campaigns</h3><span class="hint">running in your own CRM</span><span class="sp"><span class="pill mute plain">HubSpot connected</span></span></div>`;
  const ct=el('table','tbl');
  ct.innerHTML=`<thead><tr><th>Campaign</th><th>Channel</th><th>CRM</th><th>Leads</th><th>Conversion</th><th></th></tr></thead>`;
  const cb=el('tbody');
  CAMPAIGNS.forEach(c=>{ const tr=el('tr');
    tr.innerHTML=`<td><b>${c.name}</b></td><td style="color:var(--muted)">${c.channel}</td>
      <td><span class="pill mute plain">${c.crm}</span></td><td class="mono">${c.leads}</td>
      <td><span class="pill ok">${c.conv}</span></td>
      <td><span class="mono" style="color:var(--faint);font-size:11px">synced ↔ CRM</span></td>`;
    cb.appendChild(tr); });
  ct.appendChild(cb); cc.appendChild(ct);
  const note=el('div','callout'); note.style.margin='0 18px 18px';
  note.innerHTML=`<span class="ci">${svg(I.bolt,18)}</span><div class="ct">Veridex routes and tracks the lead; the campaign detail and nurture history stay in your CRM, mirrored back so you keep one picture in the tool you already use.</div>`;
  cc.appendChild(note);
  p.appendChild(cc);
  return p;
}
function chainHtml(chain){
  return `<div style="display:flex;align-items:center;gap:4px">`+chain.map((c,i)=>
    `${i?`<span style="color:var(--faint)">→</span>`:''}<span class="chip" style="padding:3px 8px;font-size:11px" title="${c}">${ini(c)}</span>`
  ).join('')+`</div>`;
}

/* ============================================================
   BROADCASTS
   ============================================================ */
function viewBroadcasts(){
  const p=el('div','page');
  p.appendChild(pageHead('Broadcasts', 'Product & appetite broadcasts',
    'When you open a new state, line or class, broadcast it down the network. Downstream partners get an in-app alert, an email, and a webhook to their CRM.',
    [ btn('New broadcast',I.mega,'primary',()=>{ openDrawer(); runIntent('broadcast our new TX commercial auto appetite to agencies'); }) ]));

  const c=el('div','card');
  c.innerHTML=`<div class="card-h"><h3>Recent broadcasts</h3><span class="hint">delivery tracked, marketing stays downstream</span></div>`;
  const tbl=el('table','tbl');
  tbl.innerHTML=`<thead><tr><th>Broadcast</th><th>Target</th><th>Recipients</th><th>Delivered</th><th>Accepted addendum</th><th>Sent</th></tr></thead>
  <tbody>
    <tr><td><b>TX commercial auto appetite</b></td><td><span class="chip code">TX</span> <span class="chip">Trucking</span></td><td class="mono">4</td><td><span class="pill ok">4 / 4</span></td><td><span class="pill warn">2 / 4</span></td><td class="mono">2h ago</td></tr>
    <tr><td><b>New cargo programme (9.1)</b></td><td><span class="chip code">TX, LA</span></td><td class="mono">3</td><td><span class="pill ok">3 / 3</span></td><td><span class="pill ok">3 / 3</span></td><td class="mono">yesterday</td></tr>
    <tr><td><b>OK workers-comp expansion</b></td><td><span class="chip code">OK</span> <span class="chip">Workers Comp</span></td><td class="mono">2</td><td><span class="pill ok">2 / 2</span></td><td><span class="pill warn">1 / 2</span></td><td class="mono">3d ago</td></tr>
  </tbody>`;
  c.appendChild(tbl); p.appendChild(c);
  return p;
}

/* ============================================================
   CRM & INTEGRATIONS — connect your own CRM, or track leads directly
   ============================================================ */
function viewCRM(){
  const org = currentOrg();
  const p = el('div','page');
  p.appendChild(pageHead('Integrations','Connect your CRM',
    'Bring your own CRM — HubSpot, Salesforce, Zoho, or a generic webhook — so leads Veridex routes to you land straight in the tool your team already works from. You can also track leads here directly, with no CRM required.',
    [ btn('Add a lead manually',I.add,'primary',()=>openAddLeadForm()) ]));

  const grid = el('div','grid g3');
  const CRMS = [
    { name:'HubSpot', icon:'HS', connected:true },
    { name:'Salesforce', icon:'SF', connected:false },
    { name:'Zoho CRM', icon:'ZC', connected:false },
  ];
  CRMS.forEach(c=>{
    const card = el('div','card pad');
    card.innerHTML = `<div style="display:flex;align-items:center;gap:12px">
      <span class="av" style="background:var(--ink)">${c.icon}</span>
      <div><div style="font-family:var(--display);font-weight:600">${c.name}</div>
      <div style="font-size:11.5px;color:var(--muted)">${c.connected?'Connected · syncing leads':'Not connected'}</div></div>
      <span class="pill ${c.connected?'ok':'mute'}" style="margin-left:auto">${c.connected?'Active':'Off'}</span></div>`;
    const b = btn(c.connected?'Manage connection':'Connect', I.plug, c.connected?'sm ghost':'sm primary', ()=>openCrmConnect(c));
    b.style.marginTop='12px'; card.appendChild(b);
    grid.appendChild(card);
  });
  p.appendChild(grid);

  const wh = el('div','card'); wh.style.marginTop='16px';
  wh.innerHTML = `<div class="card-h"><h3>Generic webhook / API</h3><span class="hint">for any other system</span></div>`;
  const wb = el('div','pad');
  wb.innerHTML = `<p style="color:var(--muted);font-size:13px;margin-bottom:10px">Point any system at this endpoint to push new leads into Veridex, or pull leads Veridex has routed to you.</p>
    <div class="mono" style="background:var(--surface-2);border:1px solid var(--line);border-radius:9px;padding:10px 12px;font-size:12px;margin-bottom:10px;word-break:break-all">https://api.veridex.io/v1/leads?org=${org.id}</div>`;
  const keyRow = el('div'); keyRow.style.cssText='display:flex;gap:8px;flex-wrap:wrap;align-items:center';
  const keyInput = el('input'); keyInput.type='text'; keyInput.readOnly=true;
  keyInput.value = 'vrx_live_' + org.id.replace(/[^a-z0-9]/gi,'').slice(0,10) + '_••••••••';
  keyInput.style.cssText='flex:1;min-width:220px;height:36px;border:1px solid var(--line);border-radius:8px;padding:0 10px;background:var(--surface-2);font-family:var(--mono);font-size:12px';
  keyRow.appendChild(keyInput);
  keyRow.appendChild(btn('Copy key','','sm',()=>toast('API key copied')));
  keyRow.appendChild(btn('Regenerate','','sm ghost',()=>toast('New API key generated','Old key revoked')));
  wb.appendChild(keyRow); wh.appendChild(wb); p.appendChild(wh);

  const lc = el('div','card'); lc.style.marginTop='16px';
  lc.innerHTML = `<div class="card-h"><h3>Your tracked leads</h3><span class="hint">${LEADS.length} total · manual + CRM + routed</span></div>`;
  const tbl = el('table','tbl');
  tbl.innerHTML = `<thead><tr><th>Lead</th><th>Source</th><th>State</th><th>Class</th><th>Value</th><th>Stage</th></tr></thead>`;
  const tb = el('tbody');
  LEADS.forEach(l=>{ const st={New:'info',Quoted:'warn',Bound:'ok'}[l.stage]||'mute'; const tr=el('tr');
    tr.innerHTML = `<td><div class="co">${av(l.name,'insured')}<b>${l.name}</b></div></td><td style="color:var(--muted)">${l.origin}</td>
      <td class="mono">${l.state}</td><td><span class="chip">${l.class}</span></td><td class="mono">${l.val}</td><td><span class="pill ${st}">${l.stage}</span></td>`;
    tb.appendChild(tr); });
  tbl.appendChild(tb); lc.appendChild(tbl); p.appendChild(lc);

  return p;
}
function openCrmConnect(c){
  openModal(`Connect ${c.name}`, `
    <p style="color:var(--muted);font-size:13px;margin-bottom:12px">${c.connected?`Manage your ${c.name} connection.`:`Authorize Veridex to push routed leads into ${c.name} and pull status changes back.`}</p>
    ${field('API key / access token','••••••••••••')}
    <div class="callout" style="margin-top:14px"><span class="ci">${svg(I.check,18)}</span><div class="ct">Simulated for this review build — in production this opens ${c.name}'s OAuth screen.</div></div>
  `, [ ['Cancel','',closeModal], [c.connected?'Save':'Connect','primary',()=>{ closeModal(); toast(`${c.name} ${c.connected?'updated':'connected'}`, 'Leads will sync automatically'); }] ]);
}
function openAddLeadForm(){
  openModal('Add a lead manually', `
    <div class="grid g2" style="gap:12px">${field('Business name','New Prospect LLC')}${field('State','TX')}</div>
    <div class="grid g2" style="gap:12px;margin-top:12px">${field('Class of business','Trucking')}${field('Estimated value','$25,000')}</div>
  `, [ ['Cancel','',closeModal], ['Add lead','primary',()=>{ closeModal();
    LEADS.unshift({ name:'New Prospect LLC', origin:'Manual entry', state:'TX', class:'Trucking', line:'19.4 / 21.2', stage:'New', chain:[currentOrg().name], val:'$25,000', age:'just now' });
    if(VIEW==='leads'||VIEW==='crm') render();
    toast('Lead added','Now tracked alongside your routed leads'); }] ]);
}

/* ============================================================
   INSURED PORTAL
   ============================================================ */
function viewPolicies(){
  const org = currentOrg();
  const p=el('div','page');
  p.appendChild(pageHead('My policies','Your policies',
    'Everything you hold, in one place. Your policy is always underwritten by a carrier; the agency and MGA helped place it. Click a policy for full detail, or ask the assistant below about renewals.', []));

  const totalPrem = POLICIES.reduce((s,pl)=>s+parseMoney(pl.prem),0);
  const soonest = [...POLICIES].sort((a,b)=>daysUntil(a.renew)-daysUntil(b.renew))[0];
  const soonestDays = daysUntil(soonest.renew);
  const kg=el('div','grid g4');
  kg.innerHTML=kpi(I.policy,String(POLICIES.length),'Active policies',null,'flat')+kpi(I.chart,fmtMoney(totalPrem),'Annual premium',null,'flat')+
    kpi(I.shield,`${soonestDays}d`,`Next renewal · ${soonest.line}`,soonestDays<=45?'soon':null,soonestDays<=45?'dn':'flat')+
    kpi(I.gift,'250 pts','Referral rewards','+50','up');
  p.appendChild(kg);

  const c=el('div','card'); c.style.marginTop='16px';
  c.innerHTML=`<div class="card-h"><h3>Policies</h3><span class="hint">${org.name} · click a row for detail</span></div>`;
  const tbl=el('table','tbl');
  tbl.innerHTML=`<thead><tr><th>Policy #</th><th>Carrier</th><th>Coverage</th><th>Premium</th><th>Effective</th><th>Renews</th><th>Days left</th><th>Status</th></tr></thead>`;
  const tb=el('tbody');
  POLICIES.forEach(pl=>{ const d = daysUntil(pl.renew); const tr=el('tr'); tr.style.cursor='pointer';
    tr.innerHTML=`<td class="mono">${pl.no}</td><td><div class="co">${av(pl.carrier,'carrier')}<b>${pl.carrier}</b></div></td>
      <td>${pl.line}</td><td class="mono">${pl.prem}</td><td class="mono">${fmtDate(pl.start)}</td><td class="mono">${fmtDate(pl.renew)}</td>
      <td><span class="pill ${d<=45?'warn':'ok'} plain">${d}d</span></td><td><span class="pill ok">${pl.status}</span></td>`;
    tr.onclick=()=>openPolicyDetail(pl);
    tb.appendChild(tr); });
  tbl.appendChild(tb); c.appendChild(tbl); p.appendChild(c);

  // embedded renewal chat — ask directly on this page, no need to open the drawer
  const chatCard = el('div','card'); chatCard.style.marginTop='16px';
  chatCard.innerHTML = `<div class="card-h"><h3>Ask about your policy</h3><span class="hint">renewals, coverage, dates</span></div>`;
  const cbody = el('div','pad');
  const log = el('div'); log.style.cssText='display:flex;flex-direction:column;gap:4px;margin-bottom:12px;max-height:280px;overflow-y:auto';
  cbody.appendChild(log);
  addPolicyMsg(log,'ai',`Hi ${org.user.split(' ')[0]} — ask me anything about your policies: when something renews, what's covered, or how to start a renewal early.`);
  const sugRow = el('div','sugs');
  ['When does my commercial auto renew?','What does my general liability cover?','Can I renew early?'].forEach(q=>{
    const b = el('button','sug',q); b.onclick=()=>askPolicyBot(log,q); sugRow.appendChild(b);
  });
  cbody.appendChild(sugRow);
  const inputRow = el('div','dw-input'); inputRow.style.marginTop='4px';
  const ta = el('textarea'); ta.rows=1; ta.placeholder='Ask about renewal, coverage, dates…';
  const sendBtn = el('button','dw-send'); sendBtn.innerHTML = svg('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',17);
  inputRow.appendChild(ta); inputRow.appendChild(sendBtn);
  cbody.appendChild(inputRow);
  function fire(){ const v=ta.value.trim(); if(!v) return; ta.value=''; askPolicyBot(log,v); }
  sendBtn.onclick=fire;
  ta.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); fire(); } });
  chatCard.appendChild(cbody); p.appendChild(chatCard);

  return p;
}
function openPolicyDetail(pl){
  const d = daysUntil(pl.renew);
  openModal(`Policy ${pl.no}`, `
    <div class="grid g3" style="margin-bottom:14px">
      <div class="card pad"><div class="k-lbl">Effective</div><div class="k-val" style="font-size:18px">${fmtDate(pl.start)}</div></div>
      <div class="card pad"><div class="k-lbl">Expires / renews</div><div class="k-val" style="font-size:18px">${fmtDate(pl.renew)}</div></div>
      <div class="card pad"><div class="k-lbl">Premium</div><div class="k-val" style="font-size:18px">${pl.prem}</div></div>
    </div>
    <p style="color:var(--muted);font-size:13px;margin-bottom:12px">${pl.desc||''}</p>
    <div class="callout"><span class="ci">${svg(I.bolt,18)}</span><div class="ct">${d<=45?`<b>Renews in ${d} days</b> — `:`Renews in ${d} days — `}ask the assistant below for renewal options, coverage changes, or to start the renewal early.</div></div>
  `, [ ['Close','',closeModal], ['Ask about renewal','primary',()=>{ closeModal(); openDrawer(); runIntent(`when does my ${pl.line} policy renew and what changes for the renewal?`); }] ]);
}
function addPolicyMsg(container, who, html){
  const m = el('div','msg '+(who==='ai'?'ai':'me'));
  m.innerHTML = `<div class="m-av">${who==='ai'?'V':currentOrg().uinit}</div><div class="m-body"><div class="bubble">${html}</div></div>`;
  container.appendChild(m); container.scrollTop = container.scrollHeight;
}
async function askPolicyBot(container, q){
  addPolicyMsg(container,'me',q);
  const typingEl = el('div','msg ai'); typingEl.innerHTML = `<div class="m-av">V</div><div class="m-body"><div class="typing"><span></span><span></span><span></span></div></div>`;
  container.appendChild(typingEl); container.scrollTop=container.scrollHeight;
  await wait(650);
  typingEl.remove();
  const s = q.toLowerCase();
  const pl = POLICIES.find(x=>s.includes(x.line.toLowerCase().split(' ')[0]));
  let answer;
  if(/renew|expire|when/.test(s) && pl){
    const d = daysUntil(pl.renew);
    answer = `Your <b>${pl.line}</b> policy (${pl.no}) is effective ${fmtDate(pl.start)} and renews on <b>${fmtDate(pl.renew)}</b> — that's ${d} day${d===1?'':'s'} away. ${d<=45?'It\'s close enough that I can start the renewal conversation with your agent now.':'No action needed yet — I\'ll remind you closer to the date.'}`;
  } else if(/renew|expire|when/.test(s)){
    const soonest = [...POLICIES].sort((a,b)=>daysUntil(a.renew)-daysUntil(b.renew))[0];
    answer = `Your soonest renewal is <b>${soonest.line}</b> (${soonest.no}) on <b>${fmtDate(soonest.renew)}</b>, ${daysUntil(soonest.renew)} days away.`;
  } else if(/cover|include|what.*(get|do i have)/.test(s) && pl){
    answer = `<b>${pl.line}</b>: ${pl.desc} Annual premium is ${pl.prem}, placed through ${currentOrg().name}'s agency relationship.`;
  } else if(/early|start.*renew/.test(s)){
    answer = `I can flag your agency to start the renewal conversation up to 60 days early — want me to notify them now?`;
  } else {
    answer = `I can tell you when a policy renews, what it covers, or help you start a renewal conversation early. Try asking about a specific coverage like "commercial auto" or "general liability".`;
  }
  addPolicyMsg(container,'ai',answer);
}
function viewRefer(){
  const p=el('div','page');
  p.appendChild(pageHead('Refer & earn','Refer a business you know',
    'Send a referral to your agency. If it binds, you earn rewards — and the lead carries your name through the whole chain.', []));
  const c=el('div','card pad'); c.style.maxWidth='520px';
  c.innerHTML=`<div class="grid g2" style="gap:12px">${field('Business name','Vela Freight Co')}${field('Contact email','ops@velafreight.com')}</div>
    <div style="margin-top:12px">${field('What do they need?','Commercial auto for their fleet')}</div>`;
  const b=btn('Send referral',I.gift,'primary',()=>{ toast('Referral sent','Vela Freight routed to Links · you earn 50 pts on bind'); });
  b.style.marginTop='14px'; c.appendChild(b); p.appendChild(c);
  return p;
}
function viewDocs(){
  const p=el('div','page');
  p.appendChild(pageHead('Documents','Your documents','Policy documents and certificates.', []));
  const c=el('div','card'); c.innerHTML=`<div class="card-h"><h3>Files</h3></div>`;
  const tb=el('table','tbl');
  tb.innerHTML=`<tbody>
    <tr><td><div class="co">${docIc('PDF')}<b>MM-CA-4471-TX · Policy.pdf</b></div></td><td class="mono" style="color:var(--muted)">Commercial Auto</td><td><span class="pill ok">Signed</span></td></tr>
    <tr><td><div class="co">${docIc('PDF')}<b>Certificate of Insurance.pdf</b></div></td><td class="mono" style="color:var(--muted)">COI</td><td><span class="pill ok">Current</span></td></tr>
  </tbody>`;
  c.appendChild(tb); p.appendChild(c);
  return p;
}

/* ============================================================
   MODAL
   ============================================================ */
function openModal(title, html, actions, opts={}){
  closeModal();
  const scrim=el('div'); scrim.id='modalScrim';
  scrim.style.cssText='position:fixed;inset:0;background:rgba(20,36,61,.4);backdrop-filter:blur(2px);z-index:80;display:grid;place-items:center;padding:24px;animation:fade .2s';
  const m=el('div'); m.style.cssText=`background:var(--surface);border-radius:16px;box-shadow:var(--shadow-lg);width:min(${opts.width||'560px'},96vw);max-height:88vh;overflow:auto;animation:pop .2s`;
  m.innerHTML=`<div style="display:flex;align-items:center;padding:16px 20px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--surface);z-index:1">
    <div style="font-family:var(--display);font-weight:600;font-size:15.5px">${title}</div>
    <button id="mClose" class="iconbtn" style="margin-left:auto">${svg('<path d="M18 6 6 18M6 6l12 12"/>',18)}</button></div>
    <div style="padding:20px">${html}</div>`;
  if(actions){ const f=el('div'); f.style.cssText='display:flex;gap:10px;justify-content:flex-end;padding:14px 20px;border-top:1px solid var(--line);position:sticky;bottom:0;background:var(--surface)';
    actions.forEach(([l,c,fn])=>{ const b=btn(l,'',c,fn); f.appendChild(b); }); m.appendChild(f); }
  scrim.appendChild(m); document.body.appendChild(scrim);
  $('#mClose').onclick=closeModal; scrim.onclick=e=>{ if(e.target===scrim) closeModal(); };
  if(opts.afterMount) opts.afterMount(m);
}
function closeModal(){ const s=$('#modalScrim'); if(s) s.remove(); }

/* ============================================================
   TOAST
   ============================================================ */
function toast(title, sub, kind='ok'){
  const t=el('div','toast '+kind);
  t.innerHTML=`<span class="tk">${svg(kind==='ok'?I.check:I.bolt,15)}</span><div>${title}${sub?`<small>${sub}</small>`:''}</div>`;
  $('#toasts').appendChild(t);
  setTimeout(()=>{ t.style.transition='opacity .3s,transform .3s'; t.style.opacity='0'; t.style.transform='translateY(8px)'; setTimeout(()=>t.remove(),300); }, 4200);
}

/* ============================================================
   AI DRAWER + ENGINE
   ============================================================ */
const SUGGESTIONS = {
  carrier:['Onboard Crestline Underwriters as an MGA for trucking in TX','Show MGA performance for Apex in Texas',
    'Filter MGAs to TX and trucking with active status','Broadcast our new TX commercial auto appetite',
    'Help me set up branding for a new invite','Connect my CRM'],
  mga:['Onboard Summit Specialty as an agency for trucking in TX','Show agency performance in Texas',
    'Filter agencies to TX and trucking','Route the Vela Freight lead',
    'Broadcast our new TX commercial auto appetite','Help me set up branding for a new invite'],
  agency:['Onboard a customer and send a portal link','Show me my top customers by premium',
    'Connect my CRM','Add a lead manually','Help me set up branding for a new invite'],
  insured:['Refer a business to my agency','When does my policy renew?'],
};

function openDrawer(){
  $('#scrim').classList.add('on'); $('#drawer').classList.add('on');
  if(!$('#dwBody').dataset.init){ resetDrawer(); $('#dwBody').dataset.init='1'; }
  setTimeout(()=>$('#dwInput').focus(),200);
}
function closeDrawer(){ $('#scrim').classList.remove('on'); $('#drawer').classList.remove('on'); }
function resetDrawer(){
  const b=$('#dwBody'); b.innerHTML='';
  const t = currentOrg();
  aiMsg(`Hi — I'm your Veridex assistant for the <b>${t.role} · ${t.name}</b> workspace. Tell me what you want to do and I'll gather what's needed, verify it, and prepare the action for your confirmation.`);
  renderSugs();
}
function renderSugs(){
  const s=$('#dwSugs'); s.innerHTML='';
  (SUGGESTIONS[CURRENT]||[]).forEach(q=>{ const b=el('button','sug',q); b.onclick=()=>{ runIntent(q); }; s.appendChild(b); });
}
function meMsg(txt){ const m=el('div','msg me'); m.innerHTML=`<div class="m-av">${currentOrg().uinit}</div><div class="m-body"><div class="bubble">${txt}</div></div>`; $('#dwBody').appendChild(m); scrollDrawer(); }
function aiMsg(html,node){ const m=el('div','msg ai'); m.innerHTML=`<div class="m-av">V</div><div class="m-body"><div class="bubble">${html}</div></div>`; if(node) m.querySelector('.m-body').appendChild(node); $('#dwBody').appendChild(m); scrollDrawer(); return m; }
function typing(){ const m=el('div','msg ai'); m.innerHTML=`<div class="m-av">V</div><div class="m-body"><div class="typing"><span></span><span></span><span></span></div></div>`; $('#dwBody').appendChild(m); scrollDrawer(); return m; }
function scrollDrawer(){ const b=$('#dwBody'); b.scrollTop=b.scrollHeight; }
async function aiSay(html,node,delay=650){ const t=typing(); await wait(delay); t.remove(); return aiMsg(html,node); }

/* ---- intent routing ---- */
function classify(q){
  const s=q.toLowerCase();
  if(/(connect .*(crm|hubspot|salesforce|zoho)|add a lead|track (my|our) leads?|crm integration|api key|webhook)/.test(s)) return 'crmIntegration';
  if(/(onboard|add|invite).*(customer|insured|client)|customer.*(link|portal)/.test(s)) return 'onboardCustomer';
  if(/(onboard|add|invite|appoint)/.test(s)) return 'onboardPartner';
  if(/^filter|filter (agencies|mgas|the network)/.test(s)) return 'filterNetwork';
  if(/(performance|loss ratio|best (mga|agency)|top (mga|agency)|how is .* doing)/.test(s)) return 'performance';
  if(/(branding|logo|white.?label|theme|invite link|preview link|background)/.test(s)) return 'branding';
  if(/(broadcast|appetite|announce)/.test(s)) return 'broadcast';
  if(/(route|assign).*(lead|vela|submission)|route the/.test(s)) return 'routeLead';
  if(/refer/.test(s)) return 'refer';
  if(/renew|policy/.test(s)) return 'policy';
  return 'fallback';
}
function runIntent(q){
  $('#dwSugs').innerHTML='';
  meMsg(q);
  const fn = { onboardPartner:flowOnboardPartner, onboardCustomer:flowOnboardCustomer,
    broadcast:flowBroadcast, routeLead:flowRouteLead, refer:flowRefer, policy:flowPolicy,
    filterNetwork:flowFilterNetwork, performance:flowPerformance, branding:flowBranding,
    crmIntegration:flowCRM, fallback:flowFallback }[classify(q)];
  fn(q);
}

/* ---- FLOW: onboard partner (MGA or agency, hierarchy-aware) ---- */
async function flowOnboardPartner(q){
  const k = targetKind();
  const nameM = q.match(/onboard\s+([A-Z][\w& ]+?)(?:\s+as|\s+for|\s+in|$)/i);
  const name = (nameM?nameM[1]:k.sample).trim();
  await aiSay(`Got it — onboarding <b>${name}</b> as ${k.type==='MGA'?'an MGA':'an agency'}. Your ${k.label.toLowerCase()} onboarding profile needs ${k.docs.map(d=>`a <b>${d}</b>`).join(', ')}. Drop the first document and I'll read and verify it.`);
  const drop = el('div','doc-drop');
  drop.innerHTML=`${svg(I.doc,22)}<div class="dt">Drop the ${k.docs[0].toLowerCase()} PDF</div><div class="ds">or click to simulate an upload</div>`;
  aiMsg('', drop);
  drop.onclick=async()=>{
    drop.outerHTML=`<div class="doc-chip">${docIc('PDF')}<span>${name.replace(/\s+/g,'_')}_TX_${k.type==='MGA'?'authority':'license'}.pdf</span></div>`;
    await aiSay('Reading the document and checking it against NIPR and the Texas Secretary of State…',null,900);
    const card = el('div','vcard');
    card.innerHTML=`<div class="vcard-h"><div class="vi">${ini(name)}</div><b>${name} LLC</b><span class="pill ok" style="margin-left:auto">Verified</span></div>
      <div class="vrow"><span class="vk">Legal entity</span><span class="vv">${name} LLC <span class="src ocr">OCR</span></span></div>
      <div class="vrow"><span class="vk">Home state</span><span class="vv">Texas <span class="src sos">Sec. of State</span></span></div>
      <div class="vrow"><span class="vk">${k.type==='MGA'?'Delegated authority #':'Licence #'}</span><span class="vv mono">TX-${k.type==='MGA'?'DA':'PL'}-${Math.floor(100000+Math.random()*899999)} <span class="src ocr">OCR</span></span></div>
      <div class="vrow"><span class="vk">Lines of authority</span><span class="vv">P&C <span class="src nipr">NIPR</span></span></div>
      <div class="vrow"><span class="vk">NIPR status</span><span class="vv">Active · in good standing <span class="src nipr">NIPR</span></span></div>
      <div class="vrow"><span class="vk">Class requested</span><span class="vv">Trucking → 19.4, 21.2, 17.1 <span class="src you">You</span></span></div>`;
    const f=el('div','vcard-f');
    f.innerHTML=`<button class="btn">Re-prompt</button><button class="btn primary">Confirm & send agreement</button>`;
    card.appendChild(f);
    aiMsg('Here is what I extracted. Every field shows its source. Confirm to send the agreement for e-signature.', card);
    f.querySelector('.primary').onclick=async()=>{
      f.innerHTML=`<span class="pill ok" style="justify-content:center;width:100%;padding:8px">${svg(I.check,14)} Agreement sent · onboarding committed</span>`;
      await aiSay(`Done. <b>${name}</b> has been onboarded as ${k.type==='MGA'?'an MGA':'an agency'}, the agreement is out for e-signature, and the relationship is live with trucking authority in Texas. It now appears in your network.`);
      createOrgFromOnboarding(k, name, {state:'TX', lines:['19.4','21.2','17.1'], classes:['Trucking']});
      buildShell(); if(VIEW==='network'||VIEW==='dashboard'||VIEW==='performance') render();
      toast(`${name} onboarded`, 'Agreement out for e-signature · edge live in TX');
    };
    f.querySelector('.btn:not(.primary)').onclick=()=>aiSay('No problem — tell me what to change (state, class, or which documents to require) and I\'ll redo it.');
  };
}

/* ---- FLOW: onboard customer (agency only) ---- */
async function flowOnboardCustomer(){
  await aiSay('Sure. Customer onboarding is light — just a name and an email, then I send a magic-link login. Who is it?');
  const card=el('div','vcard');
  card.innerHTML=`<div class="vcard-h"><div class="vi">HP</div><b>New customer</b></div>
    <div class="vrow"><span class="vk">Name</span><span class="vv">Harbor Point LLC <span class="src you">You</span></span></div>
    <div class="vrow"><span class="vk">Email</span><span class="vv mono">ops@harborpoint.com <span class="src you">You</span></span></div>
    <div class="vrow"><span class="vk">Access</span><span class="vv">Policy view + referrals</span></div>`;
  const f=el('div','vcard-f'); f.innerHTML=`<button class="btn primary" style="flex:1">Send portal invite</button>`;
  card.appendChild(f);
  aiMsg('Ready to send. They\'ll get a magic-link login to view policies and refer friends.', card);
  f.querySelector('.primary').onclick=async()=>{
    f.innerHTML=`<span class="pill ok" style="justify-content:center;width:100%;padding:8px">${svg(I.check,14)} Invite sent</span>`;
    createCustomerOrg('Harbor Point LLC');
    await aiSay('Sent. The customer will appear in your portal as soon as they accept, and you can market to them alongside your other relationships.');
    if(VIEW==='performance') render();
    toast('Customer invite sent','Harbor Point LLC · magic-link login');
  };
}

/* ---- FLOW: broadcast ---- */
async function flowBroadcast(){
  await aiSay('I\'ll broadcast a new <b>TX commercial auto (trucking)</b> appetite to your downstream agencies. Fanning out now…',null,700);
  const res=el('div','market-res');
  aiMsg('', res);
  const targets=[['Links','agency'],['Lone Star Brokerage','agency'],['Gulf Coast Agency','agency'],['Summit Specialty','agency']];
  for(const [n,c] of targets){
    const m=el('div','mkt'); m.innerHTML=`<span class="ma" style="background:${COLORS[c]}">${ini(n)}</span>
      <div><div class="mn">${n}</div><div class="mr">in-app · email · CRM webhook</div></div>
      <span class="msp pill mute">sending…</span>`;
    res.appendChild(m); scrollDrawer(); await wait(520);
    m.querySelector('.msp').className='msp pill ok'; m.querySelector('.msp').textContent='Delivered';
  }
  await aiSay('Delivered to all four. Two have already accepted the appointment addendum; I\'ll nudge the other two tomorrow. The broadcast is logged with full delivery tracking.');
  toast('Broadcast delivered','TX trucking appetite · 4 agencies');
}

/* ---- FLOW: route lead ---- */
async function flowRouteLead(){
  await aiSay('The <b>Vela Freight Co</b> lead is TX trucking, currently held by you. The best-fit placer with capacity in TX is <b>Links</b>. Route it there?');
  const card=el('div','vcard');
  card.innerHTML=`<div class="vcard-h"><div class="vi">VF</div><b>Vela Freight Co</b><span class="pill info" style="margin-left:auto">TX · Trucking</span></div>
    <div class="vrow"><span class="vk">Current holder</span><span class="vv">Futuristic Underwriters</span></div>
    <div class="vrow"><span class="vk">Route to</span><span class="vv">Links</span></div>
    <div class="vrow"><span class="vk">Custody trail</span><span class="vv">Apex → Metro Risk (visible to both)</span></div>`;
  const f=el('div','vcard-f'); f.innerHTML=`<button class="btn primary" style="flex:1">Route lead</button>`;
  card.appendChild(f); aiMsg('', card);
  f.querySelector('.primary').onclick=async()=>{
    f.innerHTML=`<span class="pill ok" style="justify-content:center;width:100%;padding:8px">${svg(I.check,14)} Routed to Links</span>`;
    const lead=LEADS.find(l=>l.name==='Vela Freight Co'); if(lead && !lead.chain.includes('Links')) lead.chain.push('Links');
    await aiSay('Routed. Metro Risk can now act on it, and you keep visibility of its status and outcome through the shared custody trail.');
    if(VIEW==='leads') render();
    toast('Lead routed','Vela Freight → Links');
  };
}

/* ---- FLOW: filter the network from a query ---- */
async function flowFilterNetwork(q){
  const s=q.toLowerCase();
  const STATES=['TX','OK','LA','NM','AR','IL','FL'];
  const st = STATES.find(x=>s.includes(x.toLowerCase()));
  const cls = Object.keys(CLASSES).find(c=>s.includes(c.toLowerCase()));
  const statusWord = /expir|warn|attention/.test(s) ? 'warn' : /active/.test(s) ? 'ok' : '';
  NET_FILTERS = { state: st||'', cls: cls||'', line:'', status: statusWord, q:'' };
  await aiSay(`Filtering your network${st?` to <b>${st}</b>`:''}${cls?` · <b>${cls}</b>`:''}${statusWord?` · status <b>${statusWord==='ok'?'active':'attention needed'}</b>`:''}. Opening the network view with these filters applied.`);
  VIEW='network'; buildShell(); render();
}

/* ---- FLOW: performance ---- */
async function flowPerformance(){
  const org = currentOrg();
  const kids = childrenOf(org.id);
  if(org.type==='AGENCY'){
    const ranked=[...kids].sort((a,b)=>parseMoney(b.premium)-parseMoney(a.premium)).slice(0,3);
    await aiSay(`Your top customers by premium: ${ranked.map(c=>`<b>${c.name}</b> (${c.premium})`).join(', ')||'none yet'}.`);
    return;
  }
  if(!kids.length){ await aiSay(`You don't have any ${org.type==='CARRIER'?'MGAs':'agencies'} yet — head to Onboarding to add your first one.`); return; }
  const ranked=[...kids].sort((a,b)=>parseMoney(b.perf.prod)-parseMoney(a.perf.prod));
  const withLR = ranked.filter(o=>o.perf.lossRatio!=='—').sort((a,b)=>parseFloat(a.perf.lossRatio)-parseFloat(b.perf.lossRatio));
  const best = withLR[0];
  await aiSay(`By production, your top ${org.type==='CARRIER'?'MGA':'agency'} is <b>${ranked[0].name}</b> at ${ranked[0].perf.prod}.${best?` By loss ratio, <b>${best.name}</b> is running best at ${best.perf.lossRatio}.`:''}`);
  const d = el('div'); d.style.marginTop='8px'; d.innerHTML = matrixHtml(ranked[0].perf.grid);
  aiMsg(`<b>${ranked[0].name}</b> · state × class of business`, d);
  await aiSay(`Open the full ${org.type==='CARRIER'?'MGA':'Agency'} performance page for every breakdown.`);
}

/* ---- FLOW: branding ---- */
async function flowBranding(){
  const org = currentOrg();
  if(org.type==='INSURED'){ await aiSay('Branding is managed by the agency that placed your policy — ask them for a branded portal link.'); return; }
  await aiSay(`Head to <b>Branding & invites</b> to set your logo, background, accent color and theme, then generate a preview link to send to a prospective ${nextTierLabel(org)}.`);
  VIEW='branding'; buildShell(); render();
}

/* ---- FLOW: CRM & integrations ---- */
async function flowCRM(){
  const org = currentOrg();
  if(org.type==='INSURED'){ await aiSay('CRM connections are managed by your agency — this is a distribution-side tool.'); return; }
  await aiSay('Head to <b>CRM & integrations</b> to connect HubSpot, Salesforce or Zoho, grab your API key for a custom webhook, or add a lead manually to track it yourself — no CRM required.');
  VIEW='crm'; buildShell(); render();
}

async function flowRefer(){ await aiSay('Head to <b>Refer &amp; earn</b> and enter the business name and email. If it binds you earn rewards, and your name travels with the lead through the whole chain.'); }
async function flowPolicy(){ await aiSay('Your <b>Commercial Auto</b> policy (MM-CA-4471-TX) with Southlake renews in <b>March 2026</b>. Want me to open the policy?'); }
async function flowFallback(){ await aiSay('I can onboard partners or customers, filter or review performance, broadcast a new appetite, route a lead, connect your CRM, or set up branding. Try one of the suggestions below.'); renderSugs(); }

/* ============================================================
   WIRING
   ============================================================ */
$('#switchBtn').onclick=e=>{ e.stopPropagation(); $('#switchMenu').classList.toggle('open'); };
document.addEventListener('click',()=>$('#switchMenu').classList.remove('open'));
$('#switchMenu').onclick=e=>e.stopPropagation();
$('#dwClose').onclick=closeDrawer;
$('#scrim').onclick=closeDrawer;

function submitAsk(v){ if(!v.trim())return; openDrawer(); runIntent(v.trim()); }
$('#askInput').addEventListener('keydown',e=>{ if(e.key==='Enter'){ submitAsk(e.target.value); e.target.value=''; } });
$('#dwInput').addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); const v=e.target.value; e.target.value=''; if(v.trim()) runIntent(v.trim()); } });
$('#dwInput').addEventListener('input',e=>{ e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight,90)+'px'; });
$('#dwSend').onclick=()=>{ const v=$('#dwInput').value; $('#dwInput').value=''; if(v.trim()) runIntent(v.trim()); };
document.addEventListener('keydown',e=>{
  if(e.key==='/' && document.activeElement.tagName!=='INPUT' && document.activeElement.tagName!=='TEXTAREA' && $('#app').classList.contains('on')){ e.preventDefault(); $('#askInput').focus(); }
  if(e.key==='Escape'){ closeDrawer(); closeModal(); }
});

/* ---------- boot ---------- */
renderGate();
