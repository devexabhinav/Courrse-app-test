import api from "@/lib/api"

export async function getOverviewData() {
  const res = await api.get("user/summary")
  return res?.data?.data
}
