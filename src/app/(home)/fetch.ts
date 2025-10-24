import { useApiClient } from "@/lib/api";

export async function getOverviewData() {
  const api = useApiClient();
  const res = await api.get("user/summary")
  return res?.data?.data
}
