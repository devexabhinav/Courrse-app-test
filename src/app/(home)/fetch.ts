import api from "@/lib/api"

export async function getOverviewData() {
  const res = await api.get("user/summary")
  console.log(res,"res====")
  return res?.data?.data
}
