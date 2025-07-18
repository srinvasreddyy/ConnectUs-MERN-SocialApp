import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser.js'
import { Channel, ChannelHeader, Chat, MessageInput, Thread, MessageList, Window } from 'stream-chat-react'
import { StreamChat } from 'stream-chat'
import Pageloader from '../components/Pageloader.jsx'
import { axiosInstance } from '../lib/axios.js'
import CallButton from '../components/CallButton.jsx'
const ChatPage = () => {

  const { id: targetUserId } = useParams()
  const [chatClient, setChatClient] = React.useState(null)
  const [channel, setChannel] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const StreamApiKey = import.meta.env.VITE_STREAM_API_KEY
  const { authUser } = useAuthUser()

  const { data: tokenData } = useQuery({
    queryKey: ["token"],
    queryFn: async () => {
      const res = await axiosInstance.get("/chat/token")
      return res.data
    },
    enabled: !!authUser //it will run only when authUser is available !! is used to convert authUser to boolean
  })
  console.log(" tokendata ", tokenData?.token)
  console.log(StreamApiKey)

  React.useEffect(() => {
    const initChat = async () => {
      if (!tokenData || !authUser) return

      try {
        console.log("Initializing stream chat client...");
        const client = StreamChat.getInstance(StreamApiKey)
        await client.connectUser({
          id: authUser._id,
          name: authUser.fullname,
          image: authUser.profilePic
        }, tokenData.token)

        const channelId = [authUser._id, targetUserId].sort().join("-")
        const currentChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId]
        })
        await currentChannel.watch()
        setChannel(currentChannel)
        setChatClient(client)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      } finally {
        console.log("chat client initialized")
        setIsLoading(false)
      }
    }

    initChat()
  }, [tokenData, authUser, targetUserId])
  console.log("chat client", chatClient)
  console.log("channel", channel)
  console.log("authUser", authUser)

  // if (isLoading) {
  //   return (
  //     <Pageloader/>
  //   )
  // }
  if (isLoading || !chatClient || !channel) {
    return <Pageloader />;
  }

  const handleVideoCall = () => {
    if (channel) {
      const CallUrl = `${window.location.origin}/call/${channel.id}`
      channel.sendMessage({
        text : `Hey there i started a video call click here to join ${CallUrl}`,
      })
    }
  }
    
  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative'>
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus/>
              <Thread/>
            </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  )
}


export default ChatPage