import { useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios.js'


const useLogin = () => {
    const queryClient = useQueryClient()
  
    const { mutate, isLoading, error } = useMutation(
      {
        mutateKey: ["login"],
        mutationFn: async (loginData) => {
          const res = await axiosInstance.post("/auth/login", loginData)
          return res.data
        },
        onSuccess: () => {
          toast.success("Login successful") 
          queryClient.invalidateQueries(["authUser"])
        },
      }
    )

    return { loginMutation: mutate, isLoading, error }
}

export default useLogin