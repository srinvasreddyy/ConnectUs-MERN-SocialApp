import { ApiError } from "../lib/api.error.js";
import User from "../models/User.js";
import { FriendReq } from "../models/FriendReq.js";
async function getFriends(req, res) {
    try {
        const user = await User.findById(req.user._id)
            .select("friends")
            .populate("friends", "fullname profilePic location bio");
        if (!user) {
            return res.status(400).json({ message: "No friends found" });
        }
        return res.status(200).json(user.friends);
    } catch (error) {
        console.log("error in getFriends", error)
        return res.status(500).json({ message: "Something went wrong" });
    }
}
async function recomendedFriends(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const requestsToCurrentUser = await FriendReq.find({
            receiver: user._id,
            status: "pending"
        }).select("sender");

        // 2️⃣ Extract senders' IDs
    const sendersWhoRequestedYou = requestsToCurrentUser?.map(req => req.sender);
    const recomendedFriends = await User.find({
        $and: [
            { _id: { $nin: user.friends } }, //not give friends
            { _id: { $ne: user._id } }, //not give self acc
            { isOnboarded: true }, //only give onboarded users
            { location: user.location }, //only give users in same location
            { _id: { $nin: sendersWhoRequestedYou } }
        ]
    })
    if (!recomendedFriends) {
        return res.status(400).json(new ApiError(400, "No recomended friends found"));
    }

    return res.status(200).json( recomendedFriends );

}
async function sendFriendRequest(req, res) {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const friend = await User.findById(req.params.id)
        console.log("friend",friend)
        if (!friend) {
            return res.status(402).json({ message: "Friend not found" });
        }
        if (user._id === friend._id) return res.status(403).json({ message: "You cannot send friend request to yourself" });

        if (friend.friends.includes(user._id)) return res.status(404).json({ message: "You are already friends with this user" });

        const existingReq = await FriendReq.findOne({
            $or: [
                { sender: user?._id, receiver: friend?._id },
                { sender: friend?._id, receiver: user?._id }
            ]
        })

        if (existingReq) {
            console.log("existongReq",existingReq)
            return res.status(410).json({ message: "You have already sent a friend request to this user" });
        } 

        const newReq = new FriendReq({
            sender: user._id,
            receiver: friend._id
        })
        await newReq.save();

        return res
            .status(200)
            .json(newReq);

    } catch (error) {
        console.log("error in sendFriendRequest", error)
        return res.status(500).json(new ApiError(500, "Something went wrong"));
    }

}
async function acceptFriendRequest(req, res) {
    try {
        const reqId = await FriendReq.findById(req.params.id)
        const user = req.user

        if (!reqId) return res.status(400).json({ message: "Friend request not found" })
        if (!user) return res.status(400).json(new ApiError({message: "User not found"}))

        // if (user._id === reqId.receiver.toString()) return res.status(400).json({ message: "You are not authorized to accept this friend request" })

        const friend = await User.findById(reqId.sender)
        if (!friend) return res.status(400).json({ message: "Friend not found" })

        const existingFriend = await User.findOne({
            $and: [
                { _id: user._id },
                { friends: reqId.sender }
            ]
        })
        if (existingFriend) return res.status(400).json({ message: "You are already friends with this user" })

        reqId.status = "accepted"
        await reqId.save()

        await User.findByIdAndUpdate(user._id, { $addToSet: { friends: reqId.sender } }, { new: true })
        await User.findByIdAndUpdate(reqId.sender, { $addToSet: { friends: user._id } }, { new: true })

        return res
            .status(200)
            .json({ message: "Friend request accepted" });
    } catch (error) {
        console.log("error in acceptFriendRequest", error)
        return res.status(500).json({ message: "Something went wrong" });
    }
}

async function getFriendRequests(req, res) {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "User not found" });
    const pendingRequests = await FriendReq.find({
        $and: [
            { receiver: user._id },
            { status: "pending" }
        ]
    }).populate("sender", "fullname profilePic location bio");
    if (!pendingRequests) return res.status(400).json({ message: "No friend requests found" });

    const acceptedReq = await FriendReq.find({
        $and: [
            { receiver: user._id },
            { status: "accepted" }
        ]
    }).populate("sender", "fullname profilePic location bio");
    if (!acceptedReq) return res.status(400).json({ message: "No accepted friend requests found" });

    return res.status(200).json({ pendingRequests, acceptedReq });
}

async function getOutgoingFriendRequests(req,res) {
    const outgoingReqs = await FriendReq.find({
        $and: [
            { sender: req.user?._id },
            { status: "pending" }
        ]
    }).populate("receiver", "fullname profilePic location bio");
    
    if (!outgoingReqs) return res.status(400).json({ message : "No outgoing friend requests found"});
    console.log(outgoingReqs)
    return res
    .status(200)
    .json(outgoingReqs); 
}

async function getPendingRequests(req,res) {
    const user = req.user;
    if (!user) return res.status(400).json(new ApiError(400, "User not found"));
    const pendingRequests = await FriendReq.find({
        $and: [
            { receiver: user._id },
            { status: "pending" }
        ]
    })
    if (!pendingRequests) return res.status(400).json(new ApiError(400, "No pending friend requests found"));
    console.log(pendingRequests)
    return res.status(200).json(pendingRequests);
}
export {
    getFriends,
    recomendedFriends,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequests,
    getOutgoingFriendRequests,
    getPendingRequests
}