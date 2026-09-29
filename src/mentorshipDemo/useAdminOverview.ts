import { usePortalStore } from "./PortalStore";

export function useAdminOverview() {
  const { adminOverview, ready } = usePortalStore();
  return { overview: adminOverview, loading: !ready, error: "" };
}
