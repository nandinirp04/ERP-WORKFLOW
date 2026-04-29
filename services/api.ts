import axios, { AxiosError } from "axios";

import type { ApiError } from "@/types/api";

const API_TIMEOUT_MS = 15000;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  timeout: API_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    return Promise.reject({
      message: error.response?.data?.message ?? error.message,
      code: error.response?.data?.code,
      status: error.response?.status,
    } satisfies ApiError);
  }
);
