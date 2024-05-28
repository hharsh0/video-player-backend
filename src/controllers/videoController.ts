import { bucket } from "../firebase";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';



export const uploadVideo = async (req:Request, res:Response) => {
    try {
      const files:any = req.files;
      console.log(req.files);
  
      const blob = bucket.file(`videos/${Date.now()}_${req.files.file.name}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: req.files.file.mimetype,
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
          }
        }
      });
  
      blobStream.on('error', (err) => {
        console.error('Blob stream error:', err);
        res.status(500).send('Something went wrong.');
      });
  
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).json({ fileLocation: publicUrl });
      });
  
      blobStream.end(req.files.file.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Something went wrong.');
    }
  };

export const getDownloadUrl = async (req:Request, res:Response) => {
    try {
      const fileName = req.params.fileName;
      const file = bucket.file(`videos/${fileName}`);
      const [metadata] = await file.getMetadata();
      const downloadToken = metadata.metadata?.firebaseStorageDownloadTokens;
  
      if (!downloadToken) {
        return res.status(404).send('No download token found.');
      }
  
      const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${downloadToken}`;
      res.status(200).json({ downloadUrl });
    } catch (error) {
      console.error('Error getting download URL:', error);
      res.status(500).send('Something went wrong.');
    }
  };