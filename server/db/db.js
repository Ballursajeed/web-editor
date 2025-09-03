import mongoose from "mongoose";

const connectDB = async() => {
    try {
       const connection = await mongoose.connect(`${process.env.MONGO_URL}/webEditor`);
       console.log("Mongo DB is connected:, connection host: ",connection.connection.host);
       
    } catch (error) {
        console.log("MONGO DB CONNECTION ERROR!!: ", error);
    }
}

export { connectDB }