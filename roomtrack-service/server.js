import app from "./src/infrastructure/app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/infrastructure/database/mongoose/connection.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
};

startServer();
