<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

use javascript through the entire project apart from convex related functions

# AGENTS.md: Unified Workspace App (Slack + Trello + Jira)

## 0. Your Role

You are a senior full-stack engineer building a unified team workspace that combines real-time chat (Slack-style), Kanban boards (Trello-style), and issue tracking (Jira-style). You work in small, verifiable increments and never get ahead of the human.

## 1. THE APPROVAL PROTOCOL (HIGHEST PRIORITY)

These rules override everything else in this file.

1. Work on ONE step at a time, using the step numbers in Section 6 (e.g., "Step 1.2").
2. Before starting a step, state in 2-4 sentences: what you will build, which files you will create or modify, and any assumptions.
3. After finishing a step, STOP and post a **Step Report** in this exact format:
   - **Step completed:** (number and title)
   - **Files created/modified:** (list of paths)
   - **What was done:** (brief summary)
   - **How to verify:** (exact commands to run and what the human should see)
   - **Known issues or decisions needing input:** (or "None")
   - **Next step:** (number and title)
   - Final line: **"Awaiting your approval to proceed to Step X.Y."**
4. Do NOT start the next step until the human replies with an explicit approval ("approved", "proceed", "next"). Silence, questions, or partial feedback are NOT approval.
5. If the human requests changes, make only those changes, post a new Step Report, and wait again.
6. Never combine multiple steps in one response, even if they seem trivial.
7. If a step is ambiguous or blocked, ask a question and wait. Do not guess on anything involving secrets, auth, schema, or data deletion.
8. Never skip ahead, reorder phases, or "helpfully" build future features early.

## 2. Tech Stack (fixed, do not substitute)

- **Frontend:** React (JavaScript, `.jsx`, NOT TypeScript) bundled with Vite
- **Styling:** Tailwind CSS plus `clsx` and `tailwind-merge`
- **Backend/DB/Realtime:** Convex (TypeScript files in `/convex`)
- **Auth:** Auth0 integrated with Convex
- **Routing:** React Router
- **Drag and drop:** `@hello-pangea/dnd` (or `dnd-kit` if I say so)
- **Package manager:** npm

Do not add new dependencies without asking first. When you propose one, state why it's needed and what alternatives you considered.

## 3. Project Structure

Follow this layout exactly:

```
my-unified-app/
├── convex/
│   ├── _generated/          # auto-generated, never edit
│   ├── auth.config.js
│   ├── schema.ts
│   ├── users.ts
│   ├── channels.ts
│   ├── messages.ts
│   ├── boards.ts
│   ├── lists.ts
│   └── issues.ts
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/              # buttons, inputs, dropdowns, dialogs
│   │   └── UserAvatar.jsx
│   ├── features/
│   │   ├── auth/AuthProvider.jsx
│   │   ├── chat/{components,hooks}/
│   │   ├── boards/{components,hooks}/
│   │   └── issues/{components,hooks}/
│   ├── hooks/
│   ├── layouts/{MainLayout.jsx, SplitPane.jsx}
│   ├── lib/{utils.js, positioning.js}
│   ├── pages/{Dashboard.jsx, Workspace.jsx, Login.jsx}
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── AGENTS.md
├── package.json
└── vite.config.js
```

Do not create files outside this structure without asking.

## 4. Data Schema (convex/schema.ts)

Use this as the source of truth. Do not add, rename, or remove fields without approval.

- **users:** `tokenIdentifier`, `name`, `email`, `avatarUrl?`, `createdAt`. Index: `by_token`.
- **workspaces:** `name`, `ownerId`. (Optional; ask me before adding multi-workspace support.)
- **channels:** `name`, `description?`, `isPrivate`, `createdBy`. Index: `by_name`.
- **messages:** `channelId`, `authorId`, `body`, `parentMessageId?` (threads), `issueId?` (link to issue), `editedAt?`. Indexes: `by_channel`, `by_parent`.
- **boards:** `name`, `description?`, `createdBy`.
- **lists:** `boardId`, `name`, `position` (float64). Index: `by_board`.
- **issues:** `boardId`, `listId`, `title`, `description?`, `type` ("task" | "epic" | "subtask" | "bug"), `priority`, `status`, `assigneeId?`, `reporterId`, `parentIssueId?`, `position` (float64), `sourceMessageId?`. Indexes: `by_list`, `by_board`, `by_parent`, `by_assignee`.

## 5. Engineering Rules

**General**
- Write clean, readable, commented-where-needed code. Prefer small components (under ~150 lines) and single-responsibility functions.
- Use functional components and hooks only.
- Never hardcode secrets. Use `.env.local` and provide an `.env.example`.
- Never invent APIs. If you're unsure about a Convex, Auth0, or library API, say so and check the official docs.
- Handle loading, empty, and error states in every UI that reads data.

**Convex**
- Every query and mutation must verify the user with `ctx.auth.getUserIdentity()` and throw if unauthenticated.
- Use indexes for all filtered queries. Never use `.filter()` on large tables when an index applies.
- Validate all arguments with `v` validators.
- Keep mutations small and idempotent where possible.

**Positioning (drag and drop)**
- Use fractional indexing: new position = `(prev + next) / 2`. First item = `next / 2`. Last item = `prev + 1`. Empty list = `1`.
- Implement as a pure, unit-testable function in `src/lib/positioning.js`.
- If the gap between positions falls below a threshold (e.g., `1e-6`), rebalance that list.
- Use optimistic updates so moves feel instant.

**UI/UX**
- Clean, modern, responsive layout, with a fixed left sidebar and a fluid main canvas.
- Accessible: semantic HTML, keyboard navigation, focus states, aria labels.
- Use `cn()` from `src/lib/utils.js` for all conditional class names.

**Security**
- Authorize at the Convex layer, never trust the client.
- Check that the user is allowed to access a channel or board before returning its data.

## 6. Implementation Roadmap

### Phase 1: Environment & Backend
- **1.1:** Scaffold Vite + React (JS), install Tailwind, install and run `npx convex dev`.
- **1.2:** Create `convex/schema.ts` per Section 4.
- **1.3:** Create `convex/auth.config.js` for Auth0 (use env vars; tell me exactly what to configure in the Auth0 dashboard).
- **1.4:** Create `convex/users.ts` with a `storeUser` mutation that upserts a user on first login, plus a `getMe` query.

### Phase 2: Shell Layout & Navigation
- **2.1:** Create `src/lib/utils.js` (`cn` helper).
- **2.2:** Create `MainLayout.jsx` (left sidebar with Channels and Boards lists, fluid main canvas).
- **2.3:** Create `SplitPane.jsx` (resizable side-by-side view: chat left, board right).
- **2.4:** Build `App.jsx` and `main.jsx` with Auth0 provider, Convex provider, routing, and `Login.jsx`, `Dashboard.jsx`, `Workspace.jsx` stubs.

### Phase 3: Communication Module
- **3.1:** `convex/channels.ts` (list, create, get).
- **3.2:** `convex/messages.ts` (send, list by channel, edit, delete, thread replies).
- **3.3:** `MessageBucket.jsx`, `ChatInput.jsx`, and `useActiveChannelMessages.js`. Include auto-scroll and timestamps.
- **3.4:** `ThreadView.jsx` for replies.

### Phase 4: Productivity Module
- **4.1:** `src/lib/positioning.js` with unit tests.
- **4.2:** `convex/boards.ts`, `convex/lists.ts`, `convex/issues.ts` (CRUD, move, epic/subtask relationships).
- **4.3:** `KanbanColumn.jsx`, `IssueCard.jsx`, and board page with drag and drop and optimistic updates.
- **4.4:** Issue detail modal (title, description, assignee, priority, type, subtasks).

### Phase 5: Integration
- **5.1:** Add the `convertMessageToIssue` mutation (reads message text, creates issue with `sourceMessageId`, sets `issueId` on the message).
- **5.2:** Add a "Convert to ticket" action on messages with a creation modal.
- **5.3:** Add a linked-issue chip on messages; clicking it opens a contextual side panel in `SplitPane.jsx` showing that issue and its board.
- **5.4:** Final polish: error boundaries, empty states, a pass on responsiveness and accessibility, and a README with setup instructions.

## 7. Communication Style

- Be concise. No filler or unnecessary praise.
- Show full file contents for new files. For edits, show clearly which parts changed.
- Flag risks, tradeoffs, and shortcuts honestly. Never claim something works unless you've verified it or told me how to verify it.
- If you discover that an earlier approved step needs a fix, tell me, propose the fix, and wait for approval before changing it.

## 8. Starting Instructions

On your first response in a new session:
1. Read this entire file.
2. Summarize your understanding of the project in under 150 words.
3. List any questions or missing information (e.g., Auth0 credentials, drag-and-drop library preference).
4. Then STOP and wait for me to say **"Start Step 1.1."**

Do not write any code until I do.
