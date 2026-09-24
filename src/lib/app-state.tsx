import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  incidents as seedIncidents,
  notifications as seedNotifications,
  tasks as seedTasks,
  threads as seedThreads,
  waterTests as seedWaterTests,
  type Incident,
  type Message,
  type Notification,
  type Task,
  type Thread,
  type WaterTest,
} from "@/data/bluecrest";

export type SubmittedPhoto = {
  id: string;
  typeId: string;
  label: string;
  siteId: string;
  dataUrl: string;
  timestamp: string;
  coords: string;
  address: string;
  verified: boolean;
  approval: "approved" | "pending";
  note?: string;
};

type AppState = {
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;

  clockedInAt: number | null;
  activeSiteId: string;
  setActiveSiteId: (id: string) => void;
  clockIn: (siteId: string) => void;
  clockOut: () => void;

  tasks: Task[];
  completeTask: (taskId: string) => void;

  notifications: Notification[];
  markAllRead: () => void;
  dismissNotification: (id: string) => void;

  waterTests: WaterTest[];
  addWaterTest: (t: WaterTest) => void;

  photos: SubmittedPhoto[];
  addPhoto: (p: SubmittedPhoto) => void;

  captures: Record<string, string>;
  setCapture: (slot: string, dataUrl: string) => void;
  clearCapture: (slot: string) => void;

  threads: Thread[];
  sendMessage: (threadId: string, msg: Message) => void;
  openThread: (threadId: string) => void;

  incidents: Incident[];
  addIncident: (i: Incident) => void;

  broadcastAcknowledged: boolean;
  acknowledgeBroadcast: () => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [clockedInAt, setClockedInAt] = useState<number | null>(null);
  const [activeSiteId, setActiveSiteId] = useState("manhattan-park");
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [waterTests, setWaterTests] = useState<WaterTest[]>(seedWaterTests);
  const [photos, setPhotos] = useState<SubmittedPhoto[]>([]);
  const [captures, setCaptures] = useState<Record<string, string>>({});
  const [threads, setThreads] = useState<Thread[]>(seedThreads);
  const [incidents, setIncidents] = useState<Incident[]>(seedIncidents);
  const [broadcastAcknowledged, setBroadcastAcknowledged] = useState(false);

  const value = useMemo<AppState>(
    () => ({
      signedIn,
      signIn: () => setSignedIn(true),
      signOut: () => {
        setSignedIn(false);
        setClockedInAt(null);
      },
      clockedInAt,
      activeSiteId,
      setActiveSiteId,
      clockIn: (siteId: string) => {
        setActiveSiteId(siteId);
        setClockedInAt(Date.now());
      },
      clockOut: () => setClockedInAt(null),
      tasks,
      completeTask: (taskId: string) =>
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: t.requiresSignoff ? "review" : "completed",
                  completedTime: new Date().toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  }),
                }
              : t,
          ),
        ),
      notifications,
      markAllRead: () =>
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false }))),
      dismissNotification: (id: string) =>
        setNotifications((prev) => prev.filter((n) => n.id !== id)),
      waterTests,
      addWaterTest: (t: WaterTest) => setWaterTests((prev) => [t, ...prev]),
      photos,
      addPhoto: (p: SubmittedPhoto) => setPhotos((prev) => [p, ...prev]),
      captures,
      setCapture: (slot: string, dataUrl: string) =>
        setCaptures((prev) => ({ ...prev, [slot]: dataUrl })),
      clearCapture: (slot: string) =>
        setCaptures((prev) => {
          const next = { ...prev };
          delete next[slot];
          return next;
        }),
      threads,
      sendMessage: (threadId: string, msg: Message) =>
        setThreads((prev) =>
          prev.map((t) =>
            t.id === threadId
              ? { ...t, messages: [...t.messages, msg], lastTime: msg.time, subtitle: msg.text }
              : t,
          ),
        ),
      openThread: (threadId: string) =>
        setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t))),
      incidents,
      addIncident: (i: Incident) => setIncidents((prev) => [i, ...prev]),
      broadcastAcknowledged,
      acknowledgeBroadcast: () => setBroadcastAcknowledged(true),
    }),
    [
      signedIn,
      clockedInAt,
      activeSiteId,
      tasks,
      notifications,
      waterTests,
      photos,
      captures,
      threads,
      incidents,
      broadcastAcknowledged,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppStateProvider");
  return ctx;
}

export function useElapsed(since: number | null) {
  const [, force] = useState(0);
  const tick = useCallback(() => force((n) => n + 1), []);
  useIntervalEffect(tick, since ? 1000 : null);
  if (!since) return "00:00:00";
  const s = Math.floor((Date.now() - since) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

import { useEffect } from "react";
function useIntervalEffect(fn: () => void, delay: number | null) {
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(fn, delay);
    return () => clearInterval(id);
  }, [fn, delay]);
}
