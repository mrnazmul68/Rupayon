import admin from "firebase-admin";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, "../../serviceAccountKey.json");

try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log("Firebase Admin initialized successfully");
} catch (error) {
  try {
    const serviceAccount = await import(serviceAccountPath, {
      assert: { type: "json" },
    });
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount.default),
    });
    console.log("Firebase Admin initialized with service account key");
  } catch (err) {
    console.log("Firebase Admin not initialized - service account key not found");
    console.log("Please add serviceAccountKey.json to your backend root directory");
  }
}

export const auth = admin.auth();
export default admin;
