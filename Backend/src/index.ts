require('dotenv').config()
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel, ContentModel, LinksModel } from './db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { usermiddleware } from "./middlewares";
import { random } from "./utils";
import cors from 'cors'
import crypto from 'crypto'

const app = express()

// Add CORS middleware before routes
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  credentials: true
}))

app.use(express.json());

mongoose.set('debug', true); // This will log all MongoDB operations

app.post("/api/v1/signup",async (req,res) => {

  const { email, password, Name } = req.body;

  const requiredObj = z.object({
    email: z.string().email().min(3).max(100),
    password: z.string()
      .min(8)
      .max(20)
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    Name: z.string().min(3).max(10),
    
  });

  const parsedData = requiredObj.safeParse(req.body);

  if (!parsedData.success) {
    res.status(411).json({
      message: 'Error in inputs',
      error: parsedData.error.errors
    });
    return;
  }

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
       res.status(403).json({
        message: 'User already exists with this username'
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      email,
      password: hashedPassword,
      Name
      
    });

    res.status(200).json({
      message: 'Signed up'
    });

  } catch (err) {
      console.error(err);
     res.status(500).json({
      message: 'Server error'
    });
   
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await UserModel.findOne({
       email: email 
      });

    if (!response) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const matchedPassword = await bcrypt.compare(password, response.password as string);

    if (!matchedPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({
       id: response._id 
      }, process.env.JWT_USER_SECRET as string);

    res.status(200).json({
       message: "Signed in successfully", 
       token
       });
  } catch (err) {
    console.error(err);
    res.status(500).json({
       message: "Server error"
       });
  }
});

interface ContentRequestBody {
  link: string;
  type: string;
  title: string;
}

interface CustomRequest extends express.Request {
  userId?: string;
}

app.post("/api/v1/content", usermiddleware, async (req: CustomRequest, res: express.Response) => {
  try {
    const { title, type, link } = req.body;
    const userId = req.userId;

    const newContent = await ContentModel.create({
      title,
      type,
      link,
      userId
    });

    res.status(201).json(newContent);
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ message: "Failed to create content" });
  }
});

app.get("/api/v1/content", usermiddleware, async (req: CustomRequest, res: express.Response) => {
  try {
    const userId = req.userId;
    const content = await ContentModel.find({
      userId: userId
    }).populate("userId", "username");

    res.json({
      content
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ message: "Failed to fetch content" });
  }
});

app.delete("/api/v1/content/:id", usermiddleware, async (req: CustomRequest, res: express.Response) => {
  try {
    const contentId = req.params.id;
    const userId = req.userId;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      res.status(400).json({ message: "Invalid content ID" });
      return;
    }

    const result = await ContentModel.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(contentId),
      userId: userId
    });

    if (!result) {
      res.status(404).json({ message: "Content not found or unauthorized" });
      return;
    }

    res.status(200).json({
      message: "Content deleted successfully",
      success: true,
      deletedId: contentId
    });

  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ message: "Failed to delete content" });
  }
});

// Update share status
app.post("/api/v1/brainybox/share", usermiddleware, async (req: CustomRequest, res: express.Response): Promise<void> => {
  try {
    const { share } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (share) {
      try {
        // First, deactivate existing links without session
        await LinksModel.updateMany(
          { userId: new mongoose.Types.ObjectId(userId) },
          { $set: { active: false } }
        );

        // Generate unique hash
        const hash = crypto.randomBytes(12).toString('hex');

        // Create new link document without using create array syntax
        const newLink = await LinksModel.create({
          hash,
          userId: new mongoose.Types.ObjectId(userId),
          active: true
        });

        console.log('Share link created:', newLink.hash); // Debug log

        res.status(200).json({ 
          hash: newLink.hash,
          message: "Share link generated successfully" 
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ 
          message: "Database error while creating share link" 
        });
      }
    } else {
      // Deactivate all links
      await LinksModel.updateMany(
        { userId: new mongoose.Types.ObjectId(userId) },
        { $set: { active: false } }
      );

      res.status(200).json({ 
        message: "Sharing disabled successfully" 
      });
    }
  } catch (error) {
    console.error("Error in share endpoint:", error);
    res.status(500).json({ 
      message: "Server error while managing share status" 
    });
  }
});

// Get shared content
app.get("/api/v1/brainybox/share/:hash", async (req: express.Request, res: express.Response) => {
  try {
    const { hash } = req.params;
    console.log('Fetching content for hash:', hash); // Debug log
    
    // Find the active share link
    const shareLink = await LinksModel.findOne({ 
      hash,
      active: true 
    });

    if (!shareLink) {
      res.status(404).json({ 
        message: "Content not found or no longer shared" 
      });
      return;
    }

    // Find the user's content
    const content = await ContentModel.find({ 
      userId: shareLink.userId 
    }).sort({ createdAt: -1 });

    console.log('Found content items:', content.length); // Debug log

    // Get user info
    const user = await UserModel.findById(shareLink.userId);

    res.status(200).json({
      username: user?.Name || "Anonymous",
      content: content
    });

  } catch (error) {
    console.error("Error fetching shared content:", error);
    res.status(500).json({ 
      message: "Failed to fetch shared content" 
    });
  }
});

app.get("/api/v1/brainybox/~:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    console.log('Fetching content for hash:', hash); // Debug log

    // Find the active share link
    const shareLink = await LinksModel.findOne({ 
      hash: hash.replace('~', ''),
      active: true 
    });

    if (!shareLink) {
      console.log('No active share link found for hash:', hash);
      return res.status(404).json({ 
        message: "Content not found or no longer shared" 
      });
    }

    // Find the user's content
    const content = await ContentModel.find({ 
      userId: shareLink.userId 
    }).sort({ createdAt: -1 });

    console.log(`Found ${content.length} content items`); // Debug log

    // Get user info
    const user = await UserModel.findById(shareLink.userId);

    return res.status(200).json({
      username: user?.Name || "Anonymous",
      content: content
    });

  } catch (error) {
    console.error("Error fetching shared content:", error);
    return res.status(500).json({ 
      message: "Failed to fetch shared content" 
    });
  }
});

// Add this route to handle shared content
app.get("/api/v1/brainybox/:hash", async (req: express.Request, res: express.Response) => {
  try {
    let { hash } = req.params;
    // If you expect the hash to be prefixed with ~, remove it
    if (hash.startsWith('~')) {
      hash = hash.slice(1);
    }
    console.log('Received hash:', hash); // Debug log

    // Find the link document
    const linkDoc = await LinksModel.findOne({ 
      hash: hash,
      active: true 
    });
    console.log('Found link doc:', linkDoc); // Debug log

    if (!linkDoc) {
      res.status(404).json({ message: "Shared content not found" });
      return;
    }

    // Find all content for this user
    const content = await ContentModel.find({ 
      userId: linkDoc.userId 
    }).sort({ createdAt: -1 });
    console.log('Found content count:', content.length); // Debug log

    // Find user info
    const user = await UserModel.findById(linkDoc.userId);

    res.status(200).json({
      username: user?.Name || 'Anonymous',
      content: content
    });

  } catch (error) {
    console.error("Error fetching shared content:", error);
    res.status(500).json({ message: "Failed to fetch shared content" });
  }
});

interface MainApp {
    (app: express.Express): Promise<void>;
}

const main: MainApp = async (app) => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      writeConcern: {
        w: 'majority'
      },
      retryWrites: true
    });
    
    // Clear and rebuild indexes on startup
    await LinksModel.collection.dropIndexes();
    await LinksModel.syncIndexes();
    
    console.log('✅ MongoDB connected successfully');
    console.log('✅ MongoDB indexes synchronized');

    app.listen(2000, () => {
      console.log("🚀 Server is running on port 2000");
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

main(app)