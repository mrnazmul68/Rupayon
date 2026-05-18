import "dotenv/config";
import { app } from "./src/app.js";
import  connectDB  from "./src/config/db.js";


const port = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    server.on("error", (error)=>{
        console.log("server error", error.message)
    });
  } catch (error) {
    console.log("Server setup error", error.message)
    process.exit(1);
  }
};

startServer();
