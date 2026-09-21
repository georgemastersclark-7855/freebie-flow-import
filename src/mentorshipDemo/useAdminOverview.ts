import { useEffect, useState } from "react";
import { adminStudents, reviewItems } from "./demoData";
import { loadLiveAdminOverview } from "./liveAdminApi";
import { usePortalStore } from "./PortalStore";
import type { AdminOverview } from "./types";

export function useAdminOverview() {
  const { backend } = usePortalStore();
  const [overview, setOverview] = useState<AdminOverview>({
    cohortId: "demo-cohort",
    cohortName: "Cohort 2",
    currentWeek: 2,
    deadlineLabel: "Friday, time to be confirmed",
    students: adminStudents,
    reviews: reviewItems,
  });
  const [loading, setLoading] = useState(backend === "supabase");
  const [error, setError] = useState("");

  useEffect(() => {
    if (backend !== "supabase") return;
    let active = true;
    setLoading(true);
    loadLiveAdminOverview()
      .then((data) => { if (active) setOverview(data); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Unable to load the cohort."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [backend]);

  return { overview, loading, error };
}
