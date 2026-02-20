import React, { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vvuspbyvwabftxxlpyku.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dXNwYnl2d2FiZnR4eGxweWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODYzNjksImV4cCI6MjA4NzE2MjM2OX0.j0vLcW2aN9bSr_8-uDdNDaifeCnaInQzAM6virkO5Zg";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const VOTE_DURATION = 180;

const GAMES = [
  {
    id: "rocket_league",
    label: "Rocket League",
    emoji: "🚀",
    desc: "سيارات + كرة قدم = إثارة لا توقف",
  },
  { id: "cs2", label: "CS2", emoji: "🔫", desc: "تكتيك، دقة، وأعصاب فولاذية" },
  { id: "pubg", label: "PUBG", emoji: "🪖", desc: "العب أو تُحذف من الخريطة" },
];

const EMPTY_VOTES = { rocket_league: 0, cs2: 0, pubg: 0 };

const getOrCreateVoterId = () => {
  try {
    let id = localStorage.getItem("voter_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("voter_id", id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
};

export default function ViewerVoteSection() {
  const [session, setSession] = useState(null);
  const [votes, setVotes] = useState(EMPTY_VOTES);
  const [myVote, setMyVote] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [dbError, setDbError] = useState(null);

  const timerRef = useRef(null);
  const channelRef = useRef(null);
  const voterId = useRef(getOrCreateVoterId());

  // ── helpers ──────────────────────────────────────────────────────────────────
  const fetchVotes = useCallback(async (sessionId) => {
    const { data, error } = await supabase
      .from("votes")
      .select("game_id")
      .eq("session_id", sessionId);
    if (error) {
      console.error("fetchVotes:", error.message);
      return;
    }
    const counts = { ...EMPTY_VOTES };
    data.forEach((r) => {
      if (counts[r.game_id] !== undefined) counts[r.game_id]++;
    });
    setVotes(counts);
  }, []);

  const checkMyVote = useCallback(async (sessionId) => {
    const { data } = await supabase
      .from("votes")
      .select("game_id")
      .eq("session_id", sessionId)
      .eq("voter_id", voterId.current)
      .maybeSingle();
    if (data) setMyVote(data.game_id);
  }, []);

  const applySession = useCallback(
    async (data) => {
      const now = Date.now();
      const endsAt = new Date(data.ends_at).getTime();
      const active = data.is_active && endsAt > now;
      setSession(data);
      await fetchVotes(data.id);
      await checkMyVote(data.id);
      if (active) {
        setPhase("active");
        setTimeLeft(Math.ceil((endsAt - now) / 1000));
      } else {
        setPhase("ended");
        setTimeLeft(0);
      }
    },
    [fetchVotes, checkMyVote],
  );

  const loadSession = useCallback(async () => {
    setLoading(true);
    setDbError(null);
    const { data, error } = await supabase
      .from("vote_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.error("loadSession:", error.message);
      setDbError(error.message);
      setPhase("idle");
    } else if (!data) {
      setPhase("idle");
    } else {
      await applySession(data);
    }
    setLoading(false);
  }, [applySession]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!cancelled) await loadSession();
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [loadSession]);

  // ── realtime: listen for new sessions AND new votes ───────────────────────────
  useEffect(() => {
    // Listen for new/updated vote_sessions so all viewers auto-switch to active
    const sessionChannel = supabase
      .channel("vote_sessions_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vote_sessions" },
        async (payload) => {
          if (payload.new) await applySession(payload.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionChannel);
    };
  }, [applySession]);

  useEffect(() => {
    if (!session) return;
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    channelRef.current = supabase
      .channel(`votes_${session.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "votes",
          filter: `session_id=eq.${session.id}`,
        },
        () => fetchVotes(session.id),
      )
      .subscribe();
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [session, fetchVotes]);

  // ── countdown ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    clearInterval(timerRef.current);
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase("ended");
          if (session)
            supabase
              .from("vote_sessions")
              .update({ is_active: false })
              .eq("id", session.id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, session]);

  // ── start session ─────────────────────────────────────────────────────────────
  const startSession = async () => {
    if (starting || phase === "active") return;
    setStarting(true);
    setDbError(null);

    // close previous
    await supabase
      .from("vote_sessions")
      .update({ is_active: false })
      .eq("is_active", true);

    const endsAt = new Date(Date.now() + VOTE_DURATION * 1000).toISOString();
    const { data, error } = await supabase
      .from("vote_sessions")
      .insert({ ends_at: endsAt, is_active: true })
      .select()
      .single();

    if (error) {
      console.error("startSession:", error.message);
      setDbError(`خطأ: ${error.message}`);
    } else if (data) {
      setSession(data);
      setVotes({ ...EMPTY_VOTES });
      setMyVote(null);
      setPhase("active");
      setTimeLeft(VOTE_DURATION);
    }
    setStarting(false);
  };

  // ── vote ──────────────────────────────────────────────────────────────────────
  const handleVote = async (gameId) => {
    if (myVote || phase !== "active" || !session) return;
    setMyVote(gameId);
    setVotes((prev) => ({ ...prev, [gameId]: prev[gameId] + 1 }));
    const { error } = await supabase.from("votes").insert({
      session_id: session.id,
      game_id: gameId,
      voter_id: voterId.current,
    });
    if (error) {
      console.error("handleVote:", error.message);
      // rollback optimistic update
      setMyVote(null);
      setVotes((prev) => ({ ...prev, [gameId]: prev[gameId] - 1 }));
      setDbError(`فشل التصويت: ${error.message}`);
    }
  };

  // ── derived ───────────────────────────────────────────────────────────────────
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const getPercent = (id) =>
    totalVotes === 0 ? 0 : Math.round((votes[id] / totalVotes) * 100);
  const leadingGame = GAMES.reduce((a, b) =>
    votes[a.id] >= votes[b.id] ? a : b,
  );
  const isWinner = (id) =>
    phase === "ended" && totalVotes > 0 && id === leadingGame.id;

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const timerPct = VOTE_DURATION > 0 ? (timeLeft / VOTE_DURATION) * 100 : 0;
  const timerColor =
    timeLeft > 60 ? "#00FF66" : timeLeft > 20 ? "#FFB800" : "#FF4444";

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        padding: "80px 0 64px",
        overflow: "hidden",
        background: "#000",
        borderTop: "1px solid rgba(0,255,102,0.2)",
        fontFamily: "'Segoe UI', sans-serif",
        direction: "rtl",
      }}
    >
      <style>{`
        @keyframes pulseGreen { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes winnerPop { 0%{transform:scale(1)} 50%{transform:scale(1.03)} 100%{transform:scale(1)} }
        @keyframes spinLoader { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        .vote-card { transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s; }
        .vote-card:hover:not(.no-hover) { border-color: #00FF66 !important; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,255,102,0.15) !important; }
        .vote-btn:hover { transform: scale(1.06); box-shadow: 0 0 24px rgba(0,255,102,0.6) !important; }
        .start-btn:hover:not(:disabled) { transform: scale(1.04) !important; box-shadow: 0 0 40px rgba(0,255,102,0.7) !important; }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,255,102,0.05) 0%, transparent 70%)",
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

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 680,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: phase === "active" ? "#00FF66" : "#444",
                animation:
                  phase === "active" ? "pulseGreen 1.4s infinite" : "none",
              }}
            />
            <span
              style={{
                color: phase === "active" ? "#00FF66" : "#444",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                opacity: 0.85,
              }}
            >
              {phase === "active" ? "تصويت نشط الآن" : "بث مباشر على Kick"}
            </span>
          </div>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 8px",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            تصويت{" "}
            <span
              style={{ color: "#00FF66", textShadow: "0 0 30px #00FF6660" }}
            >
              المشتركين
            </span>
          </h2>
          <p style={{ color: "#444", fontSize: 14, margin: 0 }}>
            صوّت للعبة القادمة — أنت من يقرر! 🎮
          </p>
        </div>

        {/* DB Error */}
        {dbError && (
          <div
            style={{
              marginBottom: 20,
              padding: "12px 18px",
              background: "rgba(255,68,68,0.08)",
              border: "1px solid rgba(255,68,68,0.3)",
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <p style={{ color: "#ff6666", fontSize: 12, margin: 0 }}>
              ⚠️ {dbError}
            </p>
            <p style={{ color: "#555", fontSize: 11, margin: "4px 0 0" }}>
              تأكد من إعداد RLS policies في Supabase
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid #111",
                borderTop: "3px solid #00FF66",
                borderRadius: "50%",
                animation: "spinLoader 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: "#444", fontSize: 13 }}>جاري التحميل...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 32,
                background: "linear-gradient(135deg, #0d0d0d, #111)",
                border: "1px solid rgba(0,255,102,0.12)",
                borderRadius: 18,
                overflow: "hidden",
              }}
            >
              {[
                { label: "إجمالي الأصوات", value: totalVotes },
                {
                  label: "المتصدر",
                  value:
                    phase !== "idle" && totalVotes > 0
                      ? `${leadingGame.emoji} ${leadingGame.label}`
                      : "—",
                },
                {
                  label: "أعلى نسبة",
                  value:
                    phase !== "idle" && totalVotes > 0
                      ? `${getPercent(leadingGame.id)}%`
                      : "—",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "20px 12px",
                    borderLeft:
                      i > 0 ? "1px solid rgba(0,255,102,0.08)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: i === 0 ? "#fff" : "#00FF66",
                      textShadow:
                        i > 0 ? "0 0 12px rgba(0,255,102,0.4)" : "none",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#444",
                      letterSpacing: "0.12em",
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Timer */}
            {phase === "active" && (
              <div style={{ marginBottom: 28, animation: "fadeIn 0.4s ease" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      color: "#555",
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    ⏱ الوقت المتبقي
                  </span>
                  <span
                    style={{
                      color: timerColor,
                      fontWeight: 900,
                      fontSize: 22,
                      fontVariantNumeric: "tabular-nums",
                      textShadow: `0 0 12px ${timerColor}80`,
                      transition: "color 0.4s",
                    }}
                  >
                    {mm}:{ss}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "#111",
                    borderRadius: 999,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${timerPct}%`,
                      background: `linear-gradient(90deg, ${timerColor}, ${timerColor}aa)`,
                      borderRadius: 999,
                      transition: "width 1s linear, background 0.4s",
                      boxShadow: `0 0 10px ${timerColor}60`,
                    }}
                  />
                </div>
                <p
                  style={{
                    color: "#333",
                    fontSize: 11,
                    textAlign: "center",
                    marginTop: 6,
                  }}
                >
                  التصويت ينتهي بعد {mm}:{ss}
                </p>
              </div>
            )}

            {/* Winner banner */}
            {phase === "ended" && totalVotes > 0 && (
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 28,
                  padding: "20px 24px",
                  background:
                    "linear-gradient(135deg, rgba(0,255,102,0.1), rgba(0,255,102,0.04))",
                  border: "1px solid rgba(0,255,102,0.35)",
                  borderRadius: 16,
                  animation: "fadeIn 0.5s ease",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 6 }}>
                  {leadingGame.emoji}
                </div>
                <p
                  style={{
                    color: "#555",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    margin: "0 0 4px",
                  }}
                >
                  🏆 الفائز بالتصويت
                </p>
                <p
                  style={{
                    color: "#00FF66",
                    fontSize: 28,
                    fontWeight: 900,
                    margin: "0 0 4px",
                    textShadow: "0 0 20px rgba(0,255,102,0.6)",
                  }}
                >
                  {leadingGame.label}
                </p>
                <p style={{ color: "#444", fontSize: 12, margin: 0 }}>
                  بنسبة {getPercent(leadingGame.id)}% من الأصوات
                </p>
              </div>
            )}

            {phase === "ended" && totalVotes === 0 && (
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 28,
                  padding: "16px 24px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                }}
              >
                <p style={{ color: "#444", fontSize: 13 }}>
                  انتهى التصويت — لم يُسجَّل أي صوت
                </p>
              </div>
            )}

            {phase === "idle" && (
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 28,
                  padding: "20px",
                  background: "rgba(0,255,102,0.03)",
                  border: "1px solid rgba(0,255,102,0.1)",
                  borderRadius: 16,
                }}
              >
                <p style={{ color: "#555", fontSize: 13, margin: 0 }}>
                  ⏳ لا يوجد تصويت نشط — انتظر المذيع ليبدأ الجلسة
                </p>
              </div>
            )}

            {/* Vote Cards */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginBottom: 28,
              }}
            >
              {GAMES.map((game) => {
                const pct = getPercent(game.id);
                const isMyVote = myVote === game.id;
                const hasVoted = !!myVote;
                const winner = isWinner(game.id);
                const canVote = phase === "active" && !hasVoted;
                const showBar = hasVoted || phase === "ended";

                return (
                  <div
                    key={game.id}
                    className={`vote-card${!canVote ? " no-hover" : ""}`}
                    onClick={() => canVote && handleVote(game.id)}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 18,
                      border: `1px solid ${winner ? "#00FF66" : isMyVote ? "rgba(0,255,102,0.6)" : "rgba(0,255,102,0.15)"}`,
                      background: "linear-gradient(135deg, #0f0f0f, #0d0d0d)",
                      boxShadow: winner
                        ? "0 0 40px rgba(0,255,102,0.25)"
                        : isMyVote
                          ? "0 0 20px rgba(0,255,102,0.1)"
                          : "none",
                      cursor: canVote ? "pointer" : "default",
                      animation: winner ? "winnerPop 1s ease 0.3s" : "none",
                    }}
                  >
                    {showBar && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          width: `${pct}%`,
                          background: winner
                            ? "linear-gradient(90deg, rgba(0,255,102,0.22), rgba(0,255,102,0.06))"
                            : isMyVote
                              ? "linear-gradient(90deg, rgba(0,255,102,0.12), rgba(0,255,102,0.03))"
                              : "linear-gradient(90deg, rgba(255,255,255,0.03), transparent)",
                          transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                          borderRadius: 18,
                        }}
                      />
                    )}
                    {winner && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          background:
                            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
                          animation: "shimmer 2s infinite",
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "18px 22px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 32,
                            lineHeight: 1,
                            filter: winner
                              ? "drop-shadow(0 0 8px rgba(0,255,102,0.5))"
                              : "none",
                          }}
                        >
                          {game.emoji}
                        </span>
                        <div>
                          <p
                            style={{
                              color: "#fff",
                              fontWeight: 900,
                              fontSize: 17,
                              margin: "0 0 2px",
                            }}
                          >
                            {game.label}
                          </p>
                          <p style={{ color: "#444", fontSize: 11, margin: 0 }}>
                            {game.desc}
                          </p>
                          {winner && (
                            <p
                              style={{
                                color: "#00FF66",
                                fontSize: 11,
                                fontWeight: 700,
                                margin: "4px 0 0",
                                letterSpacing: "0.12em",
                              }}
                            >
                              🏆 الفائز
                            </p>
                          )}
                          {isMyVote && !winner && (
                            <p
                              style={{
                                color: "#00FF66",
                                fontSize: 11,
                                fontWeight: 700,
                                margin: "4px 0 0",
                              }}
                            >
                              ✓ صوتك
                            </p>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          flexShrink: 0,
                        }}
                      >
                        {showBar && (
                          <div style={{ textAlign: "left" }}>
                            <p
                              style={{
                                color: winner || isMyVote ? "#00FF66" : "#666",
                                fontWeight: 900,
                                fontSize: 24,
                                margin: 0,
                                textShadow: winner
                                  ? "0 0 16px rgba(0,255,102,0.5)"
                                  : "none",
                              }}
                            >
                              {pct}%
                            </p>
                            <p
                              style={{ color: "#333", fontSize: 11, margin: 0 }}
                            >
                              {votes[game.id]} صوت
                            </p>
                          </div>
                        )}
                        {canVote && (
                          <button
                            className="vote-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(game.id);
                            }}
                            style={{
                              background:
                                "linear-gradient(135deg, #00FF66, #00CC55)",
                              border: "none",
                              borderRadius: 12,
                              color: "#000",
                              fontWeight: 900,
                              fontSize: 13,
                              padding: "10px 20px",
                              cursor: "pointer",
                              boxShadow: "0 0 16px rgba(0,255,102,0.35)",
                              transition: "all 0.2s",
                            }}
                          >
                            🗳️ صوّت
                          </button>
                        )}
                        {isMyVote && (
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "rgba(0,255,102,0.15)",
                              border: "2px solid #00FF66",
                            }}
                          >
                            <span
                              style={{
                                color: "#00FF66",
                                fontWeight: 900,
                                fontSize: 16,
                              }}
                            >
                              ✓
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status message */}
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              {phase === "idle" && (
                <p style={{ color: "#333", fontSize: 13 }}>
                  انتظر بدء جلسة التصويت من المذيع
                </p>
              )}
              {phase === "active" && !myVote && (
                <p style={{ color: "#555", fontSize: 13 }}>
                  اضغط على لعبة لتسجيل صوتك — لديك صوت واحد فقط ⚡
                </p>
              )}
              {phase === "active" && myVote && (
                <p
                  style={{
                    color: "rgba(0,255,102,0.7)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  ✓ تم تسجيل صوتك! النتيجة ستظهر بعد انتهاء الوقت
                </p>
              )}
              {phase === "ended" && (
                <p style={{ color: "#444", fontSize: 13 }}>
                  انتهى التصويت — شكراً لمشاركتك! 🙌
                </p>
              )}
            </div>

            {/* Streamer Panel */}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.05)",
                paddingTop: 28,
              }}
            >
              <p
                style={{
                  color: "#2a2a2a",
                  fontSize: 10,
                  textAlign: "center",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                🎛️ لوحة تحكم المذيع
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  className="start-btn"
                  onClick={startSession}
                  disabled={starting || phase === "active"}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    background:
                      phase === "active"
                        ? "linear-gradient(135deg, #1a1a1a, #111)"
                        : "linear-gradient(135deg, #00FF66, #00CC55)",
                    border: phase === "active" ? "1px solid #222" : "none",
                    color: phase === "active" ? "#444" : "#000",
                    fontWeight: 900,
                    fontSize: 15,
                    padding: "15px 48px",
                    borderRadius: 16,
                    cursor: starting
                      ? "wait"
                      : phase === "active"
                        ? "not-allowed"
                        : "pointer",
                    boxShadow:
                      phase === "active"
                        ? "none"
                        : "0 0 28px rgba(0,255,102,0.45)",
                    transition: "all 0.3s",
                  }}
                >
                  {phase !== "active" && !starting && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background:
                          "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                        animation: "shimmer 2.5s infinite",
                      }}
                    />
                  )}
                  {starting
                    ? "⏳ جاري البدء..."
                    : phase === "active"
                      ? `⏳ التصويت نشط — ${mm}:${ss}`
                      : "▶ ابدأ جلسة تصويت جديدة (3 دقائق)"}
                </button>
              </div>
              <p
                style={{
                  color: "#1e1e1e",
                  fontSize: 10,
                  textAlign: "center",
                  marginTop: 10,
                  letterSpacing: "0.1em",
                }}
              >
                تنتهي الجلسة تلقائياً بعد 3 دقائق وتظهر النتيجة للجميع في الوقت
                الفعلي
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
