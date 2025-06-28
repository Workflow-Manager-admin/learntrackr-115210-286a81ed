import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

// Accent/brand color config
const COLORS = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#ffc107"
};

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"; // Backend API URL

// Utility to check and log fetch errors for easier debugging
function logFetchError(name, error, res) {
  // Log to console for devs, show diagnostic if needed
  // eslint-disable-next-line no-console
  console.error(`[API] Failed to fetch ${name}:`, error);
  if (res) {
    // eslint-disable-next-line no-console
    console.error(`[API] Response:`, res);
  }
}

// Util helpers
function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

const statusColor = status => {
  switch (status) {
    case "Not Started":
      return COLORS.secondary;
    case "In Progress":
      return COLORS.accent;
    case "Completed":
      return COLORS.primary;
    default:
      return COLORS.secondary;
  }
};

/**
 * Sidebar navigation for filters, add button, and category filter
 */
function Sidebar({
  currentStatus,
  statuses,
  onStatusChange,
  category,
  onCategoryChange,
  onAddClick,
  categories
}) {
  return (
    <aside className="Sidebar">
      <div className="Sidebar-header">Learning Tracker</div>
      <nav className="Sidebar-filters">
        <span className="Sidebar-label">Filter by Status</span>
        <div className="Sidebar-status-list">
          <button
            className={`Sidebar-status-btn${!currentStatus ? " active" : ""}`}
            onClick={() => onStatusChange(null)}
          >All</button>
          {(statuses || []).map(s => (
            <button
              key={s}
              style={{
                borderColor: statusColor(s),
                color: statusColor(s)
              }}
              className={`Sidebar-status-btn${currentStatus === s ? " active" : ""}`}
              onClick={() => onStatusChange(s)}
            >{s}</button>
          ))}
        </div>
        <span className="Sidebar-label">Category</span>
        <select
          className="Sidebar-category-select"
          value={category}
          onChange={e => onCategoryChange(e.target.value)}
        >
          <option value="">All</option>
          {categories.map(c => (
            <option value={c} key={c}>{c}</option>
          ))}
        </select>
      </nav>
      <button className="Sidebar-add-btn" onClick={onAddClick}>+ Add Topic</button>
    </aside>
  );
}

/**
 * Dashboard summary stats (progress info)
 */
function Dashboard({ stats }) {
  const { total = 0, notStarted = 0, inProgress = 0, completed = 0 } = stats || {};
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return (
    <section className="Dashboard">
      <h2>Progress</h2>
      <div className="Dashboard-row">
        <DashboardStat label="Total" value={total} color={COLORS.primary} />
        <DashboardStat label="Not Started" value={notStarted} color={COLORS.secondary} />
        <DashboardStat label="In Progress" value={inProgress} color={COLORS.accent} />
        <DashboardStat label="Completed" value={completed} color={COLORS.primary} />
      </div>
      <div className="Dashboard-bar-bg">
        <div
          className="Dashboard-bar"
          style={{
            background: COLORS.primary,
            width: `${percent}%`
          }}
        />
      </div>
      <span className="Dashboard-percent">{percent}% complete</span>
    </section>
  );
}

function DashboardStat({ label, value, color }) {
  return (
    <div className="Dashboard-stat">
      <div className="Dashboard-stat-value" style={{ color }}>{value}</div>
      <div className="Dashboard-stat-label">{label}</div>
    </div>
  );
}

/**
 * List of topics
 */
function TopicList({ topics, onEdit, onDelete, onStatusChange, statusOptions }) {
  if (topics.length === 0) {
    return <div className="TopicList-empty">No topics found.</div>;
  }
  return (
    <div className="TopicList">
      {topics.map(topic => (
        <TopicRow
          key={topic.id}
          topic={topic}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          statusOptions={statusOptions}
        />
      ))}
    </div>
  );
}

/**
 * Single topic display row/card
 */
function TopicRow({ topic, onEdit, onDelete, onStatusChange, statusOptions }) {
  return (
    <div className="TopicRow">
      <div className="TopicRow-top">
        <span className="TopicRow-title">{topic.topic}</span>
        <div className="TopicRow-actions">
          <button title="Edit" onClick={() => onEdit(topic)}>
            <span role="img" aria-label="Edit">✏️</span>
          </button>
          <button title="Delete" onClick={() => onDelete(topic)}>
            <span role="img" aria-label="Delete">🗑️</span>
          </button>
        </div>
      </div>
      <div className="TopicRow-details">
        <div className="TopicRow-detail">
          <span className="TopicRow-label">Status:</span>
          <StatusSelect
            value={topic.status}
            options={statusOptions}
            onChange={s => onStatusChange(topic, s)}
          />
        </div>
        {topic.category && (
          <div className="TopicRow-detail">
            <span className="TopicRow-label">Category:</span> <span>{topic.category}</span>
          </div>
        )}
        {topic.targetDate && (
          <div className="TopicRow-detail">
            <span className="TopicRow-label">Target Date:</span> <span>{formatDate(topic.targetDate)}</span>
          </div>
        )}
        {topic.notes && (
          <div className="TopicRow-detail">
            <span className="TopicRow-label">Notes:</span> <span>{topic.notes}</span>
          </div>
        )}
        <span className="TopicRow-date" title={`Created: ${formatDate(topic.createdAt)}`}>
          Updated: {formatDate(topic.updatedAt)}
        </span>
      </div>
    </div>
  );
}

/**
 * Status dropdown (for inline updating status)
 */
function StatusSelect({ value, options, onChange }) {
  return (
    <select
      className="StatusSelect"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ color: statusColor(value) }}
    >
      {(options || []).map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

/**
 * Add/Edit Topic Modal/Dialog
 */
function TopicFormModal({ open, onClose, onSave, initial, statusOptions, categories }) {
  const isEdit = !!(initial && initial.id);
  const [form, setForm] = useState({
    topic: initial?.topic || "",
    status: initial?.status || statusOptions[0] || "",
    targetDate: initial?.targetDate ? formatDate(initial.targetDate) : "",
    notes: initial?.notes || "",
    category: initial?.category || ""
  });
  useEffect(() => {
    // Update form if initial changes (when editing)
    setForm({
      topic: initial?.topic || "",
      status: initial?.status || statusOptions[0] || "",
      targetDate: initial?.targetDate ? formatDate(initial.targetDate) : "",
      notes: initial?.notes || "",
      category: initial?.category || ""
    });
  }, [initial, statusOptions]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  if (!open) return null;
  return (
    <div className="Modal-backdrop" onClick={onClose}>
      <div className="Modal" onClick={e => e.stopPropagation()}>
        <div className="Modal-header">
          <h3>{isEdit ? "Edit Topic" : "Add New Topic"}</h3>
        </div>
        <form className="Modal-form" onSubmit={handleSubmit}>
          <label>
            Topic<span className="Modal-required">*</span>
            <input
              type="text"
              name="topic"
              required
              value={form.topic}
              onChange={handleChange}
              maxLength={80}
              placeholder="e.g. JavaScript, UI/UX, DSA"
              autoFocus
            />
          </label>
          <label>
            Status<span className="Modal-required">*</span>
            <select name="status" value={form.status} onChange={handleChange} required>
              {(statusOptions || []).map(s =>
                <option key={s} value={s}>{s}</option>
              )}
            </select>
          </label>
          <label>
            Category
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              list="category-suggestions"
              placeholder="Optional. e.g. Programming"
            />
            {/* datalist for basic autocomplete */}
            <datalist id="category-suggestions">
              {categories.map(c => <option key={c} value={c} />)}
            </datalist>
          </label>
          <label>
            Target Date
            <input
              type="date"
              name="targetDate"
              value={form.targetDate}
              onChange={handleChange}
            />
          </label>
          <label>
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Details, links, or notes (optional)"
              rows={2}
              maxLength={250}
            />
          </label>
          <div className="Modal-actions">
            <button type="button" className="Modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="Modal-save">{isEdit ? "Save Changes" : "Add Topic"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Confirm Dialog for delete action
 */
function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="Modal-backdrop" onClick={onCancel}>
      <div className="Modal" onClick={e => e.stopPropagation()}>
        <div className="Modal-header">
          <h3>Confirm Delete</h3>
        </div>
        <div className="Modal-content">
          <p>{message}</p>
        </div>
        <div className="Modal-actions">
          <button type="button" className="Modal-cancel" onClick={onCancel}>Cancel</button>
          <button type="button" className="Modal-save" onClick={onConfirm} style={{ background: COLORS.secondary }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/**
 * Top-level App main shell
 */
function App() {
  // Theme state
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mql.matches ? "dark" : "light");
    mql.onchange = e => setTheme(e.matches ? "dark" : "light");
    return () => { mql.onchange = null; };
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Main data state
  const [topics, setTopics] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTopic, setEditTopic] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, topic: null });
  const [error, setError] = useState(null);

  // Fetch status options and stats
  useEffect(() => {
    async function fetchMeta() {
      try {
        const [res1, res2] = await Promise.all([
          fetch(`${API_BASE}/status-options`),
          fetch(`${API_BASE}/progress`)
        ]);
        if (!res1.ok) {
          const msg = `Status options API error (${res1.status})`;
          logFetchError("status-options", msg, res1);
          setError("Failed to fetch status options");
          return;
        }
        if (!res2.ok) {
          const msg = `Progress API error (${res2.status})`;
          logFetchError("progress", msg, res2);
          setError("Failed to fetch stats");
          return;
        }
        setStatuses(await res1.json());
        setStats(await res2.json());
      } catch (e) {
        logFetchError("status or stats", e);
        setError("Failed to fetch status or stats");
      }
    }
    fetchMeta();
  }, []);

  // Fetch topics (with filters)
  const fetchTopics = useCallback(async () => {
    setLoading(true);
    let url = `${API_BASE}/topics`;
    const params = [];
    if (statusFilter) params.push(`status=${encodeURIComponent(statusFilter)}`);
    if (categoryFilter) params.push(`category=${encodeURIComponent(categoryFilter)}`);
    if (params.length) url += `?${params.join("&")}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        logFetchError("topics", `API error (${res.status})`, res);
        setError("Failed to fetch topics (API error)");
        setTopics([]);
      } else {
        setTopics(await res.json());
      }
    } catch (e) {
      logFetchError("topics", e);
      setError("Failed to fetch topics. Backend unreachable?");
      setTopics([]);
    }
    setLoading(false);
  }, [statusFilter, categoryFilter]);
  useEffect(() => { fetchTopics(); }, [fetchTopics]);

  // When topics change, update progress meta
  useEffect(() => {
    async function refreshStats() {
      try {
        const res2 = await fetch(`${API_BASE}/progress`);
        setStats(await res2.json());
      } catch (e) { /* ignore */ }
    }
    refreshStats();
  }, [topics.length]);

  // Extract categories for filter dropdown
  const topicCategories = Array.from(
    new Set(topics.filter(t => t.category).map(t => t.category))
  );

  // CRUD operations
  async function handleAddTopic(form) {
    try {
      const res = await fetch(`${API_BASE}/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      setModalOpen(false);
      setEditTopic(null);
      fetchTopics();
    } catch {
      setError("Failed to add topic. Check fields.");
    }
  }
  async function handleEditTopic(form) {
    if (!editTopic?.id) return;
    try {
      const res = await fetch(`${API_BASE}/topics/${editTopic.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      setModalOpen(false);
      setEditTopic(null);
      fetchTopics();
    } catch {
      setError("Failed to edit topic. Check fields.");
    }
  }
  async function handleStatusChange(topic, status) {
    if (!topic.id || status === topic.status) return;
    try {
      // PATCH status
      const res = await fetch(`${API_BASE}/topics/${topic.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error();
      fetchTopics();
    } catch {
      setError("Failed to update status.");
    }
  }
  async function handleDeleteTopic(topic) {
    if (!topic.id) return;
    try {
      const res = await fetch(`${API_BASE}/topics/${topic.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setConfirmDelete({ open: false, topic: null });
      fetchTopics();
    } catch {
      setError("Failed to delete topic.");
    }
  }

  // Modal open handlers
  const openAddModal = () => { setEditTopic(null); setModalOpen(true); };
  const openEditModal = topic => { setEditTopic(topic); setModalOpen(true); };

  // Filter change handlers
  const onStatusChange = s => setStatusFilter(s);
  const onCategoryChange = c => setCategoryFilter(c);

  // Modal close
  function closeModal() { setModalOpen(false); setEditTopic(null); }

  // Error dismiss
  function dismissError() { setError(null); }

  return (
    <div className="AppShell">
      <Sidebar
        currentStatus={statusFilter}
        statuses={statuses}
        onStatusChange={onStatusChange}
        category={categoryFilter}
        onCategoryChange={onCategoryChange}
        onAddClick={openAddModal}
        categories={topicCategories}
      />
      <main className="MainArea">
        <div className="AppHeader">
          <h1>Personal Learning Tracker</h1>
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
        <Dashboard stats={stats} />
        <section className="TopicsSection">
          <div className="TopicsSection-header">
            <h2>Topics</h2>
            <button
              className="add-topic-btn"
              onClick={openAddModal}
              style={{ background: COLORS.primary, color: "#fff" }}
            >+ Add Topic</button>
          </div>
          {loading ? (
            <div className="loading-indicator">Loading...</div>
          ) : (
            <TopicList
              topics={topics}
              onEdit={openEditModal}
              onDelete={topic => setConfirmDelete({ open: true, topic })}
              onStatusChange={handleStatusChange}
              statusOptions={statuses}
            />
          )}
        </section>
      </main>
      <TopicFormModal
        open={modalOpen}
        onClose={closeModal}
        onSave={editTopic ? handleEditTopic : handleAddTopic}
        initial={editTopic}
        statusOptions={statuses}
        categories={topicCategories}
      />
      <ConfirmDialog
        open={confirmDelete.open}
        message={
          confirmDelete.topic
            ? `Are you sure you want to delete "${confirmDelete.topic.topic}"? This cannot be undone.`
            : ""
        }
        onConfirm={() => handleDeleteTopic(confirmDelete.topic)}
        onCancel={() => setConfirmDelete({ open: false, topic: null })}
      />
      {error && (
        <div className="error-toast" onClick={dismissError}>
          <span>{error}</span>
          <button className="error-toast-close" onClick={dismissError}>✕</button>
        </div>
      )}
    </div>
  );
}

export default App;
