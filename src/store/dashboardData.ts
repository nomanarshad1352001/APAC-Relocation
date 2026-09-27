// ─── Seed data for the full SaaS dashboard ───

export interface Shipment {
  id: string;
  clientName: string;
  origin: string;
  destination: string;
  status: 'survey' | 'packing' | 'in-transit' | 'customs' | 'delivered';
  mode: 'sea' | 'air' | 'combo';
  volume: string;
  value: number;
  eta: string;
  departDate: string;
  trackingCode: string;
  progress: number;
  notes: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  origin: string;
  destination: string;
  moveDate: string;
  status: 'lead' | 'quoted' | 'booked' | 'active' | 'completed';
  value: number;
  avatar: string;
  notes: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  clientName: string;
  clientEmail: string;
  items: { desc: string; qty: number; rate: number }[];
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  notes: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  department: string;
  status: 'active' | 'away' | 'offline';
  activeMoves: number;
  joinDate: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'survey' | 'packing' | 'delivery' | 'meeting' | 'followup';
  client: string;
  notes: string;
}

export interface Activity {
  id: string;
  type: 'shipment' | 'client' | 'invoice' | 'system';
  message: string;
  time: string;
  icon: string;
}

// ─── Seed Shipments ───
export const seedShipments: Shipment[] = [
  { id: 'sh1', clientName: 'Chen Wei Family', origin: 'Singapore', destination: 'San Francisco, CA', status: 'in-transit', mode: 'sea', volume: '3 Bedroom', value: 8400, eta: 'Feb 14, 2026', departDate: 'Jan 18, 2026', trackingCode: 'APAC-2026-0142', progress: 62, notes: 'FCL 20ft — fragile art included' },
  { id: 'sh2', clientName: 'Priya Sharma', origin: 'Singapore', destination: 'New York, NY', status: 'packing', mode: 'air', volume: '1 Bedroom', value: 4200, eta: 'Feb 2, 2026', departDate: 'Jan 27, 2026', trackingCode: 'APAC-2026-0143', progress: 25, notes: 'Air cargo — expedited' },
  { id: 'sh3', clientName: 'Tanaka Hiroshi', origin: 'Singapore', destination: 'Seattle, WA', status: 'customs', mode: 'sea', volume: '2 Bedroom', value: 6100, eta: 'Jan 30, 2026', departDate: 'Jan 2, 2026', trackingCode: 'APAC-2026-0138', progress: 85, notes: 'LCL — awaiting ISF clearance' },
  { id: 'sh4', clientName: 'Marcus & Linda Ng', origin: 'Singapore', destination: 'Austin, TX', status: 'survey', mode: 'combo', volume: '4 Bedroom+', value: 12800, eta: 'Mar 20, 2026', departDate: '', trackingCode: 'APAC-2026-0148', progress: 5, notes: 'Video survey scheduled Feb 3' },
  { id: 'sh5', clientName: 'Lee Mei Ling', origin: 'Singapore', destination: 'Los Angeles, CA', status: 'delivered', mode: 'sea', volume: '2 Bedroom', value: 5800, eta: 'Jan 15, 2026', departDate: 'Dec 18, 2025', trackingCode: 'APAC-2026-0131', progress: 100, notes: 'Delivered — 5★ feedback received' },
  { id: 'sh6', clientName: 'David & Sarah Tan', origin: 'Singapore', destination: 'Boston, MA', status: 'in-transit', mode: 'sea', volume: '3 Bedroom', value: 7900, eta: 'Feb 22, 2026', departDate: 'Jan 22, 2026', trackingCode: 'APAC-2026-0145', progress: 45, notes: 'FCL 20ft — piano included' },
];

// ─── Seed Clients ───
export const seedClients: Client[] = [
  { id: 'cl1', name: 'Chen Wei', email: 'chen.wei@email.com', phone: '+65 9123 4567', company: 'Google Singapore', origin: 'Singapore', destination: 'San Francisco', moveDate: '2026-01-18', status: 'active', value: 8400, avatar: 'CW', notes: 'H-1B transfer, needs pet relocation', createdAt: '2025-11-02' },
  { id: 'cl2', name: 'Priya Sharma', email: 'priya.s@email.com', phone: '+65 8234 5678', company: 'Meta', origin: 'Singapore', destination: 'New York', moveDate: '2026-01-27', status: 'active', value: 4200, avatar: 'PS', notes: 'L-1B visa, studio apartment', createdAt: '2025-11-15' },
  { id: 'cl3', name: 'Tanaka Hiroshi', email: 'tanaka.h@email.com', phone: '+65 9345 6789', company: 'Amazon', origin: 'Singapore', destination: 'Seattle', moveDate: '2026-01-02', status: 'active', value: 6100, avatar: 'TH', notes: 'O-1 visa, 2BR condo', createdAt: '2025-10-20' },
  { id: 'cl4', name: 'Marcus Ng', email: 'marcus.ng@email.com', phone: '+65 8456 7890', company: 'Self-employed', origin: 'Singapore', destination: 'Austin', moveDate: '2026-03-01', status: 'quoted', value: 12800, avatar: 'MN', notes: 'EB-5 investor, large household + vehicle', createdAt: '2025-12-10' },
  { id: 'cl5', name: 'Lee Mei Ling', email: 'meiling@email.com', phone: '+65 9567 8901', company: 'Apple', origin: 'Singapore', destination: 'Los Angeles', moveDate: '2025-12-18', status: 'completed', value: 5800, avatar: 'ML', notes: 'H-1B, 2BR — move complete', createdAt: '2025-09-15' },
  { id: 'cl6', name: 'Sarah Tan', email: 'sarah.tan@email.com', phone: '+65 8678 9012', company: 'Stripe', origin: 'Singapore', destination: 'Boston', moveDate: '2026-01-22', status: 'active', value: 7900, avatar: 'ST', notes: 'E-2 visa, family of 4, piano', createdAt: '2025-11-28' },
  { id: 'cl7', name: 'Raj Patel', email: 'raj.p@email.com', phone: '+65 9789 0123', company: 'Shopify', origin: 'Singapore', destination: 'San Francisco', moveDate: '2026-04-15', status: 'lead', value: 0, avatar: 'RP', notes: 'Initial enquiry, F-1 → H-1B', createdAt: '2026-01-20' },
  { id: 'cl8', name: 'Yuki Watanabe', email: 'yuki.w@email.com', phone: '+65 8890 1234', company: 'Netflix', origin: 'Singapore', destination: 'Los Angeles', moveDate: '2026-05-01', status: 'lead', value: 0, avatar: 'YW', notes: 'Enquiry via website, 1BR', createdAt: '2026-01-22' },
];

// ─── Seed Invoices ───
export const seedInvoices: Invoice[] = [
  { id: 'inv1', invoiceNo: 'INV-2026-001', clientName: 'Chen Wei', clientEmail: 'chen.wei@email.com', items: [{ desc: 'FCL Sea Freight (SIN→SFO)', qty: 1, rate: 3780 }, { desc: 'Professional Packing', qty: 1, rate: 1680 }, { desc: 'Customs Clearance', qty: 1, rate: 1008 }, { desc: 'Destination Delivery', qty: 1, rate: 1260 }, { desc: 'Transit Insurance', qty: 1, rate: 672 }], total: 8400, status: 'paid', issueDate: '2025-12-20', dueDate: '2026-01-10', notes: '' },
  { id: 'inv2', invoiceNo: 'INV-2026-002', clientName: 'Priya Sharma', clientEmail: 'priya.s@email.com', items: [{ desc: 'Air Freight (SIN→JFK)', qty: 1, rate: 1890 }, { desc: 'Packing & Crating', qty: 1, rate: 840 }, { desc: 'Customs Clearance', qty: 1, rate: 504 }, { desc: 'Final-Mile Delivery', qty: 1, rate: 630 }, { desc: 'Insurance', qty: 1, rate: 336 }], total: 4200, status: 'sent', issueDate: '2026-01-10', dueDate: '2026-01-25', notes: '' },
  { id: 'inv3', invoiceNo: 'INV-2026-003', clientName: 'Tanaka Hiroshi', clientEmail: 'tanaka.h@email.com', items: [{ desc: 'LCL Sea Freight (SIN→SEA)', qty: 1, rate: 2745 }, { desc: 'Professional Packing', qty: 1, rate: 1220 }, { desc: 'Customs + ISF', qty: 1, rate: 732 }, { desc: 'Delivery', qty: 1, rate: 915 }, { desc: 'Insurance', qty: 1, rate: 488 }], total: 6100, status: 'paid', issueDate: '2025-11-25', dueDate: '2025-12-15', notes: '' },
  { id: 'inv4', invoiceNo: 'INV-2026-004', clientName: 'Marcus Ng', clientEmail: 'marcus.ng@email.com', items: [{ desc: 'FCL + Vehicle Freight (SIN→AUS)', qty: 1, rate: 5760 }, { desc: 'Full-Service Packing', qty: 1, rate: 2560 }, { desc: 'Customs (household + vehicle)', qty: 1, rate: 1536 }, { desc: 'White-Glove Delivery', qty: 1, rate: 1920 }, { desc: 'Full Insurance', qty: 1, rate: 1024 }], total: 12800, status: 'draft', issueDate: '2026-01-22', dueDate: '2026-02-15', notes: 'Pending survey confirmation' },
  { id: 'inv5', invoiceNo: 'INV-2026-005', clientName: 'Lee Mei Ling', clientEmail: 'meiling@email.com', items: [{ desc: 'LCL Sea Freight (SIN→LAX)', qty: 1, rate: 2610 }, { desc: 'Packing', qty: 1, rate: 1160 }, { desc: 'Customs', qty: 1, rate: 696 }, { desc: 'Delivery', qty: 1, rate: 870 }, { desc: 'Insurance', qty: 1, rate: 464 }], total: 5800, status: 'paid', issueDate: '2025-11-10', dueDate: '2025-12-01', notes: '' },
];

// ─── Seed Team ───
export const seedTeam: TeamMember[] = [
  { id: 'tm1', name: 'Rachel Lim', role: 'Senior Move Manager', email: 'rachel@apac.com', avatar: 'RL', department: 'Operations', status: 'active', activeMoves: 4, joinDate: '2021-03-15' },
  { id: 'tm2', name: 'James Ong', role: 'Logistics Coordinator', email: 'james@apac.com', avatar: 'JO', department: 'Logistics', status: 'active', activeMoves: 6, joinDate: '2022-06-01' },
  { id: 'tm3', name: 'Aisha Rahman', role: 'Customs Specialist', email: 'aisha@apac.com', avatar: 'AR', department: 'Compliance', status: 'active', activeMoves: 3, joinDate: '2020-09-10' },
  { id: 'tm4', name: 'Kevin Tan', role: 'Sales Manager', email: 'kevin@apac.com', avatar: 'KT', department: 'Sales', status: 'away', activeMoves: 2, joinDate: '2023-01-20' },
  { id: 'tm5', name: 'Sophie Chen', role: 'Client Relations', email: 'sophie@apac.com', avatar: 'SC', department: 'Support', status: 'active', activeMoves: 5, joinDate: '2022-11-05' },
  { id: 'tm6', name: 'Daniel Park', role: 'Operations Director', email: 'daniel@apac.com', avatar: 'DP', department: 'Management', status: 'active', activeMoves: 0, joinDate: '2019-05-15' },
];

// ─── Seed Calendar ───
export const seedCalendar: CalendarEvent[] = [
  { id: 'ev1', title: 'Video Survey — Marcus Ng', date: '2026-02-03', time: '10:00 AM', type: 'survey', client: 'Marcus Ng', notes: '4BR household, vehicle' },
  { id: 'ev2', title: 'Packing Day — Priya Sharma', date: '2026-01-27', time: '8:00 AM', type: 'packing', client: 'Priya Sharma', notes: '1BR air freight' },
  { id: 'ev3', title: 'Delivery — Lee Mei Ling', date: '2026-01-15', time: '9:00 AM', type: 'delivery', client: 'Lee Mei Ling', notes: '2BR LAX delivery' },
  { id: 'ev4', title: 'Follow-up Call — Raj Patel', date: '2026-01-28', time: '2:00 PM', type: 'followup', client: 'Raj Patel', notes: 'Discuss quote + timeline' },
  { id: 'ev5', title: 'Team Standup', date: '2026-01-27', time: '9:00 AM', type: 'meeting', client: '', notes: 'Weekly ops review' },
  { id: 'ev6', title: 'Survey — Yuki Watanabe', date: '2026-02-10', time: '11:00 AM', type: 'survey', client: 'Yuki Watanabe', notes: '1BR, Netflix relocation' },
];

// ─── Seed Activity ───
export const seedActivity: Activity[] = [
  { id: 'a1', type: 'shipment', message: 'APAC-2026-0142 (Chen Wei) cleared Singapore port', time: '2 hours ago', icon: 'anchor' },
  { id: 'a2', type: 'client', message: 'New lead: Raj Patel submitted enquiry', time: '4 hours ago', icon: 'user' },
  { id: 'a3', type: 'invoice', message: 'INV-2026-001 payment received — $8,400', time: '6 hours ago', icon: 'money' },
  { id: 'a4', type: 'shipment', message: 'APAC-2026-0138 (Tanaka) arrived US customs', time: '8 hours ago', icon: 'package' },
  { id: 'a5', type: 'client', message: 'Yuki Watanabe scheduled video survey', time: '1 day ago', icon: 'camera' },
  { id: 'a6', type: 'system', message: 'Monthly report generated for January', time: '1 day ago', icon: 'chart' },
  { id: 'a7', type: 'invoice', message: 'INV-2026-003 payment confirmed — $6,100', time: '2 days ago', icon: 'check' },
  { id: 'a8', type: 'shipment', message: 'APAC-2026-0131 (Lee Mei Ling) delivered successfully', time: '3 days ago', icon: 'home' },
];

// ─── Revenue data for charts ───
export const revenueData = [
  { month: 'Aug', revenue: 32400, moves: 6 },
  { month: 'Sep', revenue: 41200, moves: 8 },
  { month: 'Oct', revenue: 38900, moves: 7 },
  { month: 'Nov', revenue: 52100, moves: 10 },
  { month: 'Dec', revenue: 48600, moves: 9 },
  { month: 'Jan', revenue: 45300, moves: 8 },
];

export const leadFunnel = [
  { stage: 'Website Visit', count: 2840 },
  { stage: 'Enquiry', count: 384 },
  { stage: 'Survey Done', count: 142 },
  { stage: 'Quoted', count: 98 },
  { stage: 'Booked', count: 64 },
  { stage: 'Completed', count: 52 },
];

export const destinationBreakdown = [
  { city: 'San Francisco', pct: 28 },
  { city: 'New York', pct: 22 },
  { city: 'Los Angeles', pct: 18 },
  { city: 'Seattle', pct: 14 },
  { city: 'Austin', pct: 10 },
  { city: 'Boston', pct: 8 },
];
