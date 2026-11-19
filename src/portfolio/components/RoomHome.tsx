// @ts-nocheck -- full-screen home based on Ezadin's 3D room portfolio
import { useEffect, useRef, useState } from "react";
import { createRoom } from "../room/roomScene";
import RoomPanel, { panelTitles } from "./RoomPanel";
import RoomCharacter from "./RoomCharacter";
import "./styles/Room.css";


const RoomHome = () => {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const api = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dark, setDark] = useState(false);
  const [choice, setChoice] = useState(null);
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(null);
  const [view, setView] = useState("url");
  const [page, setPage] = useState(null);

  useEffect(() => {
    const room = createRoom(wrap.current, canvas.current, {
      onLoaded: () => setLoaded(true),
      onFocusChange: setFocused,
      onThemeChange: (t) => setDark(t === "dark"),
      onChooseProject: (c) => { setView(c.url ? "url" : "mobileUrl"); setChoice(c); },
    });
    api.current = room;
    return () => room.dispose();
  }, []);

  return (
    <div className={`room-home ${dark ? "room-dark" : ""}`}>
      <div className="room-stage room-full" ref={wrap}>
        <canvas ref={canvas} className="room-canvas" />
        {!loaded && <div className="room-loading">Loading room…</div>}
      </div>
      <header className="room-top">
        <a href="/" className="room-logo">Ezadin<span>.</span></a>
        <button className="room-menu-btn" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
      </header>
      <nav className={`room-side ${open ? "open" : ""}`}>
        {focused ? (
          <>
            <button onClick={() => { api.current?.reset(); setPage(null); }}>← Back to room</button>
            {page !== null && api.current?.projectPages > 1 && (
              <button onClick={() => { const n = (page + 1) % api.current.projectPages; setPage(n); api.current.showProjects(n); setOpen(false); }}>
                More screens ({page + 1}/{api.current.projectPages})
              </button>
            )}
          </>
        ) : (
          <>
            <button onClick={() => { api.current?.showAbout(); setOpen(false); }}>Open the book</button>
            <button onClick={() => { api.current?.showProjects(0); setPage(0); setOpen(false); }}>Project screens</button>
          </>
        )}
        {Object.keys(panelTitles).map((k) => (
          <button key={k} onClick={() => { setPanel(k); setOpen(false); }}>{panelTitles[k]}</button>
        ))}
        <a href="mailto:ezadinbadru55@gmail.com">Email me</a>
        <a href="https://www.linkedin.com/in/ezadin-badiru-966643331/" target="_blank" rel="noopener">LinkedIn</a>
      </nav>
      {loaded && <RoomCharacter />}
      {panel && <RoomPanel panel={panel} onClose={() => setPanel(null)} />}
      <p className="room-hint">Drag to look around · click the book, the light switch or a project screen</p>
      {choice && (
        <div className="room-choice" onClick={() => setChoice(null)}>
          <div className="room-choice-wide" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              {choice.url && <button onClick={() => setView("url")}>Web</button>}
              {choice.mobileUrl && <button onClick={() => setView("mobileUrl")}>Mobile / Admin</button>}
              <button onClick={() => setChoice(null)}>Close</button>
            </div>
            <div className="room-project">
              <iframe src={choice[view] || choice.url || choice.mobileUrl} title="Project preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomHome;
