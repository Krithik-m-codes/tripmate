"use client";
import dbConnect from "@/lib/dbConnect";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import RecentHistoryCard from "@/components/RecentHistoryCard";
import { ScrollArea } from "@/components/ui/scroll-area";

function RecentHistory() {
  const { data: session } = useSession();
  //   console.log("Session : ", session?.user);
  const [Loading, setLoading] = useState(true);
  const [recentHistory, setRecentHistory] = useState([
    {
      search: "",
      createdAt: "",
    },
  ]);

  //fetch search history from database
  useEffect(() => {
    dbConnect();
    const fetchRecentHistory = async () => {
      const response = await fetch(`/api/search-history/${session?.user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setRecentHistory(data.data);
        setLoading(false);
      }
    };
    fetchRecentHistory();
  }, [session?.user._id, setRecentHistory]);

  return (
    <>
      <h1 className="text-2xl w-full bg-[#166F5B] text-center text-white py-4 ">
        Recent History
      </h1>
      <div className="bg-[#F3F7F6] text-black w-full h-screen flex flex-col justify-center items-center ">
        <div className="flex flex-col h-[95%] items-center w-60 gap-5 mt-10">
          {Loading ? (
            <div className="text-center text-2xl">Loading...</div>
          ) : (
            <ScrollArea className="h-screen w-[55rem] flex flex-col gap-2">
              {recentHistory.map((history, index) => (
                <RecentHistoryCard
                  key={index}
                  destination={history.search}
                  date={history.createdAt.slice(0, 10)}
                />
              ))}
            </ScrollArea>
          )}
        </div>
      </div>
    </>
  );
}

export default RecentHistory;
