export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: 12,
        padding: 24,
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontSize: 18, marginBottom: 16 }}>{title}</h2>
      {children}
    </div>
  );
}
