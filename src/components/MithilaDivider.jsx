export default function MithilaDivider({ motif = 'lotus' }) {
  const motifs = {
    lotus: '🪷',
    fish: '🐟',
    peacock: '🦚',
    sun: '☀️',
  };

  return (
    <div className="mithila-divider my-2">
      <span className="mx-4 flex items-center gap-3 text-terracotta/30">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M2 12 Q6 8 12 12 Q18 16 22 12" stroke="currentColor" strokeWidth="1" />
          <circle cx="4" cy="12" r="1" fill="currentColor" />
          <circle cx="20" cy="12" r="1" fill="currentColor" />
        </svg>
        <span className="text-xl">{motifs[motif]}</span>
        <svg className="w-6 h-6 rotate-180" viewBox="0 0 24 24" fill="none">
          <path d="M2 12 Q6 8 12 12 Q18 16 22 12" stroke="currentColor" strokeWidth="1" />
          <circle cx="4" cy="12" r="1" fill="currentColor" />
          <circle cx="20" cy="12" r="1" fill="currentColor" />
        </svg>
      </span>
    </div>
  );
}
