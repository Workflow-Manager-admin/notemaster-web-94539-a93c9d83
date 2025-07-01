"use client";

import { useState } from "react";

// Note type
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// COLOR CONSTANTS
const PRIMARY = "#3B82F6";
const SECONDARY = "#4B5563";
const ACCENT = "#F59E42";

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

// Sidebar
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
  return (
    <aside className="h-full w-full sm:w-64 border-r border-gray-200 bg-white flex flex-col" style={{background:"#fff"}}>
      <div className="flex justify-between items-center px-4 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold" style={{color: SECONDARY}}>Notes</h2>
        <button
          className="rounded p-2 text-white"
          style={{background: ACCENT}}
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
                ${selectedId === note.id ? "bg-blue-100" : "hover:bg-gray-100"}`}>
            <div className="flex-1 truncate" onClick={() => onSelect(note.id)}>
              <span className="font-medium">{note.title || "(Untitled Note)"}</span>
              <br/>
              <span className="text-xs text-gray-400">{formatDate(note.updatedAt)}</span>
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

// Top Navigation
function Topbar() {
  return (
    <div
      className="w-full px-6 py-3 flex items-center shadow-sm bg-white justify-between"
      style={{ borderBottom: `1px solid ${PRIMARY}`}}
    >
      <span className="font-bold text-xl tracking-tight" style={{color: PRIMARY}}>Notemaster</span>
      <span className="text-sm text-gray-400" style={{color: SECONDARY}}>Simple Notes App</span>
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
  return (
    <div className="h-full flex flex-col gap-2">
      <input
        className="w-full text-2xl font-semibold bg-transparent border-b focus:outline-none"
        value={note.title}
        onChange={e => onUpdate({title: e.target.value ?? ""})}
        placeholder="Note title"
        style={{color: SECONDARY}}
        disabled={disabled}
      />
      <textarea
        className="flex-1 w-full min-h-[200px] px-2 py-1 border-none focus:outline-none text-base bg-transparent resize-none"
        value={note.content}
        onChange={e => onUpdate({content: e.target.value ?? ""})}
        placeholder="Write your note here..."
        style={{color: "#252525"}}
        disabled={disabled}
      />
      <div className="flex justify-between pt-2">
        <span className="text-xs text-gray-400">{note.updatedAt ? `Last edited: ${formatDate(note.updatedAt)}` : ""}</span>
      </div>
    </div>
  );
}

// Empty state message
function EmptyMain({onCreate}: {onCreate: () => void}) {
  return (
    <div className="h-full flex flex-col justify-center items-center text-gray-400">
      <span className="text-2xl mb-4">📝</span>
      <span>No note selected.</span>
      <button
        className="mt-4 rounded border px-4 py-1 bg-[#F59E42] text-white"
        onClick={onCreate}
      >New Note</button>
    </div>
  );
}

// Main component
export default function Home() {
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
    setNotes([newNote, ...notes]);
    setSelectedId(newNote.id);
  };

  const handleSelect = (id: string) => setSelectedId(id);

  const handleDelete = (id: string) => {
    setNotes(notes => notes.filter(note => note.id !== id));
    if(selectedId === id) setSelectedId(notes.length > 1 ? notes[1].id : null);
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

  return (
    <div className="h-screen w-screen bg-white flex flex-col" style={{background:"#fff"}}>
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
        <main className="flex-1 h-full min-w-0 p-5 overflow-auto bg-[#F8FAFC] flex flex-col">
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
