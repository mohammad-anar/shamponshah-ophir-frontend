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
    getOrderMessages: builder.query<any, { orderId: string; page?: number; limit?: number; before?: string }>({
      query: ({ orderId, ...params }) => ({
        url: `/orders/${orderId}/messages`,
        method: "GET",
        params,
      }),
      providesTags: (_res, _err, { orderId }) => [{ type: "messages", id: `order-${orderId}` }],
    }),
    sendOrderMessage: builder.mutation<any, { orderId: string; content?: string; attachments?: string[] }>({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/messages`,
        method: "POST",
        body,
      }),
    }),
    markOrderMessagesRead: builder.mutation<any, { orderId: string }>({
      query: ({ orderId }) => ({
        url: `/orders/${orderId}/messages/read`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetUserConversationsQuery,
  useGetConversationMessagesQuery,
  useLazyGetConversationMessagesQuery,
  useSendMessageMutation,
  useStartConversationMutation,
  useGetOrderMessagesQuery,
  useLazyGetOrderMessagesQuery,
  useSendOrderMessageMutation,
  useMarkOrderMessagesReadMutation,
} = messagesApi;
