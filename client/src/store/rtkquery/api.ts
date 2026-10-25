import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type ApiResponse = {
	success: boolean;
	message?: string;
	error?: string;
};

export type Document = {
	id: string;
	fileName: string;
	fileType: string;
	sourceType: "FILE" | "WEBSITE" | "YOUTUBE";
	fileSize: number | null;
	createdAt: string;
};

export type Chat = {
	id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
};

export type ChatMessage = {
	id: string;
	chatId: string;
	role: "USER" | "ASSISTANT";
	content: string;
	sources: string[];
	createdAt: string;
};

export type CreditTransaction = {
	id: string;
	amount: number;
	type: "PURCHASE" | "USAGE";
	description: string;
	createdAt: string;
};

const apiBaseUrl = `${(import.meta.env.VITE_API_URL ?? "https://knowladge-base-backend.onrender.com").replace(/\/$/, "")}/api/v1`;

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: apiBaseUrl,
		credentials: "include",
	}),
	tagTypes: ["Documents", "Chats", "ChatMessages", "Credits", "ApiKeys"],
	endpoints: (builder) => ({
		ingestDocument: builder.mutation<ApiResponse & { chunkSize: number }, File>({
			query: (file) => {
				const body = new FormData();
				body.append("file", file);
				return { url: "/ingest", method: "POST", body };
			},
			invalidatesTags: ["Documents", "Credits"],
		}),
		getDocuments: builder.query<{ success: true; documents: Document[] }, void>({
			query: () => "/get-all",
			providesTags: ["Documents"],
		}),
		deleteDocument: builder.mutation<ApiResponse, string>({
			query: (id) => ({ url: `/delete-document/${id}`, method: "DELETE" }),
			invalidatesTags: ["Documents"],
		}),

		addApiKey: builder.mutation<ApiResponse & { data: ApiKey }, CreateApiKeyRequest>({
			query: (body) => ({ url: "/add-api", method: "POST", body }),
			invalidatesTags: ["ApiKeys"],
		}),
		updateApiKey: builder.mutation<ApiResponse, UpdateApiKeyRequest>({
			query: (body) => ({ url: "/update-api", method: "PATCH", body }),
			invalidatesTags: ["ApiKeys"],
		}),
		deleteApiKey: builder.mutation<ApiResponse, string>({
			query: (id) => ({ url: "/delete-api", method: "DELETE", body: { id } }),
			invalidatesTags: ["ApiKeys"],
		}),

		getChats: builder.query<{ success: true; chats: Chat[] }, void>({
			query: () => "/chat/all-chat",
			providesTags: ["Chats"],
		}),
		getChatMessages: builder.query<{ success: true; chat: ChatMessage[] }, string>({
			query: (id) => `/chat/${id}`,
			providesTags: (_result, _error, id) => [{ type: "Chats", id }],
		}),
		deleteChat: builder.mutation<ApiResponse, string>({
			query: (id) => ({ url: `/chat/${id}`, method: "DELETE" }),
			invalidatesTags: ["Chats"],
		}),

		getCreditBalance: builder.query<CreditBalanceResponse, void>({
			query: () => "/credit/balance",
			providesTags: ["Credits"],
		}),
		getCreditTransactions: builder.query<{
			success: true;
			transactions: CreditTransaction[];
		}, void>({
			query: () => "/credit/transactions",
			providesTags: ["Credits"],
		}),

		ingestWebsite: builder.mutation<ApiResponse & { documentId: string }, { url: string }>({
			query: (body) => ({ url: "/add-webdata", method: "POST", body }),
			invalidatesTags: ["Documents", "Credits"],
		}),
		deleteWebsite: builder.mutation<ApiResponse, string>({
			query: (id) => ({ url: "/delete-webdata", method: "DELETE", body: { id } }),
			invalidatesTags: ["Documents"],
		}),
		ingestYouTube: builder.mutation<ApiResponse, { url: string }>({
			query: (body) => ({ url: "/add-youtube", method: "POST", body }),
			invalidatesTags: ["Documents", "Credits"],
		}),
		deleteYouTube: builder.mutation<ApiResponse, string>({
			query: (id) => ({ url: "/delete-youtube", method: "DELETE", body: { id } }),
			invalidatesTags: ["Documents"],
		}),

		createPaymentOrder: builder.mutation<CreatePaymentOrderResponse, { credits: number }>({
			query: (body) => ({ url: "/payment/create-order", method: "POST", body }),
		}),
		verifyPayment: builder.mutation<VerifyPaymentResponse, VerifyPaymentRequest>({
			query: (body) => ({ url: "/payment/verify", method: "POST", body }),
			invalidatesTags: ["Credits"],
		}),
		getPricing: builder.query<PricingResponse, void>({
			query: () => "/payment/pricing",
		}),
	}),
});

export type ApiKey = {
	id: string;
	name: string;
	provider: string;
	apiKey: string;
};

export type CreateApiKeyRequest = Omit<ApiKey, "id">;
export type UpdateApiKeyRequest = Partial<CreateApiKeyRequest> & { id: string };

export type CreditBalanceResponse = {
	success: true;
	balance: number;
	updatedAt: string | null;
};

export type CreatePaymentOrderResponse = ApiResponse & {
	success: true;
	order: {
		id: string;
		amount: number;
		currency: string;
		credits: number;
		displayPrice: string;
	};
};

export type VerifyPaymentRequest = {
	orderId: string;
	paymentId: string;
	signature: string;
};

export type VerifyPaymentResponse = ApiResponse & { credits: number };

export type PricingResponse = ApiResponse & {
	pricePerCredit: number;
	currency: "INR";
};

export const {
	useIngestDocumentMutation,
	useGetDocumentsQuery,
	useDeleteDocumentMutation,
	useAddApiKeyMutation,
	useUpdateApiKeyMutation,
	useDeleteApiKeyMutation,
	useGetChatsQuery,
	useGetChatMessagesQuery,
	useDeleteChatMutation,
	useGetCreditBalanceQuery,
	useGetCreditTransactionsQuery,
	useIngestWebsiteMutation,
	useDeleteWebsiteMutation,
	useIngestYouTubeMutation,
	useDeleteYouTubeMutation,
	useCreatePaymentOrderMutation,
	useVerifyPaymentMutation,
	useGetPricingQuery,
} = api;
