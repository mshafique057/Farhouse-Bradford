export default function Wheat({ size = 42 }) {
  const leaf = { fill: 'var(--accent)' };
  return (
    <svg width={size * 0.5} height={size} viewBox="0 0 40 80" aria-hidden="true" focusable="false">
      <path d="M20 78V18" style={{ stroke: 'var(--secondary)' }} strokeWidth="3" fill="none" />
      <ellipse style={leaf} cx="20" cy="12" rx="5" ry="10" />
      <ellipse style={leaf} cx="11" cy="28" rx="5" ry="10" transform="rotate(-35 11 28)" />
      <ellipse style={leaf} cx="29" cy="28" rx="5" ry="10" transform="rotate(35 29 28)" />
      <ellipse style={leaf} cx="11" cy="46" rx="5" ry="10" transform="rotate(-35 11 46)" />
      <ellipse style={leaf} cx="29" cy="46" rx="5" ry="10" transform="rotate(35 29 46)" />
    </svg>
  );
}
