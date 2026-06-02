type StatCardProps = {
  label: string;
  display: string;
  rawValue: number;
  sublabel?: string;
  isEditing?: boolean;
  onValueChange?: (v: number) => void;
};

export default function StatCard({
  label,
  display,
  rawValue,
  sublabel,
  isEditing = false,
  onValueChange,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-line p-6 flex flex-col items-center text-center gap-1">
      {isEditing && onValueChange ? (
        <input
          type="number"
          value={rawValue}
          onChange={(e) => onValueChange(Number(e.target.value))}
          className="text-3xl sm:text-[40px] font-bold text-momo-deep w-full text-center border-b-2 border-momo-deep focus:outline-none bg-transparent leading-none"
        />
      ) : (
        <p className="text-3xl sm:text-[40px] font-bold text-momo-deep leading-none">{display}</p>
      )}
      <p className="text-sm text-ink-soft mt-1 font-medium">{label}</p>
      {sublabel && (
        <p className="text-xs text-ink-soft line-clamp-1">{sublabel}</p>
      )}
    </div>
  );
}
