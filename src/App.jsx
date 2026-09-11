import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Zap, Droplet, PaintBucket, Hammer, Wrench, Users, ClipboardList, Star,
  MapPin, Phone, CheckCircle2, XCircle, Clock, AlertCircle, IndianRupee,
  TrendingUp, LogOut, Menu, Search, Plus, Camera, Navigation, CreditCard,
  MessageSquare, Truck, Shield, Flame, Snowflake, Package, Box, Layers,
  Settings, User, Building2, Car, Sparkles, Leaf, Bug, Wifi, ArrowUpDown,
  Factory, HardHat, Gauge, Home as HomeIcon, ChevronRight, X, Bell,
  BarChart3, LineChart as LineChartIcon, UserPlus, FileWarning, Wallet,
  ThumbsUp, PlayCircle, StopCircle, Image as ImageIcon, Filter, ArrowLeft
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";
import kaamSetuLogo from "./assets/kaamsetu-official-logo.png";
import landingBackground from "./assets/landing-civic-left.png";
import loginBackground from "./assets/login-page-background.png";
import { api } from "./api.js";

/* ============================== THEME ============================== */
const C = {
  navy: "#102A4C",
  navy2: "#132B4A",
  navyDeep: "#0F2747",
  navySoft: "#EAF1FA",
  blue: "#2B5AA5",
  orange: "#E87516",
  orangeDeep: "#CF5C0B",
  orangeSoft: "#FFF3E8",
  green: "#198754",
  greenDeep: "#0F7A4A",
  greenSoft: "#EAF8F0",
  red: "#C94035",
  redSoft: "#FCECEC",
  amber: "#D99A19",
  amberSoft: "#FFF6E4",
  ink: "#1D2B3E",
  text: "#1D2B3E",
  slate: "#5F6B7A",
  secondary: "#5F6B7A",
  muted: "#8A94A3",
  paper: "#F5F7FB",
  paperDim: "#F3F6F9",
  paperWarm: "#FFF9F4",
  pageBg: "linear-gradient(135deg, #F8FAFC 0%, #F5F7FB 45%, #FFF9F4 100%)",
  card: "#FFFFFF",
  line: "#E6EAF0",
  shadow: "0 8px 24px rgba(16, 42, 76, 0.06)",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap');`;

const heading = { fontFamily: "'Manrope', 'Inter', sans-serif", letterSpacing: "-0.03em" };
const body = { fontFamily: "'Inter', sans-serif" };

function BrandMark({ size = 40, alt = "KaamSetu" }) {
  return <img src={kaamSetuLogo} alt={alt} style={{ width: size, height: size, objectFit: "contain", display: "block", flexShrink: 0 }} />;
}

function BrandWordmark({ style = {} }) {
  return (
    <span style={style}>
      <span style={{ color: C.navy }}>Kaam</span><span style={{ color: C.orange }}>Setu</span>
    </span>
  );
}

// ===== Demo data for booking flow (replaceable with real APIs later) =====
const DEMO_WORKERS = [
  { id: 'W-101', name: 'Rahul Sharma', skills: 'Welder • Tile Worker', distanceKm: 2.4, etaMins: 18, rating: 4.7, photo: null, status: 'available' },
  { id: 'W-102', name: 'Sunita Verma', skills: 'Electrician', distanceKm: 3.1, etaMins: 22, rating: 4.6, photo: null, status: 'available' }
];

const DEMO_TIME_SLOTS = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'];

const DEMO_PRICING = { travelCharge: 80, platformFee: 20, discount: 50 };

function calculateBookingTotal(draft, services) {
  const serviceCharges = (draft.selectedServiceIds || []).map(id => {
    const s = services.find(x => x.id === id); return s ? s.charge : 0;
  }).reduce((a,b)=>a+b,0);
  const travelCharges = DEMO_PRICING.travelCharge;
  const platformFee = DEMO_PRICING.platformFee;
  const discount = DEMO_PRICING.discount;
  const total = Math.max(0, serviceCharges + travelCharges + platformFee - discount);
  return { serviceCharges, travelCharges, platformFee, discount, total };
}

/* ============================== DATA SETUP ============================== */
const SERVICE_DEFS = [
  ["Electrician", "Construction & Home", Zap],
  ["Plumber", "Construction & Home", Droplet],
  ["Painter", "Construction & Home", PaintBucket],
  ["Carpenter", "Construction & Home", Hammer],
  ["Mason", "Construction & Home", HardHat],
  ["Welder", "Construction & Home", Flame],
  ["Tile Worker", "Construction & Home", Layers],
  ["Flooring Worker", "Construction & Home", Layers],
  ["Roofer", "Construction & Home", HomeIcon],
  ["HVAC / AC Technician", "Construction & Home", Snowflake],
  ["Refrigeration Technician", "Construction & Home", Snowflake],
  ["Glass Worker", "Construction & Home", Box],
  ["Steel Fabricator", "Construction & Home", Factory],
  ["POP / Gypsum Worker", "Construction & Home", HardHat],
  ["Bricklayer", "Construction & Home", HardHat],
  ["Concrete Worker", "Construction & Home", HardHat],
  ["Construction Labourer", "Construction & Home", HardHat],
  ["General Helper", "Construction & Home", Users],
  ["Gardener / Mali", "Maintenance & Household", Leaf],
  ["Cleaner", "Maintenance & Household", Sparkles],
  ["Housekeeping Worker", "Maintenance & Household", HomeIcon],
  ["Security Guard", "Maintenance & Household", Shield],
  ["Driver", "Maintenance & Household", Car],
  ["Mechanic", "Maintenance & Household", Wrench],
  ["Auto Electrician", "Maintenance & Household", Zap],
  ["Appliance Repair Technician", "Maintenance & Household", Settings],
  ["Washing Machine Technician", "Maintenance & Household", Settings],
  ["Refrigerator Technician", "Maintenance & Household", Snowflake],
  ["Pest Control Worker", "Maintenance & Household", Bug],
  ["Furniture Worker", "Maintenance & Household", Box],
  ["Interior Worker", "Maintenance & Household", HomeIcon],
  ["Solar Panel Technician", "Maintenance & Household", Zap],
  ["CCTV Technician", "Maintenance & Household", Camera],
  ["Internet / Network Technician", "Maintenance & Household", Wifi],
  ["Lift / Elevator Technician", "Maintenance & Household", ArrowUpDown],
  ["Road Construction Worker", "Industrial", HardHat],
  ["Machine Operator", "Industrial", Gauge],
  ["Factory Worker", "Industrial", Factory],
  ["Packaging Worker", "Industrial", Package],
  ["Loading / Unloading Labourer", "Industrial", Truck],
  ["Warehouse Worker", "Industrial", Building2],
];

const FIRST_NAMES = ["Rahul","Amit","Suresh","Vijay","Anil","Ramesh","Sanjay","Deepak","Manoj","Ravi",
  "Ajay","Sunil","Rakesh","Naveen","Pankaj","Vikram","Arun","Kiran","Sandeep","Mahesh",
  "Priya","Anita","Sunita","Kavita","Pooja","Neha","Rekha","Meena","Geeta","Asha"];
const LAST_NAMES = ["Sharma","Verma","Yadav","Gupta","Singh","Kumar","Patel","Chauhan","Mishra","Jain",
  "Reddy","Nair","Das","Shah","Bhatt","Rao","Pillai","Iyer","Choudhary","Malhotra"];
const AREAS = ["Kothrud","Baner","Hinjewadi","Viman Nagar","Kharadi","Wakad","Hadapsar","Shivaji Nagar",
  "Aundh","Kondhwa","Camp","Pimpri","Chinchwad","Magarpatta","Wagholi"];

function seededRand(seed) {
  const x = Math.sin(seed * 9973 + 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
function nameFor(i) {
  const f = FIRST_NAMES[i % FIRST_NAMES.length];
  const l = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
  return `${f} ${l}`;
}
function initials(name) {
  return name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
}
function phoneFor(i) {
  return "9" + String(700000000 + i * 137 + 4021).slice(0, 9);
}

const SERVICES = SERVICE_DEFS.map(([name, category, Icon], i) => ({
  id: `SVC-${i + 1}`,
  name, category, Icon,
  charge: 300 + Math.floor(seededRand(i + 1) * 10) * 50,
  status: "active",
}));

function buildWorkers() {
  const workers = [];
  let counter = 1001;
  SERVICES.forEach((svc, si) => {
    for (let k = 0; k < 3; k++) {
      const idx = si * 3 + k;
      const id = `WRK-${counter++}`;
      const statusRoll = seededRand(idx * 3 + 1);
      let status = "online";
      if (statusRoll > 0.85) status = "offline";
      else if (statusRoll > 0.65) status = "working";
      const resigned = seededRand(idx * 7 + 3) > 0.94;
      workers.push({
        id,
        name: nameFor(idx + 5),
        phone: phoneFor(idx),
        address: `${AREAS[idx % AREAS.length]}, Pune`,
        skills: [svc.name],
        rating: (3.6 + seededRand(idx * 5 + 2) * 1.4).toFixed(1),
        status: resigned ? "resigned" : status,
        photo: null,
        feedback: [],
        provisionalFund: 500 + Math.floor(seededRand(idx * 13 + 7) * 20) * 50,
        history: "",
      });
    }
  });
  // A couple of multi-skilled senior workers
  workers.push({
    id: `WRK-${counter++}`, name: "Ramesh Kulkarni", phone: phoneFor(500),
    address: "Kothrud, Pune", skills: ["Electrician", "Solar Panel Technician", "CCTV Technician"],
    rating: "4.8", status: "online", photo: null, feedback: [],
    provisionalFund: 1800, history: "",
  });
  return workers;
}

const WORKERS = buildWorkers();

// The demo worker persona used for the Worker Portal login
const DEMO_WORKER = {
  id: "WRK-1000", name: "Suresh Patil", phone: phoneFor(999),
  address: "Baner, Pune", skills: ["Electrician", "Plumber", "CCTV Technician"],
  rating: "4.7", status: "online", photo: null, feedback: [
    { customer: "Neha Kapoor", service: "Electrician", rating: 5, review: "Fixed the wiring issue quickly, very professional.", date: "24 Aug 2026" },
    { customer: "Arjun Rao", service: "Plumber", rating: 4, review: "Good work, arrived a little late.", date: "18 Aug 2026" },
  ],
  provisionalFund: 2150,
  history: "Joined KaamSetu in Jan 2025. Consistently high ratings across Electrician and Plumber jobs. No disciplinary actions on record.",
};

function buildCustomers() {
  const services = SERVICES;
  const reviews = [
    "Excellent service, very punctual and professional.",
    "Work was completed neatly, would book again.",
    "Good job overall, slightly delayed but quality was fine.",
    "Very satisfied with the service provided.",
    "Worker was polite and explained the issue well.",
  ];
  const customers = [];
  for (let i = 0; i < 10; i++) {
    const svc = services[(i * 4 + 2) % services.length];
    const worker = WORKERS.find(w => w.skills.includes(svc.name) && w.status !== "resigned") || WORKERS[0];
    const hasComplaint = i === 3 || i === 7;
    customers.push({
      id: `CUST-${2001 + i}`,
      name: nameFor(i + 40),
      phone: phoneFor(800 + i),
      address: `${AREAS[(i * 2) % AREAS.length]}, Pune`,
      wallet: 0,
      history: [{
        service: svc.name,
        worker: worker.name,
        workDone: `${svc.name} service completed at customer residence.`,
        date: `${(i % 28) + 1} Aug 2026`,
        time: `${10 + (i % 6)}:00 ${i % 2 === 0 ? "AM" : "PM"}`,
        review: reviews[i % reviews.length],
        rating: hasComplaint ? 2 : 4 + (i % 2),
        feedbackGiven: true,
        complaintStatus: hasComplaint ? "Under Review" : "None",
        charge: svc.charge,
        paid: true,
      }],
    });
  }
  return customers;
}

const CUSTOMERS = buildCustomers();

// Demo customer persona used for the Customer Portal login
const DEMO_CUSTOMER = {
  id: "CUST-3000", name: "Ananya Bhat", phone: phoneFor(950),
  address: "Kharadi, Pune", wallet: 0, history: [],
};

function buildRequests() {
  const reqs = [];
  for (let i = 0; i < 8; i++) {
    const svc = SERVICES[(i * 5 + 1) % SERVICES.length];
    const cust = CUSTOMERS[i % CUSTOMERS.length];
    const assign = i % 3 !== 0;
    const worker = assign ? WORKERS.find(w => w.skills.includes(svc.name) && w.status !== "resigned") : null;
    reqs.push({
      id: `REQ-${5001 + i}`,
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      customerAddress: cust.address,
      service: svc.name,
      charge: svc.charge,
      workerId: worker ? worker.id : null,
      workerName: worker ? worker.name : null,
      status: worker ? "assigned" : "pending",
      paid: false,
      before: null,
      after: null,
      completed: false,
    });
  }
  return reqs;
}

const INITIAL_REQUESTS = buildRequests();

function buildMembers() {
  const members = [];
  let counter = 2001;
  for (let i = 0; i < 5; i++) {
    const idx = i + 200; // offset so names/phones don't collide with worker demo data
    members.push({
      id: `MEM-${counter++}`,
      name: nameFor(idx),
      phone: phoneFor(1200 + i),
      address: `${AREAS[idx % AREAS.length]}, Pune`,
      photo: null,
      status: "active",
    });
  }
  return members;
}
const MEMBERS = buildMembers();

// Initialize complaints as an array for app-wide usage. Individual pages
// will filter by customer/worker as needed. Keep empty by default to avoid
// runtime type errors when code expects an array.
const INITIAL_COMPLAINTS = [];

function monthlyProfit() {
  const days = [];
  for (let d = 1; d <= 30; d++) {
    const base = 4000 + Math.sin(d / 3) * 900 + seededRand(d * 11) * 1400;
    days.push({ day: `${d}`, profit: Math.round(base) });
  }
  return days;
}
const PROFIT_DATA = monthlyProfit();

/* ============================== SMALL UI PARTS ============================== */
function Avatar({ name, size = 44, photo }) {
  if (photo) {
    return <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />;
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: C.navy, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600,
      fontSize: size * 0.38, flexShrink: 0, ...body
    }}>
      {initials(name)}
    </div>
  );
}

function Badge({ children, tone = "slate" }) {
  const map = {
    green: { bg: C.greenSoft, fg: C.green },
    red: { bg: C.redSoft, fg: C.red },
    amber: { bg: C.amberSoft, fg: C.amber },
    blue: { bg: C.navySoft, fg: C.navy },
    orange: { bg: C.orangeSoft, fg: C.orange },
    slate: { bg: "#F2F4F7", fg: C.secondary },
  };
  const t = map[tone] || map.slate;
  return (
    <span style={{
      background: t.bg, color: t.fg, padding: "5px 10px", borderRadius: 999,
      fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", letterSpacing: "0.01em", ...body
    }}>
      {children}
    </span>
  );
}

function statusTone(status) {
  if (["online", "available", "assigned", "completed", "resolved", "worker assigned"].includes(status)) return "green";
  if (["offline", "on leave", "rejected", "resigned", "not assigned", "complaint"].includes(status)) return "red";
  if (["pending", "under review"].includes(status)) return "amber";
  if (["working", "currently working"].includes(status)) return "blue";
  return "slate";
}

function Card({ children, style, onClick, className = "", ...props }) {
  return (
    <div className={className} onClick={onClick} style={{
      background: C.card, borderRadius: 18, border: `1px solid ${C.line}`,
      boxShadow: C.shadow, transition: "box-shadow .2s ease, transform .2s ease",
      cursor: onClick ? "pointer" : "default", ...style
    }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 12px 28px rgba(16, 42, 76, 0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={e => { if (onClick) { e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.transform = "none"; } }}
      {...props}
    >
      {children}
    </div>
  );
}

function StatCard({ label, value, Icon, accent, onClick }) {
  return (
    <Card onClick={onClick} style={{ padding: 18, display: "flex", alignItems: "center", gap: 14, minHeight: 92 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14, background: accent === C.orange ? C.orangeSoft : accent === C.green ? C.greenSoft : accent === C.red ? C.redSoft : C.navySoft,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        <Icon size={22} color={accent} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 12.5, color: C.secondary, ...body, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, ...heading, lineHeight: 1.1 }}>{value}</div>
      </div>
    </Card>
  );
}

function Btn({ children, onClick, tone = "navy", size = "md", disabled, style, className = "" }) {
  const tones = {
    navy: { bg: C.navy, fg: "#fff", hover: "#0E2340", border: "1px solid transparent" },
    orange: { bg: C.orange, fg: "#fff", hover: "#D76412", border: "1px solid transparent" },
    green: { bg: C.green, fg: "#fff", hover: "#0F7A4A", border: "1px solid transparent" },
    red: { bg: C.red, fg: "#fff", hover: "#B8322F", border: "1px solid transparent" },
    ghost: { bg: "rgba(255,255,255,0.7)", fg: C.navy, border: `1px solid ${C.line}` },
  };
  const t = tones[tone] || tones.navy;
  const pad = size === "sm" ? "8px 12px" : "12px 18px";
  return (
    <button className={className} disabled={disabled} onClick={onClick} style={{
      background: disabled ? "#DCE1EA" : t.bg, color: disabled ? C.secondary : t.fg, border: t.border,
      padding: pad, borderRadius: 12, fontWeight: 700, fontSize: size === "sm" ? 13 : 14.5,
      cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : "0 6px 18px rgba(16,42,76,0.12)",
      transition: "transform .15s ease, box-shadow .15s ease, background .15s ease",
      ...body, ...style
    }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(16,42,76,0.14)"; } }}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(16,42,76,0.12)"; } }}
    >
      {children}
    </button>
  );
}

function Modal({ title, onClose, children, width = 520 }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(18,30,54,0.45)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.card, borderRadius: 16, width: "100%", maxWidth: width,
        maxHeight: "88vh", overflowY: "auto", padding: 24, position: "relative"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ ...heading, fontSize: 24, margin: 0, color: C.ink }}>{title}</h3>
          <button onClick={onClose} style={{ background: C.paperDim, border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.slate, marginBottom: 6, ...body }}>{label}</label>
      {children}
    </div>
  );
}
const inputStyle = {
  width: "100%", minHeight: 48, padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.line}`,
  fontSize: 14.5, ...body, boxSizing: "border-box", background: "#FFFFFF", color: C.text,
  boxShadow: "inset 0 1px 2px rgba(16, 42, 76, 0.02)"
};

function Stars({ value, onChange, size = 18 }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={size} onClick={() => onChange && onChange(n)}
          fill={n <= value ? C.amber : "none"} color={n <= value ? C.amber : C.line}
          style={{ cursor: onChange ? "pointer" : "default" }} />
      ))}
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.slate, ...body }}>
      <Icon size={15} /> <span>{label}:</span> <strong style={{ color: C.ink }}>{value}</strong>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, actionLabel, onAction, tone = "navy" }) {
  const palette = {
    navy: { bg: C.navySoft, fg: C.navy },
    orange: { bg: C.orangeSoft, fg: C.orange },
    green: { bg: C.greenSoft, fg: C.green },
    red: { bg: C.redSoft, fg: C.red },
  };
  const toneStyle = palette[tone] || palette.navy;

  return (
    <Card style={{ padding: 26, textAlign: "center", background: "linear-gradient(180deg, #ffffff 0%, #fbfcff 100%)" }}>
      <div style={{ width: 56, height: 56, margin: "0 auto 14px", borderRadius: 16, background: toneStyle.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={24} color={toneStyle.fg} />
      </div>
      <div style={{ ...heading, fontSize: 20, color: C.ink, marginBottom: 6 }}>{title}</div>
      <div style={{ color: C.slate, fontSize: 14, lineHeight: 1.6, maxWidth: 420, margin: "0 auto" }}>{description}</div>
      {actionLabel && onAction && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <Btn onClick={onAction}>{actionLabel}</Btn>
        </div>
      )}
    </Card>
  );
}

/* ============================== ROLE SELECTION ============================== */
const ROLE_OPTIONS = [
  { key: "Customer", title: "I am the Customer", description: "Book and manage services", Icon: User },
  { key: "Worker", title: "I am the Worker", description: "Find jobs and manage work", Icon: HardHat },
  { key: "Federation", title: "I am the Federation", description: "Manage workers and services", Icon: Building2 },
];

function RoleSelectionScreen({ onSelectRole }) {
  const rolePalette = {
    Customer: { iconBg: "rgba(16, 42, 76, 0.08)", border: "rgba(16, 42, 76, 0.34)", text: C.navy, accent: "#DDEBFF" },
    Worker: { iconBg: "rgba(232, 117, 22, 0.12)", border: "rgba(232, 117, 22, 0.68)", text: C.orange, accent: "#FFE6D3" },
    Federation: { iconBg: "rgba(25, 135, 84, 0.10)", border: "rgba(25, 135, 84, 0.55)", text: C.green, accent: "#DFF7EA" },
  };

  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, color: C.text, position: "relative", overflow: "hidden", ...body }}>
      <img
        className="ks-landing-background"
        src={landingBackground}
        alt=""
        aria-hidden="true"
      />
      <header style={{
        maxWidth: 1260,
        margin: "0 auto",
        padding: "18px 26px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BrandMark size={34} />
          </div>
          <div>
            <BrandWordmark style={{ ...heading, fontSize: 24, fontWeight: 800, lineHeight: 1.1 }} />
            <div style={{ fontSize: 11, color: C.secondary, marginTop: 2, letterSpacing: "0.01em" }}>Rozgaar aur Seva, Sabke Liye</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button type="button" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 38, padding: "0 14px", borderRadius: 12, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.8)", color: C.navy, fontSize: 13, fontWeight: 600, cursor: "pointer", ...body }}>
            हिंदी
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 10px 0 8px", borderRadius: 12, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.8)", height: 38 }}>
            <div style={{ width: 22, height: 22, borderRadius: 8, background: C.navySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bell size={13} color={C.navy} />
            </div>
            <span style={{ fontSize: 12, color: C.secondary, fontWeight: 600 }}>Help &amp; Support</span>
            <span style={{ fontSize: 11, color: C.muted }}>24x7</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1260, margin: "0 auto", padding: "18px 26px 30px", position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative", minHeight: "calc(100vh - 120px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 980, position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.72)", border: `1px solid ${C.line}`, boxShadow: C.shadow, borderRadius: 999, padding: "12px 18px", fontSize: 15, fontWeight: 600, color: C.navy }}>
                <span style={{ width: 18, height: 18, borderRadius: 6, background: C.orangeSoft, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><CheckCircle2 size={13} color={C.orange} /></span>
                Trusted Platform • Verified Services • Secure &amp; Transparent
              </div>
            </div>

            <h1 style={{ ...heading, margin: "0 auto 12px", maxWidth: 840, textAlign: "center", fontSize: "clamp(3rem, 4vw, 5.2rem)", fontWeight: 800, color: C.navy, lineHeight: 0.96 }}>
              Welcome to <BrandWordmark />
            </h1>

            <p style={{ margin: "0 auto 24px", textAlign: "center", maxWidth: 760, color: C.secondary, fontSize: "clamp(1.05rem, 1.6vw, 1.55rem)", lineHeight: 1.45 }}>
              India&apos;s unified platform for professional services and employment. Book services, find jobs, and manage operations seamlessly.
            </p>

            <div style={{ margin: "0 auto 30px", width: 84, height: 5, borderRadius: 999, background: "linear-gradient(90deg, #E87516 0%, #E87516 100%)" }} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(220px, 1fr))", gap: 22, alignItems: "stretch" }}>
              {ROLE_OPTIONS.map(({ key, title, description, Icon }) => {
                const palette = rolePalette[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSelectRole(key)}
                    style={{
                      border: `1.5px solid ${palette.border}`,
                      background: "rgba(255,255,255,0.80)",
                      borderRadius: 18,
                      padding: 0,
                      cursor: "pointer",
                      boxShadow: C.shadow,
                      transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
                      position: "relative",
                      textAlign: "center",
                      overflow: "hidden",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 12px 28px rgba(16, 42, 76, 0.12)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = C.shadow;
                    }}
                  >
                    <div style={{ padding: "34px 24px 18px" }}>
                      <div style={{ width: 76, height: 76, borderRadius: "50%", background: palette.iconBg, border: `1px solid ${palette.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                        <Icon size={34} color={palette.text} />
                      </div>

                      <h2 style={{ ...heading, fontSize: 24, color: C.navy, margin: "0 0 8px", lineHeight: 1.2 }}>{title}</h2>
                      <p style={{ margin: 0, color: C.secondary, fontSize: 15, lineHeight: 1.45 }}>{description}</p>
                    </div>

                    <div style={{ borderTop: `1px solid ${C.line}`, margin: "0 18px", padding: "18px 0 22px" }}>
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        width: "100%",
                        maxWidth: 220,
                        padding: "12px 18px",
                        borderRadius: 12,
                        border: `1px solid ${palette.border}`,
                        color: palette.text,
                        background: palette.accent,
                        fontWeight: 700,
                        fontSize: 14,
                        ...body,
                      }}>
                        Continue as {key} <ChevronRight size={18} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 36, background: "rgba(255,255,255,0.74)", border: `1px solid ${C.line}`, borderRadius: 18, boxShadow: C.shadow, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 0 }}>
                {[
                  { label: "Verified Professionals", text: "Background verified & trained", icon: Shield, tone: "navy" },
                  { label: "Secure & Safe", text: "Your data is 100% protected", icon: CheckCircle2, tone: "green" },
                  { label: "Quality Services", text: "Government approved standards", icon: BadgeCheckIcon, tone: "orange" },
                  { label: "24x7 Support", text: "Always here to help you", icon: Bell, tone: "navy" },
                ].map(({ label, text, icon: Icon, tone }) => {
                  const palette = tone === "green" ? { bg: C.greenSoft, color: C.green } : tone === "orange" ? { bg: C.orangeSoft, color: C.orange } : { bg: C.navySoft, color: C.navy };
                  return (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 18px", borderRight: label !== "24x7 Support" ? `1px solid ${C.line}` : "none" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: palette.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={18} color={palette.color} />
                      </div>
                      <div>
                        <div style={{ ...heading, fontWeight: 700, color: C.navy, fontSize: 16, lineHeight: 1.2 }}>{label}</div>
                        <div style={{ color: C.secondary, fontSize: 12.5, marginTop: 2 }}>{text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ============================== LOGIN ============================== */
const FEDERATION_ROLE_OPTIONS = ["Admin", "Member"];

function AuthBrandHeader() {
  return (
    <div className="ks-auth-header" style={{ padding: "16px 32px", display: "flex", alignItems: "center", gap: 10 }}>
      <BrandMark size={44} />
      <BrandWordmark style={{ ...heading, fontSize: 22, fontWeight: 700 }} />
    </div>
  );
}

function AuthSecurityPanel() {
  return (
    <div className="ks-auth-security">
      <Shield size={18} color={C.green} aria-hidden="true" />
      <div>
        <div style={{ fontWeight: 700, color: C.ink, fontSize: 13.5 }}>Secure authentication</div>
        <div style={{ color: C.slate, fontSize: 12.5, marginTop: 2 }}>Your information is used only to sign you in.</div>
      </div>
    </div>
  );
}

function AuthFooter() {
  return (
    <footer className="ks-auth-footer">© 2026 KaamSetu. All rights reserved.</footer>
  );
}

function AuthIntroPanel() {
  const trustItems = [
    { label: "Trusted", detail: "Verified Platform", Icon: Shield, color: C.navy },
    { label: "Secure", detail: "Your Data is Safe", Icon: CheckCircle2, color: C.green },
    { label: "Reliable", detail: "Quality Services", Icon: Star, color: C.orange },
    { label: "Support", detail: "24x7 Assistance", Icon: Bell, color: C.navy },
  ];

  return (
    <section className="ks-auth-intro" aria-label="About KaamSetu">
      <div className="ks-auth-intro-copy">
        <div className="ks-auth-kicker">Welcome to</div>
        <h1><BrandWordmark /></h1>
        <p>India&apos;s unified platform for professional services and employment.</p>
        <p>Book services, find jobs, and manage operations seamlessly.</p>
      </div>
      <div className="ks-auth-trust-strip">
        {trustItems.map(({ label, detail, Icon, color }) => (
          <div className="ks-auth-trust-item" key={label}>
            <Icon size={17} color={color} aria-hidden="true" />
            <div><strong>{label}</strong><span>{detail}</span></div>
          </div>
        ))}
      </div>
      <div className="ks-auth-institution">
        <Building2 size={18} color={C.navy} aria-hidden="true" />
        <div><strong>KaamSetu Service Network</strong><span>Connecting customers with trusted professionals.</span></div>
      </div>
    </section>
  );
}

function AuthBackButton({ onClick, label = "Change role" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        color: C.navy,
        fontWeight: 600,
        fontSize: 14,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        padding: 0,
        marginBottom: 12,
        ...body,
      }}
    >
      <ArrowLeft size={15} /> {label}
    </button>
  );
}

// Local error boundary to avoid full-app crash from this panel
class LocalErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('LocalErrorBoundary caught error:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <Card style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, color: C.red }}>Unable to load component right now.</div>
          <div style={{ color: C.slate, marginTop: 8 }}>Some information is temporarily unavailable. Try refreshing.</div>
        </Card>
      );
    }
    return this.props.children;
  }
}

function LoginPage({ selectedRole, federationRole, setFederationRole, onLogin, onChangeRole }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const isFederation = selectedRole === "Federation";
  const roleVisual = selectedRole === "Worker"
    ? { Icon: HardHat, color: C.orange, background: C.orangeSoft }
    : selectedRole === "Federation"
      ? { Icon: Building2, color: C.green, background: C.greenSoft }
      : { Icon: User, color: C.navy, background: C.navySoft };

  return (
    <div className="ks-auth-page" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column", "--ks-auth-background": `url(${loginBackground})`, ...body }}>
      <div className="ks-auth-header" style={{ padding: "16px 32px", display: "flex", alignItems: "center", gap: 10 }}>
        <BrandMark size={44} />
        <BrandWordmark style={{ ...heading, fontSize: 22, fontWeight: 700 }} />
      </div>

      <div className="ks-auth-main">
        <AuthIntroPanel />
        <div className="ks-auth-content" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <button
            type="button"
            onClick={onChangeRole}
            style={{
              background: "transparent",
              border: "none",
              color: C.navy,
              fontWeight: 600,
              fontSize: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              padding: 0,
              marginBottom: 12,
              ...body,
            }}
          >
            <ArrowLeft size={15} /> Change role
          </button>

          <div className="ks-auth-role-icon" style={{ background: roleVisual.background, color: roleVisual.color }}>
            <roleVisual.Icon size={20} aria-hidden="true" />
          </div>
          <h1 style={{ ...heading, fontSize: 46, color: C.ink, margin: "0 0 6px" }}>Welcome</h1>
          <p style={{ color: C.slate, marginBottom: 26, fontSize: 15 }}>Login as: {selectedRole}</p>

          {isFederation && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.slate, marginBottom: 6, ...body }}>
                Federation Role
              </label>
              <select
                value={federationRole}
                onChange={e => setFederationRole(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 9,
                  border: `1px solid ${C.line}`,
                  fontSize: 14.5,
                  ...body,
                  boxSizing: "border-box",
                  background: "#FBFAF6",
                }}
              >
                {FEDERATION_ROLE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )}

          <Card className="ks-login-card" style={{ padding: 26 }}>
            <Field label="Phone Number">
              <input style={inputStyle} placeholder="Enter 10-digit phone number" value={phone}
                onChange={e => setPhone(e.target.value)} maxLength={10} />
            </Field>
            <Field label="OTP">
              <input style={inputStyle} placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} />
            </Field>
            <Btn style={{ width: "100%", marginTop: 4 }} onClick={() => onLogin(selectedRole, federationRole, phone)}>Login</Btn>
          </Card>
          <AuthSecurityPanel />
        </div>
      </div>
      </div>
      <AuthFooter />
    </div>
  );
}

const CUSTOMER_ACCOUNT_OPTIONS = [
  { key: "existing", title: "I Have an Account", description: "Login with your phone number", Icon: User },
  { key: "new", title: "Create New Account", description: "Register to book services", Icon: UserPlus },
];

function CustomerAccountSelectionScreen({ onSelect, onChangeRole }) {
  return (
  <div className="ks-auth-page" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column", "--ks-auth-background": `url(${loginBackground})`, ...body }}>
      <AuthBrandHeader />
      <div className="ks-auth-main">
        <AuthIntroPanel />
        <div className="ks-auth-content" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 20px 40px" }}>
        <div style={{ width: "100%", maxWidth: 720 }}>
          <AuthBackButton onClick={onChangeRole} />
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 style={{ ...heading, fontSize: 46, color: C.ink, margin: "0 0 8px" }}>Welcome</h1>
            <p style={{ color: C.slate, margin: 0, fontSize: 18 }}>Continue as Customer</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {CUSTOMER_ACCOUNT_OPTIONS.map(({ key, title, description, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                style={{
                  border: `1px solid ${C.line}`,
                  background: C.card,
                  borderRadius: 20,
                  padding: "26px 20px",
                  textAlign: "left",
                  boxShadow: "0 1px 2px rgba(27,42,74,0.05)",
                  cursor: "pointer",
                  transition: "box-shadow .15s, transform .15s, border-color .15s",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  ...body,
                  outline: "none",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 8px 22px rgba(27,42,74,0.12)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = C.navy;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "0 1px 2px rgba(27,42,74,0.05)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.borderColor = C.line;
                }}
                onFocus={e => {
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(27,42,74,0.12)";
                  e.currentTarget.style.borderColor = C.navy;
                }}
                onBlur={e => {
                  e.currentTarget.style.boxShadow = "0 1px 2px rgba(27,42,74,0.05)";
                  e.currentTarget.style.borderColor = C.line;
                }}
              >
                <div style={{
                  width: 58, height: 58, borderRadius: 16, background: "rgba(27,42,74,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Icon size={26} color={C.navy} />
                </div>
                <div style={{ ...heading, fontSize: 28, color: C.ink, lineHeight: 1.1 }}>{title}</div>
                <div style={{ color: C.slate, fontSize: 14 }}>{description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
      <AuthFooter />
    </div>
  );
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d{10}$/;

const BadgeCheckIcon = ({ size = 18, color = C.navy }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3.75 4.5 6.5v5.8c0 4.5 3.1 8.7 7.5 10.95 4.4-2.25 7.5-6.45 7.5-10.95V6.5L12 3.75Zm4.2 7.4-4.7 4.7-2.4-2.4 1.3-1.3 1.1 1.1 3.4-3.4 1.3 1.3Z" fill={color} />
  </svg>
);

function fieldErrorStyle() {
  return { color: C.red, fontSize: 12.5, marginTop: 6, ...body };
}

function CustomerRegisterContactScreen({ initial = {}, onContinue, onBack }) {
  const [email, setEmail] = useState(initial.email || "");
  const [phone, setPhone] = useState(initial.phone || "");
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) next.email = "Email address is required.";
    else if (!EMAIL_PATTERN.test(trimmedEmail)) next.email = "Enter a valid email address.";
    if (!phone.trim()) next.phone = "Phone number is required.";
    else if (!PHONE_PATTERN.test(phone.trim())) next.phone = "Enter a 10-digit phone number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  return (
  <div className="ks-auth-page" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column", "--ks-auth-background": `url(${loginBackground})`, ...body }}>
      <AuthBrandHeader />
    <div className="ks-auth-main">
      <AuthIntroPanel />
      <div className="ks-auth-content" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <AuthBackButton onClick={onBack} label="Back" />
          <h1 style={{ ...heading, fontSize: 46, color: C.ink, margin: "0 0 6px" }}>Create Account</h1>
          <p style={{ color: C.slate, marginBottom: 26, fontSize: 15 }}>Login as: Customer</p>
          <Card style={{ padding: 26 }}>
            <Field label="Email Address">
              <input
                style={inputStyle}
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              {errors.email && <div style={fieldErrorStyle()}>{errors.email}</div>}
            </Field>
            <Field label="Phone Number">
              <input
                style={inputStyle}
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
              />
              {errors.phone && <div style={fieldErrorStyle()}>{errors.phone}</div>}
            </Field>
            <Btn style={{ width: "100%", marginTop: 4 }} onClick={() => {
              if (!validate()) return;
              onContinue({ email: email.trim(), phone: phone.trim() });
            }}>Continue</Btn>
          </Card>
        </div>
      </div>
      </div>
      <AuthFooter />
    </div>
  );
}

function CustomerRegisterOtpScreen({ email, phone, onVerified, onBack }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  return (
  <div className="ks-auth-page" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column", "--ks-auth-background": `url(${loginBackground})`, ...body }}>
      <AuthBrandHeader />
    <div className="ks-auth-main">
      <AuthIntroPanel />
      <div className="ks-auth-content" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <AuthBackButton onClick={onBack} label="Back" />
          <h1 style={{ ...heading, fontSize: 46, color: C.ink, margin: "0 0 6px" }}>Verify OTP</h1>
          <p style={{ color: C.slate, marginBottom: 26, fontSize: 15 }}>
            Enter OTP for {phone}
          </p>
          <Card style={{ padding: 26 }}>
            <div style={{ fontSize: 13, color: C.slate, marginBottom: 14 }}>{email}</div>
            <Field label="OTP">
              <input
                style={inputStyle}
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
              />
              {error && <div style={fieldErrorStyle()}>{error}</div>}
            </Field>
            <Btn style={{ width: "100%", marginTop: 4 }} onClick={() => {
              if (!otp.trim()) {
                setError("OTP is required.");
                return;
              }
              if (otp.trim().length < 4) {
                setError("Enter the OTP to continue.");
                return;
              }
              setError("");
              onVerified();
            }}>Verify</Btn>
          </Card>
        </div>
      </div>
      </div>
      <AuthFooter />
    </div>
  );
}

function CustomerProfileSetupScreen({ email, phone, onComplete, onBack }) {
  const photoInputRef = useRef(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [house, setHouse] = useState("");
  const [building, setBuilding] = useState("");
  const [street, setStreet] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pin, setPin] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhoto(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function validate() {
    const next = {};
    if (!name.trim()) next.name = "Full name is required.";
    if (!house.trim()) next.house = "House / Flat Number is required.";
    if (!building.trim()) next.building = "Building / Society Name is required.";
    if (!street.trim()) next.street = "Street / Area is required.";
    if (!locality.trim()) next.locality = "Locality is required.";
    if (!city.trim()) next.city = "City is required.";
    if (!stateName.trim()) next.stateName = "State is required.";
    if (!pin.trim()) next.pin = "PIN Code is required.";
    else if (!/^\d{6}$/.test(pin.trim())) next.pin = "Enter a 6-digit PIN Code.";
    if (!agreed) next.agreed = "You must agree to the Terms & Conditions and Privacy Policy.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const canSubmit = !!(
    name.trim() && house.trim() && building.trim() && street.trim() &&
    locality.trim() && city.trim() && stateName.trim() && /^\d{6}$/.test(pin.trim()) && agreed
  );

  return (
  <div className="ks-auth-page" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column", "--ks-auth-background": `url(${loginBackground})`, ...body }}>
      <AuthBrandHeader />
    <div className="ks-auth-main">
      <AuthIntroPanel />
      <div className="ks-auth-content" style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 20px 40px" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>
          <AuthBackButton onClick={onBack} label="Back" />
          <h1 style={{ ...heading, fontSize: 42, color: C.ink, margin: "0 0 6px" }}>Profile Setup</h1>
          <p style={{ color: C.slate, marginBottom: 22, fontSize: 15 }}>Complete your customer profile</p>
          <Card style={{ padding: 26 }}>
            <div style={{ fontSize: 13, color: C.slate, marginBottom: 16 }}>
              {email} · {phone}
            </div>

            <h3 style={{ ...heading, fontSize: 20, margin: "0 0 12px", color: C.ink }}>Personal Details</h3>
            <Field label="Full Name">
              <input style={inputStyle} placeholder="Enter full name" value={name} onChange={e => setName(e.target.value)} />
              {errors.name && <div style={fieldErrorStyle()}>{errors.name}</div>}
            </Field>

            <h3 style={{ ...heading, fontSize: 20, margin: "8px 0 12px", color: C.ink }}>Profile Image</h3>
            <Field label="Upload Profile Photo">
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                {photo ? (
                  <img src={photo} alt="Profile preview" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `1px solid ${C.line}` }} />
                ) : (
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%", background: C.paperDim,
                    display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.line}`
                  }}>
                    <Camera size={22} color={C.slate} />
                  </div>
                )}
                <div>
                  <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhoto} style={{ fontSize: 13.5 }} />
                  {photo && (
                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                      <Btn size="sm" tone="ghost" onClick={() => photoInputRef.current && photoInputRef.current.click()}>Replace</Btn>
                      <Btn size="sm" tone="ghost" onClick={removePhoto}>Remove</Btn>
                    </div>
                  )}
                </div>
              </div>
            </Field>

            <h3 style={{ ...heading, fontSize: 20, margin: "8px 0 12px", color: C.ink }}>Complete Address</h3>
            <Field label="House / Flat Number">
              <input style={inputStyle} value={house} onChange={e => setHouse(e.target.value)} />
              {errors.house && <div style={fieldErrorStyle()}>{errors.house}</div>}
            </Field>
            <Field label="Building / Society Name">
              <input style={inputStyle} value={building} onChange={e => setBuilding(e.target.value)} />
              {errors.building && <div style={fieldErrorStyle()}>{errors.building}</div>}
            </Field>
            <Field label="Street / Area">
              <input style={inputStyle} value={street} onChange={e => setStreet(e.target.value)} />
              {errors.street && <div style={fieldErrorStyle()}>{errors.street}</div>}
            </Field>
            <Field label="Locality">
              <input style={inputStyle} value={locality} onChange={e => setLocality(e.target.value)} />
              {errors.locality && <div style={fieldErrorStyle()}>{errors.locality}</div>}
            </Field>
            <Field label="City">
              <input style={inputStyle} value={city} onChange={e => setCity(e.target.value)} />
              {errors.city && <div style={fieldErrorStyle()}>{errors.city}</div>}
            </Field>
            <Field label="State">
              <input style={inputStyle} value={stateName} onChange={e => setStateName(e.target.value)} />
              {errors.stateName && <div style={fieldErrorStyle()}>{errors.stateName}</div>}
            </Field>
            <Field label="PIN Code">
              <input
                style={inputStyle}
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                placeholder="6-digit PIN Code"
              />
              {errors.pin && <div style={fieldErrorStyle()}>{errors.pin}</div>}
            </Field>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, margin: "6px 0 16px", cursor: "pointer", fontSize: 13.5, color: C.ink, ...body }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: 3, width: 16, height: 16, flexShrink: 0 }}
              />
              <span>I agree to the Terms & Conditions and Privacy Policy</span>
            </label>
            {errors.agreed && <div style={{ ...fieldErrorStyle(), marginTop: -8, marginBottom: 12 }}>{errors.agreed}</div>}

            <Btn
              style={{ width: "100%" }}
              disabled={!canSubmit}
              onClick={() => {
                if (!validate()) return;
                const address = [house.trim(), building.trim(), street.trim(), locality.trim(), city.trim(), stateName.trim(), pin.trim()].join(", ");
                onComplete({
                  name: name.trim(),
                  email,
                  phone,
                  photo,
                  address,
                  house: house.trim(),
                  building: building.trim(),
                  street: street.trim(),
                  locality: locality.trim(),
                  city: city.trim(),
                  state: stateName.trim(),
                  pin: pin.trim(),
                });
              }}
            >Complete Registration</Btn>
          </Card>
        </div>
      </div>
      </div>
      <AuthFooter />
    </div>
  );
}

/* ============================== SHELL (sidebar/header layout) ============================== */
function Shell({ title, navItems, active, setActive, onLogout, children, navSide = "left" }) {
  const nav = (
    <aside style={{
      width: 268, background: "linear-gradient(180deg, #102A4C 0%, #0A1F3B 100%)", color: "#fff",
      padding: "20px 14px 16px", display: "flex", flexDirection: "column", gap: 6, flexShrink: 0,
      borderRight: "1px solid rgba(255,255,255,0.08)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 10px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 10 }}>
        <BrandMark size={42} />
        <div>
          <BrandWordmark style={{ ...heading, fontSize: 22, fontWeight: 800, lineHeight: 1.1 }} />
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.7)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Service Network</div>
        </div>
      </div>

      {navItems.map(item => (
        <button key={item.key} onClick={() => setActive(item.key)} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 12px", borderRadius: 12,
          background: active === item.key ? "rgba(255,255,255,0.08)" : "transparent",
          color: active === item.key ? "#fff" : "#D5DCEC", border: "none", cursor: "pointer",
          fontSize: 14.5, fontWeight: 600, textAlign: "left", ...body,
          borderLeft: active === item.key ? `3px solid ${C.orange}` : "3px solid transparent",
          boxShadow: active === item.key ? "inset 0 1px 0 rgba(255,255,255,0.08)" : "none",
          transition: "all .2s ease"
        }}>
          <item.Icon size={17} /> {item.label}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      <button onClick={onLogout} style={{
        display: "flex", alignItems: "center", gap: 12, padding: "12px 12px", borderRadius: 12,
        background: "transparent", color: "#D5DCEC", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
        fontSize: 14.5, ...body, marginTop: 8
      }}>
        <LogOut size={17} /> Logout
      </button>
    </aside>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: C.pageBg, ...body }}>
      {navSide === "left" && nav}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header style={{
          padding: "16px 28px", background: "rgba(255,255,255,0.82)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.line}`,
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 20
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
            <button aria-label="Toggle navigation" style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${C.line}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Menu size={18} color={C.navy} />
            </button>
            <div style={{ position: "relative", flex: 1, maxWidth: 440 }}>
              <Search size={16} color={C.muted} style={{ position: "absolute", left: 14, top: 13 }} />
              <input aria-label="Search" placeholder="Search" style={{ ...inputStyle, paddingLeft: 38, maxWidth: "100%" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${C.line}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Language selector">
              <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>हिं</span>
            </button>
            <button style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${C.line}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Notifications">
              <Bell size={18} color={C.navy} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px 6px 8px", borderRadius: 12, border: `1px solid ${C.line}`, background: "#fff" }}>
              <Avatar name="KD" size={30} />
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Admin</div>
            </div>
          </div>
        </header>

        <main style={{ padding: 26, flex: 1, minWidth: 0 }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ ...heading, fontSize: 32, color: C.navy, margin: 0 }}>{title}</div>
              <div style={{ width: 72, height: 4, background: "linear-gradient(90deg, #E87516 0%, #E87516 100%)", borderRadius: 999, marginTop: 10 }} />
            </div>
            {children}
          </div>
        </main>
      </div>
      {navSide === "right" && nav}
    </div>
  );
}

/* ============================== FEDERATION PORTAL ============================== */
// Federation Member sees the same dashboard/content as Federation Admin,
// backed by the same shared state — the difference between the two is the
// role permissions (view-only vs. add/resign actions), not a separate UI
// or dataset. Both roles render through this single FederationPortal.
function FederationMemberPortal({ state, actions, onLogout }) {
  return <FederationPortal state={state} actions={actions} onLogout={onLogout} role="Member" />;
}

function FederationPortal({ state, actions, onLogout, role = "Admin" }) {
  const [tab, setTab] = useState("dashboard");
  const isAdmin = role === "Admin";

  // Federation Admin navbar follows an exact required sequence and no
  // longer includes Add Worker or the Current Requests folder. Federation
  // Member keeps its existing navigation (including Add Worker access was
  // never part of it), with Services management now included.
  const adminNav = [
    { key: "dashboard", label: "Dashboard", Icon: BarChart3 },
    { key: "addfedmember", label: "Add Member", Icon: UserPlus },
    { key: "members", label: "Members", Icon: Building2 },
    { key: "services", label: "Services", Icon: Layers },
    { key: "customers", label: "Customer", Icon: Users },
    { key: "workers", label: "Worker", Icon: HardHat },
    { key: "complaints", label: "Complaints", Icon: FileWarning },
  ];
  const memberNav = [
    { key: "dashboard", label: "Dashboard", Icon: BarChart3 },
    { key: "addmember", label: "Add Member", Icon: UserPlus },
    { key: "services", label: "Services", Icon: Layers },
    { key: "customers", label: "Customers", Icon: Users },
    { key: "workers", label: "Workers", Icon: HardHat },
    { key: "complaints", label: "Complaints", Icon: FileWarning },
  ];
  const nav = isAdmin ? adminNav : memberNav;
  const titles = {
    dashboard: "Federation Dashboard", addfedmember: "Add Member",
    addmember: "Add Member",
    requests: "Current Requests", services: "Services", customers: "Customers",
    workers: "Workers", complaints: "Complaints", members: "Members",
  };
  return (
    <Shell title={titles[tab]} navItems={nav} active={tab} setActive={setTab} onLogout={onLogout}>
      {tab === "dashboard" && <FedDashboard state={state} setTab={setTab} />}
      {tab === "addfedmember" && isAdmin && <AddFederationMember state={state} actions={actions} />}
      {tab === "addmember" && !isAdmin && <AddMember state={state} actions={actions} />}
      {tab === "requests" && <FedRequests state={state} />}
      {tab === "services" && <FedServices state={state} actions={actions} role={role} />}
      {tab === "customers" && <FedCustomers state={state} />}
      {tab === "workers" && <FedWorkers state={state} actions={actions} role={role} />}
      {tab === "complaints" && <FedComplaints state={state} actions={actions} role={role} />}
      {tab === "members" && <FedMembers state={state} actions={actions} role={role} />}
    </Shell>
  );
}

function FedDashboard({ state, setTab }) {
  const { workers, requests, complaints } = state;
  const active = workers.filter(w => w.status !== "resigned");
  const present = active.filter(w => w.status === "online" || w.status === "working").length;
  const working = active.filter(w => w.status === "working").length;
  const available = present - working;
  const onLeave = active.filter(w => w.status === "offline").length;
  const complaintCount = (complaints || []).length;
  const revenue = requests.filter(r => r.completed).reduce((s, r) => s + Math.round(r.charge * 0.1), 0) + 8400;
  const [chartType, setChartType] = useState("bar");

  // The six required, clickable Federation dashboard cards. Each navigates
  // to the existing section that already contains that content — no new
  // pages are created.
  const stats = [
    { label: "Workers", value: workers.length, Icon: Users, accent: C.navy, onClick: () => setTab("workers") },
    { label: "Available Workers", value: available, Icon: CheckCircle2, accent: C.greenDeep, onClick: () => setTab("workers") },
    { label: "Currently Working", value: working, Icon: HardHat, accent: C.green, onClick: () => setTab("workers") },
    { label: "Workers on Leave", value: onLeave, Icon: Clock, accent: C.amber, onClick: () => setTab("workers") },
    { label: "Customer Request Count", value: requests.length, Icon: ClipboardList, accent: C.blue, onClick: () => setTab("requests") },
    { label: "Workers Customers Complaint Count", value: complaintCount, Icon: FileWarning, accent: C.red, onClick: () => setTab("complaints") },
  ];

  return (
    <LocalErrorBoundary>
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 14, marginBottom: 26 }}>
        <StatCard label="Total Daily Revenue" value={`₹${revenue.toLocaleString("en-IN")}`} Icon={IndianRupee} accent={C.orange} />
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <Card style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h3 style={{ ...heading, fontSize: 21, margin: 0, color: C.ink }}>Daily Profit Analysis</h3>
            <p style={{ color: C.slate, fontSize: 13.5, margin: "4px 0 0" }}>Today vs. previous days, across the current month</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setChartType("bar")} style={{
              background: chartType === "bar" ? C.navy : "transparent", color: chartType === "bar" ? "#fff" : C.slate,
              border: `1px solid ${C.line}`, borderRadius: 8, padding: 8, cursor: "pointer"
            }}><BarChart3 size={16} /></button>
            <button onClick={() => setChartType("line")} style={{
              background: chartType === "line" ? C.navy : "transparent", color: chartType === "line" ? "#fff" : C.slate,
              border: `1px solid ${C.line}`, borderRadius: 8, padding: 8, cursor: "pointer"
            }}><LineChartIcon size={16} /></button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "bar" ? (
            <BarChart data={PROFIT_DATA}>
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.slate }} axisLine={{ stroke: C.line }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 13 }} />
              <Bar dataKey="profit" fill={C.orange} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={PROFIT_DATA}>
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.slate }} axisLine={{ stroke: C.line }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 13 }} />
              <Line type="monotone" dataKey="profit" stroke={C.navy} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </Card>
    </div>
  </LocalErrorBoundary>
  );
}

function AddMember({ state, actions }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState(null);
  const [skills, setSkills] = useState([]);
  const [added, setAdded] = useState(null);

  function toggleSkill(s) {
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }
  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }
  function submit() {
    if (!name || skills.length === 0) return;
    const w = actions.addWorker({ name, phone, address, photo, skills, status: "online" });
    setAdded(w.id);
    setName(""); setPhone(""); setAddress(""); setPhoto(null); setSkills([]);
  }

  // Only currently-available Services are offered as selectable Skills —
  // Services marked unavailable ("removed") follow the existing Service
  // availability logic and are excluded here, same as the Worker Edit skills list.
  const activeServices = state.services.filter(s => s.status !== "removed");
  const categories = [...new Set(activeServices.map(s => s.category))];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20 }}>
      <Card style={{ padding: 24 }}>
        <h3 style={{ ...heading, fontSize: 20, marginTop: 0, color: C.ink }}>Worker Registration</h3>
        {added && (
          <div style={{ background: "#E4F3EA", color: C.greenDeep, padding: "10px 14px", borderRadius: 9, marginBottom: 16, fontSize: 14 }}>
            Worker added successfully with ID <strong>{added}</strong>.
          </div>
        )}
        <Field label="Worker Name">
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Worker Photo">
          <input type="file" accept="image/*" onChange={handlePhoto} style={{ fontSize: 13.5 }} />
          {photo && <img src={photo} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", marginTop: 8 }} />}
        </Field>
        <Field label="Phone Number">
          <input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit number" maxLength={10} />
        </Field>
        <Field label="Address">
          <input style={inputStyle} value={address} onChange={e => setAddress(e.target.value)} placeholder="Locality, City" />
        </Field>
        <Field label="Worker ID (auto-generated)">
          <input style={{ ...inputStyle, background: "#EDECE6", color: C.slate }} value={`WRK-${1001 + state.workers.length}`} disabled />
        </Field>
        <Btn onClick={submit} disabled={!name || skills.length === 0}>Add Worker</Btn>
      </Card>

      <Card style={{ padding: 24 }}>
        <h3 style={{ ...heading, fontSize: 20, marginTop: 0, color: C.ink }}>Services / Skills</h3>
        <p style={{ color: C.slate, fontSize: 13.5, marginTop: -6, marginBottom: 14 }}>Select every service this worker is proficient in.</p>
        {categories.map(cat => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{cat}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {activeServices.filter(s => s.category === cat).map(s => (
                <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.ink, cursor: "pointer" }}>
                  <input type="checkbox" checked={skills.includes(s.name)} onChange={() => toggleSkill(s.name)} />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// Federation Admin -> "Add Member" (adding a Federation Member — distinct
// from "Add Worker" above). Member ID is auto-generated and cannot be
// typed in, following the same pattern as the Worker ID above.
function AddFederationMember({ state, actions }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState(null);
  const [added, setAdded] = useState(null);

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }
  function submit() {
    if (!name || !phone || !address) return;
    const m = actions.addMember({ name, phone, address, photo });
    setAdded(m.id);
    setName(""); setPhone(""); setAddress(""); setPhoto(null);
  }

  const nextId = `MEM-${2001 + state.members.length}`;

  return (
    <Card style={{ padding: 24, maxWidth: 480 }}>
      <h3 style={{ ...heading, fontSize: 20, marginTop: 0, color: C.ink }}>Federation Member Registration</h3>
      {added && (
        <div style={{ background: "#E4F3EA", color: C.greenDeep, padding: "10px 14px", borderRadius: 9, marginBottom: 16, fontSize: 14 }}>
          Member added successfully with ID <strong>{added}</strong>.
        </div>
      )}
      <Field label="Member Name">
        <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
      </Field>
      <Field label="Member Photo">
        <input type="file" accept="image/*" onChange={handlePhoto} style={{ fontSize: 13.5 }} />
        {photo && <img src={photo} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", marginTop: 8 }} />}
      </Field>
      <Field label="Phone Number">
        <input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit number" maxLength={10} />
      </Field>
      <Field label="Address">
        <input style={inputStyle} value={address} onChange={e => setAddress(e.target.value)} placeholder="Locality, City" />
      </Field>
      <Field label="Member ID (auto-generated)">
        <input style={{ ...inputStyle, background: "#EDECE6", color: C.slate }} value={nextId} disabled />
      </Field>
      <Btn onClick={submit} disabled={!name || !phone || !address}>Add Member</Btn>
    </Card>
  );
}

// Federation Members folder: Active Members / Resigned Members, with a
// Resign action available to the Admin role only.
function FedMembers({ state, actions, role }) {
  const [showResigned, setShowResigned] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [query, setQuery] = useState("");
  const isAdmin = role === "Admin";
  const activeMembers = state.members.filter(m => m.status !== "resigned");
  const resignedMembers = state.members.filter(m => m.status === "resigned");
  const baseList = showResigned ? resignedMembers : activeMembers;
  const q = query.trim().toLowerCase();
  const list = q
    ? baseList.filter(m =>
        m.name.toLowerCase().includes(q) ||
        (m.id || "").toLowerCase().includes(q) ||
        (m.phone || "").toLowerCase().includes(q) ||
        (m.address || "").toLowerCase().includes(q)
      )
    : baseList;

  return (
    <div>
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <StatCard label="Active Members" value={activeMembers.length} Icon={Building2} accent={C.navy} />
        <StatCard label="Resigned Members" value={resignedMembers.length} Icon={XCircle} accent={C.red} />
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <Btn tone={!showResigned ? "navy" : "ghost"} size="sm" onClick={() => setShowResigned(false)}>Active Members</Btn>
        <Btn tone={showResigned ? "navy" : "ghost"} size="sm" onClick={() => setShowResigned(true)}>Resigned Members</Btn>
      </div>
      <div style={{ position: "relative", marginBottom: 18, maxWidth: 420 }}>
        <Search size={16} color={C.slate} style={{ position: "absolute", left: 14, top: 12 }} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search members by name, ID, phone or address..."
          style={{ ...inputStyle, paddingLeft: 38 }} />
      </div>
      {q && list.length === 0 && (
        <div style={{ color: C.slate, fontSize: 13.5, marginBottom: 16 }}>No members match "{query}".</div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px,1fr))", gap: 14 }}>
        {list.map(m => (
          <Card key={m.id} style={{ padding: 16, textAlign: "center", opacity: m.status === "resigned" ? 0.75 : 1 }}>
            <Avatar name={m.name} photo={m.photo} size={56} />
            <div style={{ fontWeight: 700, color: C.ink, marginTop: 10, fontSize: 14.5 }}>{m.name}</div>
            <div style={{ fontSize: 12, color: C.slate }}>{m.id}</div>
            <div style={{ fontSize: 12, color: C.slate, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <MapPin size={11} />{m.address}
            </div>
            <div style={{ fontSize: 12, color: C.slate, marginTop: 4 }}>{m.phone}</div>
            <div style={{ marginTop: 8 }}>
              {m.status === "resigned" ? <Badge tone="red">RESIGNED</Badge> : <Badge tone="green">active</Badge>}
            </div>
            {isAdmin && m.status !== "resigned" && (
              <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "center" }}>
                <Btn tone="ghost" size="sm" onClick={() => setEditMember(m)}>Edit</Btn>
                <Btn tone="red" size="sm" onClick={() => actions.resignMember(m.id)}>Resign</Btn>
              </div>
            )}
          </Card>
        ))}
      </div>
      {editMember && (
        <MemberEditModal
          member={state.members.find(m => m.id === editMember.id) || editMember}
          actions={actions}
          onClose={() => setEditMember(null)}
        />
      )}
    </div>
  );
}

// Federation Admin -> Edit Member. Name, photo, phone, address are editable;
// Member ID stays visible but is never editable.
function MemberEditModal({ member, actions, onClose }) {
  const [name, setName] = useState(member.name);
  const [phone, setPhone] = useState(member.phone);
  const [address, setAddress] = useState(member.address);
  const [photo, setPhoto] = useState(member.photo);

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }
  function save() {
    actions.updateMemberProfile(member.id, { name, phone, address, photo });
    onClose();
  }

  return (
    <Modal title="Edit Member" onClose={onClose}>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div>
          <Avatar name={name} photo={photo} size={68} />
          <div style={{ marginTop: 8, width: 100 }}>
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ fontSize: 11, width: "100%" }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: C.slate }}>Member ID</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.ink }}>{member.id}</div>
        </div>
      </div>
      <Field label="Member Name">
        <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
      </Field>
      <Field label="Phone Number">
        <input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} />
      </Field>
      <Field label="Address">
        <input style={inputStyle} value={address} onChange={e => setAddress(e.target.value)} />
      </Field>
      <Btn onClick={save} disabled={!name || !phone || !address}>Save</Btn>
    </Modal>
  );
}

function FedRequests({ state }) {
  const [sel, setSel] = useState(null);
  const liveWorkerName = (r) => {
    if (!r.workerId) return r.workerName;
    const w = state.workers.find(w => w.id === r.workerId);
    return w ? w.name : r.workerName;
  };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 16 }}>
        {state.requests.map(r => (
          <Card key={r.id} onClick={() => setSel(r)} style={{
            padding: 18, borderLeft: `5px solid ${r.workerId ? C.green : C.red}`
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
              <Avatar name={r.customerName} size={40} />
              <div>
                <div style={{ fontWeight: 700, color: C.ink, fontSize: 15 }}>{r.customerName}</div>
                <div style={{ fontSize: 12.5, color: C.slate, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} />{r.customerAddress}</div>
              </div>
            </div>
            <Stat icon={Phone} label="Phone" value={r.customerPhone} />
            <Stat icon={Wrench} label="Service" value={r.service} />
            <Stat icon={IndianRupee} label="Charges" value={r.charge} />
            <div style={{ marginTop: 10 }}>
              {r.workerId ? <Badge tone="green">Worker Assigned — {liveWorkerName(r)}</Badge> : <Badge tone="red">Worker Not Assigned</Badge>}
            </div>
          </Card>
        ))}
      </div>
      {sel && (
        <Modal title={`Request ${sel.id}`} onClose={() => setSel(null)}>
          <Stat icon={Users} label="Customer" value={sel.customerName} />
          <Stat icon={Phone} label="Phone" value={sel.customerPhone} />
          <Stat icon={MapPin} label="Location" value={sel.customerAddress} />
          <Stat icon={Wrench} label="Service" value={sel.service} />
          <Stat icon={IndianRupee} label="Charges" value={sel.charge} />
          <Stat icon={HardHat} label="Worker" value={liveWorkerName(sel) || "Not assigned yet"} />
          <div style={{ marginTop: 10 }}><Badge tone={sel.workerId ? "green" : "red"}>{sel.status}</Badge></div>
        </Modal>
      )}
    </div>
  );
}

function FedServices({ state, actions, role }) {
  const [openSvc, setOpenSvc] = useState(null);
  const [openWorker, setOpenWorker] = useState(null);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editSvc, setEditSvc] = useState(null);
  const isMember = role === "Member";

  const activeServices = state.services.filter(s => s.status !== "removed");
  const unavailableServices = state.services.filter(s => s.status === "removed");
  const list = showUnavailable ? unavailableServices : activeServices;
  const categories = [...new Set(list.map(s => s.category))];
  const workersFor = (svcName) => state.workers.filter(w => w.skills.includes(svcName) && w.status !== "resigned");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn tone={!showUnavailable ? "navy" : "ghost"} size="sm" onClick={() => setShowUnavailable(false)}>Active Services</Btn>
          <Btn tone={showUnavailable ? "navy" : "ghost"} size="sm" onClick={() => setShowUnavailable(true)}>Unavailable Services</Btn>
        </div>
        {isMember && !showUnavailable && <Btn size="sm" onClick={() => setShowAdd(true)}>Add Service</Btn>}
      </div>

      {list.length === 0 && (
        <EmptyState
          icon={showUnavailable ? Shield : Layers}
          title={showUnavailable ? "No unavailable services" : "No services are active right now"}
          description={showUnavailable ? "All service offerings are currently available for booking and assignment." : "This catalog is empty at the moment. Add a new service to keep the marketplace active."}
          actionLabel={!showUnavailable && !isMember ? undefined : "Add Service"}
          onAction={showUnavailable ? undefined : () => setShowAdd(true)}
          tone={showUnavailable ? "green" : "orange"}
        />
      )}

      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: 26 }}>
          <h3 style={{ ...heading, fontSize: 19, color: C.ink, marginBottom: 12 }}>{cat}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 14 }}>
            {list.filter(s => s.category === cat).map(s => (
              <Card key={s.id} onClick={() => setOpenSvc(s)} style={{ padding: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: C.orange + "1A",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10
                }}><s.Icon size={20} color={C.orange} /></div>
                <div style={{ fontWeight: 700, color: C.ink, fontSize: 15 }}>{s.name}</div>
                <div style={{ fontSize: 13, color: C.slate, marginTop: 3 }}>Starting from ₹{s.charge}</div>
                <div style={{ fontSize: 12.5, color: C.slate, marginTop: 3 }}>{workersFor(s.name).length} workers available</div>
                {s.status === "removed" && (
                  <div style={{ marginTop: 10 }}>
                    <Badge tone="red">CURRENTLY NOT AVAILABLE</Badge>
                  </div>
                )}
                {isMember && s.status !== "removed" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }} onClick={e => e.stopPropagation()}>
                    <Btn tone="ghost" size="sm" onClick={() => setEditSvc(s)}>Edit</Btn>
                    <Btn tone="red" size="sm" onClick={() => actions.removeService(s.id)}>Remove</Btn>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}

      {openSvc && !openWorker && (
        <Modal title={openSvc.name} onClose={() => setOpenSvc(null)}>
          {openSvc.status === "removed" && (
            <div style={{ marginBottom: 12 }}><Badge tone="red">CURRENTLY NOT AVAILABLE</Badge></div>
          )}
          <p style={{ color: C.slate, fontSize: 13.5, marginTop: -6 }}>Starting from ₹{openSvc.charge} • {workersFor(openSvc.name).length} available workers</p>
          {workersFor(openSvc.name).map(w => (
            <div key={w.id} onClick={() => setOpenWorker(w)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 6px",
              borderBottom: `1px solid ${C.line}`, cursor: "pointer"
            }}>
              <Avatar name={w.name} photo={w.photo} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: C.ink, fontSize: 14.5 }}>{w.name}</div>
                <div style={{ fontSize: 12.5, color: C.slate, display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={12} fill={C.amber} color={C.amber} /> {w.rating}
                </div>
              </div>
              <Badge tone={statusTone(w.status)}>{w.status}</Badge>
              <ChevronRight size={16} color={C.slate} />
            </div>
          ))}
        </Modal>
      )}

      {openWorker && <WorkerProfileModal worker={openWorker} onClose={() => { setOpenWorker(null); }} />}

      {showAdd && <ServiceFormModal state={state} actions={actions} onClose={() => setShowAdd(false)} />}
      {editSvc && (
        <ServiceFormModal
          state={state}
          actions={actions}
          service={state.services.find(s => s.id === editSvc.id) || editSvc}
          onClose={() => setEditSvc(null)}
        />
      )}
    </div>
  );
}

// Federation Member -> Add Service / Edit Service. Uses the existing
// Service record shape (name, category, charge) — no unnecessary fields.
function ServiceFormModal({ state, actions, service, onClose }) {
  const isEdit = !!service;
  const [name, setName] = useState(service ? service.name : "");
  const [category, setCategory] = useState(service ? service.category : "");
  const [charge, setCharge] = useState(service ? service.charge : "");
  const categories = [...new Set(state.services.map(s => s.category))];

  function submit() {
    if (!name || !category || !charge) return;
    if (isEdit) {
      actions.updateService(service.id, { name, category, charge: Number(charge) });
    } else {
      actions.addService({ name, category, charge });
    }
    onClose();
  }

  return (
    <Modal title={isEdit ? "Edit Service" : "Add Service"} onClose={onClose}>
      <Field label="Service Name">
        <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Electrician" />
      </Field>
      <Field label="Category">
        <input style={inputStyle} value={category} onChange={e => setCategory(e.target.value)} list="service-categories" placeholder="e.g. Construction & Home" />
        <datalist id="service-categories">
          {categories.map(c => <option key={c} value={c} />)}
        </datalist>
      </Field>
      <Field label="Charge (₹)">
        <input style={inputStyle} type="number" value={charge} onChange={e => setCharge(e.target.value)} placeholder="e.g. 400" />
      </Field>
      <Btn onClick={submit} disabled={!name || !category || !charge}>{isEdit ? "Save Changes" : "Add Service"}</Btn>
    </Modal>
  );
}


function WorkerProfileModal({ worker, onClose, editable, services, onSaveProfile, showResign, onResign }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(worker.name);
  const [phone, setPhone] = useState(worker.phone);
  const [address, setAddress] = useState(worker.address);
  const [skills, setSkills] = useState(worker.skills);
  const [photo, setPhoto] = useState(worker.photo);
  const [historyText, setHistoryText] = useState(worker.history || "");

  function toggleSkill(s) {
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }
  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }
  function startEdit() {
    setName(worker.name); setPhone(worker.phone); setAddress(worker.address);
    setSkills(worker.skills); setPhoto(worker.photo); setHistoryText(worker.history || "");
    setEditing(true);
  }
  function save() {
    onSaveProfile(worker.id, { name, phone, address, skills, photo, history: historyText });
    setEditing(false);
  }
  function cancel() {
    setEditing(false);
  }

  const categories = services ? [...new Set(services.map(s => s.category))] : [];
  const displayPhoto = editing ? photo : worker.photo;

  return (
    <Modal title="Worker Profile" onClose={onClose}>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div>
          <Avatar name={editing ? name : worker.name} photo={displayPhoto} size={68} />
          {editing && (
            <div style={{ marginTop: 8, width: 100 }}>
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ fontSize: 11, width: "100%" }} />
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          {editing ? (
            <Field label="Worker Name"><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} /></Field>
          ) : (
            <div style={{ fontWeight: 700, fontSize: 19, color: C.ink }}>{worker.name}</div>
          )}
          <div style={{ fontSize: 13, color: C.slate }}>{worker.id}</div>
          <div style={{ marginTop: 6 }}><Stars value={Math.round(worker.rating)} /></div>
        </div>
      </div>

      {editing ? (
        <>
          <Field label="Phone Number">
            <input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} />
          </Field>
          <Field label="Address">
            <input style={inputStyle} value={address} onChange={e => setAddress(e.target.value)} />
          </Field>
        </>
      ) : (
        <>
          <Stat icon={Phone} label="Phone" value={worker.phone} />
          <Stat icon={MapPin} label="Address" value={worker.address} />
        </>
      )}

      <div style={{ margin: "10px 0" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.slate, marginBottom: 6 }}>Skills</div>
        {editing ? (
          categories.length > 0 ? categories.map(cat => (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{cat}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {services.filter(s => s.category === cat).map(s => (
                  <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.ink, cursor: "pointer" }}>
                    <input type="checkbox" checked={skills.includes(s.name)} onChange={() => toggleSkill(s.name)} />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>
          )) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {skills.map(s => <Badge key={s} tone="blue">{s}</Badge>)}
            </div>
          )
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {worker.skills.map(s => <Badge key={s} tone="blue">{s}</Badge>)}
          </div>
        )}
      </div>

      <div style={{ margin: "10px 0" }}>
        <Badge tone={statusTone(worker.status)}>{worker.status}</Badge>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.slate, marginBottom: 8 }}>Worker History</div>
        {editing ? (
          <textarea style={{ ...inputStyle, minHeight: 90 }} value={historyText} onChange={e => setHistoryText(e.target.value)} placeholder="Worker history notes..." />
        ) : (
          <div style={{ fontSize: 13.5, color: C.ink, background: C.paperDim, borderRadius: 10, padding: 12 }}>
            {worker.history || "No history recorded yet."}
          </div>
        )}
      </div>

      {editable && (
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {editing ? (
            <>
              <Btn size="sm" onClick={save}>Save</Btn>
              <Btn size="sm" tone="ghost" onClick={cancel}>Cancel</Btn>
            </>
          ) : (
            <Btn size="sm" tone="ghost" onClick={startEdit}>Edit Profile</Btn>
          )}
        </div>
      )}

      {/* Federation Member -> Resign Worker. Only shown where explicitly enabled. */}
      {showResign && worker.status !== "resigned" && (
        <div style={{ marginTop: 14 }}>
          <Btn tone="red" size="sm" onClick={() => { onResign(worker.id); onClose(); }}>Resign</Btn>
        </div>
      )}

      {worker.feedback && worker.feedback.length > 0 && !editing && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.slate, marginBottom: 8 }}>Customer Feedback</div>
          {worker.feedback.map((f, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${C.line}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
                <strong style={{ color: C.ink }}>{f.customer}</strong>
                <Stars value={f.rating} size={13} />
              </div>
              <div style={{ fontSize: 13, color: C.slate, marginTop: 2 }}>{f.review}</div>
              <div style={{ fontSize: 11.5, color: C.slate, marginTop: 2 }}>{f.service} • {f.date}</div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

function FedCustomers({ state }) {
  const [sel, setSel] = useState(null);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filteredCustomers = q
    ? state.customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.id || "").toLowerCase().includes(q) ||
        (c.phone || "").toLowerCase().includes(q) ||
        (c.address || "").toLowerCase().includes(q)
      )
    : state.customers;
  return (
    <div>
      <div style={{ position: "relative", marginBottom: 18, maxWidth: 420 }}>
        <Search size={16} color={C.slate} style={{ position: "absolute", left: 14, top: 12 }} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search customers by name, ID, phone or address..."
          style={{ ...inputStyle, paddingLeft: 38 }} />
      </div>
      {q && filteredCustomers.length === 0 && (
        <div style={{ color: C.slate, fontSize: 13.5, marginBottom: 16 }}>No customers match "{query}".</div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 14 }}>
        {filteredCustomers.map(c => {
          const complaint = c.history.some(h => h.complaintStatus !== "None");
          const latest = c.history[0];
          return (
            <Card key={c.id} onClick={() => setSel(c)} style={{ padding: 16, borderLeft: complaint ? `4px solid ${C.red}` : `4px solid transparent` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Avatar name={c.name} photo={c.photo} size={42} />
                <div>
                  <div style={{ fontWeight: 700, color: C.ink, fontSize: 15 }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: C.slate }}>{c.phone}</div>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <Stat icon={MapPin} label="Address" value={c.address} />
                {latest && <Stat icon={Wrench} label="Service" value={latest.service} />}
                {latest && <Stat icon={HardHat} label="Worker" value={latest.worker} />}
                {latest && <Stat icon={IndianRupee} label="Paid" value={latest.paid ? `₹${latest.charge}` : "Unpaid"} />}
                {latest && <Stat icon={Clock} label="Service Date" value={latest.date} />}
              </div>
              {complaint && <div style={{ marginTop: 8 }}><Badge tone="red">Complaint Raised</Badge></div>}
            </Card>
          );
        })}
      </div>
      {sel && (
        <Modal title={sel.name} onClose={() => setSel(null)}>
          <Stat icon={Phone} label="Phone" value={sel.phone} />
          <Stat icon={MapPin} label="Address" value={sel.address} />
          {sel.history.map((h, i) => (
            <div key={i} style={{ marginTop: 14, padding: 12, background: C.paperDim, borderRadius: 10 }}>
              <Stat icon={Wrench} label="Service" value={h.service} />
              <Stat icon={HardHat} label="Worker" value={h.worker} />
              <Stat icon={Clock} label="Date / Time" value={`${h.date}, ${h.time}`} />
              <div style={{ margin: "8px 0", fontSize: 13.5, color: C.ink }}>{h.workDone}</div>
              <Stars value={h.rating} size={14} />
              <div style={{ fontSize: 13, color: C.slate, marginTop: 4, fontStyle: "italic" }}>"{h.review}"</div>
              <div style={{ marginTop: 8 }}>
                <Badge tone={h.complaintStatus === "None" ? "green" : "red"}>
                  {h.complaintStatus === "None" ? "No Complaint" : `Complaint: ${h.complaintStatus}`}
                </Badge>
              </div>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}

function FedWorkers({ state, actions, role }) {
  const [showResigned, setShowResigned] = useState(false);
  const [sel, setSel] = useState(null);
  const [query, setQuery] = useState("");
  const isMember = role === "Member";
  const activeWorkers = state.workers.filter(w => w.status !== "resigned");
  const resignedWorkers = state.workers.filter(w => w.status === "resigned");
  const baseList = showResigned ? resignedWorkers : activeWorkers;
  const q = query.trim().toLowerCase();
  const list = q
    ? baseList.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.id.toLowerCase().includes(q) ||
        (w.phone || "").toLowerCase().includes(q) ||
        (w.skills || []).some(s => s.toLowerCase().includes(q))
      )
    : baseList;

  return (
    <div>
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <StatCard label="Total Workers" value={state.workers.length} Icon={Users} accent={C.navy} />
        <StatCard label="Resigned Workers Count" value={resignedWorkers.length} Icon={XCircle} accent={C.red} />
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <Btn tone={!showResigned ? "navy" : "ghost"} size="sm" onClick={() => setShowResigned(false)}>Active Workers</Btn>
        <Btn tone={showResigned ? "navy" : "ghost"} size="sm" onClick={() => setShowResigned(true)}>Resigned Workers</Btn>
      </div>
      <div style={{ position: "relative", marginBottom: 18, maxWidth: 420 }}>
        <Search size={16} color={C.slate} style={{ position: "absolute", left: 14, top: 12 }} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search workers by name, ID, phone or skill..."
          style={{ ...inputStyle, paddingLeft: 38 }} />
      </div>
      {q && list.length === 0 && (
        <div style={{ color: C.slate, fontSize: 13.5, marginBottom: 16 }}>No workers match "{query}".</div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px,1fr))", gap: 14 }}>
        {list.map(w => (
          <Card key={w.id} onClick={() => setSel(w)} style={{ padding: 16, textAlign: "center", opacity: w.status === "resigned" ? 0.75 : 1 }}>
            <Avatar name={w.name} photo={w.photo} size={56} />
            <div style={{ fontWeight: 700, color: C.ink, marginTop: 10, fontSize: 14.5 }}>{w.name}</div>
            <div style={{ fontSize: 12, color: C.slate }}>{w.id}</div>
            <div style={{ fontSize: 12, color: C.slate, marginTop: 4 }}>{w.phone}</div>
            <div style={{ marginTop: 8 }}>
              {w.status === "resigned" ? <Badge tone="red">RESIGNED</Badge> : <Badge tone={statusTone(w.status)}>{w.status}</Badge>}
            </div>
          </Card>
        ))}
      </div>
      {sel && (
        <WorkerProfileModal
          worker={state.workers.find(w => w.id === sel.id) || sel}
          onClose={() => setSel(null)}
          services={state.services.filter(s => s.status !== "removed")}
          showResign={isMember}
          onResign={actions.resignWorker}
          editable={isMember}
          onSaveProfile={actions.updateWorkerProfile}
        />
      )}
    </div>
  );
}

function FedComplaints({ state, actions, role }) {
  const [type, setType] = useState("Customer Complaints");
  const [sel, setSel] = useState(null);
  const typeKey = type === "Customer Complaints" ? "customer" : "worker";
  const list = (state.complaints || []).filter(c => (typeKey === 'customer' ? c.type === 'customer' : c.type === 'worker'));

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <select value={type} onChange={e => { setType(e.target.value); setSel(null); }} style={{ ...inputStyle, width: 240 }}>
          <option>Customer Complaints</option>
          <option>Worker Complaints</option>
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 14 }}>
        {list.map(c => (
          <Card key={c.id} onClick={() => setSel(c)} style={{ padding: 16 }}>
            {type === "Customer Complaints" ? (
              <>
                <Stat icon={Users} label="Raised by (Customer)" value={c.customerName} />
                <Stat icon={HardHat} label="Related Worker" value={c.workerName} />
              </>
            ) : (
              <>
                <Stat icon={HardHat} label="Raised by (Worker)" value={c.workerName} />
                <Stat icon={Users} label="Related Customer" value={c.customerName} />
              </>
            )}
            <Stat icon={Wrench} label="Service" value={c.service} />
            <Stat icon={Clock} label="Date" value={c.date} />
            <div style={{ fontSize: 13.5, color: C.ink, margin: "8px 0" }}>{c.issue}</div>
            <Badge tone={statusTone(c.status)}>{c.status}</Badge>
          </Card>
        ))}
      </div>

      {sel && (
        <ComplaintResponseModal
          complaint={sel}
          type={typeKey}
          isCustomerComplaint={type === "Customer Complaints"}
          actions={actions}
          onClose={() => setSel(null)}
          readOnly={role === "Admin"}
        />
      )}
    </div>
  );
}

function ComplaintResponseModal({ complaint, type, isCustomerComplaint, actions, onClose, readOnly }) {
  const [response, setResponse] = useState(complaint.response || "");
  const alreadyResolved = complaint.status === "Resolved" && complaint.response;

  function save() {
    actions.respondComplaint(type, complaint.id, response);
    onClose();
  }

  return (
    <Modal title={`Complaint ${complaint.id}`} onClose={onClose}>
      {isCustomerComplaint ? (
        <>
          <Stat icon={Users} label="Raised by (Customer)" value={complaint.customerName} />
          <Stat icon={HardHat} label="Related Worker" value={complaint.workerName} />
        </>
      ) : (
        <>
          <Stat icon={HardHat} label="Raised by (Worker)" value={complaint.workerName} />
          <Stat icon={Users} label="Related Customer" value={complaint.customerName} />
        </>
      )}
      <Stat icon={Wrench} label="Service" value={complaint.service} />
      <Stat icon={Clock} label="Date" value={complaint.date} />
      <div style={{ margin: "12px 0" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.slate, marginBottom: 6 }}>Complaint Details</div>
        <div style={{ fontSize: 13.5, color: C.ink, background: C.paperDim, borderRadius: 10, padding: 12 }}>{complaint.issue}</div>
      </div>
      <div style={{ marginBottom: 12 }}><Badge tone={statusTone(complaint.status)}>{complaint.status}</Badge></div>
      {readOnly ? (
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.slate, marginBottom: 6 }}>Response</div>
          <div style={{ fontSize: 13.5, color: C.ink, background: C.paperDim, borderRadius: 10, padding: 12 }}>
            {complaint.response || "No response recorded yet."}
          </div>
        </div>
      ) : (
        <>
          <Field label="Response">
            <textarea style={{ ...inputStyle, minHeight: 80 }} value={response} onChange={e => setResponse(e.target.value)}
              placeholder="Write a response to resolve this complaint..." />
          </Field>
          <Btn onClick={save} disabled={!response}>{alreadyResolved ? "Update Response" : "Save Response"}</Btn>
        </>
      )}
    </Modal>
  );
}

/* ============================== WORKER PORTAL ============================== */
function WorkerPortal({ state, actions, onLogout, workerId }) {
  const [tab, setTab] = useState("home");
  const worker = state.workers.find(w => w.id === workerId)
    || state.workers.find(w => w.backendId === workerId)
    || state.workers.find(w => w.id === DEMO_WORKER.id)
    || state.workers[0]
    || DEMO_WORKER;
  const nav = [
    { key: "home", label: "Homepage", Icon: HomeIcon },
    { key: "available", label: "Available Requests", Icon: ClipboardList },
    { key: "accepted", label: "Accepted Requests", Icon: CheckCircle2 },
    { key: "rejected", label: "Rejected Requests", Icon: XCircle },
    { key: "complaints", label: "Complaints", Icon: FileWarning },
    { key: "earnings", label: "Earnings", Icon: Wallet },
    { key: "profile", label: "My Profile", Icon: User },
  ];
  const titles = {
    home: "Worker Dashboard", available: "Available Requests", accepted: "Accepted Requests",
    rejected: "Rejected Requests", complaints: "Complaints", earnings: "Earnings",
    profile: "My Profile",
  };
  return (
    <Shell title={titles[tab]} navItems={nav} active={tab} setActive={setTab} onLogout={onLogout} navSide="left">
      {tab === "home" && <WorkerHome state={state} actions={actions} worker={worker} setTab={setTab} />}
      {tab === "available" && <WorkerAvailable state={state} actions={actions} worker={worker} />}
      {tab === "accepted" && <WorkerAccepted state={state} actions={actions} worker={worker} />}
      {tab === "rejected" && <WorkerRejected state={state} worker={worker} />}
      {tab === "complaints" && <WorkerComplaints state={state} actions={actions} worker={worker} />}
      {tab === "earnings" && <WorkerEarnings state={state} worker={worker} />}
      {tab === "profile" && <WorkerProfile state={state} actions={actions} worker={worker} />}
    </Shell>
  );
}

function WorkerHome({ state, actions, worker, setTab }) {
  const myRequests = state.requests.filter(r => r.workerId === worker.id);
  const available = state.requests.filter(r => !r.workerId && worker.skills.includes(r.service));
  const accepted = myRequests.filter(r => !r.rejectedByMe);
  const rejected = state.rejectedLog.filter(r => r.workerId === worker.id);
  const todaysEarnings = myRequests.filter(r => r.completed).reduce((s, r) => s + Math.round(r.charge * 0.9), 0);
  const monthlyEarnings = todaysEarnings;
  const prevAvailableRef = useRef(available.length);
  const [newRequestsCount, setNewRequestsCount] = useState(0);

  useEffect(() => {
    const prev = prevAvailableRef.current || 0;
    if (available.length > prev) {
      setNewRequestsCount(available.length - prev);
      // clear after a short delay so it doesn't persistently distract
      setTimeout(() => setNewRequestsCount(0), 8000);
    }
    prevAvailableRef.current = available.length;
  }, [available.length]);

  return (
    <div>
      {newRequestsCount > 0 && (
        <Card style={{ padding: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Bell size={18} color={C.navy} />
            <div style={{ fontWeight: 700 }}>{newRequestsCount} new request{newRequestsCount>1 ? 's' : ''} available nearby</div>
            <div style={{ color: C.slate, fontSize: 13 }}>Tap to review in Available Requests.</div>
          </div>
          <div><Btn onClick={() => setTab && setTab('available')}>View Requests</Btn></div>
        </Card>
      )}
      <Card style={{ padding: 20, marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Avatar name={worker.name} photo={worker.photo} size={60} />
          <div>
            <div style={{ ...heading, fontSize: 22, color: C.ink }}>{worker.name}</div>
            <div style={{ fontSize: 13, color: C.slate }}>{worker.id} • {worker.phone}</div>
            <div style={{ fontSize: 12.5, color: C.slate, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={12} />{worker.address}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              {worker.skills.map(s => <Badge key={s} tone="blue">{s}</Badge>)}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12.5, color: C.slate, marginBottom: 6 }}>Current Status</div>
          <select value={worker.status} onChange={e => actions.setWorkerStatus(worker.id, e.target.value)} style={{ ...inputStyle, width: 160 }}
            disabled={worker.status === "working"}>
            <option value="online">Online — Available</option>
            <option value="offline">Offline — On Leave</option>
            <option value="working" disabled>Working</option>
          </select>
          <div style={{ marginTop: 12, fontSize: 12.5, color: C.slate }}>Provisional Fund</div>
          <div style={{ ...heading, fontSize: 20, color: C.ink }}>₹{worker.provisionalFund}</div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 14 }}>
        <StatCard label="Today's Earning" value={`₹${todaysEarnings}`} Icon={IndianRupee} accent={C.orange} onClick={() => setTab("earnings")} />
        <StatCard label="Monthly Earning" value={`₹${monthlyEarnings}`} Icon={TrendingUp} accent={C.orangeDeep} onClick={() => setTab("earnings")} />
        <StatCard label="Available Request" value={available.length} Icon={ClipboardList} accent={C.blue} onClick={() => setTab("available")} />
        <StatCard label="Accepted Request" value={accepted.length} Icon={CheckCircle2} accent={C.green} onClick={() => setTab("accepted")} />
        <StatCard label="Rejected Request" value={rejected.length} Icon={XCircle} accent={C.red} onClick={() => setTab("rejected")} />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
        <Btn onClick={() => setTab("available")}>View Available Requests</Btn>
        <Btn tone="ghost" onClick={() => setTab("earnings")}>View Earnings</Btn>
      </div>
    </div>
  );
}

function WorkerAvailable({ state, actions, worker }) {
  const available = state.requests.filter(r => !r.workerId && worker.skills.includes(r.service));
  const [rejectTarget, setRejectTarget] = useState(null);
  const [detailsTarget, setDetailsTarget] = useState(null);
  const [acceptTarget, setAcceptTarget] = useState(null);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 16 }}>
      {available.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No nearby jobs match your skills"
          description="Your skill set is currently not in demand in the nearby requests queue. Check back soon for new assignments or update your availability."
          actionLabel="Refresh View"
          onAction={() => window.location.reload()}
          tone="orange"
        />
      )}
      {available.map(r => (
        <Card key={r.id} style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, color: C.ink }}>{r.service}</div>
              <div style={{ color: C.slate, fontSize: 13 }}>{r.customerName} • Requested {r.createdAt || 'just now'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700 }}>₹{r.charge}</div>
              <div style={{ color: C.slate, fontSize: 13 }}>{r.bookingType || (r.schedule ? 'Scheduled' : 'Instant')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <Stat icon={MapPin} label="Area" value={(r.customerAddress || '').split(',')[0] || 'Location unavailable'} />
            <Stat icon={Clock} label="When" value={r.schedule ? (r.schedule.date + ' ' + (r.schedule.time || '')) : 'Instant'} />
            <Stat icon={Phone} label="Distance" value={r.distance ? `${r.distance} km` : '—'} />
          </div>
          <div style={{ marginTop: 10, color: C.slate }}>{(r.description || '').substring(0, 160) || 'No description provided.'}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Btn size="sm" onClick={() => setDetailsTarget(r)}>View Details</Btn>
            <Btn tone="green" size="sm" onClick={() => setAcceptTarget(r)}>Accept</Btn>
            <Btn tone="red" size="sm" onClick={() => setRejectTarget(r)}>Decline</Btn>
          </div>
        </Card>
      ))}
      {rejectTarget && (
        <RejectReasonModal
          request={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={(reason) => { actions.rejectRequest(rejectTarget.id, worker.id, reason); setRejectTarget(null); }}
        />
      )}
      {detailsTarget && (
        <Modal title={`${detailsTarget.service} — ${detailsTarget.customerName}`} onClose={() => setDetailsTarget(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{detailsTarget.service}</div>
              <div style={{ color: C.slate, marginTop: 6 }}>Customer: {detailsTarget.customerName} • { (detailsTarget.customerAddress || '').split(',')[0] }</div>
              <div style={{ marginTop: 12, color: C.slate }}>{detailsTarget.description || 'No description provided.'}</div>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 700 }}>Images</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>{(detailsTarget.images||[]).length === 0 ? <div style={{ color: C.slate }}>No images provided.</div> : (detailsTarget.images||[]).map((src,i)=>(<img key={i} src={src} style={{ width:90, height:70, objectFit:'cover', borderRadius:6 }} />))}</div>
              </div>
            </div>
            <div style={{ background: C.paperDim, padding: 12, borderRadius: 8 }}>
              <div style={{ fontWeight: 700 }}>Job Details</div>
              <div style={{ marginTop: 8 }}><strong>Estimated Job Value:</strong> ₹{detailsTarget.charge}</div>
              <div style={{ marginTop: 6 }}><strong>Platform Fee:</strong> ₹{DEMO_PRICING.platformFee}</div>
              <div style={{ marginTop: 6 }}><strong>Your Estimated Earnings:</strong> ₹{Math.max(0, detailsTarget.charge - DEMO_PRICING.platformFee)}</div>
              <div style={{ marginTop: 8, color: C.green }}>Payment Secured</div>
              <div style={{ marginTop: 12 }}>
                <Btn tone="green" onClick={() => { setDetailsTarget(null); setAcceptTarget(detailsTarget); }}>Accept Request</Btn>
                <Btn tone="ghost" onClick={() => { setDetailsTarget(null); setRejectTarget(detailsTarget); }} style={{ marginLeft: 8 }}>Decline</Btn>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {acceptTarget && (
        <AcceptConfirmModal request={acceptTarget} onClose={() => setAcceptTarget(null)} onConfirm={() => { actions.acceptRequest(acceptTarget.id, worker.id); setAcceptTarget(null); }} worker={worker} />
      )}
    </div>
  );
}

function AcceptConfirmModal({ request, onClose, onConfirm, worker }) {
  return (
    <Modal title="Accept this service request?" onClose={onClose}>
      <div style={{ fontWeight: 700, fontSize: 16 }}>{request.service}</div>
      <div style={{ color: C.slate, marginTop: 8 }}>{request.customerName} • {(request.customerAddress||'').split(',')[0]}</div>
      <div style={{ marginTop: 8 }}><strong>Distance:</strong> {request.distance ? `${request.distance} km` : '—'}</div>
      <div style={{ marginTop: 8 }}><strong>Estimated Earnings:</strong> ₹{Math.max(0, request.charge - DEMO_PRICING.platformFee)}</div>
      <p style={{ color: C.slate, marginTop: 12 }}>Once you accept, this request will move to your Accepted Requests list. Please only accept if you intend to complete the job professionally.</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
        <Btn tone="ghost" onClick={onClose}>Cancel</Btn>
        <Btn tone="green" onClick={() => { onConfirm && onConfirm(); }}>Accept Request</Btn>
      </div>
    </Modal>
  );
}

function RejectReasonModal({ request, onClose, onConfirm }) {
  const reasons = [
    'Too far from my current location',
    'Currently busy with another job',
    'Service is outside my availability',
    'Scheduled time is not suitable',
    'Unable to reach the location',
    'Estimated earnings are not suitable',
    'Other reason'
  ];
  const [selected, setSelected] = useState('');
  const [otherText, setOtherText] = useState('');
  const computedReason = selected === 'Other reason' ? otherText.trim() : selected;
  const valid = selected && (selected !== 'Other reason' || otherText.trim().length >= 10);

  return (
    <Modal title="Why are you unable to accept this request?" onClose={onClose}>
      <Stat icon={Users} label="Customer" value={request.customerName} />
      <Stat icon={Wrench} label="Service" value={request.service} />
      <Field label="Select a reason">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {reasons.map(r => (
            <label key={r} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="radio" name="rejectReason" value={r} checked={selected === r} onChange={() => setSelected(r)} />
              <span style={{ color: C.ink }}>{r}</span>
            </label>
          ))}
        </div>
      </Field>
      {selected === 'Other reason' && (
        <Field label="Please explain briefly (min 10 characters)">
          <textarea style={{ ...inputStyle, minHeight: 90 }} value={otherText} onChange={e => setOtherText(e.target.value)} />
        </Field>
      )}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Btn tone="ghost" onClick={onClose}>Cancel</Btn>
        <Btn tone="red" onClick={() => onConfirm(computedReason)} disabled={!valid}>Confirm Decline</Btn>
      </div>
    </Modal>
  );
}

function WorkerAccepted({ state, actions, worker }) {
  const [openR, setOpenR] = useState(null);
  const mine = state.requests.filter(r => r.workerId === worker.id);

  // Helpers for map and distances
  function haversineKm(lat1, lon1, lat2, lon2) {
    const toRad = v => v * Math.PI / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function coordsForRequest(req) {
    // deterministic pseudo coordinates derived from request id and index (demo only)
    const baseLat = 18.5204; const baseLng = 73.8567; // Pune approx
    let seed = 0;
    for (let i=0;i<req.id.length;i++) seed += req.id.charCodeAt(i);
    const lat = baseLat + ((seed % 100) - 50) * 0.0015;
    const lng = baseLng + ((seed % 73) - 36) * 0.0015;
    // worker location nearby
    const workerLat = lat + 0.006; const workerLng = lng - 0.01;
    return { dest: { latitude: lat, longitude: lng }, worker: { latitude: workerLat, longitude: workerLng } };
  }

  function estimateETAForKm(km) {
    // assume ~18 km/h average (urban with traffic)
    const speedKmh = 18;
    const minutes = Math.max(3, Math.round((km / speedKmh) * 60));
    return `${minutes} min`;
  }

  function formatKm(km) {
    return km < 1 ? `${Math.round(km*1000)} m` : `${(km).toFixed(1)} km`;
  }

  // Job navigation modal component (in-file)
  function JobNavigationModal({ request, onClose }) {
    const { dest, worker: wloc } = coordsForRequest(request);
    const km = haversineKm(wloc.latitude, wloc.longitude, dest.latitude, dest.longitude);
    const eta = estimateETAForKm(km);
    const distanceLabel = formatKm(km);

    function openMaps() {
      const lat = dest.latitude; const lng = dest.longitude;
      const label = encodeURIComponent(`${request.customerName} • ${request.service}`);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving&destination_place_id=${label}`;
      window.open(url, '_blank');
    }

    const [status, setStatus] = useState(request.status || 'accepted');

    function updateStatus(next) {
      setStatus(next);
      actions.updateProgress && actions.updateProgress(request.id, { status: next });
    }

    return (
      <Modal title="Job Details" onClose={onClose} width={920}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={{ fontSize: 13, color: C.slate, marginBottom: 8 }}>Job Status</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <Badge tone={status === 'on_the_way' ? 'blue' : status === 'arrived' ? 'green' : status === 'accepted' ? 'amber' : 'slate'}>{status.replace('_',' ')}</Badge>
              <div style={{ color: C.slate }}>• Scheduled: {request.schedule?.date || 'Today'} {request.schedule?.time || ''}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <MapPreview worker={wloc} dest={dest} km={km} eta={eta} />
            </div>

            <div style={{ marginTop: 10 }}>
              <h4 style={{ ...heading, margin: 0, fontSize: 15 }}>Customer Location</h4>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: 700 }}>{request.customerName}</div>
                <div style={{ color: C.slate, marginTop: 6 }}>{request.customerAddress}</div>
                {request.landmark && <div style={{ color: C.slate, marginTop: 6 }}>Landmark: {request.landmark}</div>}
                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  <div style={{ color: C.slate }}>Distance</div><div style={{ fontWeight: 700 }}>{distanceLabel}</div>
                  <div style={{ color: C.slate }}>ETA</div><div style={{ fontWeight: 700 }}>{eta}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: 320, minWidth: 280 }}>
            <Card style={{ padding: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: C.slate }}>Service</div>
                  <div style={{ fontWeight: 800 }}>{request.service}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: C.slate }}>Amount</div>
                  <div style={{ fontWeight: 800 }}>₹{request.charge}</div>
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {status === 'accepted' && <Btn tone="green" onClick={() => { updateStatus('on_the_way'); alert('Journey started. Navigate safely to the customer location.'); }}>Start Journey</Btn>}
                {status === 'on_the_way' && <Btn tone="green" onClick={() => updateStatus('arrived')}>I've Arrived</Btn>}
                {status === 'arrived' && <Btn tone="green" onClick={() => updateStatus('work_started')}>Start Work</Btn>}
                {status === 'work_started' && <Btn tone="green" onClick={() => updateStatus('worker_completed')}>Mark Work Completed</Btn>}
                <Btn tone="ghost" onClick={openMaps}>Open Navigation</Btn>
              </div>
            </Card>

            <Card style={{ padding: 12 }}>
              <h4 style={{ ...heading, fontSize: 14, margin: 0 }}>Contact</h4>
              <div style={{ marginTop: 8 }}>
                <div style={{ color: C.slate }}>Customer</div>
                <div style={{ fontWeight: 700 }}>{request.customerName}</div>
                <div style={{ color: C.slate, marginTop: 6 }}>Phone</div>
                <div style={{ fontWeight: 700 }}>{request.customerPhone ? request.customerPhone.replace(/(\d{2})\d{6}(\d{2})/, '+91 $1XXXXXX$2') : '—'}</div>
                <div style={{ marginTop: 10 }}><Btn size="sm" tone="ghost">Call Customer</Btn></div>
              </div>
            </Card>
          </div>
        </div>
      </Modal>
    );
  }

  // Simple SVG map preview for demo (no external API)
  function MapPreview({ worker, dest, km, eta }) {
    // render a simple SVG with two markers and a route path
    const wX = 80, wY = 120, dX = 320, dY = 40;
    return (
      <div style={{ background: '#f7f7f9', borderRadius: 12, padding: 12 }}>
        <div style={{ position: 'relative' }}>
          <svg width="100%" height={220} viewBox="0 0 420 220" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="g1" x1="0" x2="1"><stop offset="0%" stopColor="#e6eefc" /><stop offset="100%" stopColor="#f7fbff" /></linearGradient>
            </defs>
            <rect x="0" y="0" width="420" height="220" rx="12" fill="url(#g1)" />
            <path d={`M ${wX} ${wY} Q ${(wX+dX)/2} ${(wY+dY)-30} ${dX} ${dY}`} stroke="#4a90e2" strokeWidth="3" fill="none" strokeDasharray="6 6" />
            <circle cx={wX} cy={wY} r="8" fill="#2F8F5B" />
            <text x={wX+12} y={wY+4} fontSize="11" fill="#08304A">You</text>
            <rect x={dX-6} y={dY-18} width="14" height="20" rx="3" fill="#E2622B" />
            <text x={dX+14} y={dY+4} fontSize="11" fill="#08304A">Destination</text>
          </svg>
          <div style={{ position: 'absolute', right: 12, top: 12, background: C.card, padding: '6px 8px', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 12, color: C.slate }}>ETA</div>
            <div style={{ fontWeight: 800 }}>{eta}</div>
            <div style={{ fontSize: 12, color: C.slate }}>{formatKm(km)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 16 }}>
      {mine.length === 0 && <p style={{ color: C.slate }}>No accepted requests yet.</p>}
      {mine.map(r => {
        const { dest, worker: wloc } = coordsForRequest(r);
        const km = haversineKm(wloc.latitude, wloc.longitude, dest.latitude, dest.longitude);
        const eta = estimateETAForKm(km);
        return (
          <Card key={r.id} style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{r.service}</div>
                <div style={{ color: C.slate, marginTop: 6 }}>{r.customerName}</div>
                <div style={{ color: C.slate, marginTop: 6 }}><MapPin size={14} style={{ verticalAlign: '-3px', marginRight: 6 }} />{(r.customerAddress || '').split(',')[0]}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800 }}>₹{r.charge}</div>
                <div style={{ color: C.slate, marginTop: 8 }}>{formatKm(km)} • {eta}</div>
                <div style={{ marginTop: 10 }}>
                  <Btn size="sm" onClick={() => setOpenR(r)}>View Job & Navigate</Btn>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
      {openR && <JobNavigationModal request={openR} onClose={() => setOpenR(null)} />}
    </div>
  );
}

function WorkProgressForm({ request, actions }) {
  const [beforeDesc, setBeforeDesc] = useState(request.beforeDesc || "");
  const [beforePhoto, setBeforePhoto] = useState(request.before || null);
  const [afterDesc, setAfterDesc] = useState(request.afterDesc || "");
  const [afterPhoto, setAfterPhoto] = useState(request.after || null);

  function handleFile(setter) {
    return (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setter(reader.result);
      reader.readAsDataURL(file);
    };
  }

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 700, color: C.ink, marginBottom: 8 }}>Before Starting Work</div>
        <Field label="Task Photo">
          <input type="file" accept="image/*" onChange={handleFile(setBeforePhoto)} />
          {beforePhoto && <img src={beforePhoto} style={{ width: 90, borderRadius: 8, marginTop: 8 }} />}
        </Field>
        <Field label="Issue Description">
          <textarea style={{ ...inputStyle, minHeight: 60 }} value={beforeDesc} onChange={e => setBeforeDesc(e.target.value)} placeholder="Describe the issue..." />
        </Field>
        <Btn size="sm" onClick={() => actions.updateProgress(request.id, { before: beforePhoto, beforeDesc })}>Save Before-Work Update</Btn>
      </div>
      <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
        <div style={{ fontWeight: 700, color: C.ink, marginBottom: 8 }}>After Completing Work</div>
        <Field label="Completed Work Photo">
          <input type="file" accept="image/*" onChange={handleFile(setAfterPhoto)} />
          {afterPhoto && <img src={afterPhoto} style={{ width: 90, borderRadius: 8, marginTop: 8 }} />}
        </Field>
        <Field label="Work Completion Description">
          <textarea style={{ ...inputStyle, minHeight: 60 }} value={afterDesc} onChange={e => setAfterDesc(e.target.value)} placeholder="Describe the completed work..." />
        </Field>
        <Btn size="sm" tone="green" onClick={() => actions.updateProgress(request.id, { after: afterPhoto, afterDesc })}>Mark Work Completed</Btn>
      </div>
    </div>
  );
}

function WorkerRejected({ state, worker }) {
  const rejected = state.rejectedLog.filter(r => r.workerId === worker.id);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 14 }}>
      {rejected.length === 0 && (
        <EmptyState
          icon={XCircle}
          title="No rejected requests"
          description="Your rejection log is empty. Once you decline a job, the reason will appear here for reference."
          tone="red"
        />
      )}
      {rejected.map((r, i) => (
        <Card key={i} style={{ padding: 16 }}>
          <Stat icon={Users} label="Customer" value={r.customerName} />
          <Stat icon={MapPin} label="Address" value={r.customerAddress} />
          <Stat icon={Phone} label="Phone" value={r.customerPhone} />
          <Stat icon={Wrench} label="Service" value={r.service} />
          <Stat icon={Clock} label="Service Date" value={r.rejectedDate || "—"} />
          <div style={{ margin: "10px 0" }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.slate, marginBottom: 4 }}>Rejection Reason</div>
            <div style={{ fontSize: 13.5, color: C.ink }}>{r.rejectionReason || "—"}</div>
          </div>
          <Badge tone="red">Rejected</Badge>
        </Card>
      ))}
    </div>
  );
}

function WorkerComplaints({ state, actions, worker }) {
  const [target, setTarget] = useState(null);
  const [issue, setIssue] = useState("");
  const [desc, setDesc] = useState("");
  const served = state.customers.filter(c => (c.history || []).some(h => h.worker === worker.name));
  const myComplaints = (state.complaints || []).filter(c => c.type === 'worker' && c.workerName === worker.name);

  function findCustomer(name) {
    return state.customers.find(c => c.name === name);
  }

  function submit() {
    actions.raiseWorkerComplaint({
      workerId: worker.id,
      workerName: worker.name,
      customerId: target.id,
      customerName: target.name,
      service: target.history[0]?.service || "Service",
      issue,
      description: desc
    });
    setTarget(null); setIssue(""); setDesc("");
  }

  return (
    <div>
      <h3 style={{ ...heading, fontSize: 19, color: C.ink, marginBottom: 12 }}>My Complaints</h3>
          {myComplaints.length === 0 && (
            <div style={{ marginBottom: 22 }}>
              <EmptyState
                icon={MessageSquare}
                title="No complaints raised yet"
                description="You haven’t raised any worker complaints. Keep this page handy if you need to report an issue with a service experience."
                tone="red"
              />
            </div>
          )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 14, marginBottom: 28 }}>
        {myComplaints.map(c => {
          const cust = findCustomer(c.customerName);
          return (
            <Card key={c.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                <Avatar name={c.customerName} photo={null} size={38} />
                <div>
                  <div style={{ fontWeight: 700, color: C.ink, fontSize: 14.5 }}>{c.customerName}</div>
                  {cust && <div style={{ fontSize: 12, color: C.slate }}>{cust.phone}</div>}
                </div>
              </div>
              {cust && <Stat icon={MapPin} label="Address" value={cust.address} />}
              <Stat icon={Wrench} label="Service" value={c.service} />
              <Stat icon={Clock} label="Date" value={c.date} />
              <div style={{ margin: "8px 0", fontSize: 13.5, color: C.ink }}>{c.issue}</div>
              {c.response && (
                <div style={{ fontSize: 12.5, color: C.slate, fontStyle: "italic", marginBottom: 8 }}>Federation response: {c.response}</div>
              )}
              <Badge tone={statusTone(c.status)}>{c.status}</Badge>
            </Card>
          );
        })}
      </div>

      <h3 style={{ ...heading, fontSize: 19, color: C.ink, marginBottom: 12 }}>Raise a New Complaint</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 14 }}>
        {served.map(c => (
          <Card key={c.id} style={{ padding: 16 }}>
            <Stat icon={Users} label="Customer" value={c.name} />
            <Stat icon={MapPin} label="Address" value={c.address} />
            <Stat icon={Phone} label="Phone" value={c.phone} />
            <Stat icon={Wrench} label="Service" value={c.history[0].service} />
            <Stat icon={Clock} label="Date" value={c.history[0].date} />
            <Btn size="sm" tone="ghost" style={{ marginTop: 10 }} onClick={() => setTarget(c)}>Raise Complaint</Btn>
          </Card>
        ))}
      </div>
      {target && (
        <Modal title={`Complaint against ${target.name}`} onClose={() => setTarget(null)}>
          <Stat icon={MapPin} label="Address" value={target.address} />
          <Stat icon={Phone} label="Phone" value={target.phone} />
          <Field label="Complaint Issue">
            <input style={inputStyle} value={issue} onChange={e => setIssue(e.target.value)} placeholder="Short summary" />
          </Field>
          <Field label="Description">
            <textarea style={{ ...inputStyle, minHeight: 80 }} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Explain what happened..." />
          </Field>
          <Btn onClick={submit} disabled={!issue}>Submit to Federation</Btn>
        </Modal>
      )}
    </div>
  );
}

function WorkerEarnings({ state, worker }) {
  const [filter, setFilter] = useState("month"); // day | week | month

  // Helper to safely parse a request's completed date
  function parseReqDate(r) {
    const raw = r.completedAt || r.completedDate || r.schedule?.date || r.date || r.createdAt;
    const d = raw ? new Date(raw) : null;
    return d && !isNaN(d) ? d : null;
  }

  const transactions = (state.requests || []).filter(r => r.workerId === worker.id && r.completed);

  // Derived fields per transaction
  const tx = transactions.map(r => {
    const jobAmount = Number(r.charge) || 0;
    const platformFee = r.platformFee !== undefined ? Number(r.platformFee) : Math.round(jobAmount * 0.10);
    const expense = r.expense !== undefined ? Number(r.expense) : Math.round(jobAmount * 0.05);
    const workerEarning = jobAmount - platformFee - expense;
    const paid = !!r.paid;
    const date = parseReqDate(r);
    return { ...r, jobAmount, platformFee, expense, workerEarning, paid, date };
  }).sort((a,b)=> (b.date?.getTime()||0) - (a.date?.getTime()||0));

  const today = new Date();
  const startOfWeek = new Date(); startOfWeek.setDate(today.getDate() - today.getDay());

  function inRange(d) {
    if (!d) return false;
    if (filter === 'day') return d.toDateString() === today.toDateString();
    if (filter === 'week') return d >= startOfWeek && d <= today;
    // month
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
  }

  const visible = tx.filter(t => inRange(t.date));

  const sum = arr => arr.reduce((s,x)=>s+(Number(x)||0),0);

  const todaysGross = sum(visible.map(v=>v.jobAmount));
  const todaysExpenses = sum(visible.map(v=>v.expense));
  const todaysFees = sum(visible.map(v=>v.platformFee));
  const todaysNet = todaysGross - todaysExpenses - todaysFees;

  // Monthly aggregates (from tx but respecting filter === 'month' semantics above)
  const monthTx = tx.filter(t => t.date && t.date.getFullYear() === today.getFullYear() && t.date.getMonth() === today.getMonth());
  const monthGross = sum(monthTx.map(v=>v.jobAmount));
  const monthExpenses = sum(monthTx.map(v=>v.expense));
  const monthFees = sum(monthTx.map(v=>v.platformFee));
  const monthNet = monthGross - monthExpenses - monthFees;
  const completedJobsThisMonth = monthTx.length;
  const avgPerJob = completedJobsThisMonth ? Math.round(monthGross / completedJobsThisMonth) : 0;

  const paymentsReceived = sum(monthTx.filter(t=>t.paid).map(t=>t.workerEarning));
  const pendingPayments = sum(monthTx.filter(t=>!t.paid).map(t=>t.workerEarning));
  const availableBalance = paymentsReceived; // demo: received funds available

  const recent = tx.slice(0,5);

  const fmt = v => `₹${(v||0).toLocaleString('en-IN')}`;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div>
          <h2 style={{ ...heading, margin: 0, fontSize: 20 }}>Earnings</h2>
          <div style={{ color: C.slate, marginTop: 6 }}>Track your income, expenses, and payouts. — {today.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={filter} onChange={e=>setFilter(e.target.value)} style={{ ...inputStyle, padding: '6px 10px', height: 36 }}>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Primary overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12, marginBottom: 16 }}>
        <StatCard label={filter==='day' ? "Today's Earnings" : filter==='week' ? "Week's Earnings" : "This Month - Gross"} value={fmt(todaysGross)} Icon={IndianRupee} accent={C.orange} />
        <StatCard label={filter==='day' ? "Today's Expenses" : filter==='week' ? "Week's Expenses" : "This Month - Expenses"} value={fmt(todaysExpenses)} Icon={TrendingUp} accent={C.slate} />
        <StatCard label={filter==='day' ? "Today's Net" : filter==='week' ? "Week's Net" : "This Month - Net"} value={fmt(todaysNet)} Icon={Wallet} accent={C.green} />
      </div>

      {/* Today's financial breakdown */}
      <Card style={{ padding: 18, marginBottom: 14 }}>
        <h3 style={{ ...heading, fontSize: 16, marginTop: 0 }}>Today's Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center', maxWidth: 560 }}>
          <div style={{ color: C.slate }}>Gross Earnings</div>
          <div style={{ fontWeight: 700 }}>{fmt(todaysGross)}</div>
          <div style={{ color: C.slate }}>Expenses</div>
          <div style={{ color: C.red, fontWeight: 700 }}>- {fmt(todaysExpenses)}</div>
          <div style={{ color: C.slate }}>Platform / Service Fees</div>
          <div style={{ color: C.red, fontWeight: 700 }}>- {fmt(todaysFees)}</div>
          <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 8 }} />
          <div style={{ fontWeight: 800, fontSize: 16 }}>Net Earnings</div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{fmt(todaysNet)}</div>
        </div>
      </Card>

      {/* Monthly summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <Card style={{ padding: 16 }}>
          <h4 style={{ ...heading, margin: 0, fontSize: 15 }}>This Month</h4>
          <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><div style={{ color: C.slate }}>Monthly Gross</div><div style={{ fontWeight: 700 }}>{fmt(monthGross)}</div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><div style={{ color: C.slate }}>Monthly Expenses</div><div style={{ color: C.red, fontWeight: 700 }}>- {fmt(monthExpenses)}</div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><div style={{ color: C.slate }}>Platform Fees</div><div style={{ color: C.red, fontWeight: 700 }}>- {fmt(monthFees)}</div></div>
            <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}><div style={{ fontWeight: 800 }}>Net Income</div><div style={{ fontWeight: 800 }}>{fmt(monthNet)}</div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}><div style={{ color: C.slate }}>Completed Jobs</div><div style={{ fontWeight: 700 }}>{completedJobsThisMonth}</div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><div style={{ color: C.slate }}>Avg / Job</div><div style={{ fontWeight: 700 }}>{fmt(avgPerJob)}</div></div>
          </div>
        </Card>

        <Card style={{ padding: 16 }}>
          <h4 style={{ ...heading, margin: 0, fontSize: 15 }}>Payment Overview</h4>
          <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><div style={{ color: C.slate }}>Available Balance</div><div style={{ fontWeight: 700 }}>{fmt(availableBalance)}</div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><div style={{ color: C.slate }}>Payments Received</div><div style={{ fontWeight: 700 }}>{fmt(paymentsReceived)}</div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><div style={{ color: C.slate }}>Pending Payments</div><div style={{ color: C.orange, fontWeight: 700 }}>{fmt(pendingPayments)}</div></div>
            <div style={{ marginTop: 8 }}><Btn size="sm" tone="ghost">Request Payout</Btn></div>
          </div>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ ...heading, fontSize: 16, margin: 0 }}>Recent Earnings</h3>
          {tx.length > 5 && <Btn size="sm" tone="ghost">View All Transactions</Btn>}
        </div>
        {recent.length === 0 && (
          <div style={{ marginTop: 12 }}>
            <EmptyState
              icon={Wallet}
              title="Earnings will appear here"
              description="Once you complete jobs, your earnings summary and payout history will be tracked here with transparency."
              tone="green"
            />
          </div>
        )}
        {recent.map(r => (
          <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, padding: '12px 0', borderBottom: `1px solid ${C.line}` }}>
            <div>
              <div style={{ fontWeight: 700, color: C.ink }}>{r.service}</div>
              <div style={{ color: C.slate, fontSize: 13 }}>{(r.customerAddress || r.customerLocation || '').split(',')[0] || r.customerName} • {r.date ? (r.date.toLocaleDateString('en-IN')) : '—'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700 }}>{fmt(r.jobAmount)}</div>
              <div style={{ color: C.slate, fontSize: 13 }}>You: {fmt(r.workerEarning)}</div>
              <div style={{ marginTop: 6 }}><Badge tone={r.paid ? 'green' : 'orange'}>{r.paid ? 'Paid' : 'Pending'}</Badge></div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function WorkerProfile({ state, actions, worker }) {
  const workersArr = Array.isArray(state && state.workers) ? state.workers : [];
  const w = workersArr.find(x => x.id === (worker && worker.id)) || worker || {};
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(() => ({
    name: w.name || '',
    photo: w.photo || null,
    primaryProfession: w.primaryProfession || (typeof w.skills === 'string' ? w.skills.split(' • ')[0] : (w.primaryProfession || '')),
    services: Array.isArray(w.services) ? w.services : (typeof w.skills === 'string' ? w.skills.split(' • ') : []),
    skills: Array.isArray(w.skillList) ? w.skillList : (Array.isArray(w.skills) ? w.skills : []),
    experience: w.experience || 5,
    languages: Array.isArray(w.languages) ? w.languages : (w.languages ? [w.languages] : ['Hindi','English']),
    bio: w.bio || (w.profileSummary || ''),
    availability: w.status || 'Available',
    phone: w.phone || '',
    email: w.email || 'youremail@example.com',
    location: w.address || 'Baner, Pune',
    serviceRadius: w.serviceRadius || 10,
  }));
  const [preview, setPreview] = useState(draft.photo);
  const [showVerif, setShowVerif] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => setDraft(d => ({ ...d, name: (w && w.name) || d.name })), [w && w.name]);

  function onFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => { setPreview(ev.target.result); setDraft(d => ({ ...d, photo: ev.target.result })); };
    reader.readAsDataURL(f);
  }

  function save() {
    const patch = {
      name: draft.name,
      photo: draft.photo || w.photo,
      primaryProfession: draft.primaryProfession,
      services: draft.services,
      skillList: draft.skills,
      experience: draft.experience,
      languages: draft.languages,
      bio: draft.bio,
      status: draft.availability,
      phone: draft.phone,
      email: draft.email,
      address: draft.location,
      serviceRadius: draft.serviceRadius,
    };
    actions.updateWorkerProfile && actions.updateWorkerProfile(w.id, patch);
    setEdit(false);
    setSavedMsg('Profile updated successfully');
    setTimeout(()=>setSavedMsg(''),2500);
  }

  const completion = Math.min(100, Math.round((
    (draft.photo ? 20 : 0) + (draft.bio ? 20 : 0) + (draft.services && draft.services.length ? 20 : 0) + (draft.location ? 20 : 0) + (draft.experience ? 20 : 0)
  )/1));

  const verifs = w.verification || {
    identity: 'verified', address: 'verified', professional: 'verified', background: 'verified', photo: draft.photo ? 'verified' : 'pending'
  };

  const verifsObj = (verifs && typeof verifs === 'object' && !Array.isArray(verifs))
    ? verifs
    : { identity: 'pending', address: 'pending', professional: 'pending', background: 'pending', photo: draft.photo ? 'verified' : 'pending' };

  const reviews = Array.isArray(w.reviews)
    ? w.reviews
    : [{ name: 'Amit', rating: 5, text: 'Very professional and completed the work quickly.', date: '2 days ago' }, { name: 'Rahul', rating: 5, text: 'Arrived on time and solved the issue properly.', date: '5 days ago' }];

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap' }}>
        <Card style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'center' }}>
              <Avatar name={draft.name} photo={preview || draft.photo} size={96} />
              <div style={{ marginTop: 8 }}>
                {edit ? (
                  <label style={{ cursor: 'pointer', color: C.blue, fontSize: 13 }}>
                    Change Photo <input type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
                  </label>
                ) : null}
              </div>
            </div>
            <div style={{ minWidth: 260 }}>
              <div style={{ ...heading, fontSize: 20 }}>{draft.name}</div>
              <div style={{ color: C.slate, marginTop: 6 }}>{w.id} • {draft.primaryProfession}</div>
              <div style={{ marginTop: 8 }}><Badge tone={verifs.identity === 'verified' ? 'green' : 'orange'}>{verifs.identity === 'verified' ? 'KaamSetu Verified' : 'Verification Pending'}</Badge></div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 12.5, color: C.slate }}>Status</div>
                  {!edit ? (<div style={{ fontWeight:700 }}>{draft.availability}</div>) : (
                    <select value={draft.availability} onChange={e=>setDraft(d=>({...d, availability:e.target.value}))} style={{ ...inputStyle, width: 160 }}>{['Available','Busy','Offline'].map(s=>(<option key={s}>{s}</option>))}</select>
                  )}
                </div>
                <div>
                  <Btn size="sm" tone={edit ? 'ghost' : 'primary'} onClick={()=>setEdit(e=>!e)}>{edit ? 'Editing' : 'Edit Profile'}</Btn>
                </div>
                {edit && <div><Btn size="sm" tone="green" onClick={save}>Save Changes</Btn></div>}
              </div>
              {savedMsg && <div style={{ color: C.green, marginTop: 8 }}>{savedMsg}</div>}
            </div>
          </div>
        </Card>

        <div style={{ flex: 1, minWidth: 300 }}>
          <Card style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: C.slate }}>Profile Completion</div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{completion}%</div>
              </div>
              <div style={{ width: 180 }}>
                <div style={{ height: 10, background: C.paperDim, borderRadius: 8 }}>
                  <div style={{ height: 10, width: `${completion}%`, background: C.green, borderRadius: 8 }} />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 10, color: C.slate, fontSize: 13 }}>
              Complete your profile to improve customer trust and get more job opportunities.
            </div>
          </Card>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div>
          <Card style={{ padding: 16, marginBottom: 12 }}>
            <h3 style={{ ...heading, fontSize: 16, marginTop: 0 }}>Professional Information</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              <Field label="Full Name"><input style={inputStyle} value={draft.name} onChange={e=>setDraft(d=>({...d, name:e.target.value}))} disabled={!edit} /></Field>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}><Field label="Primary Profession"><input style={inputStyle} value={draft.primaryProfession} onChange={e=>setDraft(d=>({...d, primaryProfession:e.target.value}))} disabled={!edit} /></Field></div>
                <div style={{ width: 140 }}><Field label="Experience (yrs)"><input style={inputStyle} type="number" value={draft.experience} onChange={e=>setDraft(d=>({...d, experience: Number(e.target.value)}))} disabled={!edit} /></Field></div>
              </div>
              <Field label="Languages"><input style={inputStyle} value={draft.languages.join(', ')} onChange={e=>setDraft(d=>({...d, languages: e.target.value.split(',').map(s=>s.trim())}))} disabled={!edit} /></Field>
              <Field label="About"><textarea style={{...inputStyle, minHeight:100}} value={draft.bio} onChange={e=>setDraft(d=>({...d, bio:e.target.value}))} disabled={!edit} /></Field>
            </div>
          </Card>

          <Card style={{ padding: 16, marginBottom: 12 }}>
            <h3 style={{ ...heading, fontSize: 16, marginTop: 0 }}>Skills & Services</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {(draft.services || []).map(s => (<Badge key={s} tone="blue">{s}</Badge>))}
            </div>
            <div style={{ color: C.slate, marginBottom: 8 }}>Key skills</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{(draft.skills || ['Wiring','Installation','Troubleshooting']).map(s=> <Badge key={s}>{s}</Badge>)}</div>
            {edit && <div style={{ marginTop: 10 }}><Btn size="sm" tone="ghost">Manage Services</Btn></div>}
          </Card>

          <Card style={{ padding: 16, marginBottom: 12 }}>
            <h3 style={{ ...heading, fontSize: 16, marginTop: 0 }}>Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 800, fontSize: 18 }}>{w.rating || 4.8} <span style={{ color: C.slate }}>/5</span></div><div style={{ color: C.slate }}>Rating</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 800, fontSize: 18 }}>{w.completedJobs || 184}</div><div style={{ color: C.slate }}>Completed Jobs</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 800, fontSize: 18 }}>{w.customerSatisfaction || '96%'}</div><div style={{ color: C.slate }}>Satisfaction</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 800, fontSize: 18 }}>{w.responseRate || '98%'}</div><div style={{ color: C.slate }}>Response Rate</div></div>
            </div>
          </Card>

          <Card style={{ padding: 16, marginBottom: 12 }}>
            <h3 style={{ ...heading, fontSize: 16, marginTop: 0 }}>Customer Reviews</h3>
            {reviews.map((r,i)=>(
              <div key={i} style={{ borderBottom: `1px solid ${C.line}`, padding: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><strong>{r.name[0]}</strong> <span style={{ color: C.slate, fontSize: 13 }}>• {r.date}</span></div>
                  <Stars value={r.rating} />
                </div>
                <div style={{ marginTop: 6 }}>{r.text}</div>
              </div>
            ))}
            <div style={{ marginTop: 8 }}><Btn size="sm" tone="ghost">View All Reviews</Btn></div>
          </Card>
        </div>

        <div>
          <Card style={{ padding: 16, marginBottom: 12 }}>
            <h4 style={{ ...heading, fontSize: 15, marginTop: 0 }}>Service Area</h4>
            <div style={{ marginTop: 8 }}>{draft.location}</div>
            <div style={{ color: C.slate, marginTop: 8 }}>Service Radius: <strong>{draft.serviceRadius} km</strong></div>
            <div style={{ marginTop: 10 }}>{(Array.isArray(w.serviceAreas) ? w.serviceAreas : ['Baner','Wakad','Balewadi','Aundh']).map(a=> <Badge key={a} tone="slate">{a}</Badge>)}</div>
          </Card>

          <Card style={{ padding: 16, marginBottom: 12 }}>
            <h4 style={{ ...heading, fontSize: 15, marginTop: 0 }}>Verification & Documents</h4>
            <div style={{ display: 'grid', gap: 8 }}>
              {Object.entries(verifsObj).map(([k,v])=> (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ color: C.slate, textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g,' $1')}</div>
                  <div><Badge tone={v==='verified' ? 'green' : v==='pending' ? 'orange' : 'red'}>{v==='verified' ? 'Verified' : v==='pending' ? 'Under Review' : 'Action Required'}</Badge></div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10 }}><Btn size="sm" tone="ghost" onClick={()=>setShowVerif(true)}>View Verification Details</Btn></div>
          </Card>

          <Card style={{ padding: 16, marginBottom: 12 }}>
            <h4 style={{ ...heading, fontSize: 15, marginTop: 0 }}>Account Information</h4>
            <div style={{ display: 'grid', gap: 8 }}>
              <div><div style={{ color: C.slate }}>Phone</div><div style={{ fontWeight: 700 }}>{draft.phone ? draft.phone.replace(/(\d{2})\d{6}(\d{2})/, '+91 $1XXXXXX$2') : '—'}</div></div>
              <div><div style={{ color: C.slate }}>Email</div><div style={{ fontWeight: 700 }}>{draft.email}</div></div>
              <div><div style={{ color: C.slate }}>Member Since</div><div style={{ fontWeight: 700 }}>{w.memberSince || 'January 2025'}</div></div>
            </div>
          </Card>
        </div>
      </div>

      {showVerif && (
        <Modal title="Verification Details" onClose={()=>setShowVerif(false)} width={520}>
          <div style={{ display: 'grid', gap: 10 }}>
            {Object.entries(verifsObj).map(([k,v])=> (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ color: C.slate }}>{k.replace(/([A-Z])/g,' $1')}</div>
                <div>{v==='verified' ? '✓ Verified' : v==='pending' ? 'Under Review' : 'Action Required'}</div>
              </div>
            ))}
            <div style={{ marginTop: 12 }}><Btn onClick={()=>setShowVerif(false)}>Close</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function WorkerTravel() {
  const [traveling, setTraveling] = useState(false);
  const [distance, setDistance] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const intervalRef = useRef(null);

  function start() {
    setTraveling(true); setDistance(0); setEndTime(null);
    setStartTime(new Date().toLocaleTimeString());
    intervalRef.current = setInterval(() => {
      setDistance(d => Math.round((d + 0.3 + Math.random() * 0.4) * 10) / 10);
    }, 700);
  }
  function stop() {
    clearInterval(intervalRef.current);
    setTraveling(false);
    setEndTime(new Date().toLocaleTimeString());
  }
  useEffect(() => () => clearInterval(intervalRef.current), []);
  const cost = Math.round(distance * 12);

  return (
    <Card style={{ padding: 24, maxWidth: 520 }}>
      <h3 style={{ ...heading, fontSize: 20, marginTop: 0 }}>Travel Tracking</h3>
      <p style={{ color: C.slate, fontSize: 13.5 }}>Start tracking when you leave for a customer's location.</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {!traveling ? (
          <Btn onClick={start} tone="green"><PlayCircle size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} />Start Travel</Btn>
        ) : (
          <Btn onClick={stop} tone="red"><StopCircle size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} />Stop Travel</Btn>
        )}
      </div>
      <div style={{ background: C.paperDim, borderRadius: 12, padding: 18 }}>
        <Stat icon={Clock} label="Start Time" value={startTime || "—"} />
        <Stat icon={Clock} label="End Time" value={endTime || "—"} />
        <Stat icon={Navigation} label="Distance Travelled" value={`${distance} km`} />
        <Stat icon={IndianRupee} label="Travel Cost" value={`₹${cost}`} />
      </div>
      {traveling && <div style={{ marginTop: 14, fontSize: 13, color: C.blue }}>Tracking in progress — map integration simulated for this demo.</div>}
    </Card>
  );
}

/* ============================== CUSTOMER PORTAL ============================== */
function CustomerPortal({ state, actions, onLogout, customerId, promptLocationFor, clearPrompt }) {
  const customer = state.customers.find(c => c.id === customerId)
    || state.customers.find(c => c.id === DEMO_CUSTOMER.id)
    || DEMO_CUSTOMER;
  const [view, setView] = useState("home"); // home | services | currentWork | servicesNext | about | profile
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState(() => customer.selectedServiceIds || []);
  const [bookingDraft, setBookingDraft] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    if (promptLocationFor && promptLocationFor === customer.id) {
      setShowLocationModal(true);
    }
  }, [promptLocationFor, customer.id]);

  function handleAllowLocation() {
    if (!navigator.geolocation) {
      // not supported; just close
      setShowLocationModal(false);
      clearPrompt && clearPrompt();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // store via existing architecture
        actions.updateCustomerProfile(customer.id, { location: { latitude, longitude }, locationGranted: true });
        setShowLocationModal(false);
        clearPrompt && clearPrompt();
      },
      (err) => {
        // permission denied or error -- do not block
        setShowLocationModal(false);
        clearPrompt && clearPrompt();
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }

  function handleNotNow() {
    setShowLocationModal(false);
    clearPrompt && clearPrompt();
  }

  return (
    <div style={{ minHeight: "100vh", background: C.paper, ...body }}>
      <div style={{
        padding: "12px 28px", background: C.card, borderBottom: `1px solid ${C.line}`,
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setView("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }} aria-label="Customer dashboard">
            <BrandMark size={38} />
            <BrandWordmark style={{ ...heading, fontSize: 20, fontWeight: 700 }} />
          </button>
          <div style={{ display: "flex", gap: 12, marginLeft: 18 }}>
            <button onClick={() => setView("services")} style={{ background: "none", border: "none", cursor: "pointer", color: view === "services" || view === "servicesNext" ? C.navy : C.slate, fontWeight: 600 }}>Services</button>
            <button onClick={() => setView("about")} style={{ background: "none", border: "none", cursor: "pointer", color: view === "about" ? C.navy : C.slate, fontWeight: 600 }}>About Us</button>
            <button onClick={() => setView("profile")} style={{ background: "none", border: "none", cursor: "pointer", color: view === "profile" ? C.navy : C.slate, fontWeight: 600 }}>Customer Profile</button>
            <button onClick={() => setView("complaints")} style={{ background: "none", border: "none", cursor: "pointer", color: view === "complaints" ? C.navy : C.slate, fontWeight: 600 }}>Complaints</button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Badge tone="blue"><Wallet size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} />₹{customer.wallet}</Badge>
          {state.complaints && state.complaints.filter(c => c.customerId === customer.id && !['Resolved','Closed'].includes(c.status)).length > 0 && (
            <Badge tone="orange">{state.complaints.filter(c => c.customerId === customer.id && !['Resolved','Closed'].includes(c.status)).length} Open</Badge>
          )}
          <Avatar name={customer.name} size={34} photo={customer.photo} />
          <button onClick={onLogout} style={{ background: "none", border: "none", cursor: "pointer" }}><LogOut size={18} color={C.slate} /></button>
        </div>
      </div>
      <div style={{ padding: 26, maxWidth: 1100, margin: "0 auto" }}>
        {view === "home" && (
          <CustomerHome
            state={state}
            customer={customer}
            onOpenServices={() => setView("services")}
            onOpenCurrentWork={() => setView("currentWork")}
          />
        )}
        {view === "services" && (
          <CustomerServicesPage
            state={state}
            customer={customer}
            actions={actions}
            selectedServiceIds={selectedServiceIds}
            setSelectedServiceIds={setSelectedServiceIds}
            onProceed={() => setView("servicesNext")}
          />
        )}
        {view === "currentWork" && (
          <CustomerCurrentWork state={state} actions={actions} customer={customer} onBack={() => setView("home")} />
        )}
        {view === "servicesNext" && (
          <CustomerSelectionNextStep
            state={state}
            customer={customer}
            selectedServiceIds={selectedServiceIds}
            onBack={() => setView("services")}
            onStartBooking={() => { setBookingDraft({ customerId: customer.id, selectedServiceIds: [...selectedServiceIds] }); setBookingStep(1); setView('booking'); }}
          />
        )}
        {view === "about" && <AboutUs />}
        {view === "profile" && <CustomerProfile state={state} actions={actions} customer={customer} onOpenComplaints={() => setView('complaints')} />}
        {view === 'complaints' && (
          <ComplaintsPage state={state} actions={actions} customer={customer} />
        )}

        {view === 'booking' && (
          <BookingFlow
            state={state}
            actions={actions}
            customer={customer}
            bookingDraft={bookingDraft}
            setBookingDraft={setBookingDraft}
            bookingStep={bookingStep}
            setBookingStep={setBookingStep}
            onFinish={(result) => { setBookingResult(result); setView('tracking'); }}
            onCancel={() => { setBookingDraft(null); setView('services'); }}
          />
        )}

        {view === 'tracking' && bookingResult && (
          <TrackingPage booking={bookingResult} state={state} />
        )}
      </div>

      {showLocationModal && (
        <Modal title="Enable Location" onClose={handleNotNow}>
          <p style={{ color: C.slate, fontSize: 14, marginBottom: 18 }}>
            Allow KaamSetu to access your location to help provide relevant services and connect you with nearby workers.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn tone="ghost" size="sm" onClick={handleNotNow}>Not Now</Btn>
            <Btn onClick={handleAllowLocation}>Allow Location</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function customerActiveRequests(state, customer) {
  return state.requests.filter(r => r.customerId === customer.id && !r.completed && !r.cancelled);
}

function CustomerHome({ state, customer, onOpenServices, onOpenCurrentWork }) {
  const active = customerActiveRequests(state, customer);
  const latest = active[0];
  const history = customer.history || [];
  const completed = history.filter(item => item.completed || item.workStatus === "completed").length;
  const ratings = history.map(item => Number(item.rating)).filter(Number.isFinite);
  const satisfaction = ratings.length ? `${(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)}/5` : "—";
  const popularServices = state.services.filter(service => service.status !== "removed").slice(0, 3);
  const statusLabel = latest
    ? latest.workerId ? `${latest.service} — worker assigned` : `${latest.service} — awaiting assignment`
    : "No active work right now.";
  const metrics = [
    { label: "Total Services", value: history.length + active.length, detail: "Requested", Icon: ClipboardList, tone: "blue" },
    { label: "Completed", value: completed, detail: "Services", Icon: CheckCircle2, tone: "green" },
    { label: "In Progress", value: active.length, detail: "Active requests", Icon: Clock, tone: "orange" },
    { label: "Satisfaction", value: satisfaction, detail: ratings.length ? "Based on your ratings" : "No ratings yet", Icon: Star, tone: "navy" },
  ];
  const toneMap = {
    blue: { bg: C.navySoft, color: C.blue },
    green: { bg: C.greenSoft, color: C.green },
    orange: { bg: C.orangeSoft, color: C.orange },
    navy: { bg: "#EEF1F8", color: C.navy },
  };

  return (
    <div className="ks-customer-home">
      <div className="ks-cust-hero" style={{
        display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap",
        marginBottom: 22, padding: "24px 26px", background: C.card,
        borderRadius: 16, border: `1px solid ${C.line}`
      }}>
        <div className="ks-cust-logo-wrap" style={{ flexShrink: 0 }}>
          <img
            src={kaamSetuLogo}
            alt="KaamSetu"
            width={96}
            height={96}
            style={{ width: 96, height: 96, objectFit: "contain", display: "block", borderRadius: "50%" }}
          />
        </div>
        <div style={{ minWidth: 220, flex: 1 }}>
          <BrandWordmark style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, display: "inline-block" }} />
          <h1 style={{ ...heading, fontSize: 32, color: C.ink, margin: "0 0 8px" }}>Welcome back, <span style={{ color: C.orange }}>{customer.name}</span></h1>
          <p style={{ color: C.slate, fontSize: 15, margin: 0, lineHeight: 1.5 }}>
            Find trusted professionals for your everyday service needs.
          </p>
        </div>
      </div>

      <div className="ks-cust-metrics">
        {metrics.map(({ label, value, detail, Icon, tone }) => {
          const palette = toneMap[tone];
          return (
            <div className="ks-cust-metric" key={label}>
              <div className="ks-cust-metric-icon" style={{ background: palette.bg, color: palette.color }}><Icon size={18} /></div>
              <div><div className="ks-cust-metric-label">{label}</div><strong>{value}</strong><span>{detail}</span></div>
            </div>
          );
        })}
      </div>

      <div className="ks-cust-main-grid">
        <Card className="ks-card-transition ks-cust-feature-card" onClick={onOpenServices} style={{ padding: 22 }}>
          <div className="ks-cust-card-heading">
            <div><h2>Services</h2><p>Explore and request professional services</p></div>
            <ChevronRight size={20} color={C.slate} />
          </div>
          <div className="ks-cust-service-list">
            {popularServices.map(service => {
              const Icon = service.Icon || Wrench;
              return <div className="ks-cust-service-chip" key={service.id}><Icon size={17} color={C.orange} /><span>{service.name}</span></div>;
            })}
            <div className="ks-cust-service-chip ks-cust-service-more"><Layers size={17} color={C.slate} /><span>More</span></div>
          </div>
          <div className="ks-cust-card-cta">Explore Services <ChevronRight size={16} /></div>
        </Card>

        <Card className="ks-card-transition ks-cust-feature-card" onClick={onOpenCurrentWork} style={{ padding: 22 }}>
          <div className="ks-cust-card-heading">
            <div><h2>Current Work</h2><p>Track your ongoing service requests</p></div>
            <ChevronRight size={20} color={C.slate} />
          </div>
          {active.length > 0 ? (
            <div className="ks-cust-work-summary">
              <Badge tone="blue">{active.length} active {active.length === 1 ? "request" : "requests"}</Badge>
              <strong>{statusLabel}</strong>
              <span>{latest.workerId ? "A professional has been assigned to your request." : "We are finding the right professional for you."}</span>
            </div>
          ) : (
            <div className="ks-cust-empty-work"><ClipboardList size={24} color={C.muted} /><strong>No active work right now.</strong><span>Explore services to book a professional.</span></div>
          )}
          <div className="ks-cust-card-cta">{active.length > 0 ? "View Details" : "Explore Services"} <ChevronRight size={16} /></div>
        </Card>
      </div>

      <div className="ks-cust-trust-strip">
        {[
          { label: "Trusted Platform", text: "Verified professionals", Icon: Shield },
          { label: "Secure & Safe", text: "Your data is protected", Icon: CheckCircle2 },
          { label: "Quality Services", text: "Professional standards", Icon: Star },
          { label: "24x7 Support", text: "Always here to help", Icon: Bell },
        ].map(({ label, text, Icon }) => (
          <div key={label}><Icon size={18} color={C.navy} /><span><strong>{label}</strong>{text}</span></div>
        ))}
      </div>
      <footer className="ks-cust-footer">© 2026 KaamSetu. All rights reserved.</footer>
    </div>
  );
}

function CustomerServicesPage({ state, customer, actions, selectedServiceIds, setSelectedServiceIds, onProceed }) {
  const services = state.services.filter(s => s.status !== "removed");
  const selected = services.filter(s => selectedServiceIds.includes(s.id));

  function toggleService(id) {
    setSelectedServiceIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleProceed() {
    if (!selectedServiceIds.length) return;
    actions.updateCustomerProfile(customer.id, {
      selectedServiceIds: [...selectedServiceIds],
      pendingServiceIds: [...selectedServiceIds],
      serviceSelectionStage: "proceeded",
    });
    onProceed();
  }

  return (
    <div className="ks-services-page" style={{ paddingBottom: 8, position: "relative", overflow: "hidden" }}>
      <img className="ks-services-background" src={landingBackground} alt="" aria-hidden="true" />
      <div className="ks-services-content">
      <div className="ks-services-title">
        <span aria-hidden="true" />
        <div>
          <h1 style={{ ...heading, fontSize: 32, color: C.ink, margin: "0 0 6px" }}>Services</h1>
          <p style={{ color: C.slate, fontSize: 14.5, margin: 0 }}>
        Select one or more services, then proceed. Booking details will follow in the next step.
          </p>
        </div>
      </div>

      <div className="ks-services-grid ks-services-page-grid" style={{ marginBottom: 18 }}>
        {services.map(s => {
          const isSelected = selectedServiceIds.includes(s.id);
          return (
            <Card
              key={s.id}
              className={`ks-card-transition ks-service-card${isSelected ? " ks-service-card-selected" : ""}`}
              onClick={() => toggleService(s.id)}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleService(s.id); } }}
              style={{
                padding: 20,
                border: isSelected ? `2px solid ${C.navy}` : `1px solid ${C.line}`,
                background: isSelected ? "#F4F6FB" : C.card,
                position: "relative",
              }}
            >
              <div className="ks-service-card-top">
              <div style={{
                width: 46, height: 46, borderRadius: 14, background: isSelected ? C.navy + "14" : C.orange + "1A",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10
              }}>
                {isSelected
                  ? <CheckCircle2 size={22} color={C.navy} />
                  : <s.Icon size={22} color={C.orange} />}
              </div>
                <span className="ks-service-arrow" aria-hidden="true"><ChevronRight size={17} /></span>
              </div>
              <div style={{ fontWeight: 700, color: C.ink, fontSize: 15, paddingRight: 20, lineHeight: 1.3 }}>{s.name}</div>
              <div style={{ fontSize: 12.5, color: C.slate, marginTop: 6 }}>₹{s.charge} onwards</div>
            </Card>
          );
        })}
      </div>

      <div className="ks-cust-select-bar">
        <div className="ks-services-selection-copy">
          <div className="ks-services-selection-icon"><ClipboardList size={18} color={C.navy} /></div>
          <div>
            <div style={{ fontWeight: 700, color: C.ink, fontSize: 15 }}>Selected Services: {selected.length}</div>
          {selected.length > 0 && (
            <div style={{ color: C.slate, fontSize: 13, marginTop: 4, lineHeight: 1.45 }}>
              {selected.map(s => s.name).join(" · ")}
            </div>
          )}
          </div>
        </div>
        <Btn className="ks-btn-transition" disabled={selected.length === 0} onClick={handleProceed}>Proceed <ChevronRight size={16} style={{ verticalAlign: "-3px", marginLeft: 3 }} /></Btn>
      </div>
      </div>
    </div>
  );
}

function CustomerCurrentWork({ state, actions, customer, onBack }) {
  const active = customerActiveRequests(state, customer);
  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.slate, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginBottom: 12, padding: 0 }}>
        <ArrowLeft size={16} /> Dashboard
      </button>
      <h1 style={{ ...heading, fontSize: 28, color: C.ink, margin: "0 0 16px" }}>Current Work</h1>
      {active.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No active work right now"
          description="Your service requests are currently clear. Open Services to book the help you need and track progress here."
          actionLabel="Open Services"
          onAction={onBack}
          tone="navy"
        />
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {active.map(req => (
            <Card key={req.id} style={{ padding: 18, borderLeft: `5px solid ${req.workerId ? C.green : C.amber}` }}>
              <RequestTracker request={req} actions={actions} customer={customer} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CustomerSelectionNextStep({ state, customer, selectedServiceIds, onBack, onStartBooking }) {
  const persistedIds = (customer.pendingServiceIds || customer.selectedServiceIds || selectedServiceIds);
  const selected = state.services.filter(s => persistedIds.includes(s.id));
  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.slate, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginBottom: 12, padding: 0 }}>
        <ArrowLeft size={16} /> Back to services
      </button>
      <h1 style={{ ...heading, fontSize: 28, color: C.ink, margin: "0 0 8px" }}>Your selection is saved</h1>
      <p style={{ color: C.slate, fontSize: 14.5, margin: "0 0 18px" }}>
        The booking details for these services will continue in the next phase. Your selection has been retained.
      </p>
      <Card style={{ padding: 20 }}>
        <div style={{ fontWeight: 700, color: C.ink, marginBottom: 12 }}>Selected Services ({selected.length})</div>
        {selected.length === 0 ? (
          <div style={{ color: C.slate }}>No services in this selection.</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, color: C.ink, lineHeight: 1.7 }}>
            {selected.map(s => <li key={s.id}>{s.name}</li>)}
          </ul>
        )}
      </Card>

      <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
        <Btn tone="ghost" size="sm" onClick={onBack}><ArrowLeft size={14} /> Modify</Btn>
        <Btn tone="orange" onClick={() => {
          if (onStartBooking) return onStartBooking();
          // fallback event for older wiring
          if (typeof window !== 'undefined') {
            const ev = new CustomEvent('kaamsetu:startBooking', { detail: { selectedServiceIds: persistedIds } });
            window.dispatchEvent(ev);
          }
        }}>Start Booking</Btn>
      </div>
    </div>
  );
}

function AboutUs() {
  return (
    <div>
      <h1 style={{ ...heading, fontSize: 28, color: C.ink }}>About <BrandWordmark /></h1>
      <Card style={{ padding: 20, marginTop: 12 }}>
        <p style={{ color: C.slate, fontSize: 14 }}>
          KaamSetu connects customers with trusted local skilled workers for home and industrial services.
          We prioritise safety, transparency and convenient booking to make getting work done simple.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12, marginTop: 14 }}>
          <div>
            <div style={{ fontSize: 13, color: C.slate }}>Services</div>
            <div style={{ fontWeight: 700, color: C.ink }}>Wide local coverage</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: C.slate }}>Trust</div>
            <div style={{ fontWeight: 700, color: C.ink }}>Verified professionals</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: C.slate }}>Support</div>
            <div style={{ fontWeight: 700, color: C.ink }}>Responsive help</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CustomerProfile({ state, actions, customer, onOpenComplaints }) {
  const cust = state.customers.find(c => c.id === customer.id) || customer;
  const reqs = state.requests.filter(r => r.customerId === cust.id);
  // merge historical entries: explicit customer.history + completed/cancelled/incomplete requests
  const mergedHistory = [ ...(cust.history || []), ...reqs.filter(r => ['completed','cancelled','incomplete'].includes(r.status)).map(r => ({
    service: r.service,
    category: '',
    requestId: r.id,
    date: r.completed ? (new Date().toLocaleDateString('en-IN')) : (r.schedule && r.schedule.date) || '',
    time: r.schedule && r.schedule.time || '',
    worker: r.workerName,
    photo: null,
    charge: r.charge,
    paymentStatus: r.paymentStatus || (r.paid ? 'secured' : 'pending_payment'),
    workStatus: r.workStatus || (r.completed ? 'completed' : r.status),
    rating: r.rating || null,
    review: r.review || '',
  }))];

  const totalServices = mergedHistory.length;
  const completedCount = mergedHistory.filter(h => (h.workStatus === 'completed' || h.completed)).length;
  const activeRequests = reqs.filter(r => !r.completed && !r.cancelled).length;

  const [detail, setDetail] = useState(null);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Btn size="sm" tone="ghost" onClick={() => onOpenComplaints && onOpenComplaints()}>View All Complaints →</Btn>
      </div>
      <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 18 }}>
        <Avatar name={cust.name} size={84} photo={cust.photo} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{cust.name}</div>
          <div style={{ color: C.slate, marginTop: 6 }}>{cust.email}</div>
          <div style={{ color: C.slate, marginTop: 6 }}>{cust.phone}</div>
          <div style={{ color: C.slate, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}><MapPin size={12} />{cust.address}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 18 }}>
        <Card style={{ padding: 14 }}>
          <div style={{ fontSize: 13.5, color: C.slate }}>Total Services</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{totalServices}</div>
        </Card>
        <Card style={{ padding: 14 }}>
          <div style={{ fontSize: 13.5, color: C.slate }}>Completed Services</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{completedCount}</div>
        </Card>
        <Card style={{ padding: 14 }}>
          <div style={{ fontSize: 13.5, color: C.slate }}>Active Requests</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{activeRequests}</div>
        </Card>
      </div>

      <h3 style={{ ...heading, fontSize: 18, color: C.ink, marginBottom: 12 }}>Service History</h3>
      {mergedHistory.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No service history yet"
          description="Your completed and upcoming service activity will appear here once you book a professional."
          tone="navy"
        />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {mergedHistory.map((h, i) => (
            <Card key={i} style={{ padding: 14, cursor: 'pointer' }} onClick={() => setDetail(h)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, color: C.ink }}>{h.service}</div>
                  <div style={{ color: C.slate, fontSize: 13 }}>{h.date} • {h.time || ''}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: C.ink }}>₹{h.charge}</div>
                  <div style={{ color: C.slate, fontSize: 13 }}>{h.paymentStatus === 'released' ? 'Payment Released' : (h.paymentStatus === 'secured' ? 'Payment Secured' : h.paymentStatus)}</div>
                </div>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
                <Avatar name={h.worker || 'Professional'} size={40} photo={h.photo} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{h.worker}</div>
                  <div style={{ color: C.slate, fontSize: 13 }}>{h.review || ''}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: C.slate }}>{h.workStatus || ''}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {detail && <Modal title={`Request ${detail.requestId || ''}`} onClose={() => setDetail(null)}>
        <div style={{ display: 'grid', gap: 8 }}>
          <div><strong>Service:</strong> {detail.service}</div>
          <div><strong>Request ID:</strong> {detail.requestId}</div>
          <div><strong>Date:</strong> {detail.date} {detail.time}</div>
          <div><strong>Worker:</strong> {detail.worker}</div>
          <div><strong>Amount:</strong> ₹{detail.charge}</div>
          <div><strong>Payment:</strong> {detail.paymentStatus}</div>
          <div><strong>Status:</strong> {detail.workStatus}</div>
          {detail.rating && <div><strong>Rating:</strong> <Stars value={detail.rating} /></div>}
          {detail.review && <div><strong>Review:</strong> <div style={{ color: C.slate }}>{detail.review}</div></div>}
        </div>
      </Modal>}
    </div>
  );
}

function ComplaintsPage({ state, actions, customer }) {
  const [view, setView] = useState('list'); // list | raise | details
  const [selected, setSelected] = useState(null);

  const myComplaints = (state.complaints || []).filter(c => c.customerId === customer.id);

  function openRaise() { setView('raise'); }
  function openList() { setView('list'); }
  function openDetails(c) { setSelected(c); setView('details'); }

  return (
    <div>
      <button onClick={openList} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.slate, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: 0 }}>
        <ArrowLeft size={16} /> Back
      </button>
      <h1 style={{ ...heading, fontSize: 28, color: C.ink }}>Complaints & Support</h1>
      <p style={{ color: C.slate }}>Need help with a completed service? Raise a complaint and track its progress here.</p>

      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <Btn tone="orange" onClick={openRaise}>Raise a Complaint</Btn>
        <Btn tone="ghost" onClick={openList}>Track Complaints</Btn>
      </div>

      <div style={{ marginTop: 18 }}>
        {view === 'list' && (
          <div>
            {myComplaints.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No complaints raised yet"
                description="If you run into an issue with a completed service, you can raise a complaint here and track the resolution progress."
                actionLabel="Raise a Complaint"
                onAction={openRaise}
                tone="orange"
              />
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {myComplaints.map(c => (
                  <Card key={c.id} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{c.service}</div>
                        <div style={{ color: C.slate, fontSize: 13 }}>{c.category} • {c.createdAt}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700 }}>{c.id}</div>
                        <div style={{ color: C.slate }}>{c.priority}</div>
                        <div style={{ marginTop: 8 }}><Btn size="sm" tone="ghost" onClick={() => openDetails(c)}>View Details →</Btn></div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, color: C.slate }}>{c.description && c.description.substring(0,120)}</div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'raise' && (
          <RaiseComplaintForm state={state} actions={actions} customer={customer} onSubmitted={(cmp) => { setSelected(cmp); setView('details'); }} onCancel={() => setView('list')} />
        )}

        {view === 'details' && selected && (
          <ComplaintDetails complaint={selected} setComplaint={(c)=>{setSelected(c);}} state={state} actions={actions} customer={customer} onBack={() => setView('list')} />
        )}
      </div>
    </div>
  );
}

function RaiseComplaintForm({ state, actions, customer, onSubmitted, onCancel }) {
  // related completed work: from state.requests with status 'completed' or customer.history
  const completedFromRequests = (state.requests || []).filter(r => r.customerId === customer.id && (r.status === 'completed' || r.workStatus === 'completed'));
  const cust = state.customers.find(c => c.id === customer.id) || customer;
  const completedFromHistory = (cust.history || []).map((h,i)=>({ service: h.service, requestId: h.requestId || null, worker: h.worker || h.workerName, date: h.date, amount: h.charge }));
  const options = [ ...completedFromRequests.map(r=>({ service: r.service, requestId: r.id, worker: r.workerName, date: r.completedAt || r.schedule?.date || '' , amount: r.charge })), ...completedFromHistory ];

  const [selectedWork, setSelectedWork] = useState(options[0] || null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [preferredResolution, setPreferredResolution] = useState('Re-inspection of the work');
  const [priority, setPriority] = useState('Medium');

  function handleFile(e){
    const files = Array.from(e.target.files || []);
    files.forEach(f=>{ const reader = new FileReader(); reader.onload = ()=> setImages(prev=>[...prev,reader.result]); reader.readAsDataURL(f); });
  }
  function removeImage(i){ setImages(prev=>prev.filter((_,idx)=>idx!==i)); }

  function submit(){
    if(!selectedWork){ alert('Please select the related work.'); return; }
    if(!category){ alert('Please select a complaint category.'); return; }
    if(!description || description.trim().length<6){ alert('Please describe your issue in detail.'); return; }
    const comp = actions.createComplaint({ customerId: customer.id, requestId: selectedWork.requestId, service: selectedWork.service, worker: selectedWork.worker, category, description, images, preferredResolution, priority });
    if(onSubmitted) onSubmitted(comp);
  }

  return (
    <div>
      <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.slate, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: 0 }}>
        <ArrowLeft size={16} /> Back
      </button>
      <h2 style={{ ...heading, fontSize: 20 }}>Raise a Complaint</h2>
      <p style={{ color: C.slate }}>Every complaint must be linked to a completed service. Select the related work below.</p>

      <Card style={{ padding: 16, marginTop: 10 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Select Related Work</div>
        {options.length === 0 ? (
          <div style={{ color: C.slate }}>No completed work found for your account.</div>
        ) : (
          <select style={inputStyle} value={JSON.stringify(selectedWork)} onChange={e=>setSelectedWork(JSON.parse(e.target.value))}>
            {options.map((o, i)=>(<option key={i} value={JSON.stringify(o)}>{o.service} — {o.date || ''} {o.requestId ? '• ' + o.requestId : ''}</option>))}
          </select>
        )}

        {selectedWork && (
          <div style={{ marginTop: 12, padding: 12, background: C.paperDim, borderRadius: 8 }}>
            <div style={{ fontWeight: 700 }}>{selectedWork.service}</div>
            <div style={{ color: C.slate, marginTop: 6 }}>Request ID: {selectedWork.requestId || 'N/A'}</div>
            <div style={{ color: C.slate, marginTop: 6 }}>Worker: {selectedWork.worker || 'N/A'}</div>
            <div style={{ color: C.slate, marginTop: 6 }}>Completed: {selectedWork.date || 'N/A'}</div>
            <div style={{ color: C.slate, marginTop: 6 }}>Amount Paid: ₹{selectedWork.amount || 'N/A'}</div>
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Complaint Category</div>
          <select style={inputStyle} value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="">Select category</option>
            {['Poor Quality of Work','Work Not Completed Properly','Worker Behaviour Issue','Overcharging / Pricing Issue','Property Damage','Service Delay','Safety Concern','Payment Related Issue','Other'].map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          <Field label="Describe Your Issue"><textarea style={{ ...inputStyle, minHeight: 120 }} placeholder="Please explain what happened and provide as much detail as possible." value={description} onChange={e=>setDescription(e.target.value)} /></Field>
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 700 }}>Upload Supporting Evidence (Optional)</div>
          <input type="file" accept="image/*" multiple onChange={handleFile} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>{images.map((src,i)=>(<div key={i} style={{ position: 'relative' }}><img src={src} style={{ width:80, height:60, objectFit:'cover', borderRadius:6 }} /><button onClick={()=>removeImage(i)} style={{ position:'absolute', top:-6, right:-6, background:'#fff', borderRadius:12, border:'1px solid '+C.line, padding:4 }}>x</button></div>))}</div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Preferred Resolution (Optional)</div>
          <select style={inputStyle} value={preferredResolution} onChange={e=>setPreferredResolution(e.target.value)}>
            {['Re-inspection of the work','Worker should fix the issue','Partial refund request','Full refund request','Contact me for discussion','Other'].map(o=>(<option key={o} value={o}>{o}</option>))}
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Priority</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Low','Medium','High','Urgent'].map(p=>(<button key={p} onClick={()=>setPriority(p)} style={{ padding:'8px 10px', borderRadius:8, border:`1px solid ${priority===p?C.navy:C.line}`, background: priority===p? '#eef6ff':'#fff' }}>{p}</button>))}
          </div>
          <div style={{ color: C.slate, fontSize:13, marginTop:6 }}>Please select the priority based on the seriousness of the issue.</div>
        </div>

        <div style={{ display:'flex', gap:10, marginTop: 14 }}>
          <Btn tone="ghost" onClick={onCancel}>Cancel</Btn>
          <Btn tone="orange" onClick={submit}>Submit Complaint</Btn>
        </div>
      </Card>
    </div>
  );
}

function ComplaintDetails({ complaint, setComplaint, state, actions, customer, onBack }) {
  const [local, setLocal] = useState(complaint);
  const [newUpdate, setNewUpdate] = useState('');

  useEffect(()=> setLocal(complaint), [complaint]);

  function sendUpdate(){
    if(!newUpdate.trim()) return alert('Please add details to send.');
    actions.addComplaintUpdate(local.id, 'customer', newUpdate.trim());
    setNewUpdate('');
    const refreshed = (state.complaints || []).find(c=>c.id===local.id);
    if(refreshed) setLocal(refreshed);
  }

  function doReopen(){
    const reason = prompt('Reason for reopening the complaint');
    if(!reason) return;
    actions.reopenComplaint(local.id, reason);
    const refreshed = (state.complaints || []).find(c=>c.id===local.id);
    if(refreshed) setLocal(refreshed);
  }

  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.slate, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: 0 }}>
        <ArrowLeft size={16} /> Back to Complaints
      </button>
      <h2 style={{ ...heading, fontSize: 20 }}>{local.service} — {local.id}</h2>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <Card style={{ padding: 12, flex: 1 }}>
          <div><strong>Status:</strong> {local.status}</div>
          <div><strong>Priority:</strong> {local.priority}</div>
          <div><strong>Submitted:</strong> {local.createdAt}</div>
          <div><strong>Last Updated:</strong> {local.updatedAt}</div>
        </Card>
        <Card style={{ padding: 12, width: 320 }}>
          <div style={{ fontWeight: 700 }}>Related Work</div>
          <div style={{ marginTop: 8 }}>Request ID: {local.requestId || 'N/A'}</div>
          <div style={{ marginTop: 6 }}>Worker: {local.worker || 'N/A'}</div>
          <div style={{ marginTop: 6 }}>Amount: ₹{local.amount || 'N/A'}</div>
        </Card>
      </div>

      <Card style={{ padding: 12, marginTop: 12 }}>
        <div style={{ fontWeight: 700 }}>Complaint Information</div>
        <div style={{ marginTop: 8 }}><strong>Category:</strong> {local.category}</div>
        <div style={{ marginTop: 8 }}><strong>Preferred Resolution:</strong> {local.preferredResolution}</div>
        <div style={{ marginTop: 8 }}><strong>Description:</strong><div style={{ color: C.slate, marginTop: 6 }}>{local.description}</div></div>
        {local.images && local.images.length>0 && (<div style={{ marginTop: 8 }}><strong>Images</strong><div style={{ display:'flex', gap:8, marginTop:8 }}>{local.images.map((src,i)=>(<img key={i} src={src} style={{ width:90, height:70, objectFit:'cover', borderRadius:6 }} />))}</div></div>)}
      </Card>

      <Card style={{ padding: 12, marginTop: 12 }}>
        <div style={{ fontWeight: 700 }}>Progress Timeline</div>
        <div style={{ marginTop: 10 }}>
          {(local.timeline || []).map((t, i)=> (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:8 }}>
              <div style={{ width:10, height:10, borderRadius:8, background: i < (local.timeline.length-1) ? C.green : C.navy }} />
              <div><div style={{ fontWeight:600 }}>{t.status}</div><div style={{ color:C.slate, fontSize:13 }}>{t.at} {t.note ? '— '+t.note : ''}</div></div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 12, marginTop: 12 }}>
        <div style={{ fontWeight: 700 }}>Updates</div>
        <div style={{ marginTop: 8 }}>{(local.updates || []).length === 0 ? <div style={{ color:C.slate }}>No updates yet.</div> : (local.updates || []).map((u,i)=>(<div key={i} style={{ marginBottom:8 }}><div style={{ fontWeight:600 }}>{u.author}</div><div style={{ color:C.slate }}>{u.text}</div><div style={{ fontSize:12, color:C.slate }}>{u.at}</div></div>))}</div>

        {(local.status && ['Submitted','Under Review','Investigation / Verification','Worker Response Pending','Resolution Proposed'].includes(local.status)) && (
          <div style={{ marginTop: 10 }}>
            <Field label="Need to add more information?">
              <textarea style={{ ...inputStyle, minHeight: 80 }} placeholder="Add additional details..." value={newUpdate} onChange={e=>setNewUpdate(e.target.value)} />
            </Field>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <Btn tone="ghost" onClick={()=>{ setNewUpdate(''); }}>Cancel</Btn>
              <Btn onClick={sendUpdate}>Send Update</Btn>
            </div>
          </div>
        )}

        {local.status === 'Resolved' && (
          <div style={{ marginTop: 12 }}>
            <Btn tone="ghost" onClick={doReopen}>Reopen Complaint</Btn>
          </div>
        )}
      </Card>
    </div>
  );
}

function BookingFlow({ state, actions, customer, bookingDraft, setBookingDraft, bookingStep, setBookingStep, onFinish, onCancel }) {
  const servicesMap = state.services.reduce((acc, s) => { acc[s.id] = s; return acc; }, {});
  const initial = bookingDraft || { customerId: customer.id, selectedServiceIds: [], description: '', images: [], bookingType: 'instant', schedule: { type: 'instant' }, assignedWorker: null, priceDetails: null, paymentStatus: 'pending', bookingStatus: 'draft' };
  const [draft, setDraft] = useState(initial);
  const [processing, setProcessing] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  useEffect(() => { setDraft(bookingDraft || initial); }, [bookingDraft]);

  const selected = (draft.selectedServiceIds || []).map(id => servicesMap[id]).filter(Boolean);

  function handleFile(e) {
    const files = Array.from(e.target.files || []);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = () => setDraft(d => ({ ...d, images: [...(d.images||[]), reader.result] }));
      reader.readAsDataURL(f);
    });
  }

  function removeImage(idx) {
    setDraft(d => ({ ...d, images: (d.images || []).filter((_,i) => i !== idx) }));
  }

  function goToStep(step) {
    setBookingDraft(draft);
    setBookingStep(step);
  }

  // Calculate matching candidate workers based on selected services
  const candidateWorkers = useMemo(() => {
    const serviceNames = selected.map(s => s.name);
    const allWorkers = (state.workers || []).filter(w => w.status !== "resigned");

    return allWorkers.map(w => {
      const skillsList = Array.isArray(w.skills)
        ? w.skills
        : (typeof w.skills === 'string' ? w.skills.split(',').map(s => s.trim()) : []);

      const matchedSkills = skillsList.filter(s => serviceNames.includes(s));
      let score = matchedSkills.length * 20;
      if (w.status === "online") score += 10;
      score += (parseFloat(w.rating) || 4.0) * 2;

      const charSum = (w.id || '100').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const distanceKm = (1.2 + (charSum % 28) / 10).toFixed(1);
      const etaMins = Math.round(Number(distanceKm) * 4 + 5);
      const reviewsCount = 35 + (charSum % 150);
      const jobsCount = 60 + (charSum % 220);

      return {
        ...w,
        skills: skillsList,
        matchedSkills,
        score,
        distanceKm,
        etaMins,
        reviewsCount,
        jobsCount,
      };
    }).sort((a, b) => b.score - a.score);
  }, [selected, state.workers]);

  function assignBestWorker() {
    const best = candidateWorkers.find(w => w.matchedSkills.length > 0) || candidateWorkers[0] || {
      ...DEMO_WORKER,
      skills: Array.isArray(DEMO_WORKER.skills) ? DEMO_WORKER.skills : ["Electrician", "Plumber"],
      matchedSkills: selected.map(s => s.name),
      distanceKm: "2.1",
      etaMins: 14,
      reviewsCount: 142,
      jobsCount: 180,
    };
    setDraft(d => ({ ...d, assignedWorker: d.assignedWorker || best }));
  }

  async function performPaymentAndConfirm() {
    setProcessing(true);
    try {
      const price = calculateBookingTotal(draft, state.services);
      const payload = {
        ...draft,
        serviceSummary: selected.map(s=>s.name).join(', '),
        charge: price.total,
        priceDetails: price,
        workerId: draft.assignedWorker?.id,
        workerName: draft.assignedWorker?.name,
      };
      const created = actions.confirmBooking ? await actions.confirmBooking(payload) : payload;
      setProcessing(false);
      setCreatedBooking(created);
      goToStep(6);
    } catch (error) {
      setProcessing(false);
      alert(error.message || "Unable to create the booking. Please try again.");
    }
  }

  return (
    <div>
      <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.slate, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: 0 }}>
        <ArrowLeft size={16} /> Back
      </button>
      <h1 style={{ ...heading, fontSize: 22, color: C.ink }}>{selected.length ? 'Book: ' + selected.map(s=>s.name).join(', ') : 'Booking'}</h1>

      {bookingStep === 1 && (
        <Card style={{ padding: 18 }}>
          <div style={{ marginBottom: 12, fontWeight: 700 }}>Tell us about the requirement</div>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Describe your problem</div>
          <div style={{ marginBottom: 10 }}>
            <textarea aria-label="Describe your problem" style={{ width: '100%', minHeight: 120, padding: 12 }} placeholder="Describe the issue you are facing. Include any details that may help the professional understand the problem." value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Add photos (Optional)</div>
            <div style={{ color: C.slate, fontSize: 13, marginBottom: 8 }}>Upload photos of the issue to help the professional understand your requirement.</div>
            <input type="file" accept="image/*" multiple onChange={handleFile} />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>{(draft.images||[]).map((src,i)=>(
              <div key={i} style={{ position: 'relative' }}>
                <img src={src} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: -6, right: -6, background: '#fff', borderRadius: 12, border: '1px solid '+C.line, padding: 4, cursor: 'pointer' }}>x</button>
              </div>
            ))}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <Btn tone="ghost" onClick={() => { if (onCancel) onCancel(); }}>Cancel</Btn>
            <Btn onClick={() => { if (!draft.description || draft.description.trim().length < 5) { alert('Please provide a brief description to proceed.'); return; } goToStep(2); }} tone="orange">Proceed</Btn>
          </div>
        </Card>
      )}

      {bookingStep === 2 && (
        <Card style={{ padding: 18 }}>
          <div style={{ marginBottom: 12, fontWeight: 700 }}>When do you need this service?</div>
          <div style={{ color: C.slate, marginBottom: 12 }}>Choose whether you need a professional immediately or schedule a convenient time.</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div onClick={() => setDraft(d => ({ ...d, bookingType: 'instant', schedule: { type: 'instant' } }))} style={{ flex: '1 1 240px', borderRadius: 12, padding: 16, border: `1px solid ${draft.bookingType === 'instant' ? C.navy : C.line}`, background: draft.bookingType === 'instant' ? '#FBF7F4' : '#fff', cursor: 'pointer' }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Instant Service</div>
              <div style={{ color: C.slate, marginTop: 8 }}>Get a professional assigned as soon as possible. Best for urgent requirements.</div>
            </div>
            <div onClick={() => setDraft(d => ({ ...d, bookingType: 'scheduled', schedule: { type: 'later', date: d.schedule?.date || '', time: d.schedule?.time || '' } }))} style={{ flex: '1 1 300px', borderRadius: 12, padding: 16, border: `1px solid ${draft.bookingType === 'scheduled' ? C.navy : C.line}`, background: draft.bookingType === 'scheduled' ? '#FBF7F4' : '#fff', cursor: 'pointer' }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Schedule for Later</div>
              <div style={{ color: C.slate, marginTop: 8 }}>Choose a date and time convenient for you.</div>
              {draft.bookingType === 'scheduled' && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ marginBottom: 8 }}><input type="date" min={new Date().toISOString().split('T')[0]} value={draft.schedule.date || ''} onChange={e => setDraft({ ...draft, schedule: { ...draft.schedule, date: e.target.value } })} /></div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{DEMO_TIME_SLOTS.map(slot => (
                    <button key={slot} onClick={() => setDraft(d => ({ ...d, schedule: { ...d.schedule, time: slot } }))} style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${(draft.schedule && draft.schedule.time === slot) ? C.navy : C.line}`, background: (draft.schedule && draft.schedule.time === slot) ? '#eef6ff' : '#fff', cursor: 'pointer' }}>{slot}</button>
                  ))}</div>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Btn tone="ghost" onClick={() => goToStep(1)}>Back</Btn>
            <Btn onClick={() => {
                if (draft.bookingType === 'scheduled') {
                  if (!draft.schedule?.date || !draft.schedule?.time) { alert('Please select a date and time to schedule the service.'); return; }
                }
                assignBestWorker();
                goToStep(3);
            }} tone="orange">Proceed</Btn>
          </div>
        </Card>
      )}

      {bookingStep === 3 && (() => {
        const assigned = draft.assignedWorker || candidateWorkers.find(w => w.matchedSkills.length > 0) || candidateWorkers[0] || {
          ...DEMO_WORKER,
          skills: ["Electrician", "Plumber"],
          distanceKm: "2.1",
          etaMins: 14,
          reviewsCount: 142,
          jobsCount: 180,
        };
        const otherCandidates = candidateWorkers.filter(w => w.id !== assigned.id && w.matchedSkills.length > 0).slice(0, 2);

        return (
          <Card style={{ padding: 24, maxWidth: 640 }}>
            {/* Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ ...heading, fontSize: 22, color: C.ink, marginBottom: 4 }}>Professional Found</div>
                <div style={{ color: C.slate, fontSize: 14 }}>We matched the top-rated verified professional for your service.</div>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#E6F4EA', color: '#137333', padding: '6px 12px',
                borderRadius: 20, fontSize: 13, fontWeight: 600
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#137333' }} />
                Online & Ready
              </span>
            </div>

            {/* Main Worker Profile Card */}
            <div style={{
              background: '#FAF9F5',
              border: `1.5px solid ${C.line}`,
              borderRadius: 16,
              padding: 20,
              boxShadow: '0 4px 12px rgba(27,42,74,0.04)',
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ position: 'relative' }}>
                  <Avatar name={assigned.name} size={76} photo={assigned.photo} />
                  <div style={{
                    position: 'absolute', bottom: -2, right: -2,
                    background: '#137333', border: '2px solid #fff',
                    borderRadius: '50%', width: 18, height: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={12} color="#fff" />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <div>
                      <h3 style={{ ...heading, fontSize: 20, margin: 0, color: C.ink }}>{assigned.name}</h3>
                      <div style={{ color: C.slate, fontSize: 13, marginTop: 2 }}>{assigned.id} • KaamSetu Verified Professional</div>
                    </div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: '#FEF7E0', color: '#B06000',
                      padding: '4px 10px', borderRadius: 8, fontWeight: 700, fontSize: 14
                    }}>
                      <Star size={16} fill="#F9AB00" color="#F9AB00" />
                      {assigned.rating}
                      <span style={{ fontSize: 12, fontWeight: 500, color: C.slate }}>({assigned.reviewsCount || 128})</span>
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                    {(Array.isArray(assigned.skills) ? assigned.skills : (assigned.skills || '').split(',')).map((sk, idx) => {
                      const skillStr = typeof sk === 'string' ? sk.trim() : sk;
                      const isMatch = selected.some(s => s.name === skillStr);
                      return (
                        <span key={idx} style={{
                          background: isMatch ? '#1B2A4A' : '#EAE8E0',
                          color: isMatch ? '#fff' : C.ink,
                          padding: '3px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: isMatch ? 600 : 400
                        }}>
                          {isMatch ? `✓ ${skillStr}` : skillStr}
                        </span>
                      );
                    })}
                  </div>

                  {/* Distance and ETA highlight banner */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
                    marginTop: 14, background: '#fff', border: `1px solid ${C.line}`,
                    borderRadius: 10, padding: '10px 14px'
                  }}>
                    <div>
                      <div style={{ fontSize: 11, color: C.slate, fontWeight: 600, textTransform: 'uppercase' }}>Current Location</div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={14} color={C.navy} />
                        {assigned.distanceKm} km away
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: C.slate, fontWeight: 600, textTransform: 'uppercase' }}>Estimated Arrival</div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#137333', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={14} color="#137333" />
                        ~{assigned.etaMins} mins (Fast dispatch)
                      </div>
                    </div>
                  </div>

                  {/* Trust assurance */}
                  <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12.5, color: C.slate }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Shield size={13} color="#137333" /> Background Checked</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Hammer size={13} color={C.navy} /> Tools Equipped</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={13} color={C.navy} /> {assigned.jobsCount || 85}+ Jobs Done</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Nearby Matching Professionals */}
            {otherCandidates.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.slate, marginBottom: 8 }}>
                  Other nearby qualified professionals:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                  {otherCandidates.map(w => (
                    <div
                      key={w.id}
                      onClick={() => setDraft(d => ({ ...d, assignedWorker: w }))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 10,
                        border: `1px solid ${C.line}`, background: '#fff',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      <Avatar name={w.name} size={36} photo={w.photo} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.name}</div>
                        <div style={{ fontSize: 11.5, color: C.slate }}>⭐ {w.rating} • {w.distanceKm} km</div>
                      </div>
                      <button style={{
                        background: '#EEF2F6', border: 'none', borderRadius: 6,
                        padding: '4px 8px', fontSize: 11, fontWeight: 600, color: C.navy, cursor: 'pointer'
                      }}>Select</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
              <Btn tone="ghost" onClick={() => goToStep(2)}>Back</Btn>
              <Btn onClick={() => {
                setDraft(d => ({ ...d, assignedWorker: assigned }));
                goToStep(4);
              }} tone="orange">Proceed to Summary</Btn>
            </div>
          </Card>
        );
      })()}

      {bookingStep === 4 && (
        <Card style={{ padding: 24, maxWidth: 640 }}>
          <div style={{ ...heading, fontSize: 22, color: C.ink, marginBottom: 16 }}>Booking Summary</div>
          
          <div style={{ marginBottom: 16, background: '#FAF9F5', padding: 14, borderRadius: 12, border: `1px solid ${C.line}` }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: C.ink }}>Selected Services</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selected.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <div>{s.name}</div>
                  <div style={{ fontWeight: 600 }}>₹{s.charge}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16, background: '#FAF9F5', padding: 14, borderRadius: 12, border: `1px solid ${C.line}` }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: C.ink }}>Scheduling Details</div>
            <div style={{ fontSize: 14 }}>Booking Type: <strong>{draft.bookingType === 'instant' ? '⚡ Instant Service (Priority Dispatch)' : '📅 Scheduled Service'}</strong></div>
            {draft.bookingType === 'scheduled' && (
              <div style={{ fontSize: 13.5, color: C.slate, marginTop: 4 }}>Date: <strong>{draft.schedule?.date}</strong> • Time: <strong>{draft.schedule?.time}</strong></div>
            )}
          </div>

          {draft.assignedWorker && (
            <div style={{ marginBottom: 16, background: '#FAF9F5', padding: 14, borderRadius: 12, border: `1px solid ${C.line}` }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: C.ink }}>Assigned Professional</div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <Avatar name={draft.assignedWorker.name} size={52} photo={draft.assignedWorker.photo} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{draft.assignedWorker.name}</span>
                    <span style={{ fontSize: 12, background: '#FEF7E0', color: '#B06000', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>⭐ {draft.assignedWorker.rating}</span>
                  </div>
                  <div style={{ color: C.slate, fontSize: 12.5, marginTop: 2 }}>
                    Skills: {Array.isArray(draft.assignedWorker.skills) ? draft.assignedWorker.skills.join(', ') : draft.assignedWorker.skills}
                  </div>
                  <div style={{ color: C.slate, fontSize: 12, marginTop: 4 }}>
                    📍 {draft.assignedWorker.distanceKm || '2.1'} km away • ⏱️ Arrival in ~{draft.assignedWorker.etaMins || '14'} mins
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: C.ink }}>Price Details</div>
            {(() => { const pd = calculateBookingTotal(draft, state.services); return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: C.slate }}>Service Charges</span><span>₹{pd.serviceCharges}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: C.slate }}>Travel Charges</span><span>₹{pd.travelCharges}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: C.slate }}>Platform Fee</span><span>₹{pd.platformFee}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#137333' }}>KaamSetu Discount</span><span style={{ color: '#137333', fontWeight: 600 }}>-₹{pd.discount}</span></div>
                <div style={{ height: 1, background: C.line, margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16, color: C.ink }}>
                  <span>Total Amount</span>
                  <span style={{ color: C.navy }}>₹{pd.total}</span>
                </div>
              </div>
            ); })()}
          </div>

          <div style={{ background: '#F0F4F9', borderRadius: 10, padding: 12, color: C.slate, fontSize: 12.5, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={16} color={C.navy} style={{ flexShrink: 0 }} />
            <span>Escrow Protection: Your payment remains secure with KaamSetu and is only released to the worker after you verify and approve the completed job.</span>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Btn tone="ghost" onClick={() => goToStep(3)}>Back</Btn>
            <Btn onClick={() => { setDraft(d => ({ ...d, priceDetails: calculateBookingTotal(d, state.services) })); goToStep(5); }} tone="green">Proceed to Payment</Btn>
          </div>
        </Card>
      )}

      {bookingStep === 5 && (
        <Card style={{ padding: 18 }}>
          <div style={{ marginBottom: 12, fontWeight: 700 }}>Complete Your Payment</div>
          <div style={{ color: C.slate, marginBottom: 12 }}>Review and pay the final amount to confirm your booking.</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700 }}>Total Payable</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>₹{(draft.priceDetails && draft.priceDetails.total) || calculateBookingTotal(draft, state.services).total}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Payment Method</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${C.line}` }}>UPI</button>
              <button style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${C.line}` }}>Card</button>
              <button style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${C.line}` }}>Netbanking</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn tone="ghost" onClick={() => goToStep(4)}>Back</Btn>
            <Btn tone="green" onClick={() => { performPaymentAndConfirm(); }} disabled={processing}>{processing ? 'Processing payment...' : `Pay ₹${(draft.priceDetails && draft.priceDetails.total) || calculateBookingTotal(draft, state.services).total}`}</Btn>
          </div>
        </Card>
      )}

      {bookingStep === 6 && (
        <Card style={{ padding: 18 }}>
          <div style={{ marginBottom: 12, fontWeight: 700 }}>Payment Successful!</div>
          <div style={{ color: C.slate, marginBottom: 12 }}>Your booking has been confirmed.</div>
          <div style={{ marginBottom: 8 }}>Booking ID: <strong>{createdBooking && createdBooking.id}</strong></div>
          <div style={{ marginBottom: 8 }}>Service: {createdBooking && createdBooking.service}</div>
          <div style={{ marginBottom: 8 }}>Professional: {createdBooking && createdBooking.assignedWorker && createdBooking.assignedWorker.name ? createdBooking.assignedWorker.name : (draft.assignedWorker && draft.assignedWorker.name)}</div>
          <div style={{ marginBottom: 12 }}>Amount Paid: <strong>₹{createdBooking && createdBooking.charge}</strong></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn tone="ghost" onClick={() => goToStep(4)}>View Booking Details</Btn>
            <Btn tone="green" onClick={() => { if (onFinish) onFinish(createdBooking || draft); }}>Track Your Professional</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

function TrackingPage({ booking, state }) {
  const req = booking;
  return (
    <div>
      <h1 style={{ ...heading, fontSize: 22 }}>Booking Confirmed</h1>
      <Card style={{ padding: 18 }}>
        <div style={{ marginBottom: 8 }}>Booking ID: <strong>{req && req.id ? req.id : 'N/A'}</strong></div>
        <div style={{ marginBottom: 8 }}>Service: {req && req.serviceSummary}</div>
        <div style={{ marginBottom: 8 }}>Amount: ₹{req && req.charge}</div>
        <div style={{ marginTop: 12, color: C.slate }}>Tracking simulation: worker will appear here when assigned.</div>
      </Card>
    </div>
  );
}

function RequestTracker({ request, actions, customer }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showIncomplete, setShowIncomplete] = useState(false);

  // derive friendly statuses
  const workStatus = request.workStatus || (request.completed ? 'completed' : request.status || 'pending');
  const paymentStatus = request.paymentStatus || (request.paid ? 'secured' : 'pending_payment');

  function friendlyWorkLabel(ws) {
    switch (ws) {
      case 'worker_assigned': return 'Worker Assigned';
      case 'worker_on_the_way': return 'Worker On The Way';
      case 'worker_arrived': return 'Worker Arrived';
      case 'in_progress': return 'Work In Progress';
      case 'completed': return 'Work Completed';
      case 'incomplete': return 'Work Incomplete';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
    }
  }

  function friendlyPaymentLabel(ps) {
    switch (ps) {
      case 'secured': return 'Payment Secured';
      case 'released': return 'Payment Released';
      case 'refund_pending': return 'Refund Pending';
      default: return 'Payment Pending';
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: C.ink }}>{request.service}</div>
          <div style={{ fontSize: 13, color: C.slate }}>Request {request.id} • ₹{request.charge}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Badge tone={paymentStatus === 'released' ? 'green' : 'blue'}>{friendlyPaymentLabel(paymentStatus)}</Badge>
          <Badge tone={workStatus === 'completed' ? 'green' : (workStatus === 'incomplete' ? 'red' : 'amber')}>{friendlyWorkLabel(workStatus)}</Badge>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 14, padding: 12, background: C.paperDim, borderRadius: 10 }}>
        <Avatar name={request.workerName || 'Professional'} size={54} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: C.ink }}>{request.workerName || 'Awaiting assignment'}</div>
          <div style={{ color: C.slate }}>{request.service}</div>
          <div style={{ marginTop: 8, color: C.slate }}>{request.assignedAt ? `Assigned ${request.assignedAt}` : ''}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700 }}>₹{request.charge}</div>
          <div style={{ color: C.slate, fontSize: 13 }}>{request.schedule && request.schedule.type === 'later' ? `${request.schedule.date} • ${request.schedule.time}` : 'Instant'}</div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: 8, background: workStatus === 'worker_assigned' ? C.navy : C.line }} />
          <div style={{ flex: 1, color: workStatus === 'worker_assigned' ? C.ink : C.slate }}>Worker Assigned</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: 8, background: workStatus === 'worker_on_the_way' ? C.navy : C.line }} />
          <div style={{ flex: 1, color: workStatus === 'worker_on_the_way' ? C.ink : C.slate }}>Worker On The Way</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: 8, background: workStatus === 'worker_arrived' ? C.navy : C.line }} />
          <div style={{ flex: 1, color: workStatus === 'worker_arrived' ? C.ink : C.slate }}>Worker Arrived</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: 8, background: workStatus === 'in_progress' ? C.navy : C.line }} />
          <div style={{ flex: 1, color: workStatus === 'in_progress' ? C.ink : C.slate }}>Work In Progress</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, borderRadius: 8, background: workStatus === 'completed' ? C.green : C.line }} />
          <div style={{ flex: 1, color: workStatus === 'completed' ? C.ink : C.slate }}>Customer Confirmation</div>
        </div>
      </div>

      <div style={{ marginTop: 14, padding: 12, background: '#FAFBFF', borderRadius: 10 }}>
        <div style={{ fontWeight: 700 }}>Payment Status</div>
        <div style={{ color: C.slate, marginTop: 6 }}>{paymentStatus === 'secured' ? 'Payment held securely by KaamSetu and will be released after you confirm work completion.' : (paymentStatus === 'released' ? 'Payment has been released to the professional.' : 'Payment pending')}</div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
        {!request.completed && (
          <>
            <Btn tone="green" onClick={() => setShowConfirm(true)}>Work Completed</Btn>
            <Btn tone="red" onClick={() => setShowIncomplete(true)}>Work Incomplete</Btn>
            <Btn tone="ghost" onClick={() => { actions.markStillPending(request.id); alert('Status kept as pending. You can confirm later.'); }}>Still Pending</Btn>
          </>
        )}
        {request.completed && (
          <Badge tone="green">Completed • Payment Released</Badge>
        )}
      </div>

      {showConfirm && <ConfirmCompletionModal request={request} onClose={() => setShowConfirm(false)} onConfirm={() => { setShowConfirm(false); setShowReview(true); }} />}
      {showReview && <ReviewAndRatingModal request={request} actions={actions} customer={customer} onClose={() => setShowReview(false)} onSubmit={async (ratings, review) => { try { await actions.releasePayment(request.id, customer.id, review, ratings); setShowReview(false); alert('Work completed successfully. Payment released.'); } catch (error) { alert(error.message || 'Unable to complete this booking.'); } }} />}
      {showIncomplete && <IncompleteModal request={request} onClose={() => setShowIncomplete(false)} onSubmit={(note) => { actions.markWorkIncomplete(request.id, customer.id, note); setShowIncomplete(false); alert('Your concern has been recorded. Payment remains secured.'); }} />}
    </div>
  );
}

function CancelModal({ request, customer, actions, onClose }) {
  const [form, setForm] = useState({ name: customer.name, accHolder: "", accNumber: "", ifsc: "", amount: "" });
  const [submitted, setSubmitted] = useState(false);
  const paidAmount = request.paid ? request.charge : 0;
  const deduction = Math.round(paidAmount * 0.1);
  const refundable = paidAmount - deduction;

  function submit() {
    actions.cancelService(request.id, customer.id, refundable);
    setSubmitted(true);
  }

  return (
    <Modal title="Cancel Service" onClose={onClose}>
      {!request.paid ? (
        <>
          <p style={{ fontSize: 13.5, color: C.slate }}>No payment has been made yet, so this request can be cancelled without any charge.</p>
          <Btn tone="red" onClick={() => { actions.cancelService(request.id, customer.id, 0); onClose(); }}>Confirm Cancellation</Btn>
        </>
      ) : submitted ? (
        <div style={{ background: "#E4F3EA", color: C.greenDeep, padding: 14, borderRadius: 10 }}>Refund Request Submitted Successfully</div>
      ) : (
        <>
          <div style={{ background: C.paperDim, borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 13.5 }}>
            <div>Total Service Amount: ₹{paidAmount}</div>
            <div>Cancellation Deduction (10%): ₹{deduction} <span style={{ color: C.slate }}>(6% platform, 4% worker)</span></div>
            <div style={{ fontWeight: 700, color: C.ink }}>Refundable Amount: ₹{refundable}</div>
          </div>
          <Field label="Customer Name"><input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Bank Account Holder Name"><input style={inputStyle} value={form.accHolder} onChange={e => setForm({ ...form, accHolder: e.target.value })} /></Field>
          <Field label="Bank Account Number"><input style={inputStyle} value={form.accNumber} onChange={e => setForm({ ...form, accNumber: e.target.value })} /></Field>
          <Field label="IFSC Code"><input style={inputStyle} value={form.ifsc} onChange={e => setForm({ ...form, ifsc: e.target.value })} /></Field>
          <Field label="Refund Amount"><input style={inputStyle} value={`₹${refundable}`} disabled /></Field>
          <Btn tone="red" onClick={submit} disabled={!form.accHolder || !form.accNumber || !form.ifsc}>Submit Refund Request</Btn>
        </>
      )}
    </Modal>
  );
}

function FeedbackModal({ request, actions, onClose }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  return (
    <Modal title="Give Feedback" onClose={onClose}>
      <Field label="Rating"><Stars value={rating} onChange={setRating} size={26} /></Field>
      <Field label="Feedback"><textarea style={{ ...inputStyle, minHeight: 80 }} value={text} onChange={e => setText(e.target.value)} placeholder="Share your experience..." /></Field>
      <Btn onClick={() => { actions.submitFeedback(request, rating, text); onClose(); }}>Submit Feedback</Btn>
    </Modal>
  );
}

function ComplaintModal({ request, actions, onClose }) {
  const [issue, setIssue] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <Modal title="Raise Complaint" onClose={onClose}>
      <Stat icon={HardHat} label="Worker" value={request.workerName} />
      <Stat icon={Wrench} label="Service" value={request.service} />
      <Field label="Complaint Issue"><input style={inputStyle} value={issue} onChange={e => setIssue(e.target.value)} /></Field>
      <Field label="Detailed Description"><textarea style={{ ...inputStyle, minHeight: 80 }} value={desc} onChange={e => setDesc(e.target.value)} /></Field>
      <Btn tone="red" onClick={() => { actions.raiseCustomerComplaint(request, issue, desc); onClose(); }} disabled={!issue}>Submit Complaint</Btn>
    </Modal>
  );
}

function ConfirmCompletionModal({ request, onClose, onConfirm }) {
  return (
    <Modal title="Confirm Work Completion" onClose={onClose}>
      <p style={{ color: C.slate }}>Please confirm that the service has been completed to your satisfaction. Once confirmed, your secured payment will be released to the professional.</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
        <Btn tone="ghost" onClick={onClose}>Cancel</Btn>
        <Btn tone="green" onClick={onConfirm}>Yes, Work is Completed</Btn>
      </div>
    </Modal>
  );
}

function ReviewAndRatingModal({ request, actions, customer, onClose, onSubmit }) {
  const [overall, setOverall] = useState(5);
  const [quality, setQuality] = useState(5);
  const [behaviour, setBehaviour] = useState(5);
  const [text, setText] = useState('');
  return (
    <Modal title="Rate Your Experience" onClose={onClose}>
      <Field label="Overall Experience"><Stars value={overall} onChange={setOverall} size={26} /></Field>
      <Field label="Work Quality"><Stars value={quality} onChange={setQuality} size={26} /></Field>
      <Field label="Professional Behaviour"><Stars value={behaviour} onChange={setBehaviour} size={26} /></Field>
      <Field label="Share your experience (optional)"><textarea style={{ ...inputStyle, minHeight: 90 }} placeholder="Tell us about the quality of work and your experience with the professional..." value={text} onChange={e => setText(e.target.value)} /></Field>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Btn tone="ghost" onClick={() => { if (onSubmit) onSubmit({ overall, quality, behaviour }, text); }}>Submit Review & Complete</Btn>
        <Btn tone="ghost" onClick={() => { if (onSubmit) onSubmit({ overall: null }, ''); }}>Skip Review</Btn>
      </div>
    </Modal>
  );
}

function IncompleteModal({ request, onClose, onSubmit }) {
  const [text, setText] = useState('');
  return (
    <Modal title="Work Incomplete" onClose={onClose}>
      <p style={{ color: C.slate }}>Describe the remaining or incomplete work. Payment will remain secured until the issue is resolved.</p>
      <Field label="Describe the issue"><textarea style={{ ...inputStyle, minHeight: 120 }} placeholder="Describe the remaining or incomplete work..." value={text} onChange={e => setText(e.target.value)} /></Field>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Btn tone="ghost" onClick={onClose}>Cancel</Btn>
        <Btn tone="red" onClick={() => { if (!text.trim()) { alert('Please describe the incomplete work.'); return; } onSubmit(text); }}>Submit Issue</Btn>
      </div>
    </Modal>
  );
}

/* ============================== APP ROOT ============================== */
export default function App() {
  const [screen, setScreen] = useState(() => localStorage.getItem("ks_screen") || "roleSelection");
  const [role, setRole] = useState(() => localStorage.getItem("ks_role") || null);
  const [federationRole, setFederationRole] = useState(() => localStorage.getItem("ks_fedRole") || "Admin");
  const [currentCustomerId, setCurrentCustomerId] = useState(() => {
    const stored = localStorage.getItem("ks_custId");
    return stored ? stored : DEMO_CUSTOMER.id;
  });
  const [currentWorkerId, setCurrentWorkerId] = useState(() => {
    const stored = localStorage.getItem("ks_workerId");
    return stored ? stored : DEMO_WORKER.id;
  });

  useEffect(() => {
    localStorage.setItem("ks_screen", screen);
    if (role) localStorage.setItem("ks_role", role);
    else localStorage.removeItem("ks_role");
    localStorage.setItem("ks_fedRole", federationRole);
    localStorage.setItem("ks_custId", currentCustomerId);
    localStorage.setItem("ks_workerId", currentWorkerId);
  }, [screen, role, federationRole, currentCustomerId, currentWorkerId]);
  useEffect(() => {
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.type = "image/png";
    favicon.href = kaamSetuLogo;
  }, []);
  const [regDraft, setRegDraft] = useState({ email: "", phone: "" });
  const [promptLocationFor, setPromptLocationFor] = useState(null); // customerId to show one-time location prompt
  const [services, setServices] = useState(SERVICES);
  const [workers, setWorkers] = useState(() => [...WORKERS, DEMO_WORKER]);
  const [customers, setCustomers] = useState(() => [...CUSTOMERS, DEMO_CUSTOMER]);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [rejectedLog, setRejectedLog] = useState([]);
  const [members, setMembers] = useState(MEMBERS);
  const workerCounter = useRef(1001 + WORKERS.length);
  const memberCounter = useRef(2001 + MEMBERS.length);
  const serviceCounter = useRef(SERVICES.length + 1);
  const customerCounter = useRef(4001);

  const state = { services, workers, customers, requests, complaints, rejectedLog, members };

  // Fetch initial data from backend API on load (FastAPI on 8000 / Flask on 5000)
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [apiServices, apiWorkers, apiCustomers, apiBookings, apiComplaints, apiMembers] = await Promise.allSettled([
          api.getServices(),
          api.getWorkers(),
          api.getCustomers(),
          api.getBookings(),
          api.getComplaints(),
          api.getMembers(),
        ]);

        if (apiServices.status === "fulfilled" && Array.isArray(apiServices.value) && apiServices.value.length > 0) {
          const iconMap = {};
          SERVICE_DEFS.forEach(([name, cat, Icon]) => { iconMap[name] = Icon; });
          setServices(apiServices.value.map(s => ({
            id: s.service_code || `SVC-${s.id}`,
            backendId: s.id,
            name: s.name,
            category: s.category,
            Icon: iconMap[s.name] || Wrench,
            charge: Number(s.base_charge) || 300,
            status: s.status === "ACTIVE" ? "active" : "removed",
          })));
        }

        if (apiWorkers.status === "fulfilled" && Array.isArray(apiWorkers.value) && apiWorkers.value.length > 0) {
          setWorkers(apiWorkers.value.map(w => ({
            id: w.worker_code || `WRK-${w.id}`,
            backendId: w.id,
            name: w.name,
            phone: w.phone,
            address: w.address,
            skills: w.skills || [],
            rating: String(w.avg_rating || "4.0"),
            status: (w.status || "ONLINE").toLowerCase(),
            photo: w.photo_url || null,
            feedback: [],
            provisionalFund: Number(w.provisional_fund) || 0,
            history: w.history_notes || "",
          })));
        }

        if (apiCustomers.status === "fulfilled" && Array.isArray(apiCustomers.value) && apiCustomers.value.length > 0) {
          setCustomers(apiCustomers.value.map(c => ({
            id: c.customer_code || `CUST-${c.id}`,
            backendId: c.id,
            name: c.name,
            phone: c.phone,
            address: c.address,
            wallet: Number(c.wallet_balance) || 0,
            photo: c.photo_url || null,
            history: [],
          })));
        }

        if (apiBookings.status === "fulfilled" && Array.isArray(apiBookings.value) && apiBookings.value.length > 0) {
          setRequests(apiBookings.value.map(b => ({
            id: b.request_code || `REQ-${b.id}`,
            backendId: b.id,
            customerId: b.customer_id,
            customerName: b.customer_name,
            customerPhone: b.service_phone,
            customerAddress: b.service_address,
            service: b.service_name,
            charge: Number(b.total_charge) || 0,
            workerId: b.worker_id ? `WRK-${b.worker_id}` : null,
            workerName: b.worker_name,
            status: (b.status || "pending").toLowerCase(),
            paid: b.is_paid,
            before: b.before_photo,
            after: b.after_photo,
            completed: b.status === "COMPLETED",
          })));
        }

        if (apiComplaints.status === "fulfilled" && Array.isArray(apiComplaints.value) && apiComplaints.value.length > 0) {
          setComplaints(apiComplaints.value.map(c => ({
            id: c.complaint_code || `CC-${c.id}`,
            backendId: c.id,
            type: c.complaint_type === "CUSTOMER_AGAINST_WORKER" ? "customer" : "worker",
            customerName: c.plaintiff_name,
            workerName: c.defendant_name,
            service: c.service_name,
            date: new Date(c.created_at).toLocaleDateString("en-IN"),
            issue: c.issue,
            status: c.status === "PENDING" ? "Pending" : (c.status === "UNDER_REVIEW" ? "Under Review" : "Resolved"),
            response: c.response || "",
          })));
        }

        if (apiMembers.status === "fulfilled" && Array.isArray(apiMembers.value) && apiMembers.value.length > 0) {
          setMembers(apiMembers.value.map(m => ({
            id: m.member_code || `MEM-${m.id}`,
            backendId: m.id,
            name: m.name,
            phone: m.phone,
            address: m.address,
            photo: m.photo_url || null,
            status: (m.status || "ACTIVE").toLowerCase(),
          })));
        }
      } catch (err) {
        console.warn("[KaamSetu] Backend unreachable, running in local fallback mode:", err);
      }
    }
    loadBackendData();
  }, []);

  const actions = {
    addWorker: ({ name, phone, address, photo, skills, status }) => {
      const id = `WRK-${workerCounter.current++}`;
      const w = { id, name, phone, address, photo, skills, status, rating: "4.0", feedback: [] };
      setWorkers(prev => [...prev, w]);
      api.addWorker({ name, phone, address, photo, skills }).catch(e => console.warn(e));
      return w;
    },
    addCustomer: (payload) => {
      const id = `CUST-${customerCounter.current++}`;
      const customer = {
        id,
        wallet: 0,
        history: [],
        photo: null,
        ...payload,
      };
      setCustomers(prev => [...prev, customer]);
      api.addCustomer(payload).then(res => {
        if (res && res.id) {
          setCustomers(prev => prev.map(c => c.id === id ? {
            ...c,
            backendId: res.id,
            customer_code: res.customer_code,
            id: res.customer_code || id
          } : c));
        }
      }).catch(e => console.warn("[KaamSetu API] Failed to add customer:", e));
      return customer;
    },
    updateCustomerProfile: (customerId, patch) => {
      setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, ...patch } : c));
      const targetId = customerId.replace(/\D/g, '');
      if (targetId) api.updateCustomer(targetId, patch).catch(e => console.warn(e));
    },
    setWorkerStatus: (id, status) => {
      setWorkers(prev => prev.map(w => w.id === id ? { ...w, status } : w));
      const targetId = id.replace(/\D/g, '');
      if (targetId) api.setWorkerStatus(targetId, status).catch(e => console.warn(e));
    },
    // Federation Member -> Resign Worker. Marks the worker resigned in the
    // same shared `workers` state, so Active Workers / Available Workers /
    // Currently Working / Workers on Leave / dashboard counts all update
    // together and Resigned Workers picks the record up immediately.
    resignWorker: (workerId) => {
      setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, status: "resigned" } : w));
      const targetId = workerId.replace(/\D/g, '');
      if (targetId) api.resignWorker(targetId).catch(e => console.warn(e));
    },
    // Federation Admin -> Add Member. Member ID is auto-generated from the
    // same counter approach already used for Worker IDs; never user-entered.
    addMember: ({ name, phone, address, photo }) => {
      const id = `MEM-${memberCounter.current++}`;
      const m = { id, name, phone, address, photo, status: "active" };
      setMembers(prev => [...prev, m]);
      api.addMember({ name, phone, address, photo }).catch(e => console.warn(e));
      return m;
    },
    // Federation Admin -> Resign Member. Moves the member from Active to
    // Resigned within the same shared `members` list (no deletion).
    resignMember: (memberId) => {
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: "resigned" } : m));
      const targetId = memberId.replace(/\D/g, '');
      if (targetId) api.resignMember(targetId).catch(e => console.warn(e));
    },
    // Federation Admin -> Edit Member. Member ID is never touched here; only
    // name/photo/phone/address are updated in the same shared `members` list,
    // so the change is reflected everywhere the member is displayed.
    updateMemberProfile: (memberId, patch) => {
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ...patch } : m));
      const targetId = memberId.replace(/\D/g, '');
      if (targetId) api.updateMember(targetId, patch).catch(e => console.warn(e));
    },
    // Federation Member -> Add Service. Uses the same Service record shape
    // (id/name/category/Icon/charge/status) already used by the seeded
    // Services data.
    addService: ({ name, category, charge }) => {
      const id = `SVC-${serviceCounter.current++}`;
      const s = { id, name, category, Icon: Wrench, charge: Number(charge) || 0, status: "active" };
      setServices(prev => [...prev, s]);
      api.addService({ name, category, charge }).catch(e => console.warn(e));
      return s;
    },
    // Federation Member -> Edit Service. Updates the existing shared record.
    updateService: (serviceId, patch) => {
      setServices(prev => prev.map(s => s.id === serviceId ? { ...s, ...patch } : s));
      const targetId = serviceId.replace(/\D/g, '');
      if (targetId) api.updateService(targetId, patch).catch(e => console.warn(e));
    },
    // Federation Member -> Remove Service. Never deletes the record — moves
    // it into the Unavailable Services state so it can still be viewed.
    removeService: (serviceId) => {
      setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: "removed" } : s));
      const targetId = serviceId.replace(/\D/g, '');
      if (targetId) api.removeService(targetId).catch(e => console.warn(e));
    },
    acceptRequest: (reqId, workerId) => {
      const worker = workers.find(w => w.id === workerId);
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, workerId, workerName: worker.name, status: "assigned" } : r));
      setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, status: "working" } : w));
      const rId = reqId.replace(/\D/g, '');
      const wId = workerId.replace(/\D/g, '');
      if (rId && wId) api.acceptBooking(rId, wId).catch(e => console.warn(e));
    },
    rejectRequest: (reqId, workerId, rejectionReason) => {
      const req = requests.find(r => r.id === reqId);
      setRejectedLog(prev => [...prev, {
        ...req, workerId, rejectionReason,
        rejectedDate: new Date().toLocaleDateString("en-IN"),
      }]);
      const rId = reqId.replace(/\D/g, '');
      const wId = workerId.replace(/\D/g, '');
      if (rId && wId) api.rejectBooking(rId, wId, rejectionReason).catch(e => console.warn(e));
    },
    updateProgress: async (reqId, patch) => {
      const rId = reqId.replace(/\D/g, '');
      if (!rId) throw new Error("This booking is not connected to the backend.");
      await api.updateProgress(rId, {
        ...patch,
        markCompleted: patch.markCompleted || Boolean(patch.after),
      });
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, ...patch, status: patch.after ? "in_progress" : r.status } : r));
    },
    raiseWorkerComplaint: (request) => {
      const { issue, description, workerName: reqWorkerName, customerName: reqCustomerName, service: reqService } = request;
      const workerName = workers.find(w => w.id === request.workerId)?.name || reqWorkerName;
      const customerName = customers.find(c => c.id === request.customerId)?.name || reqCustomerName;
      const service = request.service || reqService;
      setComplaints(prev => {
        const next = prev || [];
        const id = `WC-${next.length + 1}`;
        const item = { id, type: 'worker', workerName, customerName, service, date: new Date().toLocaleDateString('en-IN'), issue: issue || description, status: 'Pending', response: '' };
        return [item, ...next];
      });
      const rId = request.id ? request.id.replace(/\D/g, '') : null;
      const plaintiffId = request.workerId ? String(request.workerId).replace(/\D/g, '') : 1;
      api.raiseComplaint({ 
        type: 'WORKER_AGAINST_CUSTOMER', 
        bookingId: rId ? Number(rId) : null,
        issue: issue || description, 
        description,
        plaintiffUserId: Number(plaintiffId)
      }).catch(e => console.warn(e));
    },

    raiseCustomerComplaint: (request, issue, description) => {
      setComplaints(prev => {
        const next = prev || [];
        const id = `CC-${next.length + 1}`;
        const item = { id, type: 'customer', customerName: request.customerName, workerName: request.workerName, service: request.service, date: new Date().toLocaleDateString('en-IN'), issue, status: 'Pending', response: '' };
        return [item, ...next];
      });
      setCustomers(prev => prev.map(c => c.id === request.customerId
        ? { ...c, history: c.history.map((h, i) => i === 0 ? { ...h, complaintStatus: "Pending" } : h) }
        : c));
      const rId = request.id ? request.id.replace(/\D/g, '') : null;
      const plaintiffId = request.customerId ? String(request.customerId).replace(/\D/g, '') : 1;
      api.raiseComplaint({
        type: 'CUSTOMER_AGAINST_WORKER',
        bookingId: Number(rId),
        issue: issue,
        description: description,
        plaintiffUserId: Number(plaintiffId)
      }).catch(e => console.warn(e));
    },
    createRequest: (customer, service) => {
      const id = `REQ-${5000 + requests.length + Math.floor(Math.random() * 900)}`;
      const req = {
        id, customerId: customer.id, customerName: customer.name, customerPhone: customer.phone,
        customerAddress: customer.address, service: service.name, charge: service.charge,
        workerId: null, workerName: null, status: "pending", paid: false, before: null, after: null, completed: false,
      };
      setRequests(prev => [req, ...prev]);
      const cId = String(customer.id).replace(/\D/g, '') || 1;
      const sId = service.backendId || String(service.id).replace(/\D/g, '') || 1;
      api.createBooking({
        customerId: Number(cId),
        serviceId: Number(sId),
        serviceAddress: customer.address,
        servicePhone: customer.phone,
      }).catch(e => console.warn(e));
    },
    confirmBooking: async (draft) => {
      const cust = customers.find(c => c.id === draft.customerId) || { id: draft.customerId, name: 'Customer', phone: '', address: '' };
      const cId = String(cust.id).replace(/\D/g, '') || 1;
      const worker = draft.assignedWorker || (draft.workerId ? workers.find(w => w.id === draft.workerId) : null);
      const wId = worker?.backendId || (worker?.id ? Number(String(worker.id).replace(/\D/g, '')) : null);
      const service = state.services.find(s => s.id === draft.selectedServiceIds?.[0]) || state.services.find(s => s.name === draft.serviceSummary?.split(', ')[0]);
      const booking = await api.createBooking({
        customerId: Number(cId),
        serviceId: service?.backendId || Number(String(service?.id || '').replace(/\D/g, '')),
        selectedServiceIds: (draft.selectedServiceIds || []).map(id => state.services.find(s => s.id === id)?.backendId || Number(String(id).replace(/\D/g, ''))).filter(Boolean),
        workerId: wId,
        serviceAddress: cust.address,
        servicePhone: cust.phone,
        scheduledDate: draft.schedule?.date || null,
        scheduledTime: draft.schedule?.time || null,
      });
      await api.payBooking(booking.id);
      const req = {
        id: booking.request_code,
        backendId: booking.id,
        customerId: booking.customer_id,
        customerName: booking.customer_name,
        customerPhone: booking.service_phone,
        customerAddress: booking.service_address,
        service: booking.service_name,
        charge: Number(booking.total_charge) || draft.charge || 0,
        schedule: draft.schedule || {},
        description: draft.description || '',
        images: draft.images || [],
        workerId: booking.worker_id ? `WRK-${booking.worker_id}` : null,
        workerName: booking.worker_name,
        status: String(booking.status).toLowerCase(),
        paid: true,
        paymentStatus: 'secured',
        workStatus: 'worker_assigned',
        before: null,
        after: null,
        completed: false,
      };
      setRequests(prev => [req, ...prev]);
      return req;
    },
    topUpWallet: async (customerId, reqId) => {
      const req = requests.find(r => r.id === reqId);
      const rId = reqId.replace(/\D/g, '');
      if (!rId) throw new Error("This booking is not connected to the backend.");
      const result = await api.payBooking(rId);
      setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, wallet: Number(result.wallet_balance) || c.wallet } : c));
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, paid: true, paymentStatus: 'secured' } : r));
    },
    confirmCompletion: async (reqId, customerId) => {
      const req = requests.find(r => r.id === reqId);
      const rId = reqId.replace(/\D/g, '');
      if (!rId || !req) throw new Error("This booking is not connected to the backend.");
      await api.completeBooking(rId);
      setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, wallet: c.wallet - req.charge } : c));
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, completed: true, status: "completed", paymentStatus: "released" } : r));
      setWorkers(prev => prev.map(w => w.id === req.workerId ? { ...w, status: "online" } : w));
    },
    submitFeedback: async (request, rating, text) => {
      const rId = request.id ? request.id.replace(/\D/g, '') : null;
      if (!rId) throw new Error("This booking is not connected to the backend.");
      await api.submitReview(rId, rating, text);
      setWorkers(prev => prev.map(w => w.id === request.workerId
        ? { ...w, feedback: [...w.feedback, { customer: request.customerName, service: request.service, rating, review: text, date: new Date().toLocaleDateString("en-IN") }] }
        : w));
    },
    cancelService: (reqId, customerId, refundAmount) => {
      const req = requests.find(r => r.id === reqId);
      if (req.paid) {
        setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, wallet: c.wallet - req.charge } : c));
      }
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, cancelled: true, status: "cancelled" } : r));
      if (req.workerId) setWorkers(prev => prev.map(w => w.id === req.workerId ? { ...w, status: "online" } : w));
      const rId = reqId.replace(/\D/g, '');
      if (rId) api.cancelBooking(rId).catch(e => console.warn(e));
    },
    releasePayment: async (reqId, customerId, review, ratings) => {
      // mark payment as released and completed, move to customer history
      const req = requests.find(r => r.id === reqId);
      if (!req) return;
      const rId = reqId.replace(/\D/g, '');
      if (!rId) throw new Error("This booking is not connected to the backend.");
      await api.completeBooking(rId);
      if (ratings?.overall) await api.submitReview(rId, ratings.overall, review);
      const completedDate = new Date().toLocaleDateString("en-IN");
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, paymentStatus: 'released', status: 'completed', completed: true, workStatus: 'completed' } : r));
      setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, wallet: c.wallet - (req.charge || 0), history: [{ service: req.service, worker: req.workerName, date: completedDate, time: req.schedule?.time || '', charge: req.charge, paid: true, rating: ratings?.overall || null, review: review || '', completed: true }, ...(c.history || []) ] } : c));
    },
    markWorkIncomplete: (reqId, customerId, note) => {
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, workStatus: 'incomplete', status: 'incomplete', incompleteNote: note } : r));
    },
    markStillPending: (reqId) => {
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, workStatus: 'in_progress', status: 'in_progress' } : r));
    },
    updateWorkerHistory: (workerId, history) => {
      setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, history } : w));
      const targetId = workerId.replace(/\D/g, '');
      if (targetId) api.updateWorker(targetId, { history }).catch(e => console.warn(e));
    },
    updateWorkerProfile: (workerId, patch) => {
      setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, ...patch } : w));
      const targetId = workerId.replace(/\D/g, '');
      if (targetId) api.updateWorker(targetId, patch).catch(e => console.warn(e));
    },
    respondComplaint: (type, complaintId, response) => {
      setComplaints(prev => {
        if (Array.isArray(prev)) {
          return prev.map(c => c.id === complaintId ? { ...c, response, status: 'Resolved' } : c);
        }
        if (prev && typeof prev === 'object' && prev[type]) {
          return { ...prev, [type]: prev[type].map(c => c.id === complaintId ? { ...c, response, status: 'Resolved' } : c) };
        }
        return prev;
      });
      const cId = complaintId.replace(/\D/g, '');
      if (cId) api.respondComplaint(cId, response).catch(e => console.warn(e));
    },

    // Create a new customer complaint (frontend/demo only)
    createComplaint: ({ customerId, requestId, service, worker, category, description, images, preferredResolution, priority }) => {
      const seq = (complaints || []).length + 1;
      const id = `CMP-2026-${String(seq).padStart(3,'0')}`;
      const now = new Date();
      const createdAt = now.toLocaleString('en-IN');
      const newComplaint = {
        id,
        complaintId: id,
        customerId,
        requestId,
        service,
        worker,
        category,
        description,
        images: images || [],
        preferredResolution: preferredResolution || '',
        priority: priority || 'Medium',
        status: 'Submitted',
        createdAt,
        updatedAt: createdAt,
        timeline: [{ status: 'Submitted', at: createdAt, note: 'Complaint submitted by customer' }],
        updates: [],
        statusHistory: [{ status: 'Submitted', at: createdAt }],
      };
      setComplaints(prev => [newComplaint, ...(prev || [])]);
      return newComplaint;
    },
    addComplaintUpdate: (complaintId, author, text) => {
      const now = new Date().toLocaleString('en-IN');
      setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, updates: [...(c.updates||[]), { author, text, at: now }], updatedAt: now } : c));
    },
    changeComplaintStatus: (complaintId, status, note) => {
      const now = new Date().toLocaleString('en-IN');
      setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status, timeline: [...(c.timeline||[]), { status, at: now, note }], statusHistory: [...(c.statusHistory||[]), { status, at: now }], updatedAt: now } : c));
    },
    reopenComplaint: (complaintId, reason) => {
      const now = new Date().toLocaleString('en-IN');
      setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status: 'Under Review', updates: [...(c.updates||[]), { author: 'customer', text: `Reopen reason: ${reason}`, at: now }], timeline: [...(c.timeline||[]), { status: 'Reopened', at: now, note: reason }], updatedAt: now } : c));
    },
  };

  const handleRoleSelect = (nextRole) => {
    setRole(nextRole);
    if (nextRole === "Customer") {
      setScreen("customerAccount");
    } else {
      setScreen("login");
    }
  };

  const handleCustomerAccountSelect = (mode) => {
    if (mode === "existing") {
      setScreen("login");
      return;
    }
    setRegDraft({ email: "", phone: "" });
    setScreen("customerRegister");
  };

  const handleLogin = async (selectedRole, selectedFederationRole = federationRole, phone = "") => {
    setRole(selectedRole);
    if (selectedRole === "Federation") {
      setFederationRole(selectedFederationRole || "Admin");
    }

    const cleanPhone = phone ? String(phone).replace(/\D/g, "") : "";

    if (selectedRole === "Customer") {
      if (cleanPhone) {
        try {
          const authRes = await api.login({ phone: cleanPhone, role: "CUSTOMER" });
          if (authRes && authRes.user) {
            const profileCode = authRes.user.profile_code || `CUST-${authRes.user.profile_id}`;
            const existing = customers.find(c =>
              (c.phone && String(c.phone).replace(/\D/g, "") === cleanPhone) ||
              c.id === profileCode ||
              c.backendId === authRes.user.profile_id
            );
            if (existing) {
              setCurrentCustomerId(existing.id);
            } else {
              const newC = {
                id: profileCode,
                backendId: authRes.user.profile_id,
                name: authRes.user.name,
                phone: authRes.user.phone,
                address: "Pune, Maharashtra",
                wallet: 0,
                history: [],
                photo: null,
              };
              setCustomers(prev => [...prev, newC]);
              setCurrentCustomerId(newC.id);
            }
            setScreen("portal");
            return;
          }
        } catch (err) {
          console.warn("[KaamSetu] Auth API failed, using local customer match:", err);
        }

        const localCust = customers.find(c => c.phone && String(c.phone).replace(/\D/g, "") === cleanPhone);
        if (localCust) {
          setCurrentCustomerId(localCust.id);
          setScreen("portal");
          return;
        }
      }

      setCurrentCustomerId(customers[0]?.id || DEMO_CUSTOMER.id);
    } else if (selectedRole === "Worker") {
      if (cleanPhone) {
        try {
          const authRes = await api.login({ phone: cleanPhone, role: "WORKER" });
          if (authRes && authRes.user) {
            const profileCode = authRes.user.profile_code || `WRK-${authRes.user.profile_id}`;
            const existing = workers.find(w =>
              (w.phone && String(w.phone).replace(/\D/g, "") === cleanPhone) ||
              w.id === profileCode ||
              w.backendId === authRes.user.profile_id
            );
            if (existing) {
              setCurrentWorkerId(existing.id);
            } else {
              setCurrentWorkerId(profileCode);
            }
            setScreen("portal");
            return;
          }
        } catch (err) {
          console.warn("[KaamSetu] Worker auth failed, using local match:", err);
        }

        const localWrk = workers.find(w => w.phone && String(w.phone).replace(/\D/g, "") === cleanPhone);
        if (localWrk) {
          setCurrentWorkerId(localWrk.id);
          setScreen("portal");
          return;
        }
      }
      setCurrentWorkerId(workers[0]?.id || DEMO_WORKER.id);
    }

    setScreen("portal");
  };

  const handleCustomerRegistered = (profile) => {
    const customer = actions.addCustomer(profile);
    setCurrentCustomerId(customer.id);
    setRole("Customer");
    setScreen("portal");
    // trigger a one-time location prompt for this newly registered customer
    setPromptLocationFor(customer.id);
  };

  const handleChangeRole = () => {
    setRole(null);
    setRegDraft({ email: "", phone: "" });
    setScreen("roleSelection");
  };

  const handleLogout = () => {
    localStorage.removeItem("ks_screen");
    localStorage.removeItem("ks_role");
    localStorage.removeItem("ks_fedRole");
    localStorage.removeItem("ks_custId");
    localStorage.removeItem("ks_workerId");
    
    setRole(null);
    setCurrentCustomerId(DEMO_CUSTOMER.id);
    setRegDraft({ email: "", phone: "" });
    setScreen("roleSelection");
  };

  return (
    <div>
      <style>{`${FONT_IMPORT} * { box-sizing: border-box; } html { scroll-behavior: smooth; } body { margin: 0; background: ${C.pageBg}; color: ${C.text}; }
        .ks-auth-page { position: relative; overflow: hidden; isolation: isolate; }
        .ks-auth-page::before { content: ""; position: absolute; inset: 0; z-index: -1; background-image: var(--ks-auth-background); background-size: cover; background-position: center top; background-repeat: no-repeat; animation: ks-auth-background-drift 24s ease-in-out infinite; transform-origin: center top; pointer-events: none; }
        .ks-auth-page > * { position: relative; z-index: 1; }
        .ks-auth-header { min-height: 72px; background: rgba(255,255,255,.9); border-bottom: 1px solid rgba(230,234,240,.92); }
        .ks-login-card { box-shadow: 0 14px 34px rgba(16,42,76,.10); }
        .ks-auth-security { display: flex; align-items: flex-start; gap: 10px; margin-top: 14px; padding: 12px 14px; border: 1px solid rgba(25,135,84,.16); border-radius: 12px; background: rgba(255,255,255,.76); }
        .ks-auth-role-icon { width: 42px; height: 42px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px; border-radius: 12px; }
        .ks-auth-footer { padding: 14px 32px 18px; border-top: 1px solid rgba(230,234,240,.78); background: rgba(255,255,255,.72); color: ${C.muted}; font-size: 12px; text-align: center; }
        .ks-auth-main { flex: 1; min-height: 0; display: flex; align-items: stretch; }
        .ks-auth-intro { width: 46%; display: flex; flex-direction: column; justify-content: center; padding: 36px clamp(28px, 5vw, 76px); color: ${C.ink}; }
        .ks-auth-intro-copy { max-width: 520px; }
        .ks-auth-kicker { color: ${C.slate}; font-size: 14px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
        .ks-auth-intro h1 { margin: 6px 0 14px; ${heading.fontFamily ? `font-family: ${heading.fontFamily};` : ""} font-size: clamp(2.7rem, 4vw, 4.4rem); line-height: .95; }
        .ks-auth-intro p { max-width: 460px; margin: 0 0 7px; color: ${C.slate}; font-size: 15px; line-height: 1.5; }
        .ks-auth-trust-strip { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; max-width: 500px; margin-top: 28px; }
        .ks-auth-trust-item { display: flex; align-items: center; gap: 9px; min-height: 48px; padding: 9px 10px; border: 1px solid rgba(16,42,76,.10); border-radius: 10px; background: rgba(255,255,255,.68); }
        .ks-auth-trust-item div, .ks-auth-institution div { display: flex; flex-direction: column; gap: 2px; }
        .ks-auth-trust-item strong, .ks-auth-institution strong { color: ${C.ink}; font-size: 12px; }
        .ks-auth-trust-item span, .ks-auth-institution span { color: ${C.slate}; font-size: 11px; }
        .ks-auth-institution { display: flex; align-items: flex-start; gap: 10px; max-width: 500px; margin-top: 22px; padding-top: 16px; border-top: 1px solid rgba(16,42,76,.10); }
        .ks-auth-content { width: 54%; margin-left: auto; padding-left: 5vw !important; padding-right: 6vw !important; }
        .ks-auth-content > div { max-width: 520px !important; }
        @keyframes ks-auth-background-drift { 0%, 100% { opacity: .94; transform: scale(1); } 50% { opacity: 1; transform: scale(1.008); } }
        @media (max-width: 980px) { .ks-auth-intro { width: 42%; padding-left: 24px; padding-right: 24px; } .ks-auth-content { width: 58%; padding-left: 3vw !important; padding-right: 5vw !important; } .ks-auth-trust-strip { grid-template-columns: 1fr; } }
        @media (max-width: 720px) { .ks-auth-page::before { background-position: 35% top; opacity: .72; animation: none; } .ks-auth-header { padding-left: 20px !important; padding-right: 20px !important; } .ks-auth-footer { padding-left: 20px; padding-right: 20px; } .ks-auth-main { display: block; overflow-y: auto; } .ks-auth-intro { width: 100%; min-height: 280px; justify-content: flex-end; padding: 28px 20px 20px; background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.78)); } .ks-auth-intro h1 { font-size: 3rem; } .ks-auth-intro p { font-size: 13px; } .ks-auth-trust-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 18px; } .ks-auth-institution { margin-top: 14px; padding-top: 12px; } .ks-auth-content { width: 100%; margin-left: 0; padding-left: 20px !important; padding-right: 20px !important; background: rgba(255,255,255,.2); } .ks-auth-content > div { max-width: 520px !important; } }
        @media (prefers-reduced-motion: reduce) { .ks-auth-page::before { animation: none; } }
        .ks-landing-background { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top; opacity: .82; pointer-events: none; animation: ks-landing-breathe 22s ease-in-out infinite; }
        @keyframes ks-landing-breathe { 0%, 100% { opacity: .78; transform: scale(1); } 50% { opacity: .84; transform: scale(1.012); } }
        @media (max-width: 920px) { .ks-landing-background { opacity: .68; object-position: center top; } }
        @media (max-width: 640px) { .ks-landing-background { opacity: .5; object-position: 50% top; animation: none; } }
        @media (prefers-reduced-motion: reduce) { .ks-landing-background { animation: none; } }
        button, input, select, textarea { font: inherit; }
        button { min-height: 42px; border: 1px solid transparent; transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease, background .12s ease; }
        button:hover { transform: translateY(-1px); }
        button:active { transform: translateY(0); }
        button:disabled { opacity: 0.7; transform: none; }
        input, select, textarea {
          min-height: 44px;
          border-radius: 12px;
          color: ${C.text};
          background: #fff;
          transition: border-color .12s ease, box-shadow .12s ease, background .12s ease;
        }
        textarea { min-height: 88px; resize: vertical; }
        input::placeholder, textarea::placeholder { color: ${C.muted}; }
        *:focus-visible { outline: 3px solid rgba(16,42,76,0.22); outline-offset: 2px; box-shadow: 0 0 0 5px rgba(16,42,76,0.08); }
        input:focus, select:focus, textarea:focus, button:focus-visible { border-color: rgba(16,42,76,0.48); }
        .ks-surface { background: ${C.card}; border: 1px solid ${C.line}; border-radius: 18px; box-shadow: ${C.shadow}; }
        .ks-section-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
        .ks-section-title { margin: 0; color: ${C.ink}; font-family: 'Manrope', 'Inter', sans-serif; letter-spacing: -0.03em; }
        @media (max-width: 768px) {
          .ks-section-head { align-items: flex-start; }
        }
        @keyframes ks-fade-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ks-float { 0% { transform: translateY(0); } 50% { transform: translateY(-4px); } 100% { transform: translateY(0); } }
        .ks-logo { animation: ks-fade-in 600ms ease both, ks-float 6s ease-in-out 1s infinite; }
        .ks-card-transition { transition: transform .18s ease, box-shadow .18s ease; }
        .ks-card-transition:hover { transform: translateY(-6px); box-shadow: 0 10px 30px rgba(27,42,74,0.10); }
        .ks-btn-transition { transition: transform .12s ease, box-shadow .12s ease; }
        .ks-btn-transition:active { transform: translateY(1px) scale(.997); }
        .ks-dashboard-grid { display: grid; grid-template-columns: 1fr 360px; gap: 20px; align-items: start; }
        @media (max-width: 980px) { .ks-dashboard-grid { grid-template-columns: 1fr; } }
        .ks-services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 14px; }
        .ks-services-page { isolation: isolate; }
        .ks-services-background { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; object-fit: cover; object-position: center top; opacity: .18; pointer-events: none; }
        .ks-services-content { position: relative; z-index: 1; }
        .ks-services-title { display: flex; align-items: stretch; gap: 14px; margin: 8px 0 28px; }
        .ks-services-title > span { width: 4px; min-height: 48px; border-radius: 4px; background: ${C.orange}; flex-shrink: 0; }
        .ks-services-page-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
        .ks-service-card { min-height: 166px; display: flex; flex-direction: column; justify-content: flex-start; }
        .ks-service-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .ks-service-arrow { width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid ${C.line}; border-radius: 50%; color: ${C.slate}; background: #FBFCFE; transition: transform .18s ease, border-color .18s ease, color .18s ease; }
        .ks-service-card:hover .ks-service-arrow, .ks-service-card:focus-visible .ks-service-arrow { transform: translateX(2px); border-color: ${C.blue}; color: ${C.blue}; }
        .ks-service-card-selected { box-shadow: 0 10px 26px rgba(16,42,76,.10); }
        .ks-services-selection-copy { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .ks-services-selection-icon { width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 50%; background: ${C.navySoft}; }
        .ks-services-page .ks-cust-select-bar { margin-top: 22px; padding: 15px 18px; background: rgba(255,255,255,.94); border-radius: 14px; }
        @media (min-width: 901px) { .ks-services-page-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; } }
        @media (max-width: 760px) { .ks-services-page-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        @media (max-width: 640px) { .ks-services-page { margin: -4px -2px 0; } .ks-services-background { opacity: .10; } .ks-services-title { margin-top: 4px; margin-bottom: 22px; } .ks-services-page-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; } .ks-service-card { min-height: 154px; padding: 16px !important; } .ks-services-page .ks-cust-select-bar { position: sticky; bottom: 10px; margin-left: 0; margin-right: 0; } }
        @media (max-width: 500px) { .ks-services-page-grid { grid-template-columns: 1fr; } .ks-service-card { min-height: 138px; } .ks-services-page .ks-cust-select-bar { align-items: stretch; } .ks-services-page .ks-cust-select-bar > button { width: 100%; } }
        @keyframes ks-cust-logo-in { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
        @keyframes ks-cust-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes ks-cust-hero-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .ks-cust-hero { animation: ks-cust-hero-in 0.5s ease both; }
        .ks-cust-logo-wrap { animation: ks-cust-logo-in 0.55s ease both, ks-cust-float 5.5s ease-in-out 0.7s infinite; filter: drop-shadow(0 8px 18px rgba(27,42,74,0.12)); }
        .ks-cust-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        @media (max-width: 720px) { .ks-cust-actions { grid-template-columns: 1fr; } }
        .ks-customer-home { color: ${C.ink}; }
        .ks-customer-home .ks-cust-hero { box-shadow: 0 8px 24px rgba(16,42,76,.05); }
        .ks-cust-metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 20px; }
        .ks-cust-metric { display: flex; align-items: center; gap: 12px; min-height: 92px; padding: 16px; background: ${C.card}; border: 1px solid ${C.line}; border-radius: 14px; box-shadow: 0 4px 14px rgba(16,42,76,.04); }
        .ks-cust-metric-icon { width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; flex-shrink: 0; }
        .ks-cust-metric-label { color: ${C.slate}; font-size: 12px; margin-bottom: 2px; }
        .ks-cust-metric strong { display: block; color: ${C.ink}; font-size: 25px; line-height: 1.05; }
        .ks-cust-metric span { display: block; color: ${C.muted}; font-size: 11px; margin-top: 3px; }
        .ks-cust-main-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-bottom: 20px; }
        .ks-cust-feature-card { min-height: 242px; display: flex; flex-direction: column; }
        .ks-cust-card-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .ks-cust-card-heading h2 { ${heading.fontFamily ? `font-family: ${heading.fontFamily};` : ""} margin: 0; color: ${C.ink}; font-size: 22px; }
        .ks-cust-card-heading p { margin: 6px 0 0; color: ${C.slate}; font-size: 13.5px; line-height: 1.4; }
        .ks-cust-service-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 22px; }
        .ks-cust-service-chip { display: flex; align-items: center; gap: 8px; min-height: 42px; padding: 8px 10px; border: 1px solid ${C.line}; border-radius: 10px; background: ${C.paperDim}; color: ${C.ink}; font-size: 13px; }
        .ks-cust-service-more { color: ${C.slate}; background: #FAFBFD; }
        .ks-cust-card-cta { display: inline-flex; align-items: center; gap: 4px; margin-top: auto; padding-top: 18px; color: ${C.navy}; font-size: 13.5px; font-weight: 700; }
        .ks-cust-work-summary { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin-top: 22px; padding: 14px; border-left: 3px solid ${C.blue}; background: ${C.navySoft}; border-radius: 0 10px 10px 0; }
        .ks-cust-work-summary strong { color: ${C.ink}; font-size: 14px; }
        .ks-cust-work-summary span { color: ${C.slate}; font-size: 12.5px; line-height: 1.45; }
        .ks-cust-empty-work { display: flex; flex-direction: column; align-items: flex-start; gap: 5px; margin-top: 22px; padding: 14px; color: ${C.slate}; background: ${C.paperDim}; border-radius: 10px; }
        .ks-cust-empty-work strong { color: ${C.ink}; font-size: 14px; }
        .ks-cust-empty-work span { font-size: 12.5px; }
        .ks-cust-trust-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-bottom: 16px; background: ${C.card}; border: 1px solid ${C.line}; border-radius: 14px; box-shadow: 0 4px 14px rgba(16,42,76,.035); overflow: hidden; }
        .ks-cust-trust-strip > div { display: flex; align-items: center; gap: 10px; min-height: 68px; padding: 12px 16px; border-right: 1px solid ${C.line}; }
        .ks-cust-trust-strip > div:last-child { border-right: none; }
        .ks-cust-trust-strip span { display: flex; flex-direction: column; gap: 2px; color: ${C.slate}; font-size: 11px; }
        .ks-cust-trust-strip strong { color: ${C.ink}; font-size: 12px; }
        .ks-cust-footer { padding: 14px 4px 4px; color: ${C.muted}; font-size: 12px; text-align: center; }
        @media (max-width: 980px) { .ks-cust-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } .ks-cust-trust-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); } .ks-cust-trust-strip > div:nth-child(2) { border-right: none; } .ks-cust-trust-strip > div:nth-child(-n+2) { border-bottom: 1px solid ${C.line}; } }
        @media (max-width: 720px) { .ks-cust-metrics, .ks-cust-main-grid, .ks-cust-trust-strip { grid-template-columns: 1fr; } .ks-cust-trust-strip > div, .ks-cust-trust-strip > div:nth-child(2) { border-right: none; border-bottom: 1px solid ${C.line}; } .ks-cust-trust-strip > div:last-child { border-bottom: none; } }
        .ks-cust-select-bar { position: sticky; bottom: 12px; z-index: 20; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; padding: 14px 18px; background: ${C.card}; border: 1px solid ${C.line}; border-radius: 14px; box-shadow: 0 8px 24px rgba(27,42,74,0.10); }
        @media (max-width: 920px) {
          .ks-role-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ks-cust-hero, .ks-cust-logo-wrap { animation: none; }
        }
      `}</style>
      {screen === "roleSelection" && <RoleSelectionScreen onSelectRole={handleRoleSelect} />}
      {screen === "customerAccount" && (
        <CustomerAccountSelectionScreen
          onSelect={handleCustomerAccountSelect}
          onChangeRole={handleChangeRole}
        />
      )}
      {screen === "customerRegister" && (
        <CustomerRegisterContactScreen
          initial={regDraft}
          onBack={() => setScreen("customerAccount")}
          onContinue={(contact) => {
            setRegDraft(contact);
            setScreen("customerOtp");
          }}
        />
      )}
      {screen === "customerOtp" && (
        <CustomerRegisterOtpScreen
          email={regDraft.email}
          phone={regDraft.phone}
          onBack={() => setScreen("customerRegister")}
          onVerified={() => setScreen("customerProfile")}
        />
      )}
      {screen === "customerProfile" && (
        <CustomerProfileSetupScreen
          email={regDraft.email}
          phone={regDraft.phone}
          onBack={() => setScreen("customerOtp")}
          onComplete={handleCustomerRegistered}
        />
      )}
      {screen === "login" && (
        <LoginPage
          selectedRole={role}
          federationRole={federationRole}
          setFederationRole={setFederationRole}
          onLogin={handleLogin}
          onChangeRole={role === "Customer" ? () => setScreen("customerAccount") : handleChangeRole}
        />
      )}
      {screen === "portal" && role === "Federation" && federationRole === "Admin" && (
        <FederationPortal state={state} actions={actions} onLogout={handleLogout} role="Admin" />
      )}
      {screen === "portal" && role === "Federation" && federationRole === "Member" && (
        <FederationMemberPortal state={state} actions={actions} onLogout={handleLogout} />
      )}
      {screen === "portal" && role === "Worker" && (
        <WorkerPortal state={state} actions={actions} onLogout={handleLogout} workerId={currentWorkerId} />
      )}
      {screen === "portal" && role === "Customer" && (
        <CustomerPortal
          state={state}
          actions={actions}
          onLogout={handleLogout}
          customerId={currentCustomerId}
          promptLocationFor={promptLocationFor}
          clearPrompt={() => setPromptLocationFor(null)}
        />
      )}
    </div>
  );
}
