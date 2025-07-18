import express from "express"
import { signup , login , logout , onborad } from "../controllers/auth.controller.js"
import { protectRoute } from "../lib/protectroute.js"
const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.post("/onboarding", protectRoute,onborad)

router.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({user : req.user})
})
export default router