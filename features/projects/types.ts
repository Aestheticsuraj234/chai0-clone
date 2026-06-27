/**
 * Standard shape returned by server actions when something goes wrong.
 */
export type ActionError = {
  error: string;
};

/**
 * Type guard that detects the {@link ActionError} shape.
 *
 * @param value - Any server-action result.
 * @returns `true` (narrowing to `ActionError`) when `value` has a string
 *   `error` property.
 */
export function isActionError(value: unknown): value is ActionError {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as ActionError).error === "string"
  );
}
