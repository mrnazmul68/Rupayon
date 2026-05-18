import admin from "firebase-admin";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, "../../serviceAccountKey.json");
let firebaseAuth = null;

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    firebaseAuth = admin.auth();
    console.log("Firebase Admin initialized with service account key");
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    firebaseAuth = admin.auth();
    console.log("Firebase Admin initialized successfully (application default credentials)");
  }
} catch (error) {
  console.log("Firebase Admin initialization error:", error.message);
  console.log("Please add serviceAccountKey.json to your backend root directory or set up application default credentials");
}

export const getFirebaseAuth = () => {
  if (!firebaseAuth) {
    throw new Error("Firebase Admin credentials are not configured. Please add serviceAccountKey.json to the backend root directory.");
  }
  return firebaseAuth;
};

export const auth = firebaseAuth;
export default admin;
