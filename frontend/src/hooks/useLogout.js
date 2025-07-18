import { useMutation , useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'

const useLogout = () => {
   const queryClient = useQueryClient();
  const { mutate , isPending , error } = useMutation(
    {
      mutationKey : ["logout"],
      mutationFn : async () => {
        const res = await axiosInstance.post("/auth/logout")
        return res.data
      },
      onSuccess : () => {
        toast.success("Logout successful")
        queryClient.invalidateQueries(["authUser"])
      }
    }
  )
  return { logoutMutation: mutate, isPending, error }
}

export default useLogout