import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  amenities as seedAmenities,
  client as seedClient,
  issues as seedIssues,
  notifications as seedNotifications,
  properties as seedProperties,
  serviceRequests as seedRequests,
  threads as seedThreads,
  type Amenity,
  type Comment,
  type Issue,
  type Message,
  type Notification,
  type Property,
  type RequestPriority,
  type ServiceRequest,
  type Thread,
} from "@/data/bluecrest";

export type ClientProfile = {
  name: string;
  firstName: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  avatar: string;
  billingAddress: string;
};

export type NotifPrefs = {
  inspections: boolean;
  issues: boolean;
  work: boolean;
  requests: boolean;
  announcements: boolean;
};

const SESSION_KEY = "bluecrest-client-session";

function loadSession() {
  if (typeof window === "undefined") return { signedIn: false, seenOnboarding: false };
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return { signedIn: false, seenOnboarding: false };
    const parsed = JSON.parse(raw) as { signedIn?: boolean; seenOnboarding?: boolean };
    return {
      signedIn: Boolean(parsed.signedIn),
      seenOnboarding: Boolean(parsed.seenOnboarding),
    };
  } catch {
    return { signedIn: false, seenOnboarding: false };
  }
}

function saveSession(next: { signedIn: boolean; seenOnboarding: boolean }) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
}

type AppState = {
  sessionReady: boolean;
  signedIn: boolean;
  seenOnboarding: boolean;
  signIn: () => void;
  signOut: () => void;
  markOnboardingSeen: () => void;

  client: ClientProfile;
  updateClient: (patch: Partial<ClientProfile>) => void;

  notifications: Notification[];
  markAllRead: () => void;
  dismissNotification: (id: string) => void;

  threads: Thread[];
  sendMessage: (threadId: string, msg: Message) => void;
  openThread: (threadId: string) => void;

  issues: Issue[];
  addIssueComment: (issueId: string, text: string) => void;

  requests: ServiceRequest[];
  addRequest: (r: ServiceRequest) => void;
  addRequestComment: (requestId: string, text: string) => void;

  properties: Property[];
  amenities: Amenity[];
  addProperty: (property: Property, extras?: Amenity[]) => void;

  notifPrefs: NotifPrefs;
  setNotifPref: (key: keyof NotifPrefs, value: boolean) => void;
};

const Ctx = createContext<AppState | null>(null);

function nowStamp() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [sessionReady, setSessionReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [seenOnboarding, setSeenOnboarding] = useState(false);
  const [client, setClient] = useState<ClientProfile>({
    name: seedClient.name,
    firstName: seedClient.firstName,
    title: seedClient.title,
    company: seedClient.company,
    email: seedClient.email,
    phone: seedClient.phone,
    avatar: seedClient.avatar,
    billingAddress: seedClient.billingAddress,
  });
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [threads, setThreads] = useState<Thread[]>(seedThreads);
  const [issues, setIssues] = useState<Issue[]>(seedIssues);
  const [requests, setRequests] = useState<ServiceRequest[]>(seedRequests);
  const [properties, setProperties] = useState<Property[]>(seedProperties);
  const [amenities, setAmenities] = useState<Amenity[]>(seedAmenities);
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    inspections: true,
    issues: true,
    work: true,
    requests: true,
    announcements: true,
  });

  useEffect(() => {
    const session = loadSession();
    setSignedIn(session.signedIn);
    setSeenOnboarding(session.seenOnboarding);
    setSessionReady(true);
  }, []);

  const persistAuth = (next: { signedIn: boolean; seenOnboarding: boolean }) => {
    setSignedIn(next.signedIn);
    setSeenOnboarding(next.seenOnboarding);
    saveSession(next);
  };

  const appendThreadMessage = (threadId: string, msg: Message, create?: Partial<Thread>) => {
    setThreads((prev) => {
      const exists = prev.some((t) => t.id === threadId);
      if (!exists && create) {
        return [
          {
            id: threadId,
            kind: create.kind ?? "direct",
            name: create.name ?? "Bluecrest",
            subtitle: msg.text,
            unread: 0,
            lastTime: msg.time,
            messages: [msg],
            ...create,
          },
          ...prev,
        ];
      }
      return prev.map((t) =>
        t.id === threadId
          ? { ...t, messages: [...t.messages, msg], lastTime: msg.time, subtitle: msg.text }
          : t,
      );
    });
  };

  const value = useMemo<AppState>(
    () => ({
      sessionReady,
      signedIn,
      seenOnboarding,
      signIn: () => persistAuth({ signedIn: true, seenOnboarding: true }),
      signOut: () => persistAuth({ signedIn: false, seenOnboarding: true }),
      markOnboardingSeen: () => persistAuth({ signedIn, seenOnboarding: true }),
      client,
      updateClient: (patch) => setClient((c) => ({ ...c, ...patch })),
      notifications,
      markAllRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false }))),
      dismissNotification: (id) => setNotifications((prev) => prev.filter((n) => n.id !== id)),
      threads,
      sendMessage: (threadId, msg) => {
        appendThreadMessage(threadId, msg);
        if (msg.from !== "me") return;
        const comment: Comment = {
          id: msg.id,
          from: "me",
          sender: client.name,
          text: msg.text,
          time: msg.time,
        };
        if (threadId.startsWith("issue-")) {
          const issueId = threadId.slice("issue-".length);
          setIssues((prev) =>
            prev.map((i) =>
              i.id === issueId && !i.comments.some((c) => c.id === comment.id)
                ? { ...i, comments: [...i.comments, comment] }
                : i,
            ),
          );
        }
        if (threadId.startsWith("request-")) {
          const requestId = threadId.slice("request-".length);
          setRequests((prev) =>
            prev.map((r) =>
              r.id === requestId && !r.comments.some((c) => c.id === comment.id)
                ? { ...r, comments: [...r.comments, comment] }
                : r,
            ),
          );
        }
      },
      openThread: (threadId) =>
        setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t))),
      issues,
      addIssueComment: (issueId, text) => {
        const comment: Comment = {
          id: `c-${Date.now()}`,
          from: "me",
          sender: client.name,
          text,
          time: nowStamp(),
        };
        setIssues((prev) =>
          prev.map((i) => (i.id === issueId ? { ...i, comments: [...i.comments, comment] } : i)),
        );
        appendThreadMessage(
          `issue-${issueId}`,
          { id: comment.id, from: "me", sender: client.name, text, time: comment.time, read: false },
          { kind: "issue", name: "Issue follow-up" },
        );
      },
      requests,
      addRequest: (r) => {
        setRequests((prev) => [r, ...prev]);
        if (r.comments[0]) {
          appendThreadMessage(
            r.threadId,
            {
              id: r.comments[0].id,
              from: "me",
              sender: client.name,
              text: r.description,
              time: r.comments[0].time,
              read: false,
            },
            {
              kind: "request",
              name: `Request #${r.number}`,
              context: {
                label: `Re: Service Request #${r.number}`,
                to: "/request/$requestId",
                params: { requestId: r.id },
              },
            },
          );
        }
      },
      addRequestComment: (requestId, text) => {
        const comment: Comment = {
          id: `c-${Date.now()}`,
          from: "me",
          sender: client.name,
          text,
          time: nowStamp(),
        };
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId ? { ...r, comments: [...r.comments, comment] } : r,
          ),
        );
        appendThreadMessage(`request-${requestId}`, {
          id: comment.id,
          from: "me",
          sender: client.name,
          text,
          time: comment.time,
          read: false,
        });
      },
      properties,
      amenities,
      addProperty: (property, extras = []) => {
        setProperties((prev) => [property, ...prev]);
        if (extras.length) setAmenities((prev) => [...prev, ...extras]);
      },
      notifPrefs,
      setNotifPref: (key, value) => setNotifPrefs((p) => ({ ...p, [key]: value })),
    }),
    [sessionReady, signedIn, seenOnboarding, client, notifications, threads, issues, requests, properties, amenities, notifPrefs],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppStateProvider");
  return ctx;
}

export type NewRequestDraft = {
  propertyId: string;
  amenityId: string;
  title: string;
  description: string;
  priority: RequestPriority;
  photos: string[];
};
