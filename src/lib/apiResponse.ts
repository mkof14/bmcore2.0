export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function ok<T>(data: T, message?: string): Response {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function created<T>(data: T, message?: string): Response {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };

  return new Response(JSON.stringify(response), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function noContent(): Response {
  return new Response(null, {
    status: 204,
  });
}

export function badRequest(error: string, code?: string, details?: any): Response {
  const response: ApiErrorResponse = {
    success: false,
    error,
    code,
    details,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };

  return new Response(JSON.stringify(response), {
    status: 400,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function unauthorized(error: string = "Unauthorized", code?: string): Response {
  const response: ApiErrorResponse = {
    success: false,
    error,
    code: code || "UNAUTHORIZED",
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };

  return new Response(JSON.stringify(response), {
    status: 401,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function forbidden(error: string = "Forbidden", code?: string): Response {
  const response: ApiErrorResponse = {
    success: false,
    error,
    code: code || "FORBIDDEN",
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };

  return new Response(JSON.stringify(response), {
    status: 403,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function notFound(error: string = "Resource not found", code?: string): Response {
  const response: ApiErrorResponse = {
    success: false,
    error,
    code: code || "NOT_FOUND",
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };

  return new Response(JSON.stringify(response), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function conflict(error: string, code?: string, details?: any): Response {
  const response: ApiErrorResponse = {
    success: false,
    error,
    code: code || "CONFLICT",
    details,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };

  return new Response(JSON.stringify(response), {
    status: 409,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function tooManyRequests(error: string = "Too many requests", retryAfter?: number): Response {
  const response: ApiErrorResponse = {
    success: false,
    error,
    code: "RATE_LIMIT_EXCEEDED",
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (retryAfter) {
    headers["Retry-After"] = String(retryAfter);
  }

  return new Response(JSON.stringify(response), {
    status: 429,
    headers,
  });
}

export function internalError(
  error: string = "Internal server error",
  code?: string,
  details?: any
): Response {
  const response: ApiErrorResponse = {
    success: false,
    error,
    code: code || "INTERNAL_ERROR",
    details: import.meta.env.DEV ? details : undefined,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };

  return new Response(JSON.stringify(response), {
    status: 500,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function serviceUnavailable(error: string = "Service unavailable"): Response {
  const response: ApiErrorResponse = {
    success: false,
    error,
    code: "SERVICE_UNAVAILABLE",
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };

  return new Response(JSON.stringify(response), {
    status: 503,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function fail(error: string, status: number = 400, code?: string, details?: any): Response {
  const response: ApiErrorResponse = {
    success: false,
    error,
    code,
    details,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function withCors(response: Response, origin: string = "*"): Response {
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Access-Control-Allow-Origin", origin);
  newHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Client-Info, Apikey");
  newHeaders.set("Access-Control-Max-Age", "86400");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
