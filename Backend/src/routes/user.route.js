import express from "express";
import { protectRoute } from "../lib/protectroute.js";
import { getFriends , recomendedFriends , sendFriendRequest , acceptFriendRequest ,getFriendRequests , getOutgoingFriendRequests, getPendingRequests} from "../controllers/user.controller.js";
import { get } from "mongoose";
const router = express.Router();

router.use(protectRoute);

router.get("/friends",getFriends);
router.get("/",recomendedFriends);
router.get("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);
router.get("/friend-requests",getFriendRequests)
router.get("/outgoing-friend-requests",getOutgoingFriendRequests)
router.get("/pending-friend-requests",getPendingRequests)

router.get("/me",(req,res)=>{
    res.status(200).json({user : req.user})
})
export default router