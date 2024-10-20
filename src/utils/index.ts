export function errorObject<T>(error: T) {
  return {
    data: null,
    error: {
      message: ((error as any)?.message as string) ?? "Something went wrong",
    },
  };
}
export function dataObject<T>(data: T) {
  return {
    data,
    error: null,
  };
}
