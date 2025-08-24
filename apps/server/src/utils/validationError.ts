import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";

export function formatZodError(err: ZodError) {
  const validationError = fromZodError(err as any, { prefix: null });
  return validationError.message.split(";").map((msg) => msg.trim());
}
