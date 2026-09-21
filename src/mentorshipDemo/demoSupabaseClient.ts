// Standalone review demo: no live accounts, keys, or database connection.
// Any accidentally invoked live adapter fails before making a request.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any = new Proxy({}, {
  get() { throw new Error("Live services are disabled in this review demo."); },
});
