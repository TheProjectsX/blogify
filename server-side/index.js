import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

dotenv.config();

// Configuring App
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    })
);
app.use(cookieParser());

// Configuring Database
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    },
});

let db;

// Cookie Options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

// Connecting to MongoDB first, then Starting the Server
client
    .connect()
    .then(async () => {
        db = client.db("alternative-seek");
        app.listen(port, () => {
            console.log(`Running in port ${port}`);
        });
    })
    .catch(console.dir);
