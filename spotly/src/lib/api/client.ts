import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getEnvVar } from "../utils/env";

const API_URL = getEnvVar("NEXT_PUBLIC_API_URL", "http://localhost:3333/api/v1");

type RequestConfig<T> = AxiosRequestConfig<T>;

class ApiClient {
  private readonly client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      withCredentials: true,
    });
  }

  get<T, R = T>(url: string, config?: RequestConfig<unknown>) {
    return this.wrap<T, R>(this.client.get(url, config));
  }

  post<T, Body = unknown, R = T>(url: string, body?: Body, config?: RequestConfig<Body>) {
    return this.wrap<T, R>(this.client.post(url, body, config));
  }

  put<T, Body = unknown, R = T>(url: string, body?: Body, config?: RequestConfig<Body>) {
    return this.wrap<T, R>(this.client.put(url, body, config));
  }

  patch<T, Body = unknown, R = T>(url: string, body?: Body, config?: RequestConfig<Body>) {
    return this.wrap<T, R>(this.client.patch(url, body, config));
  }

  delete<T, R = T>(url: string, config?: RequestConfig<unknown>) {
    return this.wrap<T, R>(this.client.delete(url, config));
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common.Authorization;
    }
  }

  private async wrap<T, R>(request: Promise<AxiosResponse<T>>): Promise<R> {
    const { data } = await request;
    return data as unknown as R;
  }
}

export const apiClient = new ApiClient(API_URL);

