import { useState } from "react";

const categories = [
  { id: "All", label: "الكل" },
  { id: "PCs", label: "أجهزة PC" },
  { id: "Consoles", label: "كونسولات" },
  { id: "Phones", label: "جوالات" },
  { id: "Games", label: "ألعاب" },
  { id: "Accessories", label: "إكسسوارات" },
];

const products = [
  {
    nameAr: "جهاز الغيمينغ – Beast Mode",
    category: "PCs",
    emoji: "🖥️",
    specs: "RTX 4070 • 32GB RAM • 1TB NVMe",
    highlight: "الأكثر طلباً",
  },
  {
    nameAr: "جهاز PC بسعر مناسب",
    category: "PCs",
    emoji: "💻",
    specs: "RTX 3060 • 16GB RAM • 512GB",
    highlight: "اقتصادي",
  },
  {
    nameAr: "بلايستيشن 5 – نسخة الديسك",
    category: "Consoles",
    emoji: "🎮",
    specs: "Disc Edition • 825GB SSD • 4K",
    highlight: null,
  },
  {
    nameAr: "بلايستيشن 5 – نسخة ديجيتال",
    category: "Consoles",
    emoji: "🎮",
    specs: "Digital Edition • 825GB SSD • 4K",
    highlight: null,
  },
  {
    nameAr: "بلايستيشن 5 Slim",
    category: "Consoles",
    emoji: "🕹️",
    specs: "Slim Disc • 1TB SSD • Ultra HD",
    highlight: "جديد",
  },
  {
    nameAr: "آيفون 16 Pro Max",
    category: "Phones",
    emoji: "📱",
    specs: "256GB • Titanium • A18 Pro",
    highlight: "الأحدث",
  },
  {
    nameAr: "آيفون 16 Pro",
    category: "Phones",
    emoji: "📱",
    specs: "128GB • Titanium • A18 Pro",
    highlight: null,
  },
  {
    nameAr: "آيفون 15",
    category: "Phones",
    emoji: "📱",
    specs: "128GB • Pink / Black • A16 Bionic",
    highlight: null,
  },
  {
    nameAr: "لعبة CS2 كاملة",
    category: "Games",
    emoji: "🔫",
    specs: "PC Digital Download",
    highlight: null,
  },
  {
    nameAr: "ماوس Gaming احترافي",
    category: "Accessories",
    emoji: "🖱️",
    specs: "25K DPI • Wireless • RGB",
    highlight: "جديد",
  },
  {
    nameAr: "كيبورد ميكانيكي",
    category: "Accessories",
    emoji: "⌨️",
    specs: "TKL • Red Switches • RGB",
    highlight: null,
  },
];

const perks = [
  {
    icon: "⚡",
    title: "توصيل سريع",
    desc: "نوصلك المنتج بأسرع وقت ممكن لأي مكان",
  },
  { icon: "🛡️", title: "ضمان أصلي", desc: "كل منتج مضمون 100% من المصدر" },
  {
    icon: "🎮",
    title: "اختيار ماهركو",
    desc: "كل منتج اختاره ماهركو بنفسه للمجتمع",
  },
  {
    icon: "💰",
    title: "أفضل الأسعار",
    desc: "أسعار تنافسية خصيصاً لجمهور ماهركو",
  },
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
      className="relative w-full overflow-hidden"
      style={{
        background: "#050505",
        borderTop: "1px solid rgba(0,255,102,0.15)",
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Tajawal:wght@400;700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .product-card {
          animation: fadeInUp 0.45s ease forwards;
          opacity: 0;
        }
        .perk-icon { animation: floatUp 3s ease-in-out infinite; }
        .scan { animation: scanline 5s linear infinite; }
        .glow-pulse { animation: glowPulse 2s ease-in-out infinite; }
        .cat-btn:hover {
          color: #00FF66 !important;
          border-color: rgba(0,255,102,0.4) !important;
        }
      `}</style>

      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,102,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,102,0.025) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Scanline */}
      <div
        className="scan absolute inset-x-0 pointer-events-none"
        style={{
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,102,0.08), transparent)",
          zIndex: 0,
        }}
      />

      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "320px",
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,255,102,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        {/* ─── HERO HEADER ─── */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: "rgba(0,255,102,0.06)",
              border: "1px solid rgba(0,255,102,0.2)",
            }}
          >
            <span
              className="glow-pulse"
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#00FF66",
                display: "inline-block",
                boxShadow: "0 0 8px #00FF66",
              }}
            />
            <span
              style={{
                fontSize: "11px",
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
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "1rem",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            <span style={{ color: "#ffffff" }}>متجر </span>
            <span
              style={{
                color: "#00FF66",
                textShadow:
                  "0 0 40px rgba(0,255,102,0.5), 0 0 80px rgba(0,255,102,0.2)",
              }}
            >
              ماهركو
            </span>
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "15px",
              maxWidth: "520px",
              margin: "0 auto 1.5rem",
              lineHeight: 1.9,
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            كل شي تحتاجه للغيمينغ — أجهزة، كونسولات، جوالات وإكسسوارات مختارة
            بعناية من ماهركو لجمهوره
          </p>

          <div
            style={{
              display: "inline-block",
              padding: "8px 20px",
              borderRadius: "8px",
              background: "rgba(255,200,0,0.07)",
              border: "1px solid rgba(255,200,0,0.2)",
              color: "rgba(255,200,0,0.75)",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            ⏳ المتجر لم يفتح بعد — الأسعار ستُعلن قريباً
          </div>
        </div>

        {/* ─── PERKS ROW ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {perks.map((perk, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(0,255,102,0.1)",
                borderRadius: "16px",
                padding: "20px 16px",
                textAlign: "center",
                transition: "all 0.3s ease",
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
                className="perk-icon"
                style={{
                  fontSize: "2rem",
                  marginBottom: "10px",
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                {perk.icon}
              </div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "14px",
                  marginBottom: "4px",
                  fontFamily: "'Cairo', sans-serif",
                }}
              >
                {perk.title}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "11px",
                  lineHeight: 1.6,
                  fontFamily: "'Cairo', sans-serif",
                }}
              >
                {perk.desc}
              </div>
            </div>
          ))}
        </div>

        {/* ─── CATEGORY FILTER ─── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "36px",
          }}
        >
          {categories.map((c) => (
            <button
              key={c.id}
              className="cat-btn"
              onClick={() => setActiveCategory(c.id)}
              style={{
                padding: "9px 22px",
                borderRadius: "100px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "'Cairo', sans-serif",
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

        {/* ─── PRODUCT GRID ─── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {filtered.map((product, index) => (
            <div
              key={`${activeCategory}-${index}`}
              className="product-card"
              style={{
                borderRadius: "20px",
                border:
                  hoveredCard === index
                    ? "1px solid rgba(0,255,102,0.4)"
                    : "1px solid rgba(255,255,255,0.06)",
                background:
                  hoveredCard === index
                    ? "linear-gradient(145deg, #0f1f0f, #0a0a0a)"
                    : "linear-gradient(145deg, #0e0e0e, #080808)",
                transform:
                  hoveredCard === index ? "translateY(-6px)" : "translateY(0)",
                boxShadow:
                  hoveredCard === index
                    ? "0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,255,102,0.08)"
                    : "none",
                transition: "all 0.3s ease",
                overflow: "hidden",
                animationDelay: `${index * 0.06}s`,
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card image area */}
              <div
                style={{
                  background: "rgba(255,255,255,0.015)",
                  padding: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  minHeight: "110px",
                }}
              >
                {product.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      padding: "3px 10px",
                      borderRadius: "100px",
                      background: "rgba(0,255,102,0.12)",
                      border: "1px solid rgba(0,255,102,0.35)",
                      color: "#00FF66",
                      fontSize: "10px",
                      fontWeight: 800,
                      fontFamily: "'Cairo', sans-serif",
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
                    transition: "filter 0.3s ease",
                  }}
                >
                  {product.emoji}
                </span>
              </div>

              {/* Card body */}
              <div style={{ padding: "16px" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: "rgba(255,200,0,0.07)",
                    border: "1px solid rgba(255,200,0,0.15)",
                    color: "rgba(255,200,0,0.7)",
                    fontSize: "10px",
                    fontWeight: 800,
                    marginBottom: "8px",
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
                    fontSize: "14px",
                    marginBottom: "4px",
                    lineHeight: 1.4,
                    fontFamily: "'Cairo', sans-serif",
                  }}
                >
                  {product.nameAr}
                </h3>

                <p
                  style={{
                    color: "rgba(255,255,255,0.22)",
                    fontSize: "11px",
                    marginBottom: "14px",
                    fontFamily: "monospace",
                    direction: "ltr",
                    textAlign: "right",
                  }}
                >
                  {product.specs}
                </p>

                {/* Price placeholder row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255,255,255,0.2)",
                      fontSize: "12px",
                      fontFamily: "'Cairo', sans-serif",
                    }}
                  >
                    السعر
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.1)",
                      fontSize: "16px",
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

        {/* ─── VISION SECTION ─── */}
        <div
          style={{
            borderRadius: "24px",
            padding: "2px",
            background:
              "linear-gradient(135deg, rgba(0,255,102,0.2), transparent, rgba(0,255,102,0.1))",
          }}
        >
          <div
            style={{
              borderRadius: "22px",
              padding: "48px 40px",
              background: "linear-gradient(135deg, #0a1a0a, #080808, #0a0f0a)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏆</div>
            <h3
              style={{
                color: "#fff",
                fontWeight: 900,
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                marginBottom: "12px",
                fontFamily: "'Cairo', sans-serif",
              }}
            >
              الرؤية الكاملة لمتجر ماهركو
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "15px",
                maxWidth: "600px",
                margin: "0 auto 32px",
                lineHeight: 1.9,
                fontFamily: "'Cairo', sans-serif",
              }}
            >
              تخيل متجر رسمي باسم ماهركو يبيع كل ما يحتاجه الغيمر العربي —
              منتجات أصلية، توصيل سريع، وأسعار حصرية لجمهوره. المتجر سيكون
              امتداداً لشخصيتك وعلامتك التجارية على الإنترنت.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "16px",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              {[
                { num: "10+", label: "فئات منتجات" },
                { num: "0%", label: "مخاطرة عليك" },
                { num: "100%", label: "باسم ماهركو" },
                { num: "∞", label: "فرص النمو" },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    padding: "20px",
                    borderRadius: "14px",
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
                      marginBottom: "4px",
                    }}
                  >
                    {stat.num}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "12px",
                      fontFamily: "'Cairo', sans-serif",
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
