/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserConversations: builder.query<any, string | void>({
      query: (userId) => ({
        url: "/messages/conversations",
        method: "GET",
        params: userId ? { userId } : undefined,
      }),
      providesTags: (_res, _err, userId) => [{ type: "messages", id: userId || "LIST" }],
    }),
    getConversationMessages: builder.query<any, string | { conversationId: string; page?: number; limit?: number; before?: string }>({
      query: (arg) => {
        if (typeof arg === "string") {
          return {
            url: `/messages/conversations/${arg}`,
            method: "GET",
          };
        }
        return {
          url: `/messages/conversations/${arg.conversationId}`,
          method: "GET",
          params: { page: arg.page, limit: arg.limit, before: arg.before },
        };
      },
      providesTags: (_res, _err, arg) => {
        const id = typeof arg === "string" ? arg : arg?.conversationId;
        return [{ type: "messages", id }];
      },
    }),
    sendMessage: builder.mutation<any, { conversationId: string; content: string; attachments?: string[] }>({
      query: ({ conversationId, ...body }) => ({
        url: `/messages/conversations/${conversationId}`,
        method: "POST",
        body,
      }),
    }),
    startConversation: builder.mutation<any, { recipientUserId?: string; orderId?: string; initialMessage?: string }>({
      query: (body) => ({
        url: "/messages/conversations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["messages"],
    }),
  }),
});

export const {
  useGetUserConversationsQuery,
  useGetConversationMessagesQuery,
  useLazyGetConversationMessagesQuery,
  useSendMessageMutation,
  useStartConversationMutation,
} = messagesApi;
