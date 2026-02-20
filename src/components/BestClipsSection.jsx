import React, { useState } from "react";

const clips = [
  {
    title: "كليب ١ — لحظة لا تُنسى",
    videoUrl: "https://kick.com/maherco/clips/clip_01KHHGX0N2KKCQJ2CGP8P1HWEF",
    tag: "كلتش",
    tagColor: "#00FF66",
  },
  {
    title: "كليب ٢ — لحظة الحسم",
    videoUrl: "https://kick.com/maherco/clips/clip_01KHAHFD5Y4AJM6BQ3JS2XEQ29",
    tag: "هايلايت",
    tagColor: "#00CFFF",
  },
  {
    title: "كليب ٣ — رد الفعل الأفضل",
    videoUrl: "https://kick.com/maherco/clips/clip_01KHDHD4X4XHH9JGFEJ53FS96Z",
    tag: "مضحك",
    tagColor: "#FFD700",
  },
];

export default function BestClipsSection() {
  const [activeClip, setActiveClip] = useState(null);

  const openClip = (url) => {
    window.open(url, "_blank");
  };

  return (
    <section
      style={{
        width: "100%",
        padding: "96px 0 80px",
        background: "#000",
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        direction: "rtl",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <h2
          style={{
            textAlign: "center",
            color: "#fff",
            fontSize: 42,
            fontWeight: 900,
          }}
        >
          كليبات <span style={{ color: "#00FF66" }}>البث</span>
        </h2>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginTop: 40,
          }}
        >
          {clips.map((clip, i) => (
            <div
              key={i}
              onClick={() => setActiveClip(clip)}
              style={{
                background: "#111",
                border: "1px solid rgba(0,255,102,0.2)",
                borderRadius: 20,
                overflow: "hidden",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              {/* ==== KICK THUMBNAIL ==== */}
              <div
                style={{
                  aspectRatio: "16/9",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #0a0a0a 0%, #000 60%, #001a0d 100%)",
                  overflow: "hidden",
                }}
              >
                {/* Glow circle */}
                <div
                  style={{
                    position: "absolute",
                    width: 180,
                    height: 180,
                    background:
                      "radial-gradient(circle, rgba(0,255,102,0.25), transparent 70%)",
                    filter: "blur(40px)",
                  }}
                />

                {/* KICK TEXT */}
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    letterSpacing: "0.1em",
                    color: "#00FF66",
                    textShadow: "0 0 25px rgba(0,255,102,0.6)",
                  }}
                >
                  KICK
                </span>

                {/* Play button */}
                <div
                  style={{
                    position: "absolute",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    border: "2px solid rgba(0,255,102,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,255,102,0.1)",
                  }}
                >
                  <span
                    style={{
                      color: "#00FF66",
                      fontSize: 22,
                      marginLeft: 4,
                    }}
                  >
                    ▶
                  </span>
                </div>

                {/* Tag badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    padding: "4px 12px",
                    background: clip.tagColor + "20",
                    border: `1px solid ${clip.tagColor}`,
                    borderRadius: 999,
                    color: clip.tagColor,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {clip.tag}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: 20 }}>
                <h3 style={{ color: "#fff", margin: 0 }}>{clip.title}</h3>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openClip(clip.videoUrl);
                  }}
                  style={{
                    marginTop: 14,
                    padding: "8px 16px",
                    background: "#00FF66",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  شاهد الآن ▶
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeClip && (
        <div
          onClick={() => setActiveClip(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 500,
              background: "#0a0a0a",
              borderRadius: 20,
              padding: 30,
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#fff" }}>{activeClip.title}</h3>

            <p style={{ color: "#777", marginTop: 10 }}>
              سيتم فتح الكليب في نافذة جديدة
            </p>

            <button
              onClick={() => openClip(activeClip.videoUrl)}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                background: "#00FF66",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              فتح على Kick ↗
            </button>

            <div style={{ marginTop: 20 }}>
              <button
                onClick={() => setActiveClip(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#999",
                  cursor: "pointer",
                }}
              >
                إغلاق ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
