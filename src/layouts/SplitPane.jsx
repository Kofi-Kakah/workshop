import { useState } from "react";

export default function SplitPane({ left, right }) {
  const [leftWidth, setLeftWidth] = useState(50);
  return (
    <div className="flex h-full w-full">
      <div style={{ width: `${leftWidth}%` }} className="overflow-auto border-r border-gray-200">
        {left}
      </div>
      <div
        className="w-1 cursor-col-resize bg-gray-200"
        onMouseDown={(e) => {
          const startX = e.clientX;
          const startWidth = leftWidth;
          const onMove = (ev) => {
            const delta = ((ev.clientX - startX) / window.innerWidth) * 100;
            setLeftWidth(Math.min(80, Math.max(20, startWidth + delta)));
          };
          const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
          };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onUp);
        }}
      />
      <div style={{ width: `${100 - leftWidth}%` }} className="overflow-auto">
        {right}
      </div>
    </div>
  );
}
