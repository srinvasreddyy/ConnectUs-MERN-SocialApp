import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axios.js'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router'
import { UsersIcon, UserPlusIcon ,CheckCircleIcon,MapPinIcon  } from 'lucide-react'
import FriendCard from '../components/FriendCard.jsx'

const Home = () => {

  const queryClient = useQueryClient()
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/friends")
      return res.data || []
    }
  })
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["recomendedFriends"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/")
      return res.data || []
    }
  })
  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/outgoing-friend-requests")
      return res.data || []
    }
  })
  const { mutate, isPending } = useMutation({
    mutationKey: ["sendFriendRequest"],
    mutationFn: async (id) => {
      const res = await axiosInstance.get(`/user/friend-request/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["outgoingFriendReqs"])
      queryClient.invalidateQueries(["recomendedFriends"])
      queryClient.invalidateQueries(["friendsrequests"])
    },
    onError: (error) => {
      console.log(error)
    }
  })

 useEffect(() => {
  const outgoingIds = new Set()
  if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
    outgoingFriendReqs.forEach(req => outgoingIds.add(req.receiver?._id))
  }
  setOutgoingRequestsIds(outgoingIds)
}, [outgoingFriendReqs])




  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Go on place a friend request!!</h3>
              <p className="text-base-content opacity-70">
                Connect with people around you
              </p>
            </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {
              friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))
            }
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New People!</h2>
                <p className="opacity-70">
                  Connect with people around you who share your time spending with them
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                May be no active users are available in your location :(
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id)

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullname} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">{user.fullname}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>



                      {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                          } `}
                          
                        onClick={() => mutate(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Home