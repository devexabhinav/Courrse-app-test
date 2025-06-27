import { Users } from "@/components/Tables/users";
import { TopChannelsSkeleton } from "@/components/Tables/users/skeleton";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import api from "@/lib/api";
import { Suspense } from "react";

export default async function Home() {
  const res = await api.get("user");
  const users = res.data.data.users;

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup users={users} />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12">
          <Users users={users} />
        </div>
      </div>
    </>
  );
}
