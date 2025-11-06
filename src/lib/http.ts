export interface HttpSuccessResponse<T = any> {
  ok: true;
  data: T;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface HttpErrorResponse {
  ok: false;
  error: string;
  code?: string;
  details?: any;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export type HttpResponse<T = any> = HttpSuccessResponse<T> | HttpErrorResponse;

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function ok<T>(data: T, init?: ResponseInit): Response {
  const response: HttpSuccessResponse<T> = {
    ok: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };

  return Response.json(response, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

export function err(message: string, status: number = 400, extra?: any): Response {
  const response: HttpErrorResponse = {
    ok: false,
    error: message,
    details: extra,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };

  return Response.json(response, {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function unauthorized(message: string = "Unauthorized"): Response {
  return err(message, 401);
}

export function forbidden(message: string = "Forbidden"): Response {
  return err(message, 403);
}

export function notFound(message: string = "Not found"): Response {
  return err(message, 404);
}

export function conflict(message: string, details?: any): Response {
  return err(message, 409, details);
}

export function unprocessable(message: string, details?: any): Response {
  return err(message, 422, details);
}

export function tooManyRequests(message: string = "Too many requests", retryAfter?: number): Response {
  return Response.json(
    {
      ok: false,
      error: message,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    },
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
      },
    }
  );
}

export function serverError(message: string = "Internal server error", details?: any): Response {
  const isDev = import.meta.env.DEV;
  return err(message, 500, isDev ? details : undefined);
}

export function withCors(response: Response, origin: string = "*"): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Client-Info, Apikey");
  headers.set("Access-Control-Max-Age", "86400");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function noContent(): Response {
  return new Response(null, { status: 204 });
}

export function created<T>(data: T): Response {
  return ok(data, { status: 201 });
}

export async function handleApiError(error: unknown): Promise<Response> {
  console.error("[API Error]", error);

  if (error instanceof Error) {
    if (error.message === "UNAUTHENTICATED") {
      return unauthorized("Authentication required");
    }
    if (error.message === "INVALID_JSON") {
      return unprocessable("Invalid JSON body");
    }
    if (error.message.startsWith("VALIDATION_ERROR:")) {
      const details = error.message.replace("VALIDATION_ERROR: ", "");
      return unprocessable("Validation failed", JSON.parse(details));
    }
    if (error.message.includes("not found")) {
      return notFound(error.message);
    }

    return serverError(error.message);
  }

  return serverError("An unexpected error occurred");
}
