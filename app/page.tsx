export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[#0f766e] px-6 text-center text-white">
      <span className="text-6xl font-bold tracking-tight">tr</span>
      <p className="mt-6 max-w-xl text-xl font-medium sm:text-2xl">
        The back-office every solo mutual-fund distributor needs.
      </p>
      <p className="mt-3 text-sm font-normal text-teal-100/80">
        Built first for one.
      </p>
      <button
        type="button"
        disabled
        className="mt-10 cursor-not-allowed rounded-full border border-white/25 bg-white/10 px-8 py-3 text-sm font-medium text-white/70"
      >
        Get early access
      </button>
    </main>
  );
}
