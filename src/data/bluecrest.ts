import siteManhattan from "@/assets/site-manhattan-park.jpg";
import siteSoho from "@/assets/site-soho-house.jpg";
import siteBruckner from "@/assets/site-bruckner.jpg";
import avatarSarah from "@/assets/avatar-sarah.jpg";
import avatarDana from "@/assets/avatar-dana.jpg";
import photoOpening from "@/assets/site-manhattan-park.jpg";
import photoEquipment from "@/assets/onboarding-equipment.jpg";
import photoChemical from "@/assets/photo-chemical.jpg";
import photoDeck from "@/assets/site-soho-house.jpg";
import photoFilterBefore from "@/assets/onboarding-equipment.jpg";
import photoFilterAfter from "@/assets/site-manhattan-park.jpg";

export const brand = {
  company: "Bluecrest Amenity Management",
  address: "105-25 91st St, Ozone Park, NY 11417",
  phone: "(718) 555-0142",
  email: "clients@bluecrestamenity.com",
  website: "bluecrestamenity.com",
  version: "1.0.0",
};

/** App “today” for demo timestamps — aligned with the rest of the Bluecrest product family. */
export const appToday = new Date(2026, 7, 6); // Thu Aug 6, 2026

export const client = {
  id: "CL-2048",
  name: "Sarah Kim",
  firstName: "Sarah",
  title: "Property Manager",
  company: "Related Property Group",
  email: "s.kim@related.com",
  phone: "(212) 555-0194",
  avatar: avatarSarah,
  billingAddress: "60 Columbus Circle, New York, NY 10023",
};

export const representative = {
  id: "dana",
  name: "Dana Reyes",
  title: "Field Supervisor",
  role: "Field Supervisor",
  avatar: avatarDana,
  phone: "(718) 555-0177",
  email: "d.reyes@bluecrestamenity.com",
};

export type ComplianceStatus = "compliant" | "attention";

export type AmenityType = "Main Pool" | "Spa" | "Kiddie Pool" | "Rooftop Pool";

export type WaterReading = {
  time: string;
  date: string;
  chlorine: number;
  ph: number;
  temp: number;
  status: "ok" | "watch";
};

export type Amenity = {
  id: string;
  propertyId: string;
  name: string;
  type: AmenityType;
  photo: string;
  waterStatus: "safe" | "watch";
  lastTested: string;
  lastTestedLabel: string;
  readings: { chlorine: number; ph: number; temp: number };
  history: WaterReading[];
};

export type Property = {
  id: string;
  name: string;
  address: string;
  photo: string;
  compliance: ComplianceStatus;
  amenityIds: string[];
  coords: { lat: number; lng: number };
  mapsQuery: string;
};

export const properties: Property[] = [
  {
    id: "manhattan-park",
    name: "Manhattan Park Pool Club",
    address: "40 River Rd, Roosevelt Island, NY 10044",
    photo: siteManhattan,
    compliance: "compliant",
    amenityIds: ["mp-main", "mp-spa"],
    coords: { lat: 40.7616, lng: -73.9505 },
    mapsQuery: "40 River Rd, Roosevelt Island, NY 10044",
  },
  {
    id: "soho-house",
    name: "Soho House Rooftop",
    address: "29-35 9th Ave, New York, NY 10014",
    photo: siteSoho,
    compliance: "attention",
    amenityIds: ["sh-roof", "sh-spa"],
    coords: { lat: 40.7409, lng: -74.0078 },
    mapsQuery: "29-35 9th Ave, New York, NY 10014",
  },
  {
    id: "bruckner",
    name: "25 Bruckner",
    address: "25 Bruckner Blvd, Bronx, NY 10454",
    photo: siteBruckner,
    compliance: "compliant",
    amenityIds: ["br-main"],
    coords: { lat: 40.8062, lng: -73.9201 },
    mapsQuery: "25 Bruckner Blvd, Bronx, NY 10454",
  },
];

export const amenities: Amenity[] = [
  {
    id: "mp-main",
    propertyId: "manhattan-park",
    name: "Main Pool",
    type: "Main Pool",
    photo: siteManhattan,
    waterStatus: "safe",
    lastTested: "2026-08-06T09:04:00",
    lastTestedLabel: "Today, 9:04 AM",
    readings: { chlorine: 2.4, ph: 7.4, temp: 81 },
    history: [
      { time: "9:04 AM", date: "Aug 6", chlorine: 2.4, ph: 7.4, temp: 81, status: "ok" },
      { time: "3:00 PM", date: "Aug 5", chlorine: 2.2, ph: 7.5, temp: 82, status: "ok" },
      { time: "11:00 AM", date: "Aug 5", chlorine: 2.1, ph: 7.4, temp: 81, status: "ok" },
      { time: "9:05 AM", date: "Aug 4", chlorine: 2.6, ph: 7.3, temp: 80, status: "ok" },
      { time: "3:05 PM", date: "Aug 3", chlorine: 1.9, ph: 7.6, temp: 82, status: "ok" },
      { time: "9:03 AM", date: "Aug 2", chlorine: 2.3, ph: 7.4, temp: 81, status: "ok" },
    ],
  },
  {
    id: "mp-spa",
    propertyId: "manhattan-park",
    name: "Spa",
    type: "Spa",
    photo: photoEquipment,
    waterStatus: "safe",
    lastTested: "2026-08-06T09:10:00",
    lastTestedLabel: "Today, 9:10 AM",
    readings: { chlorine: 3.1, ph: 7.5, temp: 102 },
    history: [
      { time: "9:10 AM", date: "Aug 6", chlorine: 3.1, ph: 7.5, temp: 102, status: "ok" },
      { time: "4:58 PM", date: "Aug 5", chlorine: 2.9, ph: 7.4, temp: 101, status: "ok" },
      { time: "9:12 AM", date: "Aug 4", chlorine: 3.2, ph: 7.6, temp: 103, status: "ok" },
    ],
  },
  {
    id: "sh-roof",
    propertyId: "soho-house",
    name: "Rooftop Pool",
    type: "Rooftop Pool",
    photo: siteSoho,
    waterStatus: "safe",
    lastTested: "2026-08-05T11:15:00",
    lastTestedLabel: "Yesterday, 11:15 AM",
    readings: { chlorine: 2.0, ph: 7.5, temp: 80 },
    history: [
      { time: "11:15 AM", date: "Aug 5", chlorine: 2.0, ph: 7.5, temp: 80, status: "ok" },
      { time: "3:20 PM", date: "Aug 4", chlorine: 2.2, ph: 7.4, temp: 81, status: "ok" },
      { time: "11:10 AM", date: "Aug 3", chlorine: 1.8, ph: 7.6, temp: 80, status: "ok" },
    ],
  },
  {
    id: "sh-spa",
    propertyId: "soho-house",
    name: "Spa",
    type: "Spa",
    photo: photoEquipment,
    waterStatus: "safe",
    lastTested: "2026-08-05T11:22:00",
    lastTestedLabel: "Yesterday, 11:22 AM",
    readings: { chlorine: 2.8, ph: 7.4, temp: 101 },
    history: [
      { time: "11:22 AM", date: "Aug 5", chlorine: 2.8, ph: 7.4, temp: 101, status: "ok" },
      { time: "3:28 PM", date: "Aug 4", chlorine: 3.0, ph: 7.5, temp: 102, status: "ok" },
    ],
  },
  {
    id: "br-main",
    propertyId: "bruckner",
    name: "Main Pool",
    type: "Main Pool",
    photo: siteBruckner,
    waterStatus: "safe",
    lastTested: "2026-08-04T10:40:00",
    lastTestedLabel: "Tue, 10:40 AM",
    readings: { chlorine: 2.5, ph: 7.4, temp: 79 },
    history: [
      { time: "10:40 AM", date: "Aug 4", chlorine: 2.5, ph: 7.4, temp: 79, status: "ok" },
      { time: "2:15 PM", date: "Aug 2", chlorine: 2.3, ph: 7.5, temp: 80, status: "ok" },
      { time: "10:30 AM", date: "Aug 1", chlorine: 2.6, ph: 7.3, temp: 79, status: "ok" },
    ],
  },
];

export type InspectionResult = "passed" | "notes" | "issue";

export type ChecklistResult = {
  id: string;
  label: string;
  status: "pass" | "fail" | "complete" | "note";
};

export type InspectionPhoto = {
  id: string;
  src: string;
  label: string;
  timestamp: string;
  inspectionId: string;
  propertyId: string;
  amenityId: string;
};

export type Inspection = {
  id: string;
  propertyId: string;
  amenityId: string;
  date: string;
  dateIso: string;
  time: string;
  inspector: string;
  result: InspectionResult;
  notes?: string;
  checklist: ChecklistResult[];
  photoIds: string[];
};

export const inspectionPhotos: InspectionPhoto[] = [
  {
    id: "ph-open",
    src: photoOpening,
    label: "Opening — Pool",
    timestamp: "Aug 6, 2026 · 9:06 AM",
    inspectionId: "insp-today",
    propertyId: "manhattan-park",
    amenityId: "mp-main",
  },
  {
    id: "ph-equip",
    src: photoEquipment,
    label: "Opening — Equipment Room",
    timestamp: "Aug 6, 2026 · 9:07 AM",
    inspectionId: "insp-today",
    propertyId: "manhattan-park",
    amenityId: "mp-main",
  },
  {
    id: "ph-chem",
    src: photoChemical,
    label: "Opening — Chemical Storage",
    timestamp: "Aug 6, 2026 · 9:08 AM",
    inspectionId: "insp-today",
    propertyId: "manhattan-park",
    amenityId: "mp-main",
  },
  {
    id: "ph-soho-5",
    src: siteSoho,
    label: "Opening — Rooftop Pool",
    timestamp: "Aug 5, 2026 · 11:18 AM",
    inspectionId: "insp-soho-5",
    propertyId: "soho-house",
    amenityId: "sh-roof",
  },
  {
    id: "ph-bruck-4",
    src: siteBruckner,
    label: "Opening — Main Pool",
    timestamp: "Aug 4, 2026 · 10:42 AM",
    inspectionId: "insp-bruck-4",
    propertyId: "bruckner",
    amenityId: "br-main",
  },
  {
    id: "ph-soho-deck",
    src: siteSoho,
    label: "Deck — North stairs",
    timestamp: "Aug 3, 2026 · 11:19 AM",
    inspectionId: "insp-soho-3",
    propertyId: "soho-house",
    amenityId: "sh-roof",
  },
  {
    id: "ph-mp-spa",
    src: photoEquipment,
    label: "Spa — Equipment check",
    timestamp: "Aug 4, 2026 · 9:14 AM",
    inspectionId: "insp-mp-4",
    propertyId: "manhattan-park",
    amenityId: "mp-spa",
  },
];

const openingChecklist: ChecklistResult[] = [
  { id: "gate", label: "Pool gate and fencing inspected", status: "pass" },
  { id: "water", label: "Water quality within safe range", status: "pass" },
  { id: "rescue", label: "Rescue equipment present and ready", status: "pass" },
  { id: "firstaid", label: "First aid kit stocked", status: "pass" },
  { id: "signage", label: "Safety signage in place", status: "complete" },
  { id: "storage", label: "Chemical storage secured", status: "pass" },
];

export const inspections: Inspection[] = [
  {
    id: "insp-today",
    propertyId: "manhattan-park",
    amenityId: "mp-main",
    date: "Today",
    dateIso: "2026-08-06",
    time: "9:05 AM",
    inspector: "Marcus Bennett",
    result: "passed",
    notes: "Deck and equipment room in excellent order. Opening photos attached.",
    checklist: openingChecklist,
    photoIds: ["ph-open", "ph-equip", "ph-chem"],
  },
  {
    id: "insp-soho-5",
    propertyId: "soho-house",
    amenityId: "sh-roof",
    date: "Yesterday",
    dateIso: "2026-08-05",
    time: "11:16 AM",
    inspector: "Jamie Ortiz",
    result: "notes",
    notes:
      "Water quality is within range. Follow-up on the loose north-stair deck tile is already assigned to a technician.",
    checklist: [
      { id: "gate", label: "Pool gate and fencing inspected", status: "pass" },
      { id: "water", label: "Water quality within safe range", status: "pass" },
      { id: "deck", label: "Deck surfaces clear and secure", status: "note" },
      { id: "rescue", label: "Rescue equipment present and ready", status: "pass" },
      { id: "signage", label: "Safety signage in place", status: "complete" },
    ],
    photoIds: ["ph-soho-5"],
  },
  {
    id: "insp-bruck-4",
    propertyId: "bruckner",
    amenityId: "br-main",
    date: "Tue, Aug 4",
    dateIso: "2026-08-04",
    time: "10:40 AM",
    inspector: "Priya Shah",
    result: "passed",
    checklist: openingChecklist,
    photoIds: ["ph-bruck-4"],
  },
  {
    id: "insp-mp-5",
    propertyId: "manhattan-park",
    amenityId: "mp-main",
    date: "Yesterday",
    dateIso: "2026-08-05",
    time: "9:04 AM",
    inspector: "Marcus Bennett",
    result: "passed",
    checklist: openingChecklist,
    photoIds: [],
  },
  {
    id: "insp-mp-4",
    propertyId: "manhattan-park",
    amenityId: "mp-spa",
    date: "Tue, Aug 4",
    dateIso: "2026-08-04",
    time: "9:12 AM",
    inspector: "Marcus Bennett",
    result: "passed",
    checklist: openingChecklist,
    photoIds: ["ph-mp-spa"],
  },
  {
    id: "insp-soho-3",
    propertyId: "soho-house",
    amenityId: "sh-roof",
    date: "Mon, Aug 3",
    dateIso: "2026-08-03",
    time: "11:08 AM",
    inspector: "Jamie Ortiz",
    result: "issue",
    notes: "Loose deck tile reported near the north stairs. Issue opened for facilities.",
    checklist: [
      { id: "gate", label: "Pool gate and fencing inspected", status: "pass" },
      { id: "water", label: "Water quality within safe range", status: "pass" },
      { id: "deck", label: "Deck surfaces clear and secure", status: "fail" },
      { id: "rescue", label: "Rescue equipment present and ready", status: "pass" },
    ],
    photoIds: ["ph-soho-deck"],
  },
  {
    id: "insp-mp-3",
    propertyId: "manhattan-park",
    amenityId: "mp-main",
    date: "Mon, Aug 3",
    dateIso: "2026-08-03",
    time: "9:03 AM",
    inspector: "Marcus Bennett",
    result: "notes",
    notes: "Afternoon water test required a brief corrective action; retested within range the same day.",
    checklist: openingChecklist.map((c) =>
      c.id === "water" ? { ...c, status: "note" as const } : c,
    ),
    photoIds: [],
  },
  {
    id: "insp-bruck-1",
    propertyId: "bruckner",
    amenityId: "br-main",
    date: "Sat, Aug 1",
    dateIso: "2026-08-01",
    time: "10:30 AM",
    inspector: "Priya Shah",
    result: "passed",
    checklist: openingChecklist,
    photoIds: [],
  },
];

/** Client-friendly 90-day rollup used on the history / trend screen. */
export const inspectionTrend = {
  windowLabel: "Last 90 days",
  passedClean: 22,
  total: 24,
};

export type Priority = "Low" | "Medium" | "High" | "Critical";
export type IssueStatus = "Open" | "In Progress" | "Resolved";

export type TimelineStep = {
  label: string;
  time: string;
  done: boolean;
};

export type Comment = {
  id: string;
  from: "me" | "them";
  sender: string;
  text: string;
  time: string;
};

export type Issue = {
  id: string;
  type: string;
  title: string;
  propertyId: string;
  amenityId?: string;
  description: string;
  priority: Priority;
  status: IssueStatus;
  date: string;
  reportedAgo: string;
  photos: string[];
  timeline: TimelineStep[];
  comments: Comment[];
  threadId: string;
};

export const issues: Issue[] = [
  {
    id: "iss-1",
    type: "Deck / Surfaces",
    title: "Pool deck tile slightly loose near the north stairs",
    propertyId: "soho-house",
    amenityId: "sh-roof",
    description:
      "A single deck tile near the north stairs has a slight give underfoot. The area is marked and guests are being directed around it. A technician has been assigned and resolution is expected this week.",
    priority: "Medium",
    status: "In Progress",
    date: "Aug 3, 2026",
    reportedAgo: "3 days ago",
    photos: [photoDeck],
    timeline: [
      { label: "Reported during inspection", time: "Aug 3 · 11:20 AM", done: true },
      { label: "Assigned to technician", time: "Aug 3 · 2:40 PM", done: true },
      { label: "Expected resolution this week", time: "In progress", done: false },
    ],
    comments: [
      {
        id: "c1",
        from: "them",
        sender: "Dana Reyes",
        text: "We've marked the tile and scheduled a mason for Thursday morning. I'll send photos once it's reset.",
        time: "Aug 4 · 9:12 AM",
      },
    ],
    threadId: "issue-iss-1",
  },
];

export type RequestStatus = "Submitted" | "Acknowledged" | "In Progress" | "Completed";
export type RequestPriority = "Standard" | "Urgent";

export type ServiceRequest = {
  id: string;
  number: string;
  title: string;
  propertyId: string;
  amenityId?: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  submitted: string;
  submittedIso: string;
  notes?: string;
  photos: string[];
  comments: Comment[];
  threadId: string;
};

export const serviceRequests: ServiceRequest[] = [
  {
    id: "req-1042",
    number: "1042",
    title: "Additional pool furniture inspection before rooftop event",
    propertyId: "bruckner",
    amenityId: "br-main",
    description:
      "Requesting additional pool furniture inspection before our rooftop event on Aug 20. Please confirm lounge chairs and umbrellas are guest-ready.",
    priority: "Standard",
    status: "Acknowledged",
    submitted: "Aug 5, 2026",
    submittedIso: "2026-08-05",
    notes: "Dana confirmed the request. A walkthrough is scheduled for Aug 18.",
    photos: [],
    comments: [
      {
        id: "c1",
        from: "them",
        sender: "Dana Reyes",
        text: "Received — we'll do a dedicated furniture walkthrough on Aug 18 and send photos.",
        time: "Aug 5 · 4:20 PM",
      },
    ],
    threadId: "request-req-1042",
  },
  {
    id: "req-1043",
    number: "1043",
    title: "Please confirm weekend staffing for holiday weekend",
    propertyId: "manhattan-park",
    description:
      "Can you confirm lifeguard coverage for the Saturday–Monday holiday weekend so we can brief residents?",
    priority: "Urgent",
    status: "Submitted",
    submitted: "Today",
    submittedIso: "2026-08-06",
    photos: [],
    comments: [],
    threadId: "request-req-1043",
  },
];

export type WorkOrderStatus = "Scheduled" | "In Progress" | "Completed";

export type WorkOrder = {
  id: string;
  title: string;
  propertyId: string;
  amenityId?: string;
  description: string;
  scheduled: string;
  status: WorkOrderStatus;
  progressNotes: string[];
  completionNote?: string;
  photos: { src: string; label: string }[];
};

export const workOrders: WorkOrder[] = [
  {
    id: "wo-1",
    title: "Filter replacement — Main Pool",
    propertyId: "manhattan-park",
    amenityId: "mp-main",
    description:
      "Scheduled cartridge filter replacement on the main pool circulation system, followed by a full water-quality retest.",
    scheduled: "Aug 5, 2026",
    status: "Completed",
    progressNotes: [
      "Aug 5 · 8:30 AM — Technician on site, system isolated.",
      "Aug 5 · 10:15 AM — New filter installed and primed.",
    ],
    completionNote:
      "Filter replaced and system back online. Water retested within safe range. Deck and equipment room restored.",
    photos: [
      { src: photoFilterBefore, label: "Before" },
      { src: photoFilterAfter, label: "After" },
    ],
  },
  {
    id: "wo-2",
    title: "North-stair deck tile reset",
    propertyId: "soho-house",
    amenityId: "sh-roof",
    description: "Reset and reseal the loose tile reported near the north stairs.",
    scheduled: "Aug 7, 2026",
    status: "Scheduled",
    progressNotes: ["Materials confirmed. Mason booked for Thursday morning."],
    photos: [],
  },
];

export type NotificationType =
  | "inspection"
  | "issue"
  | "work"
  | "request"
  | "announcement";

export type Notification = {
  id: string;
  group: "Today" | "Yesterday" | "Earlier";
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  href:
    | { to: "/inspection/$inspectionId"; params: { inspectionId: string } }
    | { to: "/issue/$issueId"; params: { issueId: string } }
    | { to: "/work-order/$workOrderId"; params: { workOrderId: string } }
    | { to: "/request/$requestId"; params: { requestId: string } }
    | { to: "/thread/$threadId"; params: { threadId: string } };
};

export const notifications: Notification[] = [
  {
    id: "n1",
    group: "Today",
    type: "inspection",
    title: "New inspection completed at Manhattan Park Pool Club",
    description: "Main Pool · Passed · Marcus Bennett",
    time: "9:05 AM",
    unread: true,
    href: { to: "/inspection/$inspectionId", params: { inspectionId: "insp-today" } },
  },
  {
    id: "n2",
    group: "Today",
    type: "request",
    title: "Your service request #1042 has been updated",
    description: "Status is now Acknowledged",
    time: "Yesterday",
    unread: true,
    href: { to: "/request/$requestId", params: { requestId: "req-1042" } },
  },
  {
    id: "n3",
    group: "Yesterday",
    type: "work",
    title: "Work order completed at Manhattan Park Pool Club",
    description: "Filter replacement — Main Pool",
    time: "Yesterday",
    unread: true,
    href: { to: "/work-order/$workOrderId", params: { workOrderId: "wo-1" } },
  },
  {
    id: "n4",
    group: "Yesterday",
    type: "issue",
    title: "New issue reported at Soho House Rooftop",
    description: "Pool deck tile slightly loose near the north stairs",
    time: "3d ago",
    unread: false,
    href: { to: "/issue/$issueId", params: { issueId: "iss-1" } },
  },
  {
    id: "n5",
    group: "Earlier",
    type: "announcement",
    title: "Important announcement from Bluecrest",
    description: "Holiday weekend coverage schedule is now posted.",
    time: "5d ago",
    unread: false,
    href: { to: "/thread/$threadId", params: { threadId: "announcements" } },
  },
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

export type ThreadKind = "direct" | "announcement" | "issue" | "request";

export type ThreadContext = {
  label: string;
  to: "/issue/$issueId" | "/request/$requestId";
  params: { issueId?: string; requestId?: string };
};

export type Thread = {
  id: string;
  kind: ThreadKind;
  name: string;
  subtitle: string;
  title?: string;
  avatar?: string;
  unread: number;
  lastTime: string;
  pinned?: boolean;
  context?: ThreadContext;
  messages: Message[];
};

export const threads: Thread[] = [
  {
    id: "announcements",
    kind: "announcement",
    name: "Announcements",
    title: "Bluecrest",
    subtitle: "Holiday weekend coverage schedule is now posted for all Related properties.",
    unread: 0,
    lastTime: "Sat",
    pinned: true,
    messages: [
      {
        id: "m1",
        from: "them",
        sender: "Bluecrest",
        text: "Holiday weekend coverage schedule is now posted for all Related properties. Standard hours apply Saturday–Monday. Reach out if you need a staffing confirmation letter for residents.",
        time: "Sat · 10:02 AM",
      },
    ],
  },
  {
    id: "dana",
    kind: "direct",
    name: "Dana Reyes",
    title: "Field Supervisor",
    subtitle:
      "Hi Sarah, just confirming the filter replacement at Manhattan Park is complete and tested — everything's back to normal range. Let me know if you have any questions!",
    avatar: avatarDana,
    unread: 1,
    lastTime: "Yesterday",
    messages: [
      {
        id: "m1",
        from: "them",
        sender: "Dana Reyes",
        text: "Hi Sarah, just confirming the filter replacement at Manhattan Park is complete and tested — everything's back to normal range. Let me know if you have any questions!",
        time: "Yesterday · 4:48 PM",
      },
    ],
  },
  {
    id: "issue-iss-1",
    kind: "issue",
    name: "Soho House — Deck tile",
    title: "Issue follow-up",
    subtitle: "We've marked the tile and scheduled a mason for Thursday morning.",
    unread: 0,
    lastTime: "Aug 4",
    context: {
      label: "Re: Deck tile — Soho House Rooftop",
      to: "/issue/$issueId",
      params: { issueId: "iss-1" },
    },
    messages: [
      {
        id: "m1",
        from: "them",
        sender: "Dana Reyes",
        text: "We've marked the tile and scheduled a mason for Thursday morning. I'll send photos once it's reset.",
        time: "Aug 4 · 9:12 AM",
      },
    ],
  },
  {
    id: "request-req-1042",
    kind: "request",
    name: "Request #1042",
    title: "Service request",
    subtitle: "We'll do a dedicated furniture walkthrough on Aug 18 and send photos.",
    unread: 0,
    lastTime: "Aug 5",
    context: {
      label: "Re: Service Request #1042",
      to: "/request/$requestId",
      params: { requestId: "req-1042" },
    },
    messages: [
      {
        id: "m1",
        from: "them",
        sender: "Dana Reyes",
        text: "Received — we'll do a dedicated furniture walkthrough on Aug 18 and send photos.",
        time: "Aug 5 · 4:20 PM",
      },
    ],
  },
];

export type ActivityKind = "inspection" | "request" | "message" | "work" | "issue";

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  text: string;
  time: string;
  href:
    | { to: "/inspection/$inspectionId"; params: { inspectionId: string } }
    | { to: "/request/$requestId"; params: { requestId: string } }
    | { to: "/thread/$threadId"; params: { threadId: string } }
    | { to: "/work-order/$workOrderId"; params: { workOrderId: string } }
    | { to: "/issue/$issueId"; params: { issueId: string } };
};

export const activity: ActivityItem[] = [
  {
    id: "act1",
    kind: "inspection",
    text: "Inspection completed at Manhattan Park Pool Club",
    time: "9:05 AM",
    href: { to: "/inspection/$inspectionId", params: { inspectionId: "insp-today" } },
  },
  {
    id: "act2",
    kind: "request",
    text: "Service request #1042 marked Acknowledged",
    time: "Yesterday",
    href: { to: "/request/$requestId", params: { requestId: "req-1042" } },
  },
  {
    id: "act3",
    kind: "work",
    text: "Filter replacement completed at Manhattan Park",
    time: "Yesterday",
    href: { to: "/work-order/$workOrderId", params: { workOrderId: "wo-1" } },
  },
  {
    id: "act4",
    kind: "message",
    text: "New message from Dana Reyes",
    time: "Yesterday",
    href: { to: "/thread/$threadId", params: { threadId: "dana" } },
  },
  {
    id: "act5",
    kind: "issue",
    text: "Issue opened at Soho House Rooftop",
    time: "3d ago",
    href: { to: "/issue/$issueId", params: { issueId: "iss-1" } },
  },
];

export const faqs = [
  {
    q: "How do I submit a service request?",
    a: "Open the Requests tab, stay on the Requests segment, and tap + New Request. Choose the property, describe what you need, and attach photos from your phone if helpful. Your Bluecrest representative will acknowledge it in-app.",
  },
  {
    q: "How often are my pools inspected?",
    a: "Bluecrest staff complete a full opening inspection on every scheduled service day, plus ongoing water tests throughout the shift. Each completed inspection appears in this app with photos and a plain-language result.",
  },
  {
    q: "Who do I contact for a billing question?",
    a: "Billing is handled by Bluecrest Client Services — call the office or email clients@bluecrestamenity.com. For day-to-day service questions, message Dana Reyes from the Messages tab.",
  },
  {
    q: "How do I add another property?",
    a: "Open the Properties tab and tap + to add a building you manage. Bluecrest will confirm it against your service agreement. You can also message Dana Reyes if you need it attached right away.",
  },
];

export function propertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

export function amenityById(id: string): Amenity | undefined {
  return amenities.find((a) => a.id === id);
}

export function amenitiesFor(propertyId: string): Amenity[] {
  return amenities.filter((a) => a.propertyId === propertyId);
}

export function inspectionById(id: string): Inspection | undefined {
  return inspections.find((i) => i.id === id);
}

export function photosForInspection(id: string): InspectionPhoto[] {
  return inspectionPhotos.filter((p) => p.inspectionId === id);
}

export function greeting(now = new Date()): string {
  const h = now.getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export function resultLabel(result: InspectionResult): string {
  if (result === "passed") return "Passed";
  if (result === "notes") return "Passed with Notes";
  return "Issue Found";
}

export function resultTone(result: InspectionResult): "green" | "amber" | "red" {
  if (result === "passed") return "green";
  if (result === "notes") return "amber";
  return "red";
}

export function priorityTone(p: Priority): "neutral" | "amber" | "red" {
  if (p === "Low") return "neutral";
  if (p === "Medium") return "amber";
  return "red";
}

export function issueStatusTone(s: IssueStatus): "red" | "amber" | "green" {
  if (s === "Open") return "red";
  if (s === "In Progress") return "amber";
  return "green";
}

export function requestStatusTone(s: RequestStatus): "neutral" | "blue" | "amber" | "green" {
  if (s === "Submitted") return "neutral";
  if (s === "Acknowledged") return "blue";
  if (s === "In Progress") return "amber";
  return "green";
}

export function workStatusTone(s: WorkOrderStatus): "blue" | "amber" | "green" {
  if (s === "Scheduled") return "blue";
  if (s === "In Progress") return "amber";
  return "green";
}

export function mapsUrl(query: string): string {
  return `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
}

/** Inclusive lookback from the demo "today" (Aug 6, 2026). */
export function withinDays(dateIso: string, days: number, today = appToday): boolean {
  const d = new Date(`${dateIso}T12:00:00`);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  return d >= start && d <= end;
}

export const requestSteps: RequestStatus[] = [
  "Submitted",
  "Acknowledged",
  "In Progress",
  "Completed",
];
