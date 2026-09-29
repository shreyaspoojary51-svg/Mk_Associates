"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="page-intro">
      <div className="container">
        <p className="eyebrow">THE STUDIO COLLECTION</p>
        <h1 className="display">A brief pause.</h1>
        <p className="body-large">
          Our published collection is temporarily unavailable. We won’t
          substitute unapproved work. Please try again in a moment.
        </p>
        <button className="button" onClick={reset} style={{ marginTop: 32 }}>
          Try again ↗
        </button>
      </div>
    </section>
  );
}
