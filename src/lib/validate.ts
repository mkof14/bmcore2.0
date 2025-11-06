import { z, ZodSchema, ZodError } from "zod";

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  issues?: Array<{ path: string; message: string }>;
}

export async function parseJson<T>(req: Request, schema: ZodSchema<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new Error("INVALID_JSON");
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const error = result.error as ZodError;
    const issues = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    throw new Error(`VALIDATION_ERROR: ${JSON.stringify(issues)}`);
  }

  return result.data;
}

export function validate<T>(data: unknown, schema: ZodSchema<T>): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const error = result.error as ZodError;
    const issues = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    return {
      success: false,
      error: "Validation failed",
      issues,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

export const commonSchemas = {
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  uuid: z.string().uuid("Invalid UUID"),
  url: z.string().url("Invalid URL"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  date: z.string().datetime("Invalid date format"),
  positiveInt: z.number().int().positive("Must be a positive integer"),
  nonNegativeInt: z.number().int().min(0, "Must be non-negative"),
};

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const idSchema = z.object({
  id: commonSchemas.uuid,
});

export const emailSchema = z.object({
  email: commonSchemas.email,
});

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, 10000);
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    } else if (typeof value === "object" && value !== null) {
      sanitized[key as keyof T] = sanitizeObject(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  return sanitized;
}
