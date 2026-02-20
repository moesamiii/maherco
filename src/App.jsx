import { Routes, Route } from "react-router-dom";
import AnnouncementBanner from "./components/AnnouncementBanner";
import Header from "./components/Header";
import Home from "./pages/Home";
import JoinTournament from "./pages/join-tournament";

export default function App() {
  const announcement = {
    title: "بطولة روكيت ليق",
    prize: "جائزة بقيمة $8,000",
    countdown: "قريبا",
    active: true,
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* ثابت في كل الصفحات */}
      <AnnouncementBanner announcement={announcement} />
      <Header />

      {/* الجزء المتغير حسب الرابط */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join-tournament" element={<JoinTournament />} />
      </Routes>
    </div>
  );
}
