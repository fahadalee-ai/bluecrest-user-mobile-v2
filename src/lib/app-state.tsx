import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  client as seedClient,
  issues as seedIssues,
  notifications as seedNotifications,
  serviceRequests as seedRequests,
  threads as seedThreads,
  type Comment,
  type Message,
  type Notification,
  type RequestPriority,
  type ServiceRequest,
  type Thread,
  type Issue,
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

type AppState = {
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;

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

  notifPrefs: NotifPrefs;
  setNotifPref: (key: keyof NotifPrefs, value: boolean) => void;
};

const Ctx = createContext<AppState | null>(null);

function nowStamp() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
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
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    inspections: true,
    issues: true,
    work: true,
    requests: true,
    announcements: true,
  });

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
      signedIn,
      signIn: () => setSignedIn(true),
      signOut: () => setSignedIn(false),
      client,
      updateClient: (patch) => setClient((c) => ({ ...c, ...patch })),
      notifications,
      markAllRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false }))),
      dismissNotification: (id) => setNotifications((prev) => prev.filter((n) => n.id !== id)),
      threads,
      sendMessage: (threadId, msg) => appendThreadMessage(threadId, msg),
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
      notifPrefs,
      setNotifPref: (key, value) => setNotifPrefs((p) => ({ ...p, [key]: value })),
    }),
    [signedIn, client, notifications, threads, issues, requests, notifPrefs],
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
