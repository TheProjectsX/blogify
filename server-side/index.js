import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
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

// Check User Authentication: Middleware
const checkUserAuthentication = (req, res, next) => {
    const { access_token } = req.cookies;
    if (!access_token) {
        return res
            .status(401)
            .json({ success: false, message: "Authentication failed!" });
    }

    try {
        const decrypted = jwt.verify(access_token, process.env.JWT_SECRET);
        req.user = decrypted;
    } catch (error) {
        return res
            .status(401)
            .json({ success: false, message: "Authentication failed!" });
    }

    next();
};

// Check Admin Authentication: Middleware
const checkAdminAuthentication = async (req, res, next) => {
    const { access_token } = req.cookies;
    if (!access_token) {
        return res
            .status(401)
            .json({ success: false, message: "Authentication failed!" });
    }

    try {
        const decrypted = jwt.verify(access_token, process.env.JWT_SECRET);
        req.user = decrypted;
        const query = { email: decrypted.email };
        const dbResult = await db.collection("users").findOne(query);
        if (dbResult.role !== "admin") {
            return res
                .status(403)
                .json({ success: false, message: "Forbidden Request" });
        }
    } catch (error) {
        return res
            .status(401)
            .json({ success: false, message: "Authentication failed!" });
    }

    next();
};

// Test Route
app.get("/", async (req, res) => {
    res.json({ status: "success", message: "Server is Running!" });
});

// Create new User: Public Route
app.post("/register", async (req, res) => {
    let { username, email, password, profilePicture } = req.body;

    if (!username || !email || !password) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid Body Request" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });

    const hashedPassword = bcrypt.hashSync(String(password), 10);

    const doc = {
        email,
        username,
        role: "user",
        status: "active",
        profilePicture:
            profilePicture ||
            "https://i.ibb.co.com/tQ1tBdV/dummy-profile-picture.jpg",
        password: hashedPassword,
        createdAt: new Date().toJSON(),
    };

    try {
        const emailExists = await db
            .collection("users")
            .findOne({ email: email });
        if (emailExists) {
            return res
                .status(201)
                .json({ success: false, message: "User already exists!" });
        }

        const dbResult = await db.collection("users").insertOne(doc);
        const result = { success: true, ...dbResult };

        return res
            .cookie("access_token", token, cookieOptions)
            .status(200)
            .json(result);
    } catch (error) {
        console.error(error);
        const result = {
            success: false,
            message: "Server side error occurred",
        };

        res.status(500).json(result);
    }
});

// User Login: Public Route
app.post("/login", async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid Body Request" });
    }

    try {
        const dbResult = await db.collection("users").findOne({ email });
        if (!dbResult) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid Credentials" });
        }

        const { password: serverPassword, ...userData } = dbResult;
        const passwordMatch = bcrypt.compareSync(
            String(password),
            serverPassword
        );
        if (!passwordMatch) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid Credentials" });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        const result = { success: true, ...userData };
        return res
            .cookie("access_token", token, cookieOptions)
            .status(200)
            .json(result);
    } catch (error) {
        console.error(error);
        const result = {
            success: false,
            message: "Server side error occurred",
        };

        res.status(500).json(result);
    }
});

// User Logout: Private Route
app.get("/logout", checkUserAuthentication, async (req, res) => {
    const { access_token } = req.cookies;
    if (!access_token) {
        return res
            .status(401)
            .json({ success: false, message: "Authentication failed!" });
    }

    res.clearCookie("access_token", cookieOptions)
        .status(200)
        .json({ success: true });
});

// Create new Post: Private Route
app.post("/posts", checkUserAuthentication, async (req, res) => {
    const { email: tokenEmail } = req.user;

    let { title, content, tags, imageUrl } = req.body;

    if (!title || !content) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid Body Request" });
    }

    const doc = {
        title,
        content,
        tags: tags || [],
        imageUrl:
            imageUrl || "https://i.ibb.co.com/ryNv8bc/image-placeholder.jpg",
        authorEmail: tokenEmail,
        createdAt: new Date().toJSON(),
    };

    try {
        const dbResult = await db.collection("posts").insertOne(doc);
        const result = { success: true, ...dbResult };

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        const result = {
            success: false,
            message: "Server side error occurred",
        };

        res.status(500).json(result);
    }
});

// Get all posts: Public Route
app.get("/posts", async (req, res) => {
    let { limit = "10", page = "1" } = req.query;
    limit = isNaN(Number(limit)) ? 10 : Number(limit);
    page = isNaN(Number(page)) ? 1 : Number(page);

    const skip = (page - 1) * limit;

    try {
        const dbResult = await db
            .collection("posts")
            .find()
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalPostsCount = await db
            .collection("posts")
            .estimatedDocumentCount();

        const pagination = {
            currentCount: limit,
            totalPosts: totalPostsCount,
            has_next_page: page * limit < totalPostsCount,
        };

        const result = { success: true, pagination, data: dbResult };

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);

        const result = {
            success: false,
            message: "Server side error occurred",
        };

        res.status(500).json(result);
    }
});

// Get single Post: Public Route
app.get("/posts/:id", async (req, res) => {
    const id = req.params.id;
    let query;
    try {
        query = { _id: new ObjectId(id) };
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid Item id Provided",
        });
        return;
    }

    try {
        const dbResult = await db.collection("posts").findOne(query);
        if (!dbResult) {
            return res
                .status(404)
                .json({ success: false, message: "Item not Found!" });
        }

        const postAuthor = await db
            .collection("users")
            .findOne({ email: dbResult.authorEmail });
        const { password, ...authorData } = postAuthor;

        const result = { success: true, ...dbResult, authorData };
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);

        const result = {
            success: false,
            message: "Server side error occurred",
        };

        res.status(500).json(result);
    }
});

// Update a Post: Private Route
app.put("/posts/:id", checkUserAuthentication, async (req, res) => {
    const { email: tokenEmail } = req.user;

    let { title, content, imageUrl } = req.body;
    const id = req.params.id;

    let query;
    try {
        query = { _id: new ObjectId(id) };
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid Item id Provided",
        });
        return;
    }

    const oldItem = await db.collection("posts").findOne(query);

    if (!oldItem) {
        res.status(404).json({ success: false, message: "Item not Found" });
        return;
    }

    if (oldItem.authorEmail !== tokenEmail) {
        return res
            .status(403)
            .json({ success: false, message: "Forbidden Request" });
    }

    if (!title && !content) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid Body Request" });
    }

    const newDoc = {
        title: title ?? oldItem.title,
        content: content ?? oldItem.content,
        imageUrl: imageUrl ?? oldItem.imageUrl,
    };

    try {
        const dbResult = await db
            .collection("posts")
            .updateOne(query, { $set: newDoc });

        if (dbResult.modifiedCount > 0) {
            return res.status(200).json({ success: true, ...dbResult });
        } else {
            return res
                .status(500)
                .json({ success: false, message: "Nothing Updated" });
        }
    } catch (error) {
        console.error(error);

        const result = {
            success: false,
            message: "Server side error occurred",
        };

        res.status(500).json(result);
    }
});

// Delete a Post: Private Route
app.delete("/posts/:id", checkUserAuthentication, async (req, res) => {
    const { email: tokenEmail } = req.user;

    const id = req.params.id;
    let query;
    try {
        query = { _id: new ObjectId(id) };
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid Item id Provided",
        });
        return;
    }

    const oldItem = await db.collection("posts").findOne(query);
    if (!oldItem) {
        res.status(404).json({ success: false, message: "Item not Found" });
        return;
    }

    if (oldItem.authorEmail !== tokenEmail) {
        return res
            .status(403)
            .json({ success: false, message: "Forbidden Request" });
    }

    try {
        const dbResult = await db.collection("posts").deleteOne(query);

        if (dbResult.deletedCount > 0) {
            return res.status(200).json({ success: true, ...dbResult });
        } else {
            return res
                .status(500)
                .json({ success: false, message: "Failed to Delete post" });
        }
    } catch (error) {
        console.error(error);

        const result = {
            success: false,
            message: "Server side error occurred",
        };

        res.status(500).json(result);
    }
});

// Get User Info: Private Route
app.get("/me", checkUserAuthentication, async (req, res) => {
    const { email: tokenEmail } = req.user;

    try {
        const dbResult = await db
            .collection("users")
            .findOne({ email: tokenEmail });

        if (!dbResult) {
            return res
                .status(404)
                .json({ success: false, message: "User not Found!" });
        }

        const { password, ...userData } = dbResult;

        const result = { success: true, ...userData };
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);

        const result = {
            success: false,
            message: "Server side error occurred",
        };

        res.status(500).json(result);
    }
});

// Get posts by User: Private Route
app.get("/me/posts", checkUserAuthentication, async (req, res) => {
    const { email: tokenEmail } = req.user;

    try {
        const dbResult = await db
            .collection("posts")
            .find({ authorEmail: tokenEmail })
            .toArray();

        const result = { success: true, data: dbResult };
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);

        const result = {
            success: false,
            message: "Server side error occurred",
        };

        res.status(500).json(result);
    }
});

// Get all Users: Admin Route
app.get("/admin/users", checkAdminAuthentication, async (req, res) => {
    try {
        const dbResult = await db.collection("users").find().toArray();
        const usersWithoutPassword = dbResult.map(
            ({ password, ...rest }) => rest
        );

        const result = { success: true, data: usersWithoutPassword };
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);

        const result = {
            success: false,
            message: "Server side error occurred",
        };

        res.status(500).json(result);
    }
});

// Delete one User: Admin Route
app.delete("/admin/users/:id", checkAdminAuthentication, async (req, res) => {
    const id = req.params.id;
    let query;
    try {
        query = { _id: new ObjectId(id) };
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid User id Provided",
        });
        return;
    }

    try {
        const dbResult = await db.collection("users").deleteOne(query);

        if (dbResult.deletedCount > 0) {
            return res.status(200).json({ success: true, ...dbResult });
        } else {
            if (dbResult.matchedCount > 0) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to Delete User",
                });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: "User not Found" });
            }
        }
    } catch (error) {
        console.error(error);

        const result = {
            success: false,
            message: "Server side error occurred",
        };

        res.status(500).json(result);
    }
});

// Active or Inactive a user: Admin Route
app.put(
    "/admin/users/:id/:status",
    checkAdminAuthentication,
    async (req, res) => {
        const { id, status } = req.params;

        if (status !== "active" && status !== "inactive") {
            return res.status(404).send();
        }

        let query;
        try {
            query = { _id: new ObjectId(id) };
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Invalid User id Provided",
            });
            return;
        }

        const updateDoc = {
            $set: {
                status,
            },
        };

        try {
            const dbResult = await db
                .collection("users")
                .updateOne(query, updateDoc);

            if (dbResult.modifiedCount > 0) {
                return res.status(200).json({ success: true, ...dbResult });
            } else {
                if (dbResult.matchedCount > 0) {
                    return res.status(500).json({
                        success: false,
                        message: "Failed to Update User status",
                    });
                } else {
                    return res
                        .status(404)
                        .json({ success: false, message: "User not Found" });
                }
            }
        } catch (error) {
            console.error(error);

            const result = {
                success: false,
                message: "Server side error occurred",
            };

            res.status(500).json(result);
        }
    }
);

// Connecting to MongoDB first, then Starting the Server
client
    .connect()
    .then(async () => {
        db = client.db(process.env.DB_NAME);
        app.listen(port, () => {
            console.log(`Running in port ${port}`);
        });
    })
    .catch(console.dir);
