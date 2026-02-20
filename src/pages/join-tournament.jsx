import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function JoinTournament() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    team_name: "",
    phone: "",
    email: "",
    platform: "",
    game_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from("tournament_registrations")
      .insert([form]);
    if (error) {
      console.error(error);
      alert("حدث خطأ ❌ حاول مرة أخرى");
    } else {
      setSubmitted(true);
      setForm({
        full_name: "",
        team_name: "",
        phone: "",
        email: "",
        platform: "",
        game_id: "",
      });
    }
    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: "'Tajawal', 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-30px) scale(1.1); opacity: 0.6; }
        }
        @keyframes scanLine {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGreen {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,102,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(0,255,102,0); }
        }
        @keyframes successPop {
          0% { opacity: 0; transform: scale(0.8); }
          70% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmerBtn {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes rotateBorder {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .jt-input {
          width: 100%;
          background: rgba(0,255,102,0.03);
          border: 1px solid rgba(0,255,102,0.2);
          border-radius: 14px;
          padding: 14px 18px;
          color: #fff;
          font-family: 'Tajawal', sans-serif;
          font-size: 15px;
          transition: all 0.3s;
          outline: none;
          direction: rtl;
        }
        .jt-input::placeholder { color: #444; }
        .jt-input:focus {
          border-color: rgba(0,255,102,0.6);
          background: rgba(0,255,102,0.06);
          box-shadow: 0 0 0 3px rgba(0,255,102,0.08), inset 0 1px 0 rgba(0,255,102,0.1);
        }
        .jt-input option { background: #0d0d0d; color: #fff; }

        .jt-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #00FF66;
          opacity: 0.7;
          margin-bottom: 8px;
        }

        .jt-field {
          animation: fadeSlideUp 0.4s ease both;
        }
        .jt-field:nth-child(1) { animation-delay: 0.05s; }
        .jt-field:nth-child(2) { animation-delay: 0.1s; }
        .jt-field:nth-child(3) { animation-delay: 0.15s; }
        .jt-field:nth-child(4) { animation-delay: 0.2s; }
        .jt-field:nth-child(5) { animation-delay: 0.25s; }
        .jt-field:nth-child(6) { animation-delay: 0.3s; }

        .submit-btn {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #00FF66, #00CC55);
          color: #000;
          font-family: 'Tajawal', sans-serif;
          font-weight: 900;
          font-size: 17px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 0.03em;
          box-shadow: 0 0 30px rgba(0,255,102,0.35), 0 4px 20px rgba(0,0,0,0.4);
          animation: fadeSlideUp 0.4s ease 0.35s both;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 50px rgba(0,255,102,0.55), 0 8px 30px rgba(0,0,0,0.5);
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .submit-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: shimmerBtn 2.5s infinite;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(0,255,102,0.06);
          border: 1px solid rgba(0,255,102,0.25);
          border-radius: 12px;
          color: #00FF66;
          font-family: 'Tajawal', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.25s;
          letter-spacing: 0.05em;
        }
        .back-btn:hover {
          background: rgba(0,255,102,0.12);
          border-color: rgba(0,255,102,0.5);
          transform: translateX(4px);
        }
      `}</style>

      {/* Background grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(0,255,102,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,102,0.04) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          animation: "gridMove 3s linear infinite alternate",
        }}
      />

      {/* Orbs */}
      <div
        style={{
          position: "fixed",
          top: "10%",
          right: "5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,255,102,0.12) 0%, transparent 70%)",
          animation: "floatOrb 6s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "15%",
          left: "5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,200,80,0.08) 0%, transparent 70%)",
          animation: "floatOrb 8s ease-in-out infinite reverse",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Scan line */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,102,0.15), transparent)",
          animation: "scanLine 6s linear infinite",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        {/* Back button */}
        <div
          style={{
            width: "100%",
            maxWidth: 640,
            marginBottom: 24,
            animation: "fadeSlideUp 0.3s ease",
          }}
        >
          <button className="back-btn" onClick={() => navigate("/")}>
            <span style={{ fontSize: 16 }}>→</span>
            العودة للرئيسية
          </button>
        </div>

        {/* Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 640,
            background: "linear-gradient(160deg, #0d0d0d 0%, #0a0a0a 100%)",
            border: "1px solid rgba(0,255,102,0.2)",
            borderRadius: 28,
            padding: "48px 44px",
            boxShadow:
              "0 0 80px rgba(0,255,102,0.08), 0 40px 80px rgba(0,0,0,0.6)",
            position: "relative",
            overflow: "hidden",
            animation: "fadeSlideUp 0.4s ease",
          }}
        >
          {/* Card top accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(0,255,102,0.5), transparent)",
            }}
          />

          {/* Corner decorations */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 20,
              height: 20,
              borderTop: "2px solid rgba(0,255,102,0.4)",
              borderRight: "2px solid rgba(0,255,102,0.4)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              width: 20,
              height: 20,
              borderBottom: "2px solid rgba(0,255,102,0.4)",
              borderLeft: "2px solid rgba(0,255,102,0.4)",
            }}
          />

          {!submitted ? (
            <>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(0,255,102,0.08)",
                    border: "1px solid rgba(0,255,102,0.2)",
                    borderRadius: 50,
                    padding: "6px 16px",
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#00FF66",
                      boxShadow: "0 0 8px #00FF66",
                      animation: "pulseGreen 2s infinite",
                    }}
                  />
                  <span
                    style={{
                      color: "#00FF66",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                    }}
                  >
                    التسجيل مفتوح الآن
                  </span>
                </div>

                <h1
                  style={{
                    fontSize: 42,
                    fontWeight: 900,
                    lineHeight: 1.1,
                    color: "#fff",
                    marginBottom: 10,
                    textShadow: "0 0 40px rgba(0,255,102,0.15)",
                  }}
                >
                  انضم للبطولة{" "}
                  <span
                    style={{
                      color: "#00FF66",
                      textShadow: "0 0 25px rgba(0,255,102,0.5)",
                    }}
                  >
                    🔥
                  </span>
                </h1>
                <p style={{ color: "#555", fontSize: 15, lineHeight: 1.6 }}>
                  سجّل بياناتك وكن جزءاً من بطولة روكيت ليق
                </p>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  marginBottom: 36,
                  background:
                    "linear-gradient(90deg, transparent, rgba(0,255,102,0.15), transparent)",
                }}
              />

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* Row 1: Full name + Team name */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div className="jt-field">
                    <label className="jt-label">الاسم الكامل</label>
                    <input
                      className="jt-input"
                      type="text"
                      name="full_name"
                      placeholder="محمد أحمد"
                      value={form.full_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="jt-field">
                    <label className="jt-label">اسم الفريق</label>
                    <input
                      className="jt-input"
                      type="text"
                      name="team_name"
                      placeholder="Team Alpha"
                      value={form.team_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Phone + Email */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div className="jt-field">
                    <label className="jt-label">رقم الجوال</label>
                    <input
                      className="jt-input"
                      type="tel"
                      name="phone"
                      placeholder="+964 770 000 0000"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="jt-field">
                    <label className="jt-label">البريد الإلكتروني</label>
                    <input
                      className="jt-input"
                      type="email"
                      name="email"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Row 3: Platform + Game ID */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div className="jt-field">
                    <label className="jt-label">المنصة</label>
                    <select
                      className="jt-input"
                      name="platform"
                      value={form.platform}
                      onChange={handleChange}
                      required
                    >
                      <option value="">اختر المنصة</option>
                      <option value="PC">🖥️ PC</option>
                      <option value="PlayStation">🎮 PlayStation</option>
                      <option value="Xbox">🟩 Xbox</option>
                    </select>
                  </div>
                  <div className="jt-field">
                    <label className="jt-label">ID داخل اللعبة</label>
                    <input
                      className="jt-input"
                      type="text"
                      name="game_id"
                      placeholder="PlayerXXX#1234"
                      value={form.game_id}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Submit */}
                <div style={{ marginTop: 8 }}>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            border: "2px solid rgba(0,0,0,0.3)",
                            borderTop: "2px solid #000",
                            borderRadius: "50%",
                            display: "inline-block",
                            animation: "spinAnim 0.7s linear infinite",
                          }}
                        />
                        جاري الإرسال...
                      </span>
                    ) : (
                      "🎯 إرسال طلب الانضمام"
                    )}
                  </button>
                  <p
                    style={{
                      textAlign: "center",
                      color: "#333",
                      fontSize: 12,
                      marginTop: 12,
                    }}
                  >
                    بالإرسال توافق على شروط البطولة والمشاركة
                  </p>
                </div>
              </form>
            </>
          ) : (
            /* Success state */
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                animation:
                  "successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  margin: "0 auto 28px",
                  background: "rgba(0,255,102,0.1)",
                  border: "2px solid rgba(0,255,102,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  boxShadow: "0 0 40px rgba(0,255,102,0.2)",
                }}
              >
                ✅
              </div>
              <h2
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color: "#00FF66",
                  marginBottom: 12,
                  textShadow: "0 0 30px rgba(0,255,102,0.4)",
                }}
              >
                تم التسجيل بنجاح!
              </h2>
              <p
                style={{
                  color: "#555",
                  fontSize: 15,
                  marginBottom: 36,
                  lineHeight: 1.7,
                }}
              >
                شكراً لانضمامك إلى البطولة 🔥
                <br />
                سيتم التواصل معك قريباً عبر البريد الإلكتروني
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button className="back-btn" onClick={() => navigate("/")}>
                  <span>→</span> العودة للرئيسية
                </button>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    padding: "10px 20px",
                    background: "linear-gradient(135deg, #00FF66, #00CC55)",
                    border: "none",
                    borderRadius: 12,
                    color: "#000",
                    fontFamily: "'Tajawal', sans-serif",
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.25s",
                    boxShadow: "0 0 20px rgba(0,255,102,0.3)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  ➕ تسجيل آخر
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p
          style={{
            color: "#222",
            fontSize: 11,
            marginTop: 28,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          بطولة روكيت ليق ● مدعوم بالكود والأخضر
        </p>
      </div>
    </div>
  );
}
