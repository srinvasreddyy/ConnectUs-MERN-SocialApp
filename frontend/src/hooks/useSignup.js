import React from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios.js'

const useSignup = () => {
    const queryClient = useQueryClient()

    const { mutate, isLoading, error } = useMutation(
        {
            mutateKey: ["signup"],
            mutationFn: async (signupData) => {
                const res = await axiosInstance.post("/auth/signup", signupData)
                return res.data
            },
            onSuccess: () => {
                console.log("signup successful")
                toast.success("Signup successful")
                queryClient.invalidateQueries(["authUser"])
            },
        }
    )

    return { signUpMutation: mutate, isLoading, error }
}

export default useSignup