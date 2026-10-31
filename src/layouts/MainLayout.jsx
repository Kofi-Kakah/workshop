export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-900">
      <aside className="w-64 shrink-0 border-r border-gray-200 bg-white p-4">
        <div className="text-lg font-semibold">Workspace</div>
        <nav className="mt-4 space-y-2">
          <div className="text-xs font-medium uppercase text-gray-500">Channels</div>
          <div className="text-sm text-gray-400">No channels yet</div>
          <div className="mt-4 text-xs font-medium uppercase text-gray-500">Boards</div>
          <div className="text-sm text-gray-400">No boards yet</div>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
