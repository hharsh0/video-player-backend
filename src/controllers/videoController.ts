import { bucket } from "../firebase";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user";
import UserVideo from "../models/userVideos";
import { generateRandomString } from "../utils/generateRandomString";

export const uploadVideo = async (req: any, res: Response) => {
  try {
    const { title, description } = req.body;
    const file = req.files?.file;
    const currentTime = new Date();

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }
    const randomFileName = generateRandomString(12);

    const blob = bucket.file(`videos/${randomFileName}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });

    blobStream.on("error", (err) => {
      console.error("Blob stream error:", err);
      res.status(500).send("Something went wrong.");
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      // Save the URL and other details to the database
      const userId = req.user.id;

      try {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const video = new UserVideo({
          userId,
          url: publicUrl,
          title,
          uploadTime: currentTime,
          description,
        });
        await video.save();

        res
          .status(200)
          .json({
            fileLocation: publicUrl,
            message: "Video uploaded successfully!",
            title: title,
            description: description,
            uploadTime: currentTime,
          });
      } catch (error) {
        console.error("Error saving video URL:", error);
        res.status(500).send("Something went wrong.");
      }
    });

    blobStream.end(file.data);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Something went wrong." + error);
  }
};

export const getDownloadUrl = async (req: Request, res: Response) => {
  try {
    const fileName = req.params.fileName;
    const file = bucket.file(`videos/${fileName}`);
    const [metadata] = await file.getMetadata();
    const downloadToken = metadata.metadata?.firebaseStorageDownloadTokens;

    if (!downloadToken) {
      return res.status(404).send("No download token found.");
    }

    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(file.name)}?alt=media&token=${downloadToken}`;
    res.status(200).json({ downloadUrl });
  } catch (error) {
    console.error("Error getting download URL:", error);
    res.status(500).send("Something went wrong.");
  }
};
