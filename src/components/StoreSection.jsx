import { useState } from "react";

const categories = [
  { id: "All", label: "الكل" },
  { id: "Phones", label: "جوالات" },
  { id: "Consoles", label: "كونسولات" },
  { id: "PCs", label: "أجهزة PC" },
];

const products = [
  {
    nameAr: "آيفون 16 Pro Max",
    category: "Phones",
    emoji: "📱",
    specs: "256GB • Titanium • A18 Pro",
    highlight: "الأحدث",
  },
  {
    nameAr: "بلايستيشن 5 Slim",
    category: "Consoles",
    emoji: "🎮",
    specs: "Slim Disc • 1TB SSD • Ultra HD",
    highlight: "جديد",
  },
  {
    nameAr: "جهاز الغيمينغ – Beast Mode",
    category: "PCs",
    emoji: "🖥️",
    specs: "RTX 4070 • 32GB RAM • 1TB NVMe",
    highlight: "الأكثر طلباً",
  },
];

const perks = [
  { icon: "⚡", title: "توصيل سريع", desc: "نوصلك المنتج بأسرع وقت ممكن" },
  { icon: "🛡️", title: "ضمان أصلي", desc: "كل منتج مضمون 100% من المصدر" },
  { icon: "🎮", title: "اختيار ماهركو", desc: "اختاره ماهركو بنفسه للمجتمع" },
  { icon: "💰", title: "أفضل الأسعار", desc: "أسعار حصرية لجمهور ماهركو" },
];

export default function StoreSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section
      dir="rtl"
      style={{
        background: "#050505",
        borderTop: "1px solid rgba(0,255,102,0.15)",
        fontFamily: "'Cairo','Tajawal',sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes glowPulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .store-perk-icon { animation: floatUp 3s ease-in-out infinite; }
        .store-scan { animation: scanline 5s linear infinite; }
        .store-glow-pulse { animation: glowPulse 2s ease-in-out infinite; }
        .store-product-card { animation: fadeInUp 0.45s ease forwards; opacity: 0; }

        .store-cat-btn:hover { color: #00FF66 !important; border-color: rgba(0,255,102,0.4) !important; }

        /* ── PERKS: 4 col desktop, 2 col mobile ── */
        .store-perks-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 56px;
        }

        /* ── PRODUCTS: 3 col desktop ── */
        .store-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 80px;
        }

        /* ── STATS: 4 col desktop ── */
        .store-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          max-width: 700px;
          margin: 0 auto;
        }

        .store-cats-row {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }

        /* ── TABLET ── */
        @media (max-width: 900px) {
          .store-perks-grid { grid-template-columns: repeat(2, 1fr); }
          .store-products-grid { grid-template-columns: repeat(2, 1fr); }
          .store-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── MOBILE ── */
        @media (max-width: 580px) {
          .store-section-inner { padding: 48px 16px 56px !important; }
          .store-header { margin-bottom: 36px !important; }
          .store-title { font-size: clamp(2rem, 10vw, 2.8rem) !important; }
          .store-subtitle { font-size: 13px !important; }

          /* perks: horizontal scroll */
          .store-perks-grid {
            grid-template-columns: unset;
            display: flex;
            overflow-x: auto;
            overflow-y: visible;
            gap: 12px;
            margin-bottom: 36px;
            padding-bottom: 12px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .store-perks-grid::-webkit-scrollbar { display: none; }
          .store-perk-card {
            min-width: 160px !important;
            scroll-snap-align: start;
            flex-shrink: 0;
          }

          /* category pills: horizontal scroll */
          .store-cats-row {
            flex-wrap: nowrap;
            overflow-x: auto;
            justify-content: flex-start;
            padding: 0 0 8px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .store-cats-row::-webkit-scrollbar { display: none; }
          .store-cat-btn { flex-shrink: 0; white-space: nowrap; }

          /* products: horizontal scroll */
          .store-products-grid {
            grid-template-columns: unset;
            display: flex;
            overflow-x: auto;
            overflow-y: visible;
            gap: 14px;
            margin-bottom: 48px;
            padding-bottom: 12px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .store-products-grid::-webkit-scrollbar { display: none; }
          .store-product-card {
            min-width: 220px !important;
            width: 220px !important;
            scroll-snap-align: start;
            flex-shrink: 0;
          }

          /* vision box */
          .store-vision-inner { padding: 32px 20px !important; }
          .store-vision-title { font-size: 1.3rem !important; }
          .store-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 360px) {
          .store-product-card { min-width: 190px !important; width: 190px !important; }
          .store-perk-card { min-width: 140px !important; }
        }
      `}</style>

      {/* BG grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(0,255,102,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,102,0.025) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Scanline */}
      <div
        className="store-scan"
        style={{
          position: "absolute",
          insetInline: 0,
          height: "2px",
          background:
            "linear-gradient(90deg,transparent,rgba(0,255,102,0.08),transparent)",
          zIndex: 0,
        }}
      />

      {/* Top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          pointerEvents: "none",
          height: "320px",
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%,rgba(0,255,102,0.07) 0%,transparent 70%)",
        }}
      />

      <div
        className="store-section-inner"
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "96px 24px",
        }}
      >
        {/* Header */}
        <div
          className="store-header"
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: "100px",
              background: "rgba(0,255,102,0.06)",
              border: "1px solid rgba(0,255,102,0.2)",
              marginBottom: 20,
            }}
          >
            <span
              className="store-glow-pulse"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#00FF66",
                display: "inline-block",
                boxShadow: "0 0 8px #00FF66",
              }}
            />
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.25em",
                color: "rgba(0,255,102,0.7)",
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              MAHERCO STORE — قريباً
            </span>
          </div>

          <h2
            className="store-title"
            style={{
              fontSize: "clamp(2.8rem,6vw,5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "1rem",
              fontFamily: "'Cairo',sans-serif",
            }}
          >
            <span style={{ color: "#fff" }}>متجر </span>
            <span
              style={{
                color: "#00FF66",
                textShadow:
                  "0 0 40px rgba(0,255,102,0.5),0 0 80px rgba(0,255,102,0.2)",
              }}
            >
              ماهركو
            </span>
          </h2>

          <p
            className="store-subtitle"
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 15,
              maxWidth: 520,
              margin: "0 auto 20px",
              lineHeight: 1.9,
              fontFamily: "'Cairo',sans-serif",
            }}
          >
            كل شي تحتاجه للغيمينغ — أجهزة، كونسولات، وجوالات مختارة بعناية من
            ماهركو لجمهوره
          </p>

          <div
            style={{
              display: "inline-block",
              padding: "8px 20px",
              borderRadius: 8,
              background: "rgba(255,200,0,0.07)",
              border: "1px solid rgba(255,200,0,0.2)",
              color: "rgba(255,200,0,0.75)",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Cairo',sans-serif",
            }}
          >
            ⏳ المتجر لم يفتح بعد — الأسعار ستُعلن قريباً
          </div>
        </div>

        {/* Perks */}
        <div className="store-perks-grid">
          {perks.map((perk, i) => (
            <div
              key={i}
              className="store-perk-card"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(0,255,102,0.1)",
                borderRadius: 16,
                padding: "20px 16px",
                textAlign: "center",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,255,102,0.3)";
                e.currentTarget.style.background = "rgba(0,255,102,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,255,102,0.1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              }}
            >
              <div
                className="store-perk-icon"
                style={{
                  fontSize: "2rem",
                  marginBottom: 10,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                {perk.icon}
              </div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 14,
                  marginBottom: 4,
                  fontFamily: "'Cairo',sans-serif",
                }}
              >
                {perk.title}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 11,
                  lineHeight: 1.6,
                  fontFamily: "'Cairo',sans-serif",
                }}
              >
                {perk.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="store-cats-row">
          {categories.map((c) => (
            <button
              key={c.id}
              className="store-cat-btn"
              onClick={() => setActiveCategory(c.id)}
              style={{
                padding: "9px 22px",
                borderRadius: "100px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "'Cairo',sans-serif",
                background:
                  activeCategory === c.id
                    ? "rgba(0,255,102,0.12)"
                    : "transparent",
                border:
                  activeCategory === c.id
                    ? "1px solid rgba(0,255,102,0.5)"
                    : "1px solid rgba(255,255,255,0.08)",
                color:
                  activeCategory === c.id ? "#00FF66" : "rgba(255,255,255,0.3)",
                boxShadow:
                  activeCategory === c.id
                    ? "0 0 15px rgba(0,255,102,0.1)"
                    : "none",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="store-products-grid">
          {filtered.map((product, index) => (
            <div
              key={`${activeCategory}-${index}`}
              className="store-product-card"
              style={{
                borderRadius: 20,
                border:
                  hoveredCard === index
                    ? "1px solid rgba(0,255,102,0.4)"
                    : "1px solid rgba(255,255,255,0.06)",
                background:
                  hoveredCard === index
                    ? "linear-gradient(145deg,#0f1f0f,#0a0a0a)"
                    : "linear-gradient(145deg,#0e0e0e,#080808)",
                transform:
                  hoveredCard === index ? "translateY(-6px)" : "translateY(0)",
                boxShadow:
                  hoveredCard === index
                    ? "0 20px 40px rgba(0,0,0,0.5),0 0 30px rgba(0,255,102,0.08)"
                    : "none",
                transition: "all 0.3s",
                overflow: "hidden",
                animationDelay: `${index * 0.08}s`,
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Thumb */}
              <div
                style={{
                  background: "rgba(255,255,255,0.015)",
                  padding: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  minHeight: 110,
                }}
              >
                {product.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      padding: "3px 10px",
                      borderRadius: "100px",
                      background: "rgba(0,255,102,0.12)",
                      border: "1px solid rgba(0,255,102,0.35)",
                      color: "#00FF66",
                      fontSize: 10,
                      fontWeight: 800,
                      fontFamily: "'Cairo',sans-serif",
                    }}
                  >
                    {product.highlight}
                  </div>
                )}
                <span
                  style={{
                    fontSize: "3.5rem",
                    lineHeight: 1,
                    filter:
                      hoveredCard === index
                        ? "drop-shadow(0 0 12px rgba(0,255,102,0.3))"
                        : "none",
                    transition: "filter 0.3s",
                  }}
                >
                  {product.emoji}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: 16 }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: 6,
                    background: "rgba(255,200,0,0.07)",
                    border: "1px solid rgba(255,200,0,0.15)",
                    color: "rgba(255,200,0,0.7)",
                    fontSize: 10,
                    fontWeight: 800,
                    marginBottom: 8,
                    fontFamily: "monospace",
                    letterSpacing: "0.08em",
                  }}
                >
                  قريباً
                </div>

                <h3
                  style={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 14,
                    marginBottom: 4,
                    lineHeight: 1.4,
                    fontFamily: "'Cairo',sans-serif",
                  }}
                >
                  {product.nameAr}
                </h3>

                <p
                  style={{
                    color: "rgba(255,255,255,0.22)",
                    fontSize: 11,
                    marginBottom: 14,
                    fontFamily: "monospace",
                    direction: "ltr",
                    textAlign: "right",
                  }}
                >
                  {product.specs}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255,255,255,0.2)",
                      fontSize: 12,
                      fontFamily: "'Cairo',sans-serif",
                    }}
                  >
                    السعر
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.1)",
                      fontSize: 16,
                      fontWeight: 900,
                      fontFamily: "monospace",
                      letterSpacing: "0.3em",
                    }}
                  >
                    ———
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vision box */}
        <div
          style={{
            borderRadius: 24,
            padding: 2,
            background:
              "linear-gradient(135deg,rgba(0,255,102,0.2),transparent,rgba(0,255,102,0.1))",
          }}
        >
          <div
            className="store-vision-inner"
            style={{
              borderRadius: 22,
              padding: "48px 40px",
              background: "linear-gradient(135deg,#0a1a0a,#080808,#0a0f0a)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🏆</div>
            <h3
              className="store-vision-title"
              style={{
                color: "#fff",
                fontWeight: 900,
                fontSize: "clamp(1.5rem,3vw,2.2rem)",
                marginBottom: 12,
                fontFamily: "'Cairo',sans-serif",
              }}
            >
              الرؤية الكاملة لمتجر ماهركو
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 15,
                maxWidth: 600,
                margin: "0 auto 32px",
                lineHeight: 1.9,
                fontFamily: "'Cairo',sans-serif",
              }}
            >
              متجر رسمي باسم ماهركو يبيع كل ما يحتاجه الغيمر العربي — منتجات
              أصلية، توصيل سريع، وأسعار حصرية لجمهوره.
            </p>

            <div className="store-stats-grid">
              {[
                { num: "10+", label: "فئات منتجات" },
                { num: "0%", label: "مخاطرة عليك" },
                { num: "100%", label: "باسم ماهركو" },
                { num: "∞", label: "فرص النمو" },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    padding: 20,
                    borderRadius: 14,
                    background: "rgba(0,255,102,0.04)",
                    border: "1px solid rgba(0,255,102,0.12)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "#00FF66",
                      fontFamily: "monospace",
                      textShadow: "0 0 20px rgba(0,255,102,0.4)",
                      marginBottom: 4,
                    }}
                  >
                    {stat.num}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 12,
                      fontFamily: "'Cairo',sans-serif",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
