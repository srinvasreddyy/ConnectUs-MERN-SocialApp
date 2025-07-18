import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { axiosInstance } from "../lib/axios.js"
import { UserCheckIcon,MessageSquareIcon,BellIcon,ClockIcon } from "lucide-react"
const Notifications = () => {


  const queryClient = useQueryClient()
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friendsrequests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/friend-requests")
      return res.data
    }
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ["acceptFriendRequest"],
    mutationFn: async (id) => {
      const res = await axiosInstance.put(`/user/friend-request/${id}/accept`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"])
      queryClient.invalidateQueries(["friendsrequests"])
      toast.success("Friend request accepted")
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  })

  const incomingRequests = friends?.pendingRequests || []
  const acceptedRequests = friends?.acceptedReq || []


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img src={request.sender.profilePic} alt={request.sender.fullname} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{request.sender.fullname}</h3>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => mutate(request._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div key={notification._id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-12 rounded-full">
                            <img className="size-12 rounded-full"
                              src={notification.sender.profilePic}
                              alt={notification.sender.fullName}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl">{notification.sender.fullname}</h3>
                            <p className="text-sm my-1">
                              {notification.sender.fullName} Say Hii !! to your new friend
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No notifications available</h3>
            </div>
            )}
          </>
        )}
      </div>
    </div>
  );
  
}

export default Notifications