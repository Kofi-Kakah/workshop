import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import MessageBucket from "./MessageBucket.jsx";

export default function ThreadView({ parentMessageId }) {
  const replies = useQuery(api.messages.listThread, { parentMessageId });
  if (!replies) return <div className="p-4">Loading...</div>;
  return (
    <div className="border-l p-4">
      <MessageBucket messages={replies} />
    </div>
  );
}
