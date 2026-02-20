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
    <section className="relative w-full py-24 overflow-hidden bg-black border-t border-green-500/20">
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-green-400 text-xs font-bold tracking-[0.3em] uppercase mb-2 opacity-70">
            ● Partners
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Official{" "}
            <span
              className="text-green-400"
              style={{ textShadow: "0 0 30px #00FF6660" }}
            >
              Sponsors
            </span>
          </h2>
          <p className="text-gray-500 text-sm mt-3">
            Proudly supported by our amazing partners
          </p>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sponsors.map((sponsor, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer"
              style={{
                background: "linear-gradient(145deg, #111, #0a0a0a)",
                borderColor: "rgba(0,255,102,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,255,102,0.5)";
                e.currentTarget.style.boxShadow =
                  "0 0 40px rgba(0,255,102,0.15)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,255,102,0.15)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="p-8 flex flex-col items-center gap-6">
                <div
                  className="w-full flex items-center justify-center rounded-xl p-8"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-20 object-contain"
                  />
                </div>

                <div className="text-center">
                  <p className="text-white font-black text-lg">
                    {sponsor.name}
                  </p>
                  <p className="text-green-400 text-sm mt-1 opacity-70">
                    {sponsor.tag}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
