import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");
  return (
    <form
      className="flex gap-2 border-t p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSend(value);
        setValue("");
      }}
    >
      <input
        className="flex-1 rounded border px-3 py-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">
        Send
      </button>
    </form>
  );
}
