export default function AnnouncementBanner({ announcement }) {
  if (!announcement?.active) return null;

  return (
    <div className="bg-kickGreen text-black py-3 px-6 flex justify-between items-center">
      <div>
        <span className="font-bold">{announcement.title}</span> —{" "}
        {announcement.prize}
      </div>
      <div className="font-semibold">{announcement.countdown}</div>
    </div>
  );
}
