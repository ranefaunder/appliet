import type { ZodType, infer as ZodInfer } from "zod";

export function parseJson<T>(json: string | null | undefined): T | null;
export function parseJson<S extends ZodType>(json: string | null | undefined, schema: S): ZodInfer<S> | null;
export function parseJson<T, S extends ZodType>(json: string | null | undefined, schema?: S): T | ZodInfer<S> | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    if (schema !== undefined) {
      const result = schema.safeParse(parsed);
      return result.success ? result.data : null;
    }
    return typeof parsed === "object" && parsed !== null ? (parsed as T) : null;
  } catch {
    return null;
  }
}
