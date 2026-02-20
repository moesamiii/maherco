export default function Header() {
  return (
    <header className="flex items-center justify-between px-10 py-6 border-b border-green-500/20">
      <h1 className="text-2xl font-bold text-kickGreen">Maherco Live</h1>

      <div className="flex items-center gap-2">
        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        <span className="text-sm text-gray-400">LIVE</span>
      </div>
    </header>
  );
}
