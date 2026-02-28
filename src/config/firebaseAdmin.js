import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.js"; // JS file ko import kar rahe hain

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;