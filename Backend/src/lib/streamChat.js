import { ApiError } from './api.error.js';
import {StreamChat} from 'stream-chat';
import "dotenv/config"

const STREAM_API_KEY = process.env.STREAM_API_KEY
const STREAM_API_SECRET = process.env.STREAM_API_SECRET

if(!STREAM_API_KEY || !STREAM_API_SECRET){
    throw new ApiError(400,"STREAM_API_KEY or STREAM_API_SECRET is missing")
}

export const streamChat = StreamChat.getInstance(STREAM_API_KEY,STREAM_API_SECRET)

export const createStreamUser = async (userData) => {
    try {
        const response = await streamChat.upsertUsers([userData])
        return response
    } catch (error) {
        console.log("error in createStreamUser", error)
        throw new ApiError(500, "Something went wrong")
    }
}

export const generateStreamToken = async (id) => {
    try {
        const token = streamChat.createToken(id.toString())
        return token
    } catch (error) {
        console.log("error in generateStreamToken", error)
    }
}