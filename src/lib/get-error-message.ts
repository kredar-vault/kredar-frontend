export function getErrorMessage(
  error: any,
  fallback = 'Something went wrong. Please try again.',
): string {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || fallback;
  }

  // .NET ProblemDetails validation errors: { errors: { FieldName: ["msg1", "msg2"] } }
  if (data.errors && typeof data.errors === 'object') {
    const firstField = Object.keys(data.errors)[0];
    const firstMessage = data.errors[firstField]?.[0];
    if (firstMessage) return firstMessage;
  }

  // Custom backend messages that might come in different shapes
  if (data.detail) return data.detail;
  if (data.message) return data.message;
  if (data.data?.message) return data.data.message;
  if (data.title) return data.title;

  return error?.message || fallback;
}
