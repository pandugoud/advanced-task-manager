export default function SummaryCards({ summary }) {
  const cards = [
    { label: "Total Tasks", value: summary.total || 0, tone: "neutral" },
    { label: "To Do", value: summary.todo || 0, tone: "todo" },
    { label: "In Progress", value: summary.inprogress || 0, tone: "progress" },
    { label: "Done", value: summary.done || 0, tone: "done" },
    { label: "High Priority", value: summary.high || 0, tone: "high" },
  ];

  return (
    <section className="summary-grid">
      {cards.map((card) => (
        <article key={card.label} className={`summary-card ${card.tone}`}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}