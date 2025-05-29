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

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'https://brainybox-aftab.vercel.app',
  'https://brainybox-aftab-8unr25qne-aftab784s-projects.vercel.app'
];

// Add CORS middleware before routes
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

app.use(express.json());


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
   
  }

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
       res.status(403).json({
        message: 'User already exists with this username'
      });
      
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
})

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
    const { link, type, title, content } = req.body;

    const newContent = await ContentModel.create({
      link,
      type,
      title,
      content, // Add this
      userId: req.userId
    });

    res.status(200).json({
      message: "Content Added",
      content: newContent
    });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ 
      message: "Failed to create content" 
    });
  }
});

app.get("/api/v1/content", usermiddleware,async (req:CustomRequest,res: express.Response) => {
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId
  }).populate("userId", "username")

  res.json({
    content
})
})

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

app.post("/api/v1/brainybox/share",usermiddleware, async (req:CustomRequest,res: express.Response) => {
  try{
  const { share } = req.body;
  
    if (share) {
      const existingLink = await LinksModel.findOne({
        userId: req.userId
      });

      if (existingLink) {
        res.json({
          hash: existingLink.hash
        });
        return;
      }

      const hash = random(18);
      await LinksModel.create({
        userId: req.userId,
        hash: hash
      });

      res.json({
        hash
      });
    } else {
      const result = await LinksModel.deleteOne({
        userId: req.userId
      });

      if (result.deletedCount === 0) {
        res.status(404).json({
          message: "No link found to remove"
        });
        return;
      }

      res.json({
        message: "Removed link"
      });
    }
  }catch(err){
    console.log(err)
    res.status(500).json({
      message: "Server error"
    });
  }
});

// Update the shared content endpoint
app.get("/api/v1/brainybox/~:shareLink", async (req: express.Request, res: express.Response) => {
  try {
    const hash = req.params.shareLink;
    
    // Find the share link in database
    const shareLink = await LinksModel.findOne({ hash });
    
    if (!shareLink) {
      res.status(404).json({
        message: "Share link not found"
      });
      return;
    }

    // Get user's content
    const content = await ContentModel.find({ 
      userId: shareLink.userId 
    }).sort({ createdAt: -1 });

    // Get user info
    const user = await UserModel.findById(shareLink.userId);

    if (!user) {
      res.status(404).json({
        message: "User not found"
      });
      return;
    }

    res.json({
      username: user.Name || user.email,
      content
    });

  } catch (error: any) {
    console.error('Share content error:', error);
    res.status(500).json({
      message: "Server error",
      error: error?.message || 'Unknown error'
    });
  }
});

interface UpdateContentBody {
  content: string;
}

// Add this PUT endpoint for content updates
app.put("/api/v1/content/:id", usermiddleware, async (req: CustomRequest, res: express.Response) => {
  try {
    const contentId = req.params.id;
    const { content } = req.body;
    const userId = req.userId;

    if (!contentId || !content) {
      res.status(400).json({
        message: "Content ID and updated content are required"
      });
      return;
    }

    const updatedContent = await ContentModel.findOneAndUpdate(
      { 
        _id: contentId, 
        userId 
      },
      { 
        $set: { content } 
      },
      { 
        new: true 
      }
    );

    if (!updatedContent) {
      res.status(404).json({
        message: "Content not found or you don't have permission to update it"
      });
      return;
    }

    res.status(200).json({
      message: "Content updated successfully",
      content: updatedContent
    });

  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({
      message: "Failed to update content"
    });
  }
});

interface MainApp {
    (app: express.Express): Promise<void>;
}

const main: MainApp = async (app) => {
  try {

    const start = Date.now(); 

    await mongoose.connect(process.env.MONGO_URL as string);

    const end = Date.now();

    const timeTaken = ((end - start ) / 1000).toFixed(3)

    console.log(`✅ MongoDB connected in ${timeTaken}s`);

    app.listen(2000, ()=> {
      console.log("🚀 Server is running on port 2000");
    })
  }catch(err) {
    console.error("❌ Failed to connect to MongoDB:", err);
        process.exit(1); // Exit the app if DB connection fails
  }
};

main(app)