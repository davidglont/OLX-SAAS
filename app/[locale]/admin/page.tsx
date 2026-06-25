"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Users, BarChart2, Zap, FileText, Shield, X, ChevronDown, RefreshCw } from "lucide-react";

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  plan: string;
  role: string;
  usageLimit: number | null;
  createdAt: string;
  usageLogs: { count: number }[];
  _count: { listings: number };
}

interface Stats {
  totalUsers: number;
  totalListings: number;
  todayAnalyses: number;
  weekAnalyses: number;
  planBreakdown: { plan: string; count: number }[];
}

const PLAN_COLORS: Record<string, string> = {
  free: "rgba(139,139,139,0.15)",
  pro: "rgba(212,153,26,0.18)",
  proplus: "rgba(212,153,26,0.28)",
  business: "rgba(16,185,129,0.18)",
};
const PLAN_TEXT: Record<string, string> = {
  free: "#888",
  pro: "var(--primary-light)",
  proplus: "#F0B429",
  business: "#34D399",
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [editPlan, setEditPlan] = useState("free");
  const [editRole, setEditRole] = useState("user");
  const [editLimit, setEditLimit] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [s, u] = await Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
    ]);
    setStats(s);
    setUsers(Array.isArray(u) ? u : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/" + locale);
      return;
    }
    fetchData();
  }, [status, session, router, locale, fetchData]);

  function openEdit(u: UserRow) {
    setEditUser(u);
    setEditPlan(u.plan);
    setEditRole(u.role);
    setEditLimit(u.usageLimit === null ? "" : String(u.usageLimit));
  }

  async function saveEdit() {
    if (!editUser) return;
    setSaving(true);
    const usageLimit = editLimit === "" ? null : editLimit === "-1" ? -1 : parseInt(editLimit, 10);
    await fetch("/api/admin/users/" + editUser.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: editPlan, role: editRole, usageLimit }),
    });
    setSaving(false);
    setEditUser(null);
    fetchData();
  }

  const filtered = users.filter(
    (u) => !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (status === "loading" || loading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid rgba(212,153,26,0.3)", borderTop: "3px solid var(--primary-light)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg,#D4991A,#A67800)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontFamily: "Rubik,sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--color-foreground)", margin: 0 }}>Admin Panel</h1>
            <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)", margin: 0 }}>AnuntAI — Control total</p>
          </div>
        </div>
        <button onClick={fetchData} style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.25)", borderRadius: "10px", padding: "8px 14px", cursor: "pointer", color: "var(--primary-light)", fontSize: "13px", fontWeight: 600 }}>
          <RefreshCw size={14} /> Reimprospateaza
        </button>
      </div>

      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Utilizatori totali", value: stats.totalUsers, icon: Users, color: "#D4991A" },
            { label: "Anunturi generate", value: stats.totalListings, icon: FileText, color: "#34D399" },
            { label: "Analize azi", value: stats.todayAnalyses, icon: Zap, color: "#F0B429" },
            { label: "Analize (7 zile)", value: stats.weekAnalyses, icon: BarChart2, color: "#A78BFA" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card" style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{ fontSize: "26px", fontWeight: 800, fontFamily: "Rubik,sans-serif", color: "var(--color-foreground)", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginTop: "4px" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {stats?.planBreakdown && (
        <div className="card" style={{ padding: "20px 24px", marginBottom: "24px", display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Planuri:</span>
          {stats.planBreakdown.map((p) => (
            <div key={p.plan} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <span style={{ padding: "3px 10px", borderRadius: "20px", background: PLAN_COLORS[p.plan] ?? "rgba(128,128,128,0.1)", color: PLAN_TEXT[p.plan] ?? "#888", fontSize: "12px", fontWeight: 700, fontFamily: "Rubik,sans-serif", textTransform: "capitalize" }}>{p.plan}</span>
              <span style={{ fontSize: "13px", color: "var(--color-foreground)", fontWeight: 600 }}>{p.count}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: "16px" }}>
        <input type="text" placeholder="Cauta dupa email sau nume..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: "360px", fontSize: "14px" }} />
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(212,153,26,0.1)" }}>
                {["Utilizator", "Plan", "Rol", "Azi", "Limita", "Anunturi", "Inregistrat", ""].map((h) => (
                  <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const todayCount = u.usageLogs[0]?.count ?? 0;
                const limitDisplay = u.usageLimit === -1 ? "Nelimitat" : u.usageLimit !== null ? u.usageLimit + "/zi" : "plan default";
                return (
                  <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--color-foreground)" }}>{u.name ?? "—"}</div>
                      <div style={{ fontSize: "11px", color: "var(--color-muted-foreground)" }}>{u.email}</div>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "20px", background: PLAN_COLORS[u.plan] ?? "rgba(128,128,128,0.1)", color: PLAN_TEXT[u.plan] ?? "#888", fontSize: "11px", fontWeight: 700, fontFamily: "Rubik,sans-serif", textTransform: "capitalize" }}>{u.plan}</span>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "20px", background: u.role === "admin" ? "rgba(212,153,26,0.15)" : "rgba(255,255,255,0.05)", color: u.role === "admin" ? "var(--primary-light)" : "var(--color-muted-foreground)", fontSize: "11px", fontWeight: 700, fontFamily: "Rubik,sans-serif" }}>{u.role}</span>
                    </td>
                    <td style={{ padding: "14px 18px", fontSize: "13px", fontWeight: 600, color: todayCount > 0 ? "var(--primary-light)" : "var(--color-muted-foreground)" }}>{todayCount}</td>
                    <td style={{ padding: "14px 18px", fontSize: "12px", color: "var(--color-muted-foreground)" }}>{limitDisplay}</td>
                    <td style={{ padding: "14px 18px", fontSize: "13px", color: "var(--color-foreground)" }}>{u._count.listings}</td>
                    <td style={{ padding: "14px 18px", fontSize: "11px", color: "var(--color-muted-foreground)" }}>{new Date(u.createdAt).toLocaleDateString("ro-RO")}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <button onClick={() => openEdit(u)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", borderRadius: "8px", padding: "5px 12px", cursor: "pointer", fontSize: "12px", color: "var(--primary-light)", fontWeight: 600 }}>
                        Editeaza <ChevronDown size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "var(--color-muted-foreground)", fontSize: "14px" }}>Niciun utilizator gasit.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editUser && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }} onClick={() => setEditUser(null)}>
          <div className="card" style={{ width: "100%", maxWidth: "440px", padding: "28px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontFamily: "Rubik,sans-serif", fontWeight: 700, fontSize: "17px", color: "var(--color-foreground)", margin: 0 }}>Editeaza utilizator</h2>
                <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)", margin: "4px 0 0" }}>{editUser.email}</p>
              </div>
              <button onClick={() => setEditUser(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-muted-foreground)", padding: 0 }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Plan</label>
                <select value={editPlan} onChange={(e) => setEditPlan(e.target.value)} style={{ width: "100%" }}>
                  {["free", "pro", "proplus", "business"].map((p) => (<option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Rol</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} style={{ width: "100%" }}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Limita zilnica custom</label>
                <input type="number" value={editLimit} onChange={(e) => setEditLimit(e.target.value)} placeholder="-1 = nelimitat, gol = plan default" style={{ width: "100%" }} />
                <p style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginTop: "4px" }}>-1 nelimitat &middot; gol = plan default &middot; numar = limita custom</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button onClick={saveEdit} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "11px" }}>{saving ? "Se salveaza..." : "Salveaza"}</button>
              <button onClick={() => setEditUser(null)} className="btn-secondary" style={{ padding: "11px 16px" }}>Anuleaza</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}