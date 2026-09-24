import siteManhattan from "@/assets/site-manhattan-park.jpg";
import siteSoho from "@/assets/site-soho-house.jpg";
import siteScott from "@/assets/auth-pool.jpg";
import avatarMarcus from "@/assets/avatar-marcus.jpg";
import avatarDana from "@/assets/avatar-dana.jpg";

export const brand = {
  company: "Bluecrest Amenity Management",
  address: "105-25 91st St, Ozone Park, NY 11417",
  phone: "(718) 555-0142",
  email: "office@bluecrestamenity.com",
  website: "bluecrestamenity.com",
  version: "1.0.0",
};

export const staff = {
  id: "BC-1042",
  name: "Marcus Bennett",
  firstName: "Marcus",
  role: "Certified Lifeguard",
  email: "m.bennett@bluecrestamenity.com",
  phone: "(917) 555-0188",
  avatar: avatarMarcus,
  emergencyContactName: "Alicia Bennett",
  emergencyContactPhone: "(917) 555-0132",
  stats: { attendance: "98%", tasksCompleted: 142, onTime: "96%" },
};

export const supervisor = {
  name: "Dana Reyes",
  role: "Site Supervisor",
  avatar: avatarDana,
  phone: "(718) 555-0177",
};

export type Site = {
  id: string;
  name: string;
  address: string;
  photo: string;
  shiftStatus: "today" | "scheduled" | "none";
  shiftStatusLabel: string;
  waterSchedule: string;
  notes: string;
  coords: { lat: number; lng: number };
  geofenceRadius: number;
};

export const sites: Site[] = [
  {
    id: "manhattan-park",
    name: "Manhattan Park Pool Club",
    address: "40 River Rd, Roosevelt Island, NY 10044",
    photo: siteManhattan,
    shiftStatus: "today",
    shiftStatusLabel: "Today's Shift",
    waterSchedule: "Every hour, 9:00 AM – 7:00 PM",
    notes:
      "Gate code: 4471. Equipment room is behind the cabana bar. Chemical storage key is on the red lanyard in the guard office.",
    coords: { lat: 40.7616, lng: -73.9505 },
    geofenceRadius: 150,
  },
  {
    id: "soho-house",
    name: "Soho House Rooftop",
    address: "29-35 9th Ave, New York, NY 10014",
    photo: siteSoho,
    shiftStatus: "scheduled",
    shiftStatusLabel: "Scheduled Thu",
    waterSchedule: "Every 2 hours, 11:00 AM – 9:00 PM",
    notes: "Fill-in coverage. Check in with front desk on the ground floor for elevator access.",
    coords: { lat: 40.7409, lng: -74.0078 },
    geofenceRadius: 120,
  },
  {
    id: "scott-ave",
    name: "154 Scott Ave",
    address: "154 Scott Ave, Brooklyn, NY 11237",
    photo: siteScott,
    shiftStatus: "none",
    shiftStatusLabel: "Past assignment",
    waterSchedule: "Every hour, 12:00 AM – 8:00 AM",
    notes: "Overnight fill-in site. Side entrance via the alley; key fob from the overnight supervisor.",
    coords: { lat: 40.7012, lng: -73.9275 },
    geofenceRadius: 100,
  },
];

/** App “today” for assignment categorization & history demos. */
export const appToday = new Date(2026, 7, 6); // Thu Aug 6, 2026

export type AssignmentType = "Primary" | "Temporary";
export type AssignmentBucket = "current" | "upcoming" | "past";

export type SiteAssignment = {
  id: string;
  siteId: string;
  type: AssignmentType;
  /** ISO date YYYY-MM-DD */
  startDate: string;
  /** ISO date or null for Ongoing Primary */
  endDate: string | null;
  shiftTime: string;
  /** Past assignment summary */
  daysWorked?: number;
  daysScheduled?: number;
};

export const siteAssignments: SiteAssignment[] = [
  {
    id: "asg-manhattan-primary",
    siteId: "manhattan-park",
    type: "Primary",
    startDate: "2026-01-15",
    endDate: null,
    shiftTime: "8:00 AM – 4:00 PM",
  },
  {
    id: "asg-soho-event",
    siteId: "soho-house",
    type: "Temporary",
    startDate: "2026-08-12",
    endDate: "2026-08-14",
    shiftTime: "4:00 PM – 12:00 AM",
  },
  {
    id: "asg-scott-overnight",
    siteId: "scott-ave",
    type: "Temporary",
    startDate: "2026-07-01",
    endDate: "2026-07-14",
    shiftTime: "12:00 AM – 8:00 AM",
    daysWorked: 13,
    daysScheduled: 14,
  },
];

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function assignmentBucket(
  a: SiteAssignment,
  asOf: Date = appToday,
): AssignmentBucket {
  const today = startOfDay(asOf).getTime();
  const start = startOfDay(parseISODate(a.startDate)).getTime();
  if (start > today) return "upcoming";
  if (a.endDate) {
    const end = startOfDay(parseISODate(a.endDate)).getTime();
    if (end < today) return "past";
  }
  return "current";
}

export function formatAssignmentPeriod(a: SiteAssignment): string {
  const fmt = (iso: string) =>
    parseISODate(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  if (!a.endDate) return `Since ${fmt(a.startDate)} · Ongoing`;
  return `${fmt(a.startDate)} – ${fmt(a.endDate)}`;
}

export function daysUntilStart(a: SiteAssignment, asOf: Date = appToday): number {
  const start = startOfDay(parseISODate(a.startDate)).getTime();
  const today = startOfDay(asOf).getTime();
  return Math.max(0, Math.round((start - today) / 86400000));
}

export function attendancePct(a: SiteAssignment): number | null {
  if (!a.daysScheduled || !a.daysWorked) return null;
  return Math.round((a.daysWorked / a.daysScheduled) * 100);
}

export type HistoryEventStatus = "completed" | "missed" | "late" | "info" | "flagged";

export type SiteHistoryEvent = {
  time: string;
  label: string;
  status: HistoryEventStatus;
  photoCount?: number;
};

export type SiteHistoryDay = {
  /** YYYY-MM-DD */
  date: string;
  tasksCompleted: number;
  tasksTotal: number;
  clockIn?: string;
  clockOut?: string;
  waterOk: number;
  waterTotal: number;
  events: SiteHistoryEvent[];
};

/** Marcus’s history at Manhattan Park — Aug 1–6 sample. */
export const manhattanParkHistory: SiteHistoryDay[] = [
  {
    date: "2026-08-01",
    tasksCompleted: 4,
    tasksTotal: 4,
    clockIn: "8:58 AM",
    clockOut: "4:02 PM",
    waterOk: 2,
    waterTotal: 2,
    events: [
      { time: "8:58 AM", label: "Clocked In", status: "info" },
      { time: "9:05 AM", label: "Opening Checklist — Completed", status: "completed" },
      { time: "9:06 AM", label: "Opening Photos Submitted", status: "completed", photoCount: 4 },
      { time: "11:00 AM", label: "Water Test Submitted — Within Range", status: "completed" },
      { time: "3:00 PM", label: "Water Test Submitted — Within Range", status: "completed" },
      { time: "4:00 PM", label: "Closing Checklist — Completed", status: "completed" },
      { time: "4:02 PM", label: "Clocked Out", status: "info" },
    ],
  },
  {
    date: "2026-08-02",
    tasksCompleted: 3,
    tasksTotal: 4,
    clockIn: "8:55 AM",
    clockOut: "4:05 PM",
    waterOk: 2,
    waterTotal: 2,
    events: [
      { time: "8:55 AM", label: "Clocked In", status: "info" },
      { time: "9:04 AM", label: "Opening Checklist — Completed", status: "completed" },
      { time: "9:05 AM", label: "Opening Photos Submitted", status: "completed", photoCount: 4 },
      { time: "11:02 AM", label: "Water Test Submitted — Within Range", status: "completed" },
      { time: "3:01 PM", label: "Water Test Submitted — Within Range", status: "completed" },
      { time: "4:00 PM", label: "Closing Checklist — Missed", status: "missed" },
      { time: "4:05 PM", label: "Clocked Out", status: "info" },
    ],
  },
  {
    date: "2026-08-03",
    tasksCompleted: 4,
    tasksTotal: 4,
    clockIn: "8:55 AM",
    clockOut: "4:01 PM",
    waterOk: 1,
    waterTotal: 2,
    events: [
      { time: "8:55 AM", label: "Clocked In", status: "info" },
      { time: "9:03 AM", label: "Opening Checklist — Completed", status: "completed" },
      { time: "9:04 AM", label: "Opening Photos Submitted", status: "completed", photoCount: 4 },
      { time: "11:00 AM", label: "Water Test Submitted — Within Range", status: "completed" },
      {
        time: "3:05 PM",
        label: "Water Test Flagged — Corrective action logged",
        status: "flagged",
      },
      { time: "4:00 PM", label: "Closing Checklist — Completed", status: "completed" },
      { time: "4:01 PM", label: "Clocked Out", status: "info" },
    ],
  },
  {
    date: "2026-08-04",
    tasksCompleted: 4,
    tasksTotal: 4,
    clockIn: "9:14 AM",
    clockOut: "4:02 PM",
    waterOk: 2,
    waterTotal: 2,
    events: [
      { time: "9:14 AM", label: "Clocked In", status: "late" },
      { time: "9:20 AM", label: "Opening Checklist — Completed", status: "completed" },
      { time: "9:22 AM", label: "Opening Photos Submitted", status: "completed", photoCount: 4 },
      { time: "11:00 AM", label: "Water Test Submitted — Within Range", status: "completed" },
      { time: "3:00 PM", label: "Water Test Submitted — Within Range", status: "completed" },
      { time: "4:00 PM", label: "Closing Checklist — Completed", status: "completed" },
      { time: "4:02 PM", label: "Clocked Out", status: "info" },
    ],
  },
  {
    date: "2026-08-05",
    tasksCompleted: 4,
    tasksTotal: 4,
    clockIn: "8:58 AM",
    clockOut: "4:03 PM",
    waterOk: 2,
    waterTotal: 2,
    events: [
      { time: "8:58 AM", label: "Clocked In", status: "info" },
      { time: "9:05 AM", label: "Opening Checklist — Completed", status: "completed" },
      {
        time: "10:15 AM",
        label: "Opening Photos Submitted",
        status: "late",
        photoCount: 4,
      },
      { time: "11:00 AM", label: "Water Test Submitted — Within Range", status: "completed" },
      { time: "3:00 PM", label: "Water Test Submitted — Within Range", status: "completed" },
      { time: "4:00 PM", label: "Closing Checklist — Completed", status: "completed" },
      { time: "4:03 PM", label: "Clocked Out", status: "info" },
    ],
  },
  {
    date: "2026-08-06",
    tasksCompleted: 2,
    tasksTotal: 4,
    clockIn: "8:57 AM",
    waterOk: 1,
    waterTotal: 2,
    events: [
      { time: "8:57 AM", label: "Clocked In", status: "info" },
      { time: "9:05 AM", label: "Opening Checklist — Completed", status: "completed" },
      { time: "9:06 AM", label: "Opening Photos Submitted", status: "completed", photoCount: 4 },
      { time: "11:00 AM", label: "Water Test Submitted — Within Range", status: "completed" },
      { time: "—", label: "Afternoon water test — In progress", status: "info" },
      { time: "—", label: "Closing Checklist — Pending", status: "info" },
    ],
  },
];

export function siteHistoryFor(siteId: string): SiteHistoryDay[] {
  if (siteId === "manhattan-park") return manhattanParkHistory;
  return [];
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatHistoryDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function addDaysISO(iso: string, delta: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + delta);
  return toISODate(d);
}

/** Last N calendar days ending at `endIso`, oldest → newest. */
export function heatmapWindow(endIso: string, days = 14): string[] {
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) out.push(addDaysISO(endIso, -i));
  return out;
}

export function dayCompletionTone(
  day: SiteHistoryDay | undefined,
): "full" | "partial" | "missed" | "empty" | "today" {
  if (!day) return "empty";
  if (day.date === toISODate(appToday)) return "today";
  if (day.tasksCompleted >= day.tasksTotal && day.tasksTotal > 0) return "full";
  if (day.events.some((e) => e.status === "missed")) return "missed";
  if (day.tasksCompleted > 0) return "partial";
  return "empty";
}

export const photoTypes = [
  { id: "opening-pool", group: "Opening", label: "Pool", icon: "waves" },
  { id: "opening-equipment", group: "Opening", label: "Equipment Room", icon: "wrench" },
  { id: "opening-rescue", group: "Opening", label: "Rescue Equipment", icon: "life-buoy" },
  { id: "opening-chemical", group: "Opening", label: "Chemical Storage", icon: "flask" },
  { id: "closing-pool", group: "Closing", label: "Pool", icon: "waves" },
  { id: "closing-equipment", group: "Closing", label: "Equipment Room", icon: "wrench" },
  { id: "closing-rescue", group: "Closing", label: "Rescue Equipment", icon: "life-buoy" },
  { id: "water-verify", group: "Water Test Verification", label: "Test Strip / Kit", icon: "droplet" },
  { id: "incident", group: "Incident", label: "Incident Photo", icon: "alert" },
];

export type TaskCategory = "Opening" | "Ongoing" | "Closing";
export type TaskStatus = "completed" | "due" | "pending" | "review";

export type ChecklistItem = {
  id: string;
  label: string;
  requiresPhoto?: boolean;
  linksTo?: "water-test";
};

export type Task = {
  id: string;
  name: string;
  siteId: string;
  category: TaskCategory;
  dueTime: string;
  completedTime?: string;
  status: TaskStatus;
  assignedBy: string;
  requiresSignoff?: boolean;
  items: ChecklistItem[];
};

export const tasks: Task[] = [
  {
    id: "opening-checklist",
    name: "Opening Checklist",
    siteId: "manhattan-park",
    category: "Opening",
    dueTime: "9:00 AM",
    completedTime: "9:05 AM",
    status: "completed",
    assignedBy: "Daily Opening Template",
    requiresSignoff: true,
    items: [
      { id: "gate", label: "Unlock and inspect pool gate/fencing" },
      { id: "chem", label: "Test and log water chemistry", linksTo: "water-test" },
      { id: "rescue", label: "Inspect rescue equipment", requiresPhoto: true },
      { id: "firstaid", label: "Check first aid kit stock" },
      { id: "signage", label: "Set up signage and safety flags" },
      {
        id: "storage",
        label: "Confirm chemical storage is locked and photographed",
        requiresPhoto: true,
      },
    ],
  },
  {
    id: "rescue-check",
    name: "Rescue Equipment Check",
    siteId: "manhattan-park",
    category: "Opening",
    dueTime: "9:10 AM",
    completedTime: "9:10 AM",
    status: "completed",
    assignedBy: "Daily Opening Template",
    items: [
      { id: "tube", label: "Rescue tube present and serviceable" },
      { id: "backboard", label: "Backboard and straps inspected", requiresPhoto: true },
      { id: "aed", label: "AED battery indicator green" },
    ],
  },
  {
    id: "chemical-check",
    name: "Chemical Storage Check",
    siteId: "manhattan-park",
    category: "Opening",
    dueTime: "9:12 AM",
    completedTime: "9:12 AM",
    status: "completed",
    assignedBy: "Daily Opening Template",
    items: [
      { id: "locked", label: "Storage room locked and labeled" },
      { id: "levels", label: "Chemical levels sufficient for the day" },
      { id: "spill", label: "Spill kit in place", requiresPhoto: true },
    ],
  },
  {
    id: "water-11",
    name: "Hourly Water Test (11:00 AM)",
    siteId: "manhattan-park",
    category: "Ongoing",
    dueTime: "11:00 AM",
    status: "due",
    assignedBy: "Water Testing Schedule",
    items: [{ id: "test", label: "Complete water test form", linksTo: "water-test" }],
  },
  {
    id: "water-12",
    name: "Hourly Water Test (12:00 PM)",
    siteId: "manhattan-park",
    category: "Ongoing",
    dueTime: "12:00 PM",
    status: "pending",
    assignedBy: "Water Testing Schedule",
    items: [{ id: "test", label: "Complete water test form", linksTo: "water-test" }],
  },
  {
    id: "bathroom",
    name: "Bathroom Inspection",
    siteId: "manhattan-park",
    category: "Ongoing",
    dueTime: "1:00 PM",
    status: "pending",
    assignedBy: "Daily Ongoing Template",
    items: [
      { id: "clean", label: "Restrooms clean and stocked" },
      { id: "hazard", label: "No slip hazards or standing water" },
      { id: "photo", label: "Photograph restroom entry", requiresPhoto: true },
    ],
  },
  {
    id: "closing-checklist",
    name: "Closing Checklist",
    siteId: "manhattan-park",
    category: "Closing",
    dueTime: "7:00 PM",
    status: "pending",
    assignedBy: "Daily Closing Template",
    requiresSignoff: true,
    items: [
      { id: "clear", label: "Clear deck and confirm pool is empty" },
      { id: "cover", label: "Secure pool cover and gates", requiresPhoto: true },
      { id: "equip", label: "Return rescue equipment to storage", requiresPhoto: true },
      { id: "log", label: "Complete end-of-day log" },
    ],
  },
];

export type WaterTest = {
  id: string;
  siteId: string;
  body: string;
  time: string;
  date: string;
  chlorine: number;
  ph: number;
  temp: number;
  bathers: number;
  status: "ok" | "flagged";
  correctiveAction?: string;
  signoff?: string;
};

export const waterTests: WaterTest[] = [
  {
    id: "wt-1",
    siteId: "manhattan-park",
    body: "Main Pool",
    time: "9:04 AM",
    date: "Today",
    chlorine: 2.4,
    ph: 7.4,
    temp: 81,
    bathers: 0,
    status: "ok",
    signoff: "Approved by Dana Reyes",
  },
  {
    id: "wt-2",
    siteId: "manhattan-park",
    body: "Main Pool",
    time: "10:02 AM",
    date: "Today",
    chlorine: 2.1,
    ph: 7.5,
    temp: 82,
    bathers: 12,
    status: "ok",
  },
  {
    id: "wt-3",
    siteId: "manhattan-park",
    body: "Spa",
    time: "4:58 PM",
    date: "Yesterday",
    chlorine: 0.7,
    ph: 7.8,
    temp: 102,
    bathers: 4,
    status: "flagged",
    correctiveAction: "Added 8 oz sodium hypochlorite, closed spa 30 min, retested at 5:35 PM.",
    signoff: "Reviewed by Dana Reyes",
  },
];

export const ranges = {
  chlorine: { min: 1, max: 4, warnLow: 1.5, warnHigh: 3.5, unit: "ppm", scale: [0, 6] },
  ph: { min: 7.2, max: 7.8, warnLow: 7.3, warnHigh: 7.7, unit: "", scale: [6.5, 8.5] },
  temp: { min: 78, max: 86, warnLow: 79, warnHigh: 85, unit: "°F", scale: [70, 105] },
};

export type Shift = {
  id: string;
  day: string;
  date: string;
  siteId: string;
  time: string;
  note?: string;
};

export const shifts: Shift[] = [
  { id: "s1", day: "Mon", date: "Aug 3", siteId: "manhattan-park", time: "9:00 AM – 7:00 PM" },
  { id: "s2", day: "Tue", date: "Aug 4", siteId: "manhattan-park", time: "9:00 AM – 7:00 PM" },
  { id: "s3", day: "Wed", date: "Aug 5", siteId: "manhattan-park", time: "9:00 AM – 7:00 PM" },
  {
    id: "s4",
    day: "Thu",
    date: "Aug 6",
    siteId: "soho-house",
    time: "11:00 AM – 9:00 PM",
    note: "Fill-in coverage",
  },
  { id: "s5", day: "Fri", date: "Aug 7", siteId: "manhattan-park", time: "9:00 AM – 7:00 PM" },
];

export type Notification = {
  id: string;
  group: "Today" | "Yesterday" | "Earlier";
  type: "task" | "message" | "photo" | "water" | "cert";
  title: string;
  description: string;
  time: string;
  unread: boolean;
};

export const notifications: Notification[] = [
  {
    id: "n1",
    group: "Today",
    type: "water",
    title: "Water test due in 15 minutes",
    description: "Main Pool — Manhattan Park Pool Club",
    time: "10m ago",
    unread: true,
  },
  {
    id: "n2",
    group: "Today",
    type: "photo",
    title: "Supervisor approved your opening photos",
    description: "4 photos approved by Dana Reyes",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n3",
    group: "Today",
    type: "message",
    title: "New message from Supervisor Dana Reyes",
    description: "Reminder: water testing kit restock arrives today...",
    time: "2h ago",
    unread: true,
  },
  {
    id: "n4",
    group: "Yesterday",
    type: "task",
    title: "Reminder: Closing checklist due by 6:00 PM",
    description: "Manhattan Park Pool Club",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n5",
    group: "Earlier",
    type: "cert",
    title: "Your CPR certification expires in 30 days",
    description: "CPR/AED/First Aid — renew before 09/12/2026",
    time: "3d ago",
    unread: false,
  },
];

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  issued: string;
  expires: string;
  status: "valid" | "expiring" | "expired";
};

export const certifications: Certification[] = [
  {
    id: "c1",
    name: "Red Cross Lifeguard Certification",
    issuer: "American Red Cross",
    issued: "03/15/2025",
    expires: "03/15/2027",
    status: "valid",
  },
  {
    id: "c2",
    name: "CPR/AED/First Aid",
    issuer: "American Red Cross",
    issued: "09/12/2024",
    expires: "09/12/2026",
    status: "expiring",
  },
  {
    id: "c3",
    name: "Bloodborne Pathogens Training",
    issuer: "OSHA Authorized Provider",
    issued: "01/20/2025",
    expires: "01/20/2027",
    status: "valid",
  },
];

export type AttendanceEntry = {
  id: string;
  date: string;
  day: number;
  siteId: string;
  clockIn: string;
  clockOut: string;
  hours: string;
  status: "complete" | "late" | "off";
};

/** Demo “today” aligned with the staff app calendar. */
export const attendanceAsOf = new Date(2026, 7, 7); // Fri Aug 7, 2026

export const attendance: AttendanceEntry[] = [
  {
    id: "a1",
    date: "Aug 6, 2026",
    day: 6,
    siteId: "manhattan-park",
    clockIn: "8:57 AM",
    clockOut: "7:03 PM",
    hours: "10h 06m",
    status: "complete",
  },
  {
    id: "a2",
    date: "Aug 5, 2026",
    day: 5,
    siteId: "manhattan-park",
    clockIn: "8:58 AM",
    clockOut: "7:04 PM",
    hours: "10h 06m",
    status: "complete",
  },
  {
    id: "a3",
    date: "Aug 4, 2026",
    day: 4,
    siteId: "manhattan-park",
    clockIn: "9:14 AM",
    clockOut: "7:02 PM",
    hours: "9h 48m",
    status: "late",
  },
  {
    id: "a4",
    date: "Aug 3, 2026",
    day: 3,
    siteId: "manhattan-park",
    clockIn: "8:55 AM",
    clockOut: "7:00 PM",
    hours: "10h 05m",
    status: "complete",
  },
  {
    id: "a5",
    date: "Aug 1, 2026",
    day: 1,
    siteId: "soho-house",
    clockIn: "11:00 AM",
    clockOut: "9:00 PM",
    hours: "10h 00m",
    status: "complete",
  },
  {
    id: "a6",
    date: "Jul 31, 2026",
    day: 31,
    siteId: "soho-house",
    clockIn: "11:02 AM",
    clockOut: "9:05 PM",
    hours: "10h 03m",
    status: "complete",
  },
  {
    id: "a7",
    date: "Jul 28, 2026",
    day: 28,
    siteId: "manhattan-park",
    clockIn: "9:05 AM",
    clockOut: "7:01 PM",
    hours: "9h 56m",
    status: "late",
  },
  {
    id: "a8",
    date: "Jul 25, 2026",
    day: 25,
    siteId: "manhattan-park",
    clockIn: "8:52 AM",
    clockOut: "7:00 PM",
    hours: "10h 08m",
    status: "complete",
  },
];

/** Parse "Aug 5, 2026" style attendance dates. */
export function parseAttendanceDate(date: string): Date {
  return new Date(date);
}

/** Hours string like "10h 06m" → decimal hours. */
export function attendanceHoursToNumber(hours: string): number {
  const h = hours.match(/(\d+)\s*h/i);
  const m = hours.match(/(\d+)\s*m/i);
  return (h ? Number(h[1]) : 0) + (m ? Number(m[1]) / 60 : 0);
}

export type AttendanceRange = "week" | "month" | "all";

/** Monday-start week containing `asOf`. */
function startOfWeek(asOf: Date): Date {
  const d = new Date(asOf.getFullYear(), asOf.getMonth(), asOf.getDate());
  const day = d.getDay(); // 0 Sun … 6 Sat
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfWeek(asOf: Date): Date {
  const start = startOfWeek(asOf);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function filterAttendance(
  entries: AttendanceEntry[],
  range: AttendanceRange,
  asOf: Date = attendanceAsOf,
): AttendanceEntry[] {
  if (range === "all") return entries;

  if (range === "week") {
    const start = startOfWeek(asOf);
    const end = endOfWeek(asOf);
    return entries.filter((e) => {
      const d = parseAttendanceDate(e.date);
      return d >= start && d <= end;
    });
  }

  // month
  const y = asOf.getFullYear();
  const m = asOf.getMonth();
  return entries.filter((e) => {
    const d = parseAttendanceDate(e.date);
    return d.getFullYear() === y && d.getMonth() === m;
  });
}

export function attendanceRangeLabel(range: AttendanceRange, asOf: Date = attendanceAsOf): string {
  if (range === "all") return "All Time";
  if (range === "week") {
    const start = startOfWeek(asOf);
    const end = endOfWeek(asOf);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(start)} – ${fmt(end)}`;
  }
  return asOf.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";

export type Incident = {
  id: string;
  type: string;
  title: string;
  siteId: string;
  description: string;
  severity: IncidentSeverity;
  date: string;
  status: "Open" | "Under Review" | "Resolved";
  photos: string[];
  timeline: { label: string; time: string }[];
};

export const incidents: Incident[] = [
  {
    id: "i1",
    type: "Rule Violation",
    title: "Minor slip near pool deck",
    siteId: "manhattan-park",
    description:
      "Wet floor near the north deck entry. Area cordoned off and dried, signage placed. No injury, guest continued swimming.",
    severity: "Low",
    date: "Jul 28, 2026 · 2:14 PM",
    status: "Resolved",
    photos: [],
    timeline: [
      { label: "Submitted", time: "Jul 28, 2:20 PM" },
      { label: "Under Review by Dana Reyes", time: "Jul 28, 3:02 PM" },
      { label: "Resolved — Deck resealed by facilities, no further action", time: "Jul 30, 9:15 AM" },
    ],
  },
];

export const incidentTypes = [
  "Injury",
  "Rescue",
  "Chemical Issue",
  "Equipment Damage",
  "Weather Closure",
  "Rule Violation",
];

export type Message = {
  id: string;
  from: "me" | "them";
  sender?: string;
  text: string;
  time: string;
  read?: boolean;
  photo?: string;
};

export type ThreadMember = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: "online" | "away" | "offline";
};

export type Thread = {
  id: string;
  kind: "direct" | "group" | "announcement";
  name: string;
  subtitle: string;
  avatar?: string;
  unread: number;
  urgent?: boolean;
  lastTime: string;
  messages: Message[];
  members?: ThreadMember[];
};

export const threads: Thread[] = [
  {
    id: "admin-broadcast",
    kind: "announcement",
    name: "Bluecrest Admin",
    subtitle: "Heat advisory in effect today — ensure all guards are rotating shade breaks every hour.",
    unread: 1,
    urgent: true,
    lastTime: "7:42 AM",
    messages: [
      {
        id: "m1",
        from: "them",
        sender: "Bluecrest Admin",
        text: "Heat advisory in effect today — ensure all guards are rotating shade breaks every hour. Hydration stations must stay stocked at all sites.",
        time: "7:42 AM",
      },
    ],
  },
  {
    id: "dana",
    kind: "direct",
    name: "Dana Reyes",
    subtitle: "Reminder: water testing kit restock arrives today, log the new lot number",
    avatar: avatarDana,
    unread: 1,
    lastTime: "8:31 AM",
    messages: [
      {
        id: "m1",
        from: "them",
        sender: "Dana Reyes",
        text: "Morning Marcus — reminder: water testing kit restock arrives today, log the new lot number when you open the box.",
        time: "8:28 AM",
      },
      { id: "m2", from: "me", text: "Got it, thanks!", time: "8:31 AM", read: true },
    ],
  },
  {
    id: "site-group",
    kind: "group",
    name: "Manhattan Park Pool Club",
    subtitle: "Jamie: Deck chairs are set for the morning rush",
    avatar: siteManhattan,
    unread: 0,
    lastTime: "8:12 AM",
    members: [
      {
        id: "marcus",
        name: "Marcus Bennett",
        role: "Certified Lifeguard · You",
        avatar: avatarMarcus,
        status: "online",
      },
      {
        id: "dana",
        name: "Dana Reyes",
        role: "Site Supervisor",
        avatar: avatarDana,
        status: "online",
      },
      {
        id: "jamie",
        name: "Jamie Ortiz",
        role: "Certified Lifeguard",
        status: "online",
      },
      {
        id: "priya",
        name: "Priya Shah",
        role: "Certified Lifeguard",
        status: "away",
      },
      {
        id: "luis",
        name: "Luis Mendez",
        role: "Deck Attendant",
        status: "offline",
      },
    ],
    messages: [
      {
        id: "m1",
        from: "them",
        sender: "Dana Reyes",
        text: "Team — we're expecting a busy Friday. Two guards on the main pool from noon.",
        time: "7:55 AM",
      },
      {
        id: "m2",
        from: "them",
        sender: "Jamie Ortiz",
        text: "Deck chairs are set for the morning rush",
        time: "8:12 AM",
      },
    ],
  },
];

export const activity = [
  { id: "act1", text: "Chemical Storage Check completed", time: "9:12 AM" },
  { id: "act2", text: "Rescue Equipment Check completed", time: "9:10 AM" },
  { id: "act3", text: "Opening photos submitted (4)", time: "9:07 AM" },
  { id: "act4", text: "Water test logged — Main Pool", time: "9:04 AM" },
];

export const faqs = [
  {
    q: "How do I clock in?",
    a: "Open the Home tab and tap Clock In on the shift card. Allow location access so we can confirm you're on-site — your clock-in is stamped with GPS and time automatically.",
  },
  {
    q: "What if my photo won't verify my location?",
    a: "Move closer to the pool deck and wait a few seconds for GPS to settle. If it still shows outside the site radius, you can submit anyway with a short note explaining where you were — your supervisor will review it.",
  },
  {
    q: "Who do I contact if I forgot my password and I'm not near a computer?",
    a: "Use Forgot Password on the sign-in screen to get a reset link by email. If you can't access your email, call the Bluecrest office and HR will reset it for you.",
  },
  {
    q: "Why can't I upload a photo from my gallery?",
    a: "Compliance photos must be captured live with GPS and timestamp verification. Profile photos and certification documents are the only uploads that allow files from your device.",
  },
];
