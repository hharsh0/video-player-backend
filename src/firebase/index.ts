import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

var admin = require("firebase-admin");

var serviceAccount = require("../../google-service-account.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "streaming-aa564.appspot.com"
});

export const bucket = getStorage().bucket();
