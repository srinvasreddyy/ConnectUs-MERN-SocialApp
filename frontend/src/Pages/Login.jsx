import React from 'react'
import { Link } from 'react-router'
import useLogin from '../hooks/useLogin.js'
import { MessageCircleHeartIcon } from 'lucide-react'

const Login = () => {
  function handleSignup(e) {
      e.preventDefault()
      loginMutation(loginData)
    }
  
    const [loginData, setloginData] = React.useState({
      email: "",
      password: "",
    })


    const { loginMutation , isLoading , error}= useLogin()
  
    // const queryClient = useQueryClient()
  
    // const { mutate, isLoading, error } = useMutation(
    //   {
    //     mutateKey: ["login"],
    //     mutationFn: async (loginData) => {
    //       const res = await axiosInstance.post("/auth/login", loginData)
    //       return res.data
    //     },
    //     onSuccess: () => {
    //       console.log("Login successful")
    //       toast.success("Login successful")
    //       setloginData({
    //         email: "",
    //         password: "",
    //       })  
    //       queryClient.invalidateQueries(["authUser"])
    //     },
    //   }
    // )





  return (
    <div
          className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
        >
          <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
            {/* Login FORM - LEFT SIDE */}
            <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
              {/* LOGO */}
              <div className="mb-4 flex items-center justify-start gap-2">
                <MessageCircleHeartIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  ConnectUs
                </span>
              </div>
              {error && (
                <div className="alert alert-error mb-4">
                  <span>{error?.response?.data?.message}</span>
                </div>
                
              )}
             
    
              <div className="w-full">
                <form onSubmit={handleSignup}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold">Login !!</h2>
                      <p className="text-sm opacity-70">
                        Welcome to ConnectUs and build your network!
                      </p>
                    </div>
                    <div className="space-y-3">
                      {/* EMAIL */}
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text">Email</span>
                        </label>
                        <input
                          type="email"
                          placeholder="john@gmail.com"
                          className="input input-bordered w-full"
                          value={loginData.email}
                          onChange={(e) => setloginData({ ...loginData, email: e.target.value })}
                        />
                      </div>
                      {/* PASSWORD */}
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text">Password</span>
                        </label>
                        <input
                          type="password"
                          placeholder="********"
                          className="input input-bordered w-full"
                          value={loginData.password}
                          onChange={(e) => setloginData({ ...loginData, password: e.target.value })}
                          required
                        />
                        <p className="text-xs opacity-70 mt-1">
                          Password must be at least 6 characters long
                        </p>
                      </div>
                    </div>
    
                    <button className="btn btn-primary w-full" type="submit">
    
                      {
                        isLoading ? (
                          <span className="loading loading-spinner loading-xs">So close..</span>
                        ) : (
                          "Login"
                        )
                      }
                    </button>
                    <div className="text-center mt-4">
                      <p className="text-sm">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary hover:underline">
                          SignUp
                        </Link>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
    
            {/* SIGNUP FORM - RIGHT SIDE */}
            <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
              <div className="max-w-md p-8">
                {/* Illustration */}
                <div className="relative aspect-square max-w-sm mx-auto">
                  <img src="/login.png" alt="Language connection illustration" className="w-full h-full" />
                </div>
    
                <div className="text-center space-y-3 mt-6">
                  <h2 className="text-xl font-semibold">Connect partners anywhere!</h2>
                  <p className="opacity-70">
                    Build conversations, make friends, and improve your networking skills together
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default Login