import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

var admin = require("firebase-admin");
import dotenv from 'dotenv';

dotenv.config();

var serviceAccount = require("../../google-service-account.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.CLOUD_STORAGE
});

export const bucket = getStorage().bucket();
