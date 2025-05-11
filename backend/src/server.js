import app from "./app.js";
import connectDB from "./lib/connectDB.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    
    await connectDB().then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    });


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();