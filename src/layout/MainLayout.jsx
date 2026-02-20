import Header from "../components/Header";
import AnnouncementBanner from "../components/AnnouncementBanner";

export default function MainLayout({ children }) {
  const announcement = {
    title: "بطولة روكيت ليق",
    prize: "جائزة بقيمة $8,000",
    countdown: "تنتهي خلال 3 أيام",
    active: true,
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <AnnouncementBanner announcement={announcement} />
      <Header />
      <div>{children}</div>
    </div>
  );
}
