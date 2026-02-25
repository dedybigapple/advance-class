export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="h-14 w-14 rounded-full bg-brand text-3xl font-light text-white shadow-lg transition hover:bg-blue-700"
      aria-label={label}
    >
      +
    </button>
  );
}
