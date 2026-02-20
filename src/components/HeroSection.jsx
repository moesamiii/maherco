import currentEvent from "../data/currentEvent";
import mahercoImage2 from "../images/mahercoo.png";
import { Link } from "react-router-dom";

export default function HeroSection() {
  if (!currentEvent.active) return null;

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#00ff6620_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#00ff6610_0%,_transparent_60%)]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />

      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 items-center gap-16 z-10">
        {/* Left Content */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/30 text-green-400 text-sm font-semibold px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live Event
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="text-white">
              {currentEvent.title.split(" ")[0]}{" "}
            </span>
            <span className="text-green-400">
              {currentEvent.title.split(" ").slice(1).join(" ")}
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            {currentEvent.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link to="/join-tournament">
              <button className="bg-green-400 text-black px-8 py-3 rounded-xl font-bold text-sm hover:bg-green-300 hover:scale-105 transition-all duration-200 shadow-[0_0_20px_#00ff6640]">
                {currentEvent.buttonText}
              </button>
            </Link>

            <a
              href="https://kick.com/maherco"
              target="_blank"
              rel="noreferrer"
              className="border border-green-400/60 text-green-400 px-8 py-3 rounded-xl font-bold text-sm hover:bg-green-400 hover:text-black hover:scale-105 transition-all duration-200"
            >
              {currentEvent.secondaryButton}
            </a>
          </div>

          {/* Stats Row */}
          <div className="flex gap-8 pt-2">
            <div>
              <p className="text-white font-bold text-xl">٦٠٠ ألف+</p>
              <p className="text-gray-500 text-sm">متابع على Kick</p>
            </div>

            <div className="w-px bg-green-400/20" />

            <div>
              <p className="text-white font-bold text-xl">٩٦٨ ألف+</p>
              <p className="text-gray-500 text-sm">متابع على إنستغرام</p>
            </div>

            <div className="w-px bg-green-400/20" />

            <div>
              <p className="text-white font-bold text-xl">٤.٥ مليون+</p>
              <p className="text-gray-500 text-sm">مشترك على يوتيوب</p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center relative">
          <div className="absolute inset-0 rounded-3xl bg-green-400/10 blur-3xl scale-90" />
          <img
            src={mahercoImage2}
            alt="Maherco"
            className="relative rounded-3xl border border-green-400/40 w-[380px] md:w-[460px] shadow-[0_0_80px_#00ff6630] hover:shadow-[0_0_100px_#00ff6650] hover:scale-[1.02] transition-all duration-300 object-cover"
          />
        </div>
      </div>
    </section>
  );
}
