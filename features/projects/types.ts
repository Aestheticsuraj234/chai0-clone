export type ActionError = {
  error: string;
};

export function isActionError(value: unknown): value is ActionError {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as ActionError).error === "string"
  );
}
