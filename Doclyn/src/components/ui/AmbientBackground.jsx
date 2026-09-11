// Mounted once in App.jsx so it isn't re-created per page. This is the
// ONLY continuously-animating element in the whole app (two soft glows) —
// deliberately kept to one layer instead of stacking many independent
// animated elements, per the performance requirement in the design brief.
export default function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-orb" style={{ left: "-140px", top: "80px" }} />
      <div className="ambient-orb two" />
    </div>
  );
}
