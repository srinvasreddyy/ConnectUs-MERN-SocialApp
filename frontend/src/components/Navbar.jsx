import Pageloader from './Pageloader.jsx'
import useAuthUser from '../hooks/useAuthUser'
import { Link, useLocation } from 'react-router'
import { BellIcon, MessageCircleHeartIcon,  LogOutIcon} from 'lucide-react'
import useLogout from '../hooks/useLogout.js'
import ThemeSelector from './ThemeSelector.jsx'
const Navbar = () => {

 
  const location = useLocation()
  const isChatPage = location.pathname === "/chat"
  const {authUser} = useAuthUser()

  // const queryClient = useQueryClient();
  // const { mutate , isPending , error } = useMutation(
  //   {
  //     mutationKey : ["logout"],
  //     mutationFn : async () => {
  //       const res = await axiosInstance.post("/auth/logout")
  //       return res.data
  //     },
  //     onSuccess : () => {
  //       toast.success("Logout successful")
  //       queryClient.invalidateQueries(["authUser"])
  //     }
  //   }
  // )

  const { logoutMutation , isPending , error } = useLogout()

  function logoutHandler() {
    logoutMutation()
  }
  if(isPending) return <Pageloader />

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full gap-4">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <MessageCircleHeartIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  ConnectUs
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-6 sm:gap-6 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          <ThemeSelector/>
          
          <Link to="/">
            <div className="avatar">
            <div className="w-10 ">
              <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
            </div>
              <span className='pl-2 pt-2'>{authUser?.fullname}</span>
          </div>
          </Link>
          

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutHandler}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar