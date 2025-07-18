import { axiosInstance } from "../lib/axios.js"
import { useQuery } from "@tanstack/react-query"

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/user/me")
        return res.data
      } catch (error) {
        return null
      }
    }
  })
  return { authUser: authUser?.data?.user }
}

export default useAuthUser