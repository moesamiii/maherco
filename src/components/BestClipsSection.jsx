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

  const openClip = (url) => window.open(url, "_blank");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');

        .clips-section {
          width: 100%;
          padding: 96px 0 80px;
          background: #000;
          font-family: 'Cairo', 'Segoe UI', sans-serif;
          direction: rtl;
          box-sizing: border-box;
        }

        .clips-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .clips-title {
          text-align: center;
          color: #fff;
          font-size: 42px;
          font-weight: 900;
          margin: 0 0 40px;
          line-height: 1.2;
        }

        /* Desktop/Tablet: normal grid */
        .clips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .clip-card {
          background: #111;
          border: 1px solid rgba(0,255,102,0.2);
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
          flex-shrink: 0;
        }

        .clip-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0,255,102,0.5);
          box-shadow: 0 12px 40px rgba(0,255,102,0.12);
        }

        .clip-thumb {
          aspect-ratio: 16/9;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #000 60%, #001a0d 100%);
          overflow: hidden;
        }

        .thumb-glow {
          position: absolute;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(0,255,102,0.25), transparent 70%);
          filter: blur(40px);
        }

        .thumb-kick-text {
          font-size: 48px;
          font-weight: 900;
          letter-spacing: 0.1em;
          color: #00FF66;
          text-shadow: 0 0 25px rgba(0,255,102,0.6);
          z-index: 1;
        }

        .thumb-play {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid rgba(0,255,102,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,255,102,0.1);
          z-index: 2;
          transition: background 0.2s, transform 0.2s;
        }

        .clip-card:hover .thumb-play {
          background: rgba(0,255,102,0.25);
          transform: scale(1.1);
        }

        .thumb-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          z-index: 3;
        }

        .clip-body {
          padding: 20px;
        }

        .clip-body h3 {
          color: #fff;
          margin: 0 0 14px;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.4;
        }

        .watch-btn {
          padding: 8px 18px;
          background: #00FF66;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-family: 'Cairo', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          color: #000;
        }

        .watch-btn:hover { background: #00e65c; transform: scale(1.04); }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.88);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(8px);
          box-sizing: border-box;
        }

        .modal-box {
          width: 100%;
          max-width: 480px;
          background: linear-gradient(145deg, #111, #0a0a0a);
          border: 1px solid rgba(0,255,102,0.3);
          border-radius: 24px;
          padding: 36px 28px;
          text-align: center;
          box-shadow: 0 0 60px rgba(0,255,102,0.15);
          box-sizing: border-box;
        }

        .modal-icon { font-size: 40px; margin-bottom: 12px; }
        .modal-title { color: #fff; font-size: 20px; font-weight: 900; margin: 0 0 8px; }
        .modal-subtitle { color: #555; font-size: 13px; margin: 0 0 24px; }

        .modal-open-btn {
          padding: 13px 32px;
          background: linear-gradient(135deg, #00FF66, #00CC55);
          border: none;
          border-radius: 12px;
          font-weight: 900;
          font-family: 'Cairo', sans-serif;
          font-size: 15px;
          cursor: pointer;
          color: #000;
          box-shadow: 0 0 20px rgba(0,255,102,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
          display: block;
          width: 100%;
        }

        .modal-open-btn:hover {
          transform: scale(1.03);
          box-shadow: 0 0 35px rgba(0,255,102,0.6);
        }

        .modal-close-btn {
          margin-top: 16px;
          background: none;
          border: none;
          color: #555;
          cursor: pointer;
          font-family: 'Cairo', sans-serif;
          font-size: 13px;
          transition: color 0.2s;
          padding: 4px 8px;
        }

        .modal-close-btn:hover { color: #999; }

        /* Tablet: 2 columns */
        @media (max-width: 900px) {
          .clips-grid { grid-template-columns: repeat(2, 1fr); }
          .clips-title { font-size: 34px; }
        }

        /* ── MOBILE: horizontal scroll ── */
        @media (max-width: 580px) {
          .clips-section { padding: 56px 0 48px; }
          .clips-inner { padding: 0; }

          .clips-title {
            font-size: 26px;
            margin-bottom: 24px;
            padding: 0 16px;
          }

          /* Switch grid → horizontal scroll row */
          .clips-grid {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            overflow-y: visible;
            gap: 14px;
            padding: 8px 16px 20px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }

          .clips-grid::-webkit-scrollbar { display: none; }

          .clip-card {
            min-width: 260px;
            width: 260px;
            scroll-snap-align: start;
            transform: none !important;
          }

          .thumb-kick-text { font-size: 32px; }
          .thumb-play { width: 44px; height: 44px; }

          .clip-body { padding: 12px 14px 14px; }
          .clip-body h3 { font-size: 13px; margin-bottom: 10px; }
          .watch-btn { font-size: 12px; padding: 7px 12px; }

          /* Scroll hint fade on right */
          .clips-inner::after {
            content: '';
            position: absolute;
            top: 0; right: 0;
            width: 40px; height: 100%;
            background: linear-gradient(to left, #000, transparent);
            pointer-events: none;
          }

          .clips-inner { position: relative; }

          .modal-box { padding: 28px 20px; border-radius: 20px; }
          .modal-title { font-size: 17px; }
          .modal-open-btn { font-size: 14px; padding: 12px 24px; }
        }

        @media (max-width: 360px) {
          .clip-card { min-width: 230px; width: 230px; }
          .clips-title { font-size: 22px; }
        }
      `}</style>

      <section className="clips-section">
        <div className="clips-inner">
          <h2 className="clips-title">
            كليبات <span style={{ color: "#00FF66" }}>البث</span>
          </h2>

          <div className="clips-grid">
            {clips.map((clip, i) => (
              <div
                key={i}
                className="clip-card"
                onClick={() => setActiveClip(clip)}
              >
                <div className="clip-thumb">
                  <div className="thumb-glow" />
                  <span className="thumb-kick-text">KICK</span>
                  <div className="thumb-play">
                    <span
                      style={{ color: "#00FF66", fontSize: 18, marginLeft: 3 }}
                    >
                      ▶
                    </span>
                  </div>
                  <div
                    className="thumb-tag"
                    style={{
                      background: clip.tagColor + "20",
                      border: `1px solid ${clip.tagColor}`,
                      color: clip.tagColor,
                    }}
                  >
                    {clip.tag}
                  </div>
                </div>

                <div className="clip-body">
                  <h3>{clip.title}</h3>
                  <button
                    className="watch-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openClip(clip.videoUrl);
                    }}
                  >
                    شاهد الآن ▶
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {activeClip && (
        <div className="modal-overlay" onClick={() => setActiveClip(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🎬</div>
            <h3 className="modal-title">{activeClip.title}</h3>
            <p className="modal-subtitle">
              سيتم فتح الكليب في نافذة جديدة على Kick
            </p>
            <button
              className="modal-open-btn"
              onClick={() => openClip(activeClip.videoUrl)}
            >
              فتح على Kick ↗
            </button>
            <button
              className="modal-close-btn"
              onClick={() => setActiveClip(null)}
            >
              إغلاق ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
