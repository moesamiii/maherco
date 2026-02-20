import { useRef, useState, useEffect, useCallback } from "react";

const initialTeamMembers = [
  "ماهرکو",
  "اوسم",
  "تكريتي",
  "هيكساوي",
  "ايفل",
  "اسيريان",
  "جلطة",
  "كريستال",
];

const COLORS = [
  "#00FF66",
  "#0a0a0a",
  "#00CC55",
  "#111111",
  "#00FF99",
  "#0d0d0d",
  "#00E676",
  "#121212",
];

export default function TeamWheel() {
  const canvasRef = useRef(null);
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [spinHistory, setSpinHistory] = useState([]);
  const [removedMembers, setRemovedMembers] = useState([]);
  const [totalSpins, setTotalSpins] = useState(0);
  const [confetti, setConfetti] = useState([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [addError, setAddError] = useState("");
  const [showManagePanel, setShowManagePanel] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [wheelSize, setWheelSize] = useState(460);

  const segments = teamMembers.length;
  const angleRef = useRef((2 * Math.PI) / segments);
  angleRef.current = segments > 0 ? (2 * Math.PI) / segments : 0;
  const teamMembersRef = useRef(teamMembers);
  teamMembersRef.current = teamMembers;

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 380) setWheelSize(270);
      else if (w < 480) setWheelSize(310);
      else if (w < 640) setWheelSize(350);
      else setWheelSize(460);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Core draw function — always reads size from canvas.width so it's never stale
  const drawWheel = useCallback((rot) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const segs = teamMembersRef.current.length;
    if (segs === 0) return;

    const size = canvas.width; // ← always accurate
    const ctx = canvas.getContext("2d");
    const radius = size / 2;
    const segAngle = (2 * Math.PI) / segs;

    ctx.clearRect(0, 0, size, size);

    // Outer ring hint
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 1, 0, 2 * Math.PI);
    ctx.lineWidth = 18;
    ctx.strokeStyle = "rgba(0,255,102,0.08)";
    ctx.stroke();

    // Segments
    for (let i = 0; i < segs; i++) {
      const start = i * segAngle + rot;
      const end = start + segAngle;

      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 16, start, end);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(0,0,0,0.8)";
      ctx.stroke();

      // Shimmer on even segments
      if (i % 2 === 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius - 16, start, end);
        ctx.clip();
        const mid = start + segAngle / 2;
        const shimmer = ctx.createLinearGradient(
          radius + Math.cos(mid) * 80,
          radius + Math.sin(mid) * 80,
          radius + Math.cos(mid) * (radius - 20),
          radius + Math.sin(mid) * (radius - 20),
        );
        shimmer.addColorStop(0, "rgba(255,255,255,0.0)");
        shimmer.addColorStop(0.5, "rgba(255,255,255,0.07)");
        shimmer.addColorStop(1, "rgba(255,255,255,0.0)");
        ctx.fillStyle = shimmer;
        ctx.fill();
        ctx.restore();
      }

      // Label
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(start + segAngle / 2);
      ctx.textAlign = "right";
      const isGreen = i % 2 === 0;
      ctx.fillStyle = isGreen ? "#000000" : "#00FF66";
      const fontSize = size < 320 ? 10 : size < 380 ? 12 : 15;
      ctx.font = `bold ${fontSize}px 'Segoe UI', sans-serif`;
      ctx.shadowColor = isGreen ? "transparent" : "rgba(0,255,102,0.5)";
      ctx.shadowBlur = 6;
      const maxLen = size < 320 ? 8 : size < 380 ? 10 : 14;
      const raw = teamMembersRef.current[i] || "";
      const label = raw.length > maxLen ? raw.slice(0, maxLen - 1) + "…" : raw;
      ctx.fillText(label, radius - 20, 5);
      ctx.restore();
    }

    // Outer glow ring
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#00FF66";
    ctx.shadowColor = "#00FF66";
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Hub
    const hubR = size < 320 ? 28 : size < 380 ? 36 : 48;
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

    // Hub dots
    for (let d = 0; d < 4; d++) {
      const bAngle = (d * Math.PI) / 2 + rot * 0.3;
      ctx.beginPath();
      ctx.arc(
        radius + Math.cos(bAngle) * (hubR * 0.46),
        radius + Math.sin(bAngle) * (hubR * 0.46),
        3,
        0,
        2 * Math.PI,
      );
      ctx.fillStyle = "#00FF66";
      ctx.fill();
    }

    // Center icon
    ctx.font = `${size < 320 ? 13 : 18}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎯", radius, radius);
  }, []); // no deps — reads everything from refs

  // Redraw whenever members, rotation, or wheelSize changes
  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [teamMembers, wheelSize, drawWheel]);

  const spawnConfetti = () => {
    const pieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ["#00FF66", "#00CC55", "#ffffff", "#00FF99"][
        Math.floor(Math.random() * 4)
      ],
      delay: Math.random() * 0.6,
      size: Math.random() * 8 + 4,
      shape: Math.random() > 0.5 ? "50%" : "2px",
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 2500);
  };

  const spin = () => {
    if (isSpinning || segments === 0) return;
    setIsSpinning(true);
    setWinner(null);
    setShowPopup(false);

    const spinDegrees = Math.random() * 2000 + 3000;
    const startRot = rotationRef.current;
    const finalRotation = startRot + (spinDegrees * Math.PI) / 180;
    const duration = 4500;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentRotation = startRot + (finalRotation - startRot) * easeOut;
      rotationRef.current = currentRotation;
      setRotation(currentRotation); // triggers canvas size sync
      drawWheel(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const segs = teamMembersRef.current.length;
        const segAngle = (2 * Math.PI) / segs;
        const topAngle = -Math.PI / 2;
        const relativeAngle =
          (((topAngle - currentRotation) % (2 * Math.PI)) + 2 * Math.PI) %
          (2 * Math.PI);
        const idx = Math.floor(relativeAngle / segAngle) % segs;
        const pickedName = teamMembersRef.current[idx];
        setWinner(pickedName);
        setShowPopup(true);
        setTotalSpins((s) => s + 1);
        setSpinHistory((h) => [
          { name: pickedName, time: new Date().toLocaleTimeString("ar-IQ") },
          ...h.slice(0, 4),
        ]);
        spawnConfetti();
      }
    };
    requestAnimationFrame(animate);
  };

  const handleKeep = () => setShowPopup(false);
  const handleRemove = () => {
    setRemovedMembers((r) => [...r, winner]);
    setTeamMembers((prev) => prev.filter((m) => m !== winner));
    setShowPopup(false);
    setWinner(null);
  };
  const handleRestore = (name) => {
    setRemovedMembers((r) => r.filter((m) => m !== name));
    setTeamMembers((prev) => [...prev, name]);
  };
  const handleAddMember = () => {
    const trimmed = newMemberName.trim();
    if (!trimmed) {
      setAddError("الاسم فارغ");
      return;
    }
    if (teamMembers.includes(trimmed) || removedMembers.includes(trimmed)) {
      setAddError("الاسم موجود مسبقاً");
      return;
    }
    setTeamMembers((prev) => [...prev, trimmed]);
    setNewMemberName("");
    setAddError("");
  };
  const handleDirectDelete = (name) => {
    setTeamMembers((prev) => prev.filter((m) => m !== name));
    if (winner === name) setWinner(null);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", direction: "rtl" }}>
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes popIn { 0%{opacity:0;transform:scale(0.7) translateY(20px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideDown { 0%{opacity:0;transform:translateY(-10px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes confettiFall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes floatUp { 0%{transform:translateY(0)} 50%{transform:translateY(-8px)} 100%{transform:translateY(0)} }
        @keyframes glowPulse {
          0%,100%{box-shadow:0 0 30px rgba(0,255,102,0.4)}
          50%{box-shadow:0 0 60px rgba(0,255,102,0.8)}
        }
        @keyframes spinAnim { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .spin-btn:hover:not(:disabled) { transform: scale(1.05) !important; }
        .member-row:hover .delete-btn { opacity: 1 !important; }
        .member-row:hover { background: rgba(0,255,102,0.1) !important; border-color: rgba(0,255,102,0.35) !important; }
        .add-input:focus { outline: none; border-color: rgba(0,255,102,0.6) !important; box-shadow: 0 0 12px rgba(0,255,102,0.15); }
        .manage-toggle:hover { background: rgba(0,255,102,0.12) !important; border-color: rgba(0,255,102,0.4) !important; }
        .restore-btn:hover { background: rgba(0,255,102,0.15) !important; color: #00FF66 !important; }
        .accordion-btn:hover { background: rgba(0,255,102,0.08) !important; }

        @media (max-width: 640px) { .delete-btn { opacity: 0.7 !important; } }

        .desktop-layout { display: flex; }
        .mobile-layout { display: none; }
        @media (max-width: 900px) {
          .desktop-layout { display: none !important; }
          .mobile-layout { display: block !important; }
        }
      `}</style>

      {confetti.map((c) => (
        <div
          key={c.id}
          style={{
            position: "fixed",
            left: `${c.x}%`,
            top: 0,
            width: c.size,
            height: c.size,
            background: c.color,
            borderRadius: c.shape,
            animation: `confettiFall 2.2s ease-in ${c.delay}s forwards`,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      ))}

      {showPopup && winner && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPopup(false);
          }}
        >
          <div
            style={{
              background: "linear-gradient(145deg, #0f0f0f, #1a1a1a)",
              border: "1px solid rgba(0,255,102,0.4)",
              borderRadius: 24,
              padding: "clamp(24px,6vw,40px) clamp(18px,5vw,48px)",
              maxWidth: 420,
              width: "100%",
              textAlign: "center",
              animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
              boxShadow:
                "0 0 80px rgba(0,255,102,0.2), 0 24px 80px rgba(0,0,0,0.6)",
              direction: "rtl",
            }}
          >
            <div
              style={{
                fontSize: 44,
                marginBottom: 8,
                animation: "floatUp 2s ease-in-out infinite",
              }}
            >
              👑
            </div>
            <p
              style={{
                color: "#555",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              تم الاختيار
            </p>
            <h2
              style={{
                color: "#00FF66",
                fontSize: "clamp(24px,7vw,38px)",
                fontWeight: 900,
                margin: "8px 0 4px",
                textShadow: "0 0 30px rgba(0,255,102,0.7)",
              }}
            >
              {winner}
            </h2>
            <p style={{ color: "#444", fontSize: 12, marginBottom: 28 }}>
              الدوران رقم {totalSpins}
            </p>
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(0,255,102,0.3), transparent)",
                marginBottom: 24,
              }}
            />
            <p style={{ color: "#777", fontSize: 13, marginBottom: 18 }}>
              ماذا تريد أن تفعل؟
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleKeep}
                style={{
                  flex: 1,
                  padding: "13px 0",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #00FF66, #00CC55)",
                  color: "#000",
                  fontWeight: 900,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(0,255,102,0.4)",
                  transition: "all 0.2s",
                }}
              >
                ✅ ابقِه
              </button>
              <button
                onClick={handleRemove}
                style={{
                  flex: 1,
                  padding: "13px 0",
                  borderRadius: 14,
                  background: "transparent",
                  color: "#ff4444",
                  fontWeight: 900,
                  fontSize: 15,
                  border: "1px solid rgba(255,68,68,0.4)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                🗑️ أزِله
              </button>
            </div>
          </div>
        </div>
      )}

      <section
        style={{
          position: "relative",
          width: "100%",
          padding: "clamp(40px,7vw,96px) 0 clamp(28px,5vw,64px)",
          overflow: "hidden",
          background: "#000",
          borderTop: "1px solid rgba(0,255,102,0.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,255,102,0.05) 0%, transparent 70%)",
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

        {/* Header */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            marginBottom: "clamp(20px,4vw,48px)",
            direction: "rtl",
            padding: "0 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
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
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
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
              fontSize: "clamp(28px,6vw,52px)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.02em",
              margin: "0 0 8px",
              lineHeight: 1.1,
            }}
          >
            اختيار{" "}
            <span
              style={{ color: "#00FF66", textShadow: "0 0 30px #00FF6660" }}
            >
              الفريق
            </span>
          </h2>
          <p style={{ color: "#444", fontSize: 14, margin: 0 }}>
            أدِر العجلة — القدر يختار من يستحق 🎯
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(16px,5vw,32px)",
              marginTop: 20,
            }}
          >
            {[
              { label: "أعضاء نشطون", value: teamMembers.length },
              { label: "إجمالي الأدوار", value: totalSpins },
              { label: "المحذوفون", value: removedMembers.length },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "clamp(18px,4vw,26px)",
                    fontWeight: 900,
                    color: "#00FF66",
                    textShadow: "0 0 15px rgba(0,255,102,0.4)",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: "clamp(9px,2vw,10px)",
                    color: "#555",
                    letterSpacing: "0.1em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop 3-col */}
        <div
          className="desktop-layout"
          style={{
            position: "relative",
            zIndex: 10,
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 48,
            flexWrap: "wrap",
            padding: "0 32px",
          }}
        >
          <div style={{ minWidth: 220, maxWidth: 240 }}>
            <DesktopMembersPanel
              teamMembers={teamMembers}
              winner={winner}
              newMemberName={newMemberName}
              setNewMemberName={setNewMemberName}
              addError={addError}
              setAddError={setAddError}
              handleAddMember={handleAddMember}
              handleDirectDelete={handleDirectDelete}
              showManagePanel={showManagePanel}
              setShowManagePanel={setShowManagePanel}
            />
            {removedMembers.length > 0 && (
              <RemovedPanel
                removedMembers={removedMembers}
                handleRestore={handleRestore}
              />
            )}
          </div>

          <WheelBlock
            canvasRef={canvasRef}
            wheelSize={wheelSize}
            isSpinning={isSpinning}
            winner={winner}
            showPopup={showPopup}
            segments={segments}
            spin={spin}
          />

          <div style={{ minWidth: 200, maxWidth: 220 }}>
            <HistoryPanel spinHistory={spinHistory} />
            <HowItWorksPanel />
          </div>
        </div>

        {/* Mobile stacked */}
        <div className="mobile-layout">
          <WheelBlock
            canvasRef={canvasRef}
            wheelSize={wheelSize}
            isSpinning={isSpinning}
            winner={winner}
            showPopup={showPopup}
            segments={segments}
            spin={spin}
          />

          <div
            style={{
              padding: "20px 14px 0",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Accordion
              label={`⚙️ إدارة الأعضاء (${teamMembers.length})`}
              open={showManagePanel}
              onToggle={() => setShowManagePanel((v) => !v)}
            >
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <input
                  className="add-input"
                  value={newMemberName}
                  onChange={(e) => {
                    setNewMemberName(e.target.value);
                    setAddError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddMember();
                  }}
                  placeholder="اسم العضو الجديد..."
                  style={{
                    flex: 1,
                    background: "rgba(0,255,102,0.05)",
                    border: "1px solid rgba(0,255,102,0.2)",
                    borderRadius: 10,
                    color: "#ddd",
                    fontSize: 14,
                    padding: "10px 12px",
                    direction: "rtl",
                    transition: "all 0.2s",
                  }}
                />
                <button
                  onClick={handleAddMember}
                  style={{
                    background: "linear-gradient(135deg, #00FF66, #00CC55)",
                    border: "none",
                    borderRadius: 10,
                    color: "#000",
                    fontWeight: 900,
                    fontSize: 20,
                    width: 42,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  +
                </button>
              </div>
              {addError && (
                <p
                  style={{ color: "#ff4444", fontSize: 11, margin: "0 0 8px" }}
                >
                  ⚠️ {addError}
                </p>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                  maxHeight: 280,
                  overflowY: "auto",
                }}
              >
                {teamMembers.map((name) => (
                  <div
                    key={name}
                    className="member-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 6,
                      padding: "8px 10px",
                      borderRadius: 8,
                      background:
                        winner === name
                          ? "rgba(0,255,102,0.1)"
                          : "rgba(0,255,102,0.04)",
                      border: `1px solid ${winner === name ? "rgba(0,255,102,0.35)" : "rgba(0,255,102,0.1)"}`,
                      transition: "all 0.2s",
                    }}
                  >
                    <span
                      style={{
                        color: "#ccc",
                        fontSize: 13,
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {name}
                    </span>
                    <button
                      className="delete-btn"
                      onClick={() => handleDirectDelete(name)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ff4444",
                        cursor: "pointer",
                        fontSize: 14,
                        padding: "2px",
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              {removedMembers.length > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid rgba(255,68,68,0.1)",
                  }}
                >
                  <p
                    style={{
                      color: "#ff4444",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      margin: "0 0 8px",
                    }}
                  >
                    🔴 المحذوفون
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {removedMembers.map((name) => (
                      <button
                        key={name}
                        onClick={() => handleRestore(name)}
                        style={{
                          background: "rgba(255,68,68,0.07)",
                          border: "1px solid rgba(255,68,68,0.2)",
                          borderRadius: 8,
                          color: "#888",
                          fontSize: 12,
                          padding: "6px 12px",
                          cursor: "pointer",
                          fontFamily: "'Segoe UI', sans-serif",
                        }}
                      >
                        {name} ↩
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Accordion>

            <Accordion
              label="🕐 سجل الأدوار"
              open={showHistoryPanel}
              onToggle={() => setShowHistoryPanel((v) => !v)}
            >
              {spinHistory.length === 0 ? (
                <p
                  style={{
                    color: "#333",
                    fontSize: 12,
                    textAlign: "center",
                    padding: "6px 0",
                  }}
                >
                  لا توجد أدوار بعد
                </p>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {spinHistory.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        borderRadius: 8,
                        background:
                          i === 0
                            ? "rgba(0,255,102,0.08)"
                            : "rgba(255,255,255,0.02)",
                        border: `1px solid ${i === 0 ? "rgba(0,255,102,0.25)" : "rgba(255,255,255,0.04)"}`,
                      }}
                    >
                      <span
                        style={{
                          color: i === 0 ? "#00FF66" : "#666",
                          fontSize: 13,
                          fontWeight: i === 0 ? 700 : 400,
                        }}
                      >
                        {h.name}
                      </span>
                      <span style={{ color: "#333", fontSize: 10 }}>
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Accordion>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            marginTop: 48,
            paddingTop: 28,
            borderTop: "1px solid rgba(0,255,102,0.08)",
          }}
        >
          <p
            style={{
              color: "#222",
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            مدعوم بالقدر والكثير من اللون الأخضر ●
          </p>
        </div>
      </section>
    </div>
  );
}

function WheelBlock({
  canvasRef,
  wheelSize,
  isSpinning,
  winner,
  showPopup,
  segments,
  spin,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        padding: "0 8px",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
              animation: isSpinning
                ? "glowPulse 0.5s ease-in-out infinite"
                : "none",
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
            {/* canvas width/height must match wheelSize so drawWheel reads correct size */}
            <canvas
              ref={canvasRef}
              width={wheelSize}
              height={wheelSize}
              style={{ borderRadius: "50%", display: "block" }}
            />
          </div>
        </div>
      </div>

      {winner && !showPopup ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderRadius: 14,
            padding: "12px 24px",
            border: "1px solid rgba(0,255,102,0.4)",
            background:
              "linear-gradient(135deg, rgba(0,255,102,0.12), rgba(0,255,102,0.04))",
            boxShadow: "0 0 30px rgba(0,255,102,0.15)",
          }}
        >
          <span style={{ fontSize: 20 }}>🎯</span>
          <div>
            <p
              style={{
                color: "#555",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                margin: 0,
              }}
            >
              آخر مختار
            </p>
            <p
              style={{
                color: "#00FF66",
                fontWeight: 900,
                fontSize: "clamp(15px,4vw,20px)",
                textShadow: "0 0 20px #00FF6680",
                margin: 0,
                direction: "rtl",
              }}
            >
              {winner}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ height: 56 }} />
      )}

      <button
        className="spin-btn"
        onClick={spin}
        disabled={isSpinning || segments === 0}
        style={{
          position: "relative",
          overflow: "hidden",
          fontWeight: 900,
          fontSize: "clamp(14px,4vw,18px)",
          letterSpacing: "0.08em",
          padding: "clamp(12px,3vw,18px) clamp(28px,8vw,64px)",
          borderRadius: 18,
          width: "clamp(200px,78vw,320px)",
          background:
            isSpinning || segments === 0
              ? "linear-gradient(135deg, #1a1a1a, #111)"
              : "linear-gradient(135deg, #00FF66, #00CC55)",
          color: isSpinning || segments === 0 ? "#444" : "#000",
          boxShadow:
            isSpinning || segments === 0
              ? "none"
              : "0 0 30px rgba(0,255,102,0.5), 0 4px 20px rgba(0,0,0,0.4)",
          cursor: isSpinning || segments === 0 ? "not-allowed" : "pointer",
          border: isSpinning || segments === 0 ? "1px solid #222" : "none",
          transition: "all 0.3s",
        }}
      >
        {!isSpinning && segments > 0 && (
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
                display: "inline-block",
                width: 16,
                height: 16,
                border: "2px solid #555",
                borderTop: "2px solid #888",
                borderRadius: "50%",
                animation: "spinAnim 0.7s linear infinite",
              }}
            />
            جاري الدوران...
          </span>
        ) : segments === 0 ? (
          "لا يوجد أعضاء 😅"
        ) : (
          "🎯 أدِر العجلة"
        )}
      </button>

      {segments > 0 && (
        <p
          style={{
            color: "#333",
            fontSize: 11,
            margin: 0,
            letterSpacing: "0.08em",
          }}
        >
          {segments} {segments === 1 ? "عضو" : "أعضاء"} على العجلة
        </p>
      )}
    </div>
  );
}

function Accordion({ label, open, onToggle, children }) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #0d0d0d, #111)",
        border: "1px solid rgba(0,255,102,0.18)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <button
        className="accordion-btn"
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          background: "none",
          border: "none",
          color: "#00FF66",
          fontFamily: "'Segoe UI', sans-serif",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <span>{label}</span>
        <span
          style={{
            fontSize: 10,
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "0 16px 16px",
            animation: "slideDown 0.2s ease forwards",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function DesktopMembersPanel({
  teamMembers,
  winner,
  newMemberName,
  setNewMemberName,
  addError,
  setAddError,
  handleAddMember,
  handleDirectDelete,
  showManagePanel,
  setShowManagePanel,
}) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #0d0d0d, #111)",
        border: "1px solid rgba(0,255,102,0.25)",
        borderRadius: 16,
        padding: "20px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <p
          style={{
            color: "#00FF66",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          ⚙️ إدارة الأعضاء
        </p>
        <button
          className="manage-toggle"
          onClick={() => setShowManagePanel((v) => !v)}
          style={{
            background: "rgba(0,255,102,0.06)",
            border: "1px solid rgba(0,255,102,0.2)",
            borderRadius: 8,
            color: "#00FF66",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 10px",
            cursor: "pointer",
            transition: "all 0.2s",
            letterSpacing: "0.1em",
          }}
        >
          {showManagePanel ? "إخفاء ▲" : "إظهار ▼"}
        </button>
      </div>

      {showManagePanel && (
        <div style={{ animation: "slideDown 0.2s ease forwards" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              className="add-input"
              value={newMemberName}
              onChange={(e) => {
                setNewMemberName(e.target.value);
                setAddError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddMember();
              }}
              placeholder="اسم العضو الجديد..."
              style={{
                flex: 1,
                background: "rgba(0,255,102,0.05)",
                border: "1px solid rgba(0,255,102,0.2)",
                borderRadius: 8,
                color: "#ddd",
                fontSize: 13,
                padding: "9px 12px",
                direction: "rtl",
                transition: "all 0.2s",
              }}
            />
            <button
              onClick={handleAddMember}
              style={{
                background: "linear-gradient(135deg, #00FF66, #00CC55)",
                border: "none",
                borderRadius: 8,
                color: "#000",
                fontWeight: 900,
                fontSize: 18,
                width: 38,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 12px rgba(0,255,102,0.3)",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              +
            </button>
          </div>
          {addError && (
            <p
              style={{
                color: "#ff4444",
                fontSize: 11,
                margin: "0 0 8px",
                direction: "rtl",
              }}
            >
              ⚠️ {addError}
            </p>
          )}
          <p
            style={{
              color: "#333",
              fontSize: 10,
              margin: "0 0 10px",
              textAlign: "right",
            }}
          >
            مرّر على اسم ثم اضغط 🗑️ لحذفه
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            {teamMembers.length === 0 && (
              <p
                style={{
                  color: "#333",
                  fontSize: 12,
                  textAlign: "center",
                  padding: "8px 0",
                }}
              >
                لا يوجد أعضاء
              </p>
            )}
            {teamMembers.map((name, i) => (
              <div
                key={name}
                className="member-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 10px",
                  borderRadius: 8,
                  background: "rgba(0,255,102,0.04)",
                  border: "1px solid rgba(0,255,102,0.1)",
                  transition: "all 0.2s",
                }}
              >
                <span
                  style={{
                    color: "#00FF66",
                    fontSize: 9,
                    fontWeight: 700,
                    opacity: 0.4,
                    minWidth: 16,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    color: "#ccc",
                    fontSize: 13,
                    fontWeight: 600,
                    direction: "rtl",
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  {name}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => handleDirectDelete(name)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff4444",
                    cursor: "pointer",
                    fontSize: 13,
                    padding: "2px 4px",
                    borderRadius: 4,
                    opacity: 0,
                    transition: "opacity 0.2s",
                    lineHeight: 1,
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showManagePanel && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {teamMembers.map((name, i) => (
            <div
              key={name}
              className="member-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 8,
                background:
                  winner === name
                    ? "rgba(0,255,102,0.1)"
                    : "rgba(0,255,102,0.06)",
                border: `1px solid ${winner === name ? "rgba(0,255,102,0.4)" : "rgba(0,255,102,0.15)"}`,
                transition: "all 0.2s",
              }}
            >
              <span
                style={{
                  color: "#00FF66",
                  fontSize: 10,
                  fontWeight: 700,
                  opacity: 0.5,
                  minWidth: 18,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  color: "#ddd",
                  fontSize: 13,
                  fontWeight: 600,
                  direction: "rtl",
                  flex: 1,
                  textAlign: "right",
                }}
              >
                {name}
              </span>
              <button
                className="delete-btn"
                onClick={() => handleDirectDelete(name)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff4444",
                  cursor: "pointer",
                  fontSize: 13,
                  padding: "2px 4px",
                  borderRadius: 4,
                  opacity: 0,
                  transition: "opacity 0.2s",
                  lineHeight: 1,
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RemovedPanel({ removedMembers, handleRestore }) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #0d0d0d, #111)",
        border: "1px solid rgba(255,68,68,0.15)",
        borderRadius: 16,
        padding: "20px",
      }}
    >
      <p
        style={{
          color: "#ff4444",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          margin: "0 0 14px",
        }}
      >
        🔴 المحذوفون
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {removedMembers.map((name) => (
          <div
            key={name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderRadius: 8,
              background: "rgba(255,68,68,0.05)",
              border: "1px solid rgba(255,68,68,0.15)",
            }}
          >
            <span style={{ color: "#888", fontSize: 13 }}>{name}</span>
            <button
              className="restore-btn"
              onClick={() => handleRestore(name)}
              style={{
                background: "none",
                border: "none",
                color: "#555",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 4,
                transition: "all 0.2s",
              }}
            >
              ↩
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryPanel({ spinHistory }) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #0d0d0d, #111)",
        border: "1px solid rgba(0,255,102,0.15)",
        borderRadius: 16,
        padding: "20px",
        marginBottom: 16,
      }}
    >
      <p
        style={{
          color: "#00FF66",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          margin: "0 0 14px",
        }}
      >
        🕐 سجل الأدوار
      </p>
      {spinHistory.length === 0 ? (
        <p
          style={{
            color: "#333",
            fontSize: 12,
            textAlign: "center",
            padding: "12px 0",
          }}
        >
          لا توجد أدوار بعد
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {spinHistory.map((h, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: 8,
                background:
                  i === 0 ? "rgba(0,255,102,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === 0 ? "rgba(0,255,102,0.25)" : "rgba(255,255,255,0.04)"}`,
              }}
            >
              <span
                style={{
                  color: i === 0 ? "#00FF66" : "#666",
                  fontSize: 13,
                  fontWeight: i === 0 ? 700 : 400,
                  direction: "rtl",
                }}
              >
                {h.name}
              </span>
              <span style={{ color: "#333", fontSize: 10 }}>{h.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HowItWorksPanel() {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #0d0d0d, #111)",
        border: "1px solid rgba(0,255,102,0.1)",
        borderRadius: 16,
        padding: "20px",
      }}
    >
      <p
        style={{
          color: "#00FF66",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          margin: "0 0 14px",
        }}
      >
        ⚡ كيف تعمل؟
      </p>
      {[
        { icon: "🎯", text: "اضغط أدِر — العجلة تنطلق" },
        { icon: "👑", text: "يظهر الفائز في نافذة منبثقة" },
        { icon: "✅", text: "ابقِه أو احذفه من العجلة" },
        { icon: "➕", text: "أضف أعضاء من لوحة الإدارة" },
        { icon: "🗑️", text: "مرّر على اسم لحذفه فوراً" },
        { icon: "↩", text: "استعد المحذوفين في أي وقت" },
      ].map((step, i, arr) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 10,
            marginBottom: i < arr.length - 1 ? 10 : 0,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 14 }}>{step.icon}</span>
          <span style={{ color: "#555", fontSize: 12, lineHeight: 1.4 }}>
            {step.text}
          </span>
        </div>
      ))}
    </div>
  );
}
