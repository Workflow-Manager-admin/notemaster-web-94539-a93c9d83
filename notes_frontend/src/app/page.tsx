"use client";

// PUBLIC_INTERFACE
import { useState, useContext } from "react";
import ThemeProviderWrapper from "./ThemeProviderWrapper";
import { ThemeContext } from "./ThemeProvider";

// Note type
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// COLOR CONSTANTS (fallbacks, prefer CSS vars)
// (Removed unused PRIMARY, SECONDARY, ACCENT)

// Helper: Generate unique IDs
function generateId() {
  return Math.random().toString(36).slice(2, 12) + Date.now();
}

// Format date nicely
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// INITIAL NOTES (for demo)
const demoNotes: Note[] = [
  {
    id: generateId(),
    title: "Welcome to Notemaster!",
    content: "This is your first note. Create, select, and edit notes using the sidebar.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

/**
 * Sidebar component for listing notes and actions
 */
function Sidebar({
  notes,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
}: {
  notes: Note[],
  selectedId: string | null,
  onSelect: (id: string) => void,
  onCreate: () => void,
  onDelete: (id: string) => void,
}) {
  // Dark mode support via Tailwind and CSS variables
  return (
    <aside
      className="h-full w-full sm:w-64 border-r bg-white dark:bg-[var(--background)] border-gray-200 dark:border-zinc-800 flex flex-col"
      style={{ background: "var(--background)" }}
    >
      <div className="flex justify-between items-center px-4 py-4 border-b border-gray-100 dark:border-zinc-800">
        <h2 className="text-lg font-semibold" style={{ color: "var(--secondary)" }}>Notes</h2>
        <button
          className="rounded p-2 text-white"
          style={{ background: "var(--accent)" }}
          aria-label="Create new note"
          onClick={onCreate}
        >
          +
        </button>
      </div>
      <ul className="overflow-auto flex-1 px-1">
        {notes.map(note => (
          <li key={note.id}
              className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer mb-0.5 transition
                ${
                  selectedId === note.id
                    ? "bg-blue-100 dark:bg-zinc-800"
                    : "hover:bg-gray-100 dark:hover:bg-zinc-900"
                }`}>
            <div className="flex-1 truncate" onClick={() => onSelect(note.id)}>
              <span className="font-medium">{note.title || "(Untitled Note)"}</span>
              <br/>
              <span className="text-xs text-gray-400 dark:text-zinc-400">{formatDate(note.updatedAt)}</span>
            </div>
            <button
              className="ml-2 text-sm text-gray-400 hover:text-red-500 px-2 py-0.5 rounded"
              aria-label="Delete note"
              onClick={e => { e.stopPropagation(); if(window.confirm("Delete this note?")) onDelete(note.id); }}
            >🗑</button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/**
 * ThemeToggle: Small accessible toggle for dark/light mode
 */
function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-label="Toggle dark mode"
      className="px-2 py-2 ml-3 transition rounded-md border border-transparent hover:border-primary bg-transparent flex items-center"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      style={{
        color: "var(--primary)",
        background: theme === "dark" ? "rgba(55,56,70,0.15)" : "rgba(59,130,246,0.08)"
      }}
    >
      {theme === "light"
        ? (
          <span className="inline-flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" stroke="currentColor"/><path stroke="currentColor" d="M12 1v2m0 18v2m11-11h-2M3 12H1m17.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41M17.66 17.66l-1.41-1.41M6.34 6.34L4.93 4.93"/></svg>
            <span className="hidden sm:inline">Light</span>
          </span>
        )
        : (
          <span className="inline-flex items-center">
            <svg className="w-5 h-5 mr-1" fill="currentColor" stroke="none" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.752 15.002A9.718 9.718 0 012.93 8.022a.75.75 0 01.755-.907A8.251 8.251 0 0012 21.75a.75.75 0 01-.906-.756 9.718 9.718 0 0110.658-5.992z"/></svg>
            <span className="hidden sm:inline">Dark</span>
          </span>
        )
      }
    </button>
  );
}

/**
 * Top Navigation Bar, with theme toggle and app branding
 */
function Topbar() {
  return (
    <div
      className="w-full px-6 py-3 flex items-center shadow-sm bg-white dark:bg-[var(--background)] justify-between"
      style={{ borderBottom: `1px solid var(--primary)` }}
    >
      <span className="font-bold text-xl tracking-tight" style={{ color: "var(--primary)" }}>
        Notemaster
      </span>
      <div className="flex items-center">
        <span className="text-sm text-gray-400 dark:text-zinc-400" style={{ color: "var(--secondary)" }}>
          Simple Notes App
        </span>
        <ThemeToggle />
      </div>
    </div>
  );
}

// Note Editor
function NoteEditor({
  note,
  onUpdate,
  disabled,
}: {
  note: Note;
  onUpdate: (patch: Partial<Note>) => void;
  disabled: boolean;
}) {
  // Style adjusts for light/dark, using CSS vars with fallback
  return (
    <div className="h-full flex flex-col gap-2">
      <input
        className="w-full text-2xl font-semibold bg-transparent border-b focus:outline-none dark:border-zinc-800"
        value={note.title}
        onChange={e => onUpdate({title: e.target.value ?? ""})}
        placeholder="Note title"
        style={{
          color: "var(--secondary)",
          background: "transparent",
          borderColor: "var(--primary)",
        }}
        disabled={disabled}
      />
      <textarea
        className="flex-1 w-full min-h-[200px] px-2 py-1 border-none focus:outline-none text-base bg-transparent resize-none"
        value={note.content}
        onChange={e => onUpdate({content: e.target.value ?? ""})}
        placeholder="Write your note here..."
        style={{
          color: "var(--foreground)",
          background: "transparent",
        }}
        disabled={disabled}
      />
      <div className="flex justify-between pt-2">
        <span className="text-xs text-gray-400 dark:text-zinc-400">
          {note.updatedAt ? `Last edited: ${formatDate(note.updatedAt)}` : ""}
        </span>
      </div>
    </div>
  );
}

// Empty state message
function EmptyMain({onCreate}: {onCreate: () => void}) {
  return (
    <div className="h-full flex flex-col justify-center items-center text-gray-400 dark:text-zinc-400">
      <span className="text-2xl mb-4">📝</span>
      <span>No note selected.</span>
      <button
        className="mt-4 rounded border px-4 py-1 bg-[var(--accent)] text-white dark:bg-[var(--accent)]"
        onClick={onCreate}
      >New Note</button>
    </div>
  );
}

// Main component
export default function Home() {
  return (
    <ThemeProviderWrapper>
      <InnerHome />
    </ThemeProviderWrapper>
  );
}

// All Home logic in an inner client component that gets theme context
function InnerHome() {
  const [notes, setNotes] = useState<Note[]>([...demoNotes]);
  const [selectedId, setSelectedId] = useState<string | null>(notes.length ? notes[0].id : null);

  // CRUD actions
  const handleCreate = () => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: generateId(),
      title: "Untitled",
      content: "",
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedId(newNote.id);
  };

  const handleSelect = (id: string) => setSelectedId(id);

  const handleDelete = (id: string) => {
    setNotes(notes => notes.filter(note => note.id !== id));
    if (selectedId === id) setSelectedId(notes.length > 1 ? notes[1].id : null);
  };

  const handleUpdate = (patch: Partial<Note>) => {
    setNotes(notes =>
      notes.map(note =>
        note.id === selectedId
          ? { ...note, ...patch, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const selectedNote = notes.find(n => n.id === selectedId) || null;

  // Outer background for both themes
  return (
    <div
      className="h-screen w-screen flex flex-col bg-white dark:bg-[var(--background)]"
      style={{ background: "var(--background)" }}
    >
      <Topbar />
      <div className="flex flex-1 h-full overflow-hidden">
        <div className="w-64 flex-shrink-0 hidden sm:block">
          <Sidebar
            notes={notes}
            selectedId={selectedId}
            onSelect={handleSelect}
            onCreate={handleCreate}
            onDelete={handleDelete}
          />
        </div>
        {/* Responsive drawer for mobile */}
        <div className="w-full sm:hidden">
          <Sidebar
            notes={notes}
            selectedId={selectedId}
            onSelect={handleSelect}
            onCreate={handleCreate}
            onDelete={handleDelete}
          />
        </div>
        <main className="flex-1 h-full min-w-0 p-5 overflow-auto bg-[#F8FAFC] dark:bg-[var(--background)] flex flex-col" style={{ transition: "background 0.2s" }}>
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onUpdate={handleUpdate}
              disabled={false}
            />
          ) : (
            <EmptyMain onCreate={handleCreate} />
          )}
        </main>
      </div>
    </div>
  );
}
