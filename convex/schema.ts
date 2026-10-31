import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    users: defineTable({
      tokenIdentifier: v.string(),
      name: v.string(),
      email: v.string(),
      avatarUrl: v.optional(v.string()),
      createdAt: v.number(),
    }).index("by_token", ["tokenIdentifier"]),

    workspaces: defineTable({
      name: v.string(),
      ownerId: v.id("users"),
    }),

    channels: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      isPrivate: v.boolean(),
      createdBy: v.id("users"),
    }).index("by_name", ["name"]),

    messages: defineTable({
      channelId: v.id("channels"),
      authorId: v.id("users"),
      body: v.string(),
      parentMessageId: v.optional(v.id("messages")),
      issueId: v.optional(v.id("issues")),
      editedAt: v.optional(v.number()),
    })
      .index("by_channel", ["channelId"])
      .index("by_parent", ["parentMessageId"]),

    boards: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      createdBy: v.id("users"),
    }),

    lists: defineTable({
      boardId: v.id("boards"),
      name: v.string(),
      position: v.float64(),
    }).index("by_board", ["boardId"]),

    issues: defineTable({
      boardId: v.id("boards"),
      listId: v.id("lists"),
      title: v.string(),
      description: v.optional(v.string()),
      type: v.union(v.literal("task"), v.literal("epic"), v.literal("subtask"), v.literal("bug")),
      priority: v.string(),
      status: v.string(),
      assigneeId: v.optional(v.id("users")),
      reporterId: v.id("users"),
      parentIssueId: v.optional(v.id("issues")),
      position: v.float64(),
      sourceMessageId: v.optional(v.id("messages")),
    })
      .index("by_list", ["listId"])
      .index("by_board", ["boardId"])
      .index("by_parent", ["parentIssueId"])
      .index("by_assignee", ["assigneeId"]),
  },
  { schemaValidation: true }
);
