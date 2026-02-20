export default function Footer() {
  return (
    <footer className="w-full bg-black relative overflow-hidden">
      {/* Ambient glow background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, #00FF66 30%, #00FF66 70%, transparent)",
          boxShadow: "0 0 80px 30px rgba(0,255,102,0.08)",
        }}
      />

      <div className="max-w-5xl mx-auto px-8 pt-20 pb-10 relative">
        {/* Main content — centered stacked layout */}
        <div className="flex flex-col items-center text-center gap-10">
          {/* Logo block */}
          <div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#00FF66",
                  boxShadow: "0 0 10px #00FF66, 0 0 20px #00FF66",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  color: "rgba(0,255,102,0.5)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                }}
              >
                Live on Kick
              </span>
            </div>
            <h3
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 900,
                background:
                  "linear-gradient(135deg, #ffffff 0%, #00FF66 60%, #00cc55 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                fontFamily: "'Georgia', serif",
                marginBottom: "0.4rem",
              }}
            >
              Maherco Live
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.3)",
                maxWidth: "380px",
                lineHeight: 1.7,
                fontFamily: "monospace",
              }}
            >
              Gaming · Challenges · Tournaments · Entertainment — live every
              day.
            </p>
          </div>

          {/* Divider line with glow */}
          <div
            style={{
              width: "100%",
              maxWidth: "480px",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(0,255,102,0.3) 50%, transparent)",
            }}
          />

          {/* Social links — horizontal pill row */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Kick */}
            <a
              href="https://kick.com/maherco"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 24px",
                borderRadius: "100px",
                border: "1px solid rgba(0,255,102,0.2)",
                background: "rgba(0,255,102,0.04)",
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "monospace",
                letterSpacing: "0.05em",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,255,102,0.12)";
                e.currentTarget.style.borderColor = "rgba(0,255,102,0.6)";
                e.currentTarget.style.color = "#00FF66";
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(0,255,102,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,255,102,0.04)";
                e.currentTarget.style.borderColor = "rgba(0,255,102,0.2)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <rect width="24" height="24" rx="6" fill="#00FF66" />
                <text
                  x="50%"
                  y="58%"
                  textAnchor="middle"
                  fill="black"
                  fontSize="14"
                  fontWeight="bold"
                  dominantBaseline="middle"
                >
                  K
                </text>
              </svg>
              Kick
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@mahercogaming1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 24px",
                borderRadius: "100px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "monospace",
                letterSpacing: "0.05em",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,0,0,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,0,0,0.4)";
                e.currentTarget.style.color = "#ff4444";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(255,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.5 6.2a2.9 2.9 0 0 0-2-2C19.6 3.7 12 3.7 12 3.7s-7.6 0-9.5.5a2.9 2.9 0 0 0-2 2A30.2 30.2 0 0 0 0 12a30.2 30.2 0 0 0 .5 5.8 2.9 2.9 0 0 0 2 2c1.9.5 9.5.5 9.5.5s7.6 0 9.5-.5a2.9 2.9 0 0 0 2-2A30.2 30.2 0 0 0 24 12a30.2 30.2 0 0 0-.5-5.8zM9.8 15.5v-7l6.4 3.5-6.4 3.5z" />
              </svg>
              YouTube
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/mahercogaming/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 24px",
                borderRadius: "100px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "monospace",
                letterSpacing: "0.05em",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(228,64,95,0.1)";
                e.currentTarget.style.borderColor = "rgba(228,64,95,0.4)";
                e.currentTarget.style.color = "#e4405f";
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(228,64,95,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8zm0 6.9A2.7 2.7 0 1 0 9.3 12 2.7 2.7 0 0 0 12 14.7zm4.5-7.6a1 1 0 1 0-1-1 1 1 0 0 0 1 1z" />
              </svg>
              Instagram
            </a>
          </div>

          {/* Bottom divider + copyright */}
          <div
            style={{ width: "100%", textAlign: "center", paddingTop: "16px" }}
          >
            <div
              style={{
                width: "100%",
                height: "1px",
                background: "rgba(255,255,255,0.04)",
                marginBottom: "20px",
              }}
            />
            <p
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.2)",
                fontFamily: "monospace",
                letterSpacing: "0.1em",
              }}
            >
              © {new Date().getFullYear()} MAHERCO LIVE — ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </footer>
  );
}
