import { env } from "@/core/config/env";
import { AppError } from "@/core/errors/AppError";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.apiUrl;
  }

  async get<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`);

    if (!response.ok) {
      throw new AppError(`GET ${url} failed`, response.status);
    }

    return response.json();
  }

  async post<T>(
    url: string,
    body?: unknown
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new AppError(`POST ${url} failed`, response.status);
    }

    return response.json();
  }

  async put<T>(
    url: string,
    body?: unknown
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new AppError(`PUT ${url} failed`, response.status);
    }

    return response.json();
  }

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new AppError(`DELETE ${url} failed`, response.status);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();