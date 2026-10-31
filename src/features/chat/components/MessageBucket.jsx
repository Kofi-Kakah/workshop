export default function MessageBucket({ messages }) {
  return (
    <div className="space-y-2 p-4">
      {messages.map((m) => (
        <div key={m._id} className="text-sm">
          <span className="font-medium">{m.authorId}</span>: {m.body}
        </div>
      ))}
    </div>
  );
}
