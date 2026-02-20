import { useRef, useState, useEffect } from "react";

const defaultGames = [
  "فورتنايت",
  "ماينكرافت",
  "فالورانت",
  "ليغ أوف ليجندز",
  "أبيكس ليجندز",
  "جي تي إيه 5",
  "وارزون",
  "CS2",
  "أوفرووتش 2",
  "روكيت ليغ",
];

export default function GameWheel() {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [games, setGames] = useState(defaultGames);
  const [newGame, setNewGame] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [wheelSize, setWheelSize] = useState(460);
  const rotationRef = useRef(0);

  const colors = [
    "#00FF66",
    "#0a0a0a",
    "#00CC55",
    "#111111",
    "#00FF99",
    "#0d0d0d",
    "#00E676",
    "#121212",
  ];

  // Responsive wheel size
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w < 400) setWheelSize(300);
      else if (w < 640) setWheelSize(340);
      else if (w < 768) setWheelSize(380);
      else setWheelSize(460);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const drawWheel = (rotation, size = wheelSize) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const radius = size / 2;
    const segs = games.length;
    const segAngle = (2 * Math.PI) / segs;
    ctx.clearRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(radius, radius, radius - 1, 0, 2 * Math.PI);
    ctx.lineWidth = 18;
    ctx.strokeStyle = "rgba(0,255,102,0.08)";
    ctx.stroke();

    for (let i = 0; i < segs; i++) {
      const start = i * segAngle + rotation;
      const end = start + segAngle;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 16, start, end);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(0,0,0,0.8)";
      ctx.stroke();

      if (i % 2 === 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius - 16, start, end);
        ctx.clip();
        const shimmer = ctx.createLinearGradient(
          radius + Math.cos(start + segAngle / 2) * 80,
          radius + Math.sin(start + segAngle / 2) * 80,
          radius + Math.cos(start + segAngle / 2) * (radius - 20),
          radius + Math.sin(start + segAngle / 2) * (radius - 20),
        );
        shimmer.addColorStop(0, "rgba(255,255,255,0.0)");
        shimmer.addColorStop(0.5, "rgba(255,255,255,0.07)");
        shimmer.addColorStop(1, "rgba(255,255,255,0.0)");
        ctx.fillStyle = shimmer;
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(start + segAngle / 2);
      ctx.textAlign = "right";
      const isGreen = i % 2 === 0;
      ctx.fillStyle = isGreen ? "#000000" : "#00FF66";
      const fontSize = size < 360 ? 11 : 13;
      ctx.font = `bold ${fontSize}px 'Cairo', 'Segoe UI', sans-serif`;
      ctx.shadowColor = isGreen ? "transparent" : "rgba(0,255,102,0.5)";
      ctx.shadowBlur = 6;
      const maxLen = size < 360 ? 11 : 14;
      const label =
        games[i].length > maxLen
          ? games[i].slice(0, maxLen - 1) + "…"
          : games[i];
      ctx.fillText(label, radius - 24, 5);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#00FF66";
    ctx.shadowColor = "#00FF66";
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;

    for (let i = 0; i < segs; i++) {
      const tickAngle = i * segAngle + rotation;
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(tickAngle);
      ctx.beginPath();
      ctx.moveTo(radius - 16, 0);
      ctx.lineTo(radius - 10, 0);
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    const hubR = size < 360 ? 36 : 48;
    ctx.beginPath();
    ctx.arc(radius, radius, hubR, 0, 2 * Math.PI);
    const hubGrad = ctx.createRadialGradient(
      radius - 8,
      radius - 8,
      0,
      radius,
      radius,
      hubR,
    );
    hubGrad.addColorStop(0, "#1e1e1e");
    hubGrad.addColorStop(1, "#050505");
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#00FF66";
    ctx.shadowColor = "#00FF66";
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;

    for (let d = 0; d < 4; d++) {
      const bAngle = (d * Math.PI) / 2 + rotation * 0.3;
      ctx.beginPath();
      ctx.arc(
        radius + Math.cos(bAngle) * (hubR * 0.45),
        radius + Math.sin(bAngle) * (hubR * 0.45),
        4,
        0,
        2 * Math.PI,
      );
      ctx.fillStyle = "#00FF66";
      ctx.fill();
    }

    ctx.font = `${size < 360 ? 16 : 20}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎮", radius, radius);
  };

  useEffect(() => {
    drawWheel(rotationRef.current, wheelSize);
  }, [games, wheelSize]);

  const spin = () => {
    if (isSpinning || games.length < 2) return;
    setIsSpinning(true);
    setWinner(null);
    setShowPopup(false);
    setShowEditor(false);

    const spinTime = 5000;
    const start = performance.now();
    const extraSpins = Math.PI * 10 + Math.random() * Math.PI * 2;
    const startRotation = rotationRef.current;

    const animate = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / spinTime, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentRotation = startRotation + easeOut * extraSpins;
      rotationRef.current = currentRotation;
      drawWheel(currentRotation, wheelSize);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const segs = games.length;
        const segAngle = (2 * Math.PI) / segs;
        const normalized =
          ((currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const pointerAngle = (3 * Math.PI) / 2;
        const relativeAngle =
          (pointerAngle - normalized + 2 * Math.PI) % (2 * Math.PI);
        const winIndex = Math.floor(relativeAngle / segAngle) % segs;
        setWinner(games[winIndex]);
        setShowPopup(true);
      }
    };
    requestAnimationFrame(animate);
  };

  const addGame = () => {
    const trimmed = newGame.trim();
    if (!trimmed || games.includes(trimmed)) return;
    setGames([...games, trimmed]);
    setNewGame("");
  };

  const deleteGame = (index) => {
    if (games.length <= 2) return;
    setGames(games.filter((_, i) => i !== index));
  };

  const deleteWinner = () => {
    setGames(games.filter((g) => g !== winner));
    setWinner(null);
    setShowPopup(false);
  };

  const keepWinner = () => setShowPopup(false);

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditingValue(games[index]);
  };

  const saveEdit = () => {
    const trimmed = editingValue.trim();
    if (!trimmed) return;
    const updated = [...games];
    updated[editingIndex] = trimmed;
    setGames(updated);
    setEditingIndex(null);
    setEditingValue("");
  };

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        background: "#000",
        minHeight: "100vh",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { 0%{opacity:0;transform:scale(0.85)} 100%{opacity:1;transform:scale(1)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .gw-input {
          background: rgba(0,255,102,0.04);
          border: 1px solid rgba(0,255,102,0.25);
          border-radius: 12px;
          color: #fff;
          font-family: 'Cairo', sans-serif;
          font-size: 14px;
          padding: 10px 14px;
          outline: none;
          transition: all 0.2s;
          direction: rtl;
          width: 100%;
        }
        .gw-input:focus {
          border-color: rgba(0,255,102,0.6);
          background: rgba(0,255,102,0.07);
          box-shadow: 0 0 0 3px rgba(0,255,102,0.07);
        }
        .gw-input::placeholder { color: #444; }

        .game-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.2s;
        }
        .game-row:hover { background: rgba(0,255,102,0.06); border-color: rgba(0,255,102,0.2); }
        .game-row .row-actions { opacity: 0; transition: opacity 0.2s; }
        .game-row:hover .row-actions { opacity: 1; }

        /* Mobile: always show actions */
        @media (max-width: 640px) {
          .game-row .row-actions { opacity: 1; }
        }

        .spin-btn {
          position: relative;
          overflow: hidden;
          font-family: 'Cairo', sans-serif;
          font-weight: 900;
          letter-spacing: 0.06em;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        .spin-btn:hover:not(:disabled) { transform: scale(1.04); }
        .spin-btn:disabled { cursor: not-allowed; }

        .editor-toggle {
          display: none;
        }
        @media (max-width: 1023px) {
          .editor-toggle { display: flex; }
          .desktop-editor { display: none !important; }
        }
        @media (min-width: 1024px) {
          .editor-toggle { display: none; }
          .desktop-editor { display: flex !important; }
        }

        .mobile-editor {
          animation: slideDown 0.2s ease forwards;
        }
      `}</style>

      {/* BG effects */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,255,102,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.03,
          backgroundImage:
            "linear-gradient(#00FF66 1px, transparent 1px), linear-gradient(90deg, #00FF66 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── DESKTOP LAYOUT ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 40,
          padding: "40px 24px",
          flexWrap: "wrap",
        }}
      >
        {/* Editor panel — desktop */}
        <div
          className="desktop-editor"
          style={{
            flexDirection: "column",
            width: 280,
            background: "linear-gradient(145deg, #111, #0a0a0a)",
            border: "1px solid rgba(0,255,102,0.2)",
            borderRadius: 20,
            padding: 20,
            gap: 12,
            boxShadow: "0 0 40px rgba(0,255,102,0.05)",
            maxHeight: 580,
            animation: "fadeUp 0.4s ease",
          }}
        >
          <h3
            style={{
              color: "#00FF66",
              fontWeight: 900,
              fontSize: 13,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            🎮 تعديل الخيارات
          </h3>
          <p style={{ color: "#555", fontSize: 12, margin: 0 }}>
            {games.length} خيارات · الحد الأدنى 2
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="gw-input"
              value={newGame}
              onChange={(e) => setNewGame(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGame()}
              placeholder="اكتب اسم لعبة..."
              autoComplete="off"
              spellCheck={false}
            />
            <button
              onClick={addGame}
              style={{
                background: "linear-gradient(135deg, #00FF66, #00CC55)",
                border: "none",
                borderRadius: 12,
                color: "#000",
                fontWeight: 900,
                fontSize: 18,
                width: 40,
                cursor: "pointer",
                flexShrink: 0,
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              +
            </button>
          </div>

          <div
            style={{
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              flex: 1,
            }}
          >
            {games.map((game, i) => (
              <div
                key={i}
                className="game-row"
                style={{
                  border:
                    winner === game
                      ? "1px solid rgba(0,255,102,0.4)"
                      : undefined,
                  background:
                    winner === game ? "rgba(0,255,102,0.08)" : undefined,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: colors[i % colors.length],
                    flexShrink: 0,
                  }}
                />
                {editingIndex === i ? (
                  <input
                    className="gw-input"
                    style={{ padding: "4px 8px", borderRadius: 8 }}
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") setEditingIndex(null);
                    }}
                    autoFocus
                    spellCheck={false}
                  />
                ) : (
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: "#ddd",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {game}
                  </span>
                )}
                <div
                  className="row-actions"
                  style={{ display: "flex", gap: 4 }}
                >
                  {editingIndex === i ? (
                    <button
                      onClick={saveEdit}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#00FF66",
                        cursor: "pointer",
                        fontSize: 14,
                        padding: "2px 4px",
                      }}
                    >
                      ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(i)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#555",
                        cursor: "pointer",
                        fontSize: 13,
                        padding: "2px 4px",
                      }}
                    >
                      ✎
                    </button>
                  )}
                  <button
                    onClick={() => deleteGame(i)}
                    disabled={games.length <= 2}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff5555",
                      cursor: "pointer",
                      fontSize: 13,
                      padding: "2px 4px",
                      opacity: games.length <= 2 ? 0.2 : 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wheel + controls */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", animation: "fadeUp 0.3s ease" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#00FF66",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <p
                style={{
                  color: "#00FF66",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  opacity: 0.7,
                  margin: 0,
                }}
              >
                بث مباشر على Kick
              </p>
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 6vw, 48px)",
                fontWeight: 900,
                color: "#fff",
                margin: "0 0 6px",
                letterSpacing: "-0.02em",
              }}
            >
              عجلة{" "}
              <span
                style={{ color: "#00FF66", textShadow: "0 0 30px #00FF6660" }}
              >
                الألعاب
              </span>
            </h2>
            <p style={{ color: "#555", fontSize: 13, margin: 0 }}>
              ادوّر العجلة واختار لعبة الليلة
            </p>
          </div>

          {/* Mobile editor toggle */}
          <button
            className="editor-toggle"
            onClick={() => setShowEditor((v) => !v)}
            style={{
              alignItems: "center",
              gap: 8,
              background: showEditor
                ? "rgba(0,255,102,0.12)"
                : "rgba(0,255,102,0.06)",
              border: "1px solid rgba(0,255,102,0.3)",
              borderRadius: 12,
              color: "#00FF66",
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              padding: "10px 20px",
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.05em",
            }}
          >
            🎮 {showEditor ? "إخفاء الخيارات ▲" : "تعديل الخيارات ▼"}
          </button>

          {/* Mobile editor panel */}
          {showEditor && (
            <div
              className="mobile-editor"
              style={{
                width: "100%",
                maxWidth: 400,
                background: "linear-gradient(145deg, #111, #0a0a0a)",
                border: "1px solid rgba(0,255,102,0.2)",
                borderRadius: 20,
                padding: 16,
                boxShadow: "0 0 30px rgba(0,255,102,0.06)",
              }}
            >
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input
                  className="gw-input"
                  value={newGame}
                  onChange={(e) => setNewGame(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addGame()}
                  placeholder="أضف لعبة جديدة..."
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  onClick={addGame}
                  style={{
                    background: "linear-gradient(135deg, #00FF66, #00CC55)",
                    border: "none",
                    borderRadius: 12,
                    color: "#000",
                    fontWeight: 900,
                    fontSize: 18,
                    width: 42,
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: 6,
                  maxHeight: 240,
                  overflowY: "auto",
                }}
              >
                {games.map((game, i) => (
                  <div
                    key={i}
                    className="game-row"
                    style={{ justifyContent: "space-between" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: colors[i % colors.length],
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          color: "#ccc",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {game}
                      </span>
                    </div>
                    <div
                      className="row-actions"
                      style={{ display: "flex", gap: 2 }}
                    >
                      <button
                        onClick={() => startEdit(i)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#555",
                          cursor: "pointer",
                          fontSize: 13,
                          padding: "2px",
                        }}
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => deleteGame(i)}
                        disabled={games.length <= 2}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ff5555",
                          cursor: "pointer",
                          fontSize: 13,
                          padding: "2px",
                          opacity: games.length <= 2 ? 0.2 : 1,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wheel */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Pointer */}
            <div
              style={{
                position: "absolute",
                top: -14,
                zIndex: 20,
                filter: "drop-shadow(0 0 10px #00FF66)",
              }}
            >
              <svg width="28" height="36" viewBox="0 0 28 36">
                <polygon points="14,36 0,0 28,0" fill="#00FF66" />
                <polygon points="14,30 4,4 24,4" fill="#003d1a" />
              </svg>
            </div>

            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  pointerEvents: "none",
                  boxShadow:
                    "0 0 80px rgba(0,255,102,0.25), 0 0 160px rgba(0,255,102,0.1)",
                }}
              />
              <div
                style={{
                  borderRadius: "50%",
                  padding: 12,
                  background: "linear-gradient(145deg, #1a1a1a, #0a0a0a)",
                  boxShadow: "inset 0 2px 4px rgba(255,255,255,0.05)",
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={wheelSize}
                  height={wheelSize}
                  style={{ borderRadius: "50%", display: "block" }}
                />
              </div>
            </div>
          </div>

          {/* Spin button */}
          <button
            className="spin-btn"
            onClick={spin}
            disabled={isSpinning || games.length < 2}
            style={{
              fontSize: "clamp(14px, 4vw, 18px)",
              padding: "clamp(12px, 3vw, 16px) clamp(32px, 8vw, 56px)",
              background: isSpinning
                ? "linear-gradient(135deg, #1a1a1a, #111)"
                : "linear-gradient(135deg, #00FF66, #00CC55)",
              color: isSpinning ? "#444" : "#000",
              boxShadow: isSpinning
                ? "none"
                : "0 0 30px rgba(0,255,102,0.5), 0 4px 20px rgba(0,0,0,0.4)",
              border: isSpinning ? "1px solid #222" : "none",
              width: "clamp(200px, 80vw, 320px)",
            }}
          >
            {!isSpinning && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                  animation: "shimmer 2.5s infinite",
                }}
              />
            )}
            {isSpinning ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid #555",
                    borderTop: "2px solid #888",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                جاري الدوران...
              </span>
            ) : (
              "🎰 دوّر العجلة"
            )}
          </button>

          <p
            style={{
              color: "#333",
              fontSize: 11,
              margin: 0,
              letterSpacing: "0.1em",
            }}
          >
            {games.length} {games.length === 1 ? "خيار" : "خيارات"} على العجلة
          </p>
        </div>
      </div>

      {/* Winner popup */}
      {showPopup && winner && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(10px)",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "linear-gradient(145deg, #151515, #0a0a0a)",
              border: "1px solid rgba(0,255,102,0.4)",
              borderRadius: 28,
              padding: "clamp(28px, 6vw, 44px)",
              maxWidth: 380,
              width: "100%",
              textAlign: "center",
              boxShadow:
                "0 0 80px rgba(0,255,102,0.2), 0 0 160px rgba(0,255,102,0.08)",
              animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
            <p
              style={{
                color: "#555",
                fontSize: 11,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              الليلة نلعب
            </p>
            <p
              style={{
                color: "#00FF66",
                fontWeight: 900,
                fontSize: "clamp(24px, 6vw, 34px)",
                textShadow: "0 0 30px #00FF6680",
                marginBottom: 8,
              }}
            >
              {winner}
            </p>
            <p style={{ color: "#444", fontSize: 13, marginBottom: 28 }}>
              تبي تشيل اللعبة من العجلة أو تخليها؟
            </p>
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(0,255,102,0.2), transparent)",
                marginBottom: 24,
              }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={deleteWinner}
                style={{
                  flex: 1,
                  padding: "14px 0",
                  borderRadius: 14,
                  background: "rgba(255,60,60,0.12)",
                  border: "1px solid rgba(255,60,60,0.35)",
                  color: "#ff6060",
                  fontFamily: "'Cairo', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(13px, 3.5vw, 15px)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,60,60,0.2)";
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,60,60,0.12)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                🗑 احذفها
              </button>
              <button
                onClick={keepWinner}
                style={{
                  flex: 1,
                  padding: "14px 0",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #00FF66, #00CC55)",
                  border: "none",
                  color: "#000",
                  fontFamily: "'Cairo', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(13px, 3.5vw, 15px)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 0 20px rgba(0,255,102,0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 0 35px rgba(0,255,102,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(0,255,102,0.4)";
                }}
              >
                ✓ خليها
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
