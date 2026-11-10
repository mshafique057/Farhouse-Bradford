export default function PageHead({ title, intro }) {
  return (
    <div className="container page-head">
      <h1>{title}</h1>
      {intro && <p className="lead pre">{intro}</p>}
    </div>
  );
}
