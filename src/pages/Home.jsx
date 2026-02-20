import HeroSection from "../components/HeroSection";
import GameWheel from "../components/wheel/GameWheel";
import TeamWheel from "../components/team/TeamWheel";
import SponsorsSection from "../components/SponsorsSection";
import ViewerVoteSection from "../components/ViewerVoteSection"; // 👈 أضفنا هذا
import BestClipsSection from "../components/BestClipsSection";
import Footer from "../components/Footer";
import StoreSection from "../components/StoreSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Section 1 */}
      <HeroSection />

      {/* Section 2 */}
      <div className="py-24">
        <GameWheel />
      </div>

      {/* Section 3 */}
      <TeamWheel />

      {/* Section 4 - Viewer Vote */}
      <ViewerVoteSection />

      {/* Section 6 - Best Clips */}
      <BestClipsSection />

      {/* Section 7 */}
      <SponsorsSection />

      {/* section 8 */}
      <StoreSection />

      <Footer />
    </div>
  );
}
