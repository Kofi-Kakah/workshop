import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function requireUser(ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();
  if (!user) throw new Error("User not found");
  return user;
}

export const listByChannel = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    return await ctx.db
      .query("messages")
      .withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
      .collect();
  },
});

export const listThread = query({
  args: { parentMessageId: v.id("messages") },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    return await ctx.db
      .query("messages")
      .withIndex("by_parent", (q) => q.eq("parentMessageId", args.parentMessageId))
      .collect();
  },
});

export const send = mutation({
  args: {
    channelId: v.id("channels"),
    body: v.string(),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    return await ctx.db.insert("messages", {
      channelId: args.channelId,
      authorId: user._id,
      body: args.body,
      parentMessageId: args.parentMessageId,
    });
  },
});

export const edit = mutation({
  args: { id: v.id("messages"), body: v.string() },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const msg = await ctx.db.get(args.id);
    if (!msg || msg.authorId !== user._id) throw new Error("Not allowed");
    await ctx.db.patch(args.id, { body: args.body, editedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const msg = await ctx.db.get(args.id);
    if (!msg || msg.authorId !== user._id) throw new Error("Not allowed");
    await ctx.db.delete(args.id);
  },
});
