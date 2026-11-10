// Simple text renderer: khali line = naya paragraph, "## " = heading
export default function Rich({ text }) {
  if (!text) return null;
  return (
    <div className="prose">
      {text.split(/\n\s*\n/).map((block, i) =>
        block.startsWith('## ') ? <h2 key={i}>{block.slice(3)}</h2> : <p key={i}>{block}</p>
      )}
    </div>
  );
}
