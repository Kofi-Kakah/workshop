import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useActiveChannelMessages(channelId) {
  return useQuery(api.messages.listByChannel, channelId ? { channelId } : "skip");
}
