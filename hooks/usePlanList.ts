import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const usePlanList = () => {
  const { data, error, isLoading } = useSWR("/api/plans", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return { data, error, isLoading };
};

export default usePlanList;
