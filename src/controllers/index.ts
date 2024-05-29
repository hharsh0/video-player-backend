import type { Request, Response } from "express";
import User from "../models/user";
import UserVideo from "../models/userVideos";

export const getListing = async (req: Request, res: Response) => {
    try {
        const userVideos = await UserVideo.find({});
        res.status(200).json(userVideos);
    } catch (error) {
        console.error('Error retrieving user videos:', error);
        res.status(500).json({ message: 'Server error', error });
    }
}

export const getUserInfo = async (req:any, res:Response) =>{
    const userId = req.user.id;

    try{
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Find all videos uploaded by the user
        const videos = await UserVideo.find({ userId });

        res.status(200).json({
            user,
            videos
        });
    }catch(error:any){
        console.error('Error retrieving user information:', error);
        res.status(500).json({ message: 'Server error', error });
    }
}