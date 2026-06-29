// Extracts the server-provided message from an Axios error, falling back to a default.
export function getErrorMessage(err: unknown, fallback: string): string {
  return (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg || fallback;
}
