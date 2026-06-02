type EditableNumberProps = {
  value: number;
  isEditing: boolean;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  className?: string;
};

export default function EditableNumber({
  value,
  isEditing,
  onChange,
  format,
  className = "",
}: EditableNumberProps) {
  if (!isEditing) {
    return (
      <span className={className}>{format ? format(value) : String(value)}</span>
    );
  }
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`bg-momo-light border-b border-momo-deep focus:outline-none text-center w-20 rounded-sm ${className}`}
    />
  );
}
