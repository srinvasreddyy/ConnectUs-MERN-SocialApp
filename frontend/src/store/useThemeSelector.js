import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
export const useThemeSelector = create((set) => ({
    theme: localStorage.getItem("prevTheme") || "forest",
    setTheme: (theme) => {
        set({ theme });
        localStorage.setItem("prevTheme", theme);
    },
}));

export const useNotificationCount = create((set) => ({
    count: 0,

    setCount: () => {
        const { data: friends, isLoading } = useQuery({
            queryKey: ["friendsrequests"],
            queryFn: async () => {
                const res = await axiosInstance.get("/user/friend-requests")
                return res.data
            }
        })
        console.log(friends?.pendingRequests?.length)
        set({ count:friends?.pendingRequests?.length || 0 });
    }
}));
