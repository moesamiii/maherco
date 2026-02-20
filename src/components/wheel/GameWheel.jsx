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
  const rotationRef = useRef(0);

  const size = 460;

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

  const drawWheel = (rotation) => {
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
      ctx.font = "bold 13px 'Cairo', 'Segoe UI', sans-serif";
      ctx.shadowColor = isGreen ? "transparent" : "rgba(0,255,102,0.5)";
      ctx.shadowBlur = 6;
      const label =
        games[i].length > 14 ? games[i].slice(0, 13) + "…" : games[i];
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

    ctx.beginPath();
    ctx.arc(radius, radius, 48, 0, 2 * Math.PI);
    const hubGrad = ctx.createRadialGradient(
      radius - 8,
      radius - 8,
      0,
      radius,
      radius,
      48,
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
        radius + Math.cos(bAngle) * 22,
        radius + Math.sin(bAngle) * 22,
        4,
        0,
        2 * Math.PI,
      );
      ctx.fillStyle = "#00FF66";
      ctx.fill();
    }

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎮", radius, radius);
  };

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [games]);

  const spin = () => {
    if (isSpinning || games.length < 2) return;
    setIsSpinning(true);
    setWinner(null);
    setShowPopup(false);

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
      drawWheel(currentRotation);

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

  const keepWinner = () => {
    setShowPopup(false);
  };

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
      className="relative flex flex-row items-center justify-center min-h-screen bg-black overflow-hidden px-4 gap-8"
      style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap"
        rel="stylesheet"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,255,102,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#00FF66 1px, transparent 1px), linear-gradient(90deg, #00FF66 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Left: Editor Panel (RTL = appears on right visually) */}
      <div
        className="relative z-10 flex flex-col w-72"
        style={{ maxHeight: "600px" }}
      >
        <div
          className="rounded-2xl border p-4 flex flex-col gap-3 h-full"
          style={{
            background: "linear-gradient(145deg, #111, #0a0a0a)",
            borderColor: "rgba(0,255,102,0.2)",
            boxShadow: "0 0 40px rgba(0,255,102,0.05)",
          }}
        >
          <h3
            className="text-green-400 font-black text-sm tracking-widest uppercase"
            style={{ textShadow: "0 0 10px #00FF6640" }}
          >
            🎮 تعديل الخيارات
          </h3>
          <p className="text-gray-600 text-xs">
            {games.length} خيارات · الحد الأدنى 2 للدوران
          </p>

          {/* Add new */}
          <div className="flex gap-2">
            <input
              value={newGame}
              onChange={(e) => setNewGame(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGame()}
              placeholder="اكتب اسم لعبة..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="flex-1 bg-transparent text-white text-sm px-3 py-2 rounded-xl outline-none"
              style={{
                border: "1px solid rgba(0,255,102,0.25)",
                caretColor: "#00FF66",
                direction: "rtl",
              }}
            />
            <button
              onClick={addGame}
              className="text-black font-black text-sm px-3 py-2 rounded-xl transition-all"
              style={{
                background: "linear-gradient(135deg, #00FF66, #00CC55)",
                minWidth: "40px",
              }}
            >
              +
            </button>
          </div>

          {/* Game list */}
          <div
            className="flex-1 overflow-y-auto flex flex-col gap-2 pl-1"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#00FF6630 transparent",
            }}
          >
            {games.map((game, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl px-3 py-2 group"
                style={{
                  background:
                    winner === game
                      ? "rgba(0,255,102,0.1)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    winner === game
                      ? "1px solid rgba(0,255,102,0.4)"
                      : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: colors[i % colors.length] }}
                />
                {editingIndex === i ? (
                  <input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") setEditingIndex(null);
                    }}
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                    className="flex-1 bg-transparent text-white text-sm outline-none"
                    style={{
                      borderBottom: "1px solid #00FF66",
                      direction: "rtl",
                    }}
                  />
                ) : (
                  <span className="flex-1 text-white text-sm truncate">
                    {game}
                  </span>
                )}
                {editingIndex === i ? (
                  <button
                    onClick={saveEdit}
                    className="text-green-400 text-xs font-bold hover:text-green-300"
                  >
                    ✓
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(i)}
                    className="text-gray-600 text-xs hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✎
                  </button>
                )}
                <button
                  onClick={() => deleteGame(i)}
                  disabled={games.length <= 2}
                  className="text-gray-600 text-xs hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Wheel */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-center mb-6">
          <p className="text-green-400 text-xs font-bold tracking-[0.3em] uppercase mb-2 opacity-70">
            ● بث مباشر على Kick
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            عجلة{" "}
            <span
              className="text-green-400"
              style={{ textShadow: "0 0 30px #00FF6660" }}
            >
              الألعاب
            </span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            ادوّر العجلة واختار لعبة الليلة
          </p>
        </div>

        <div className="relative flex flex-col items-center gap-3">
          {/* Pointer */}
          <div
            className="absolute z-20"
            style={{ top: "-14px", filter: "drop-shadow(0 0 10px #00FF66)" }}
          >
            <svg width="28" height="36" viewBox="0 0 28 36">
              <polygon points="14,36 0,0 28,0" fill="#00FF66" />
              <polygon points="14,30 4,4 24,4" fill="#003d1a" />
            </svg>
          </div>

          {/* Wheel */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                boxShadow:
                  "0 0 80px rgba(0,255,102,0.25), 0 0 160px rgba(0,255,102,0.1)",
              }}
            />
            <div
              className="relative rounded-full p-3"
              style={{
                background: "linear-gradient(145deg, #1a1a1a, #0a0a0a)",
                boxShadow: "inset 0 2px 4px rgba(255,255,255,0.05)",
              }}
            >
              <canvas
                ref={canvasRef}
                width={size}
                height={size}
                className="rounded-full block"
              />
            </div>
          </div>

          {/* Spin Button */}
          <button
            onClick={spin}
            disabled={isSpinning || games.length < 2}
            className="relative overflow-hidden font-black text-lg tracking-widest uppercase transition-all duration-300"
            style={{
              padding: "14px 52px",
              borderRadius: "16px",
              background: isSpinning
                ? "linear-gradient(135deg, #1a1a1a, #111)"
                : "linear-gradient(135deg, #00FF66, #00CC55)",
              color: isSpinning ? "#444" : "#000",
              boxShadow: isSpinning
                ? "none"
                : "0 0 30px rgba(0,255,102,0.5), 0 4px 20px rgba(0,0,0,0.4)",
              cursor: isSpinning ? "not-allowed" : "pointer",
              border: isSpinning ? "1px solid #222" : "none",
              fontFamily: "'Cairo', sans-serif",
            }}
            onMouseEnter={(e) => {
              if (!isSpinning) e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {!isSpinning && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                  transform: "translateX(-100%)",
                  animation: "shimmer 2.5s infinite",
                }}
              />
            )}
            <style>{`@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }`}</style>
            {isSpinning ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
                جاري الدوران...
              </span>
            ) : (
              "🎰 دوّر العجلة"
            )}
          </button>
        </div>
      </div>

      {/* Winner Popup */}
      {showPopup && winner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="flex flex-col items-center gap-6 rounded-3xl p-10 text-center"
            style={{
              background: "linear-gradient(145deg, #151515, #0a0a0a)",
              border: "1px solid rgba(0,255,102,0.4)",
              boxShadow:
                "0 0 80px rgba(0,255,102,0.2), 0 0 160px rgba(0,255,102,0.08)",
              maxWidth: "380px",
              width: "90%",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            <div className="text-5xl">🏆</div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-2">
                الليلة نلعب
              </p>
              <p
                className="text-green-400 font-black text-3xl"
                style={{ textShadow: "0 0 30px #00FF6680" }}
              >
                {winner}
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              تبي تشيل اللعبة من العجلة أو تخليها للمرة الجاية؟
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={deleteWinner}
                className="flex-1 font-bold text-sm py-3 rounded-xl transition-all hover:scale-105"
                style={{
                  background: "rgba(255,60,60,0.15)",
                  border: "1px solid rgba(255,60,60,0.4)",
                  color: "#ff6060",
                  fontFamily: "'Cairo', sans-serif",
                }}
              >
                🗑 احذفها
              </button>
              <button
                onClick={keepWinner}
                className="flex-1 font-bold text-sm py-3 rounded-xl transition-all hover:scale-105 text-black"
                style={{
                  background: "linear-gradient(135deg, #00FF66, #00CC55)",
                  boxShadow: "0 0 20px rgba(0,255,102,0.4)",
                  fontFamily: "'Cairo', sans-serif",
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
