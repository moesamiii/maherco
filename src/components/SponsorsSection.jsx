import kickLogo from "../images/kick.png";
import kingsLogo from "../images/kingsleaus.png";

export default function SponsorsSection() {
  const sponsors = [
    {
      name: "Kick",
      logo: kickLogo,
      tag: "Streaming Partner",
    },
    {
      name: "Kings League",
      logo: kingsLogo,
      tag: "Official League Partner",
    },
  ];

  return (
    <>
      <style>{`
        .sponsors-section {
          position: relative;
          width: 100%;
          padding: 96px 0;
          overflow: hidden;
          background: #000;
          border-top: 1px solid rgba(0,255,102,0.2);
          box-sizing: border-box;
        }

        .sponsors-inner {
          position: relative;
          z-index: 10;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .sponsors-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .sponsors-eyebrow {
          color: #00FF66;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          opacity: 0.7;
          margin: 0 0 8px;
        }

        .sponsors-title {
          font-size: 42px;
          font-weight: 900;
          color: #fff;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .sponsors-subtitle {
          color: #555;
          font-size: 14px;
          margin: 0;
        }

        /* Desktop: 2 columns */
        .sponsors-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .sponsor-card {
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(0,255,102,0.15);
          background: linear-gradient(145deg, #111, #0a0a0a);
          cursor: pointer;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
        }

        .sponsor-card:hover {
          border-color: rgba(0,255,102,0.5);
          box-shadow: 0 0 40px rgba(0,255,102,0.15);
          transform: translateY(-4px);
        }

        .sponsor-card-inner {
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .sponsor-logo-wrap {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          padding: 32px 24px;
          background: rgba(255,255,255,0.05);
          box-sizing: border-box;
        }

        .sponsor-logo-wrap img {
          height: 80px;
          object-fit: contain;
        }

        .sponsor-info { text-align: center; }

        .sponsor-name {
          color: #fff;
          font-weight: 900;
          font-size: 17px;
          margin: 0 0 4px;
        }

        .sponsor-tag {
          color: #00FF66;
          font-size: 13px;
          opacity: 0.7;
          margin: 0;
        }

        /* ── MOBILE: horizontal scroll ── */
        @media (max-width: 580px) {
          .sponsors-section { padding: 56px 0; }
          .sponsors-inner { padding: 0; }

          .sponsors-header {
            padding: 0 16px;
            margin-bottom: 28px;
          }

          .sponsors-title { font-size: 26px; }
          .sponsors-subtitle { font-size: 13px; }

          /* Switch to horizontal scroll */
          .sponsors-grid {
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

          .sponsors-grid::-webkit-scrollbar { display: none; }

          .sponsor-card {
            min-width: 240px;
            width: 240px;
            scroll-snap-align: start;
            transform: none !important;
          }

          .sponsor-card-inner { padding: 20px; gap: 14px; }

          .sponsor-logo-wrap { padding: 20px 16px; }
          .sponsor-logo-wrap img { height: 56px; }

          .sponsor-name { font-size: 15px; }
          .sponsor-tag { font-size: 12px; }
        }

        @media (max-width: 360px) {
          .sponsor-card { min-width: 210px; width: 210px; }
          .sponsors-title { font-size: 22px; }
        }
      `}</style>

      <section className="sponsors-section">
        <div className="sponsors-inner">
          <div className="sponsors-header">
            <p className="sponsors-eyebrow">● Partners</p>
            <h2 className="sponsors-title">
              Official{" "}
              <span
                style={{ color: "#00FF66", textShadow: "0 0 30px #00FF6660" }}
              >
                Sponsors
              </span>
            </h2>
            <p className="sponsors-subtitle">
              Proudly supported by our amazing partners
            </p>
          </div>

          <div className="sponsors-grid">
            {sponsors.map((sponsor, index) => (
              <div key={index} className="sponsor-card">
                <div className="sponsor-card-inner">
                  <div className="sponsor-logo-wrap">
                    <img src={sponsor.logo} alt={sponsor.name} />
                  </div>
                  <div className="sponsor-info">
                    <p className="sponsor-name">{sponsor.name}</p>
                    <p className="sponsor-tag">{sponsor.tag}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
