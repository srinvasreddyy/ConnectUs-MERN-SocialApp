import { useQueryClient,useMutation } from "@tanstack/react-query";
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios.js'

const useOnboarding = () => {
   const queryClient = useQueryClient();
    const { mutate , isPending , error } = useMutation({
      mutationKey: ["onboardUser"],
      mutationFn: async (formState) => {
        const res = await axiosInstance.post("auth/onboarding", formState);
        return res.data;
      },
      onSuccess: () => {
        toast.success("Onboarding successful");
        queryClient.invalidateQueries(["authUser"])
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    })

    return { onboardMutation: mutate, isPending, error }
}

export default useOnboarding