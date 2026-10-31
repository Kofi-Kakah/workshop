import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    users: defineTable({
      auth0Id: v.string(),
      name: v.string(),
      email: v.string(),
      avatarUrl: v.optional(v.string()),
    }).index("by_auth0Id", ["auth0Id"]),

    workspaces: defineTable({
      name: v.string(),
      slug: v.string(),
    }).index("by_slug", ["slug"]),

    memberships: defineTable({
      workspaceId: v.id("workspaces"),
      userId: v.id("users"),
      role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    })
      .index("by_workspace", ["workspaceId"])
      .index("by_user", ["userId"])
      .index("by_workspace_user", ["workspaceId", "userId"]),

    channels: defineTable({
      workspaceId: v.id("workspaces"),
      name: v.string(),
      topic: v.optional(v.string()),
      isPrivate: v.boolean(),
      createdBy: v.id("users"),
    }).index("by_workspace", ["workspaceId"]),

    messages: defineTable({
      channelId: v.id("channels"),
      authorId: v.id("users"),
      body: v.string(),
      parentMessageId: v.optional(v.id("messages")),
      linkedIssueId: v.optional(v.id("issues")),
      createdAt: v.number(),
    })
      .index("by_channel_created", ["channelId", "createdAt"])
      .index("by_parent", ["parentMessageId"]),

    boards: defineTable({
      workspaceId: v.id("workspaces"),
      name: v.string(),
      archived: v.boolean(),
      createdBy: v.id("users"),
    }).index("by_workspace", ["workspaceId"]),

    lists: defineTable({
      boardId: v.id("boards"),
      name: v.string(),
      position: v.number(),
    })
      .index("by_board", ["boardId"])
      .index("by_board_position", ["boardId", "position"]),

    issues: defineTable({
      boardId: v.id("boards"),
      listId: v.id("lists"),
      title: v.string(),
      description: v.optional(v.string()),
      status: v.string(),
      priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent"))),
      position: v.number(),
      assigneeId: v.optional(v.id("users")),
      parentId: v.optional(v.id("issues")),
      epicId: v.optional(v.id("issues")),
      blocks: v.optional(v.array(v.id("issues"))),
      blockedBy: v.optional(v.array(v.id("issues"))),
      createdBy: v.id("users"),
    })
      .index("by_list_position", ["listId", "position"])
      .index("by_board", ["boardId"])
      .index("by_assignee", ["assigneeId"])
      .index("by_parent", ["parentId"]),
  },
  { schemaValidation: true }
);
