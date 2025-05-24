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

// Add CORS middleware before routes
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  credentials: true
}))

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
  const { link, type, title } = req.body as ContentRequestBody;

  await ContentModel.create({
    link,
    type,
    title,
    userId: req.userId,
    tags: []
  });

  res.json({
    message: "Content Added"
  });

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

app.get("/api/v1/brainybox/~:shareLink",async (req:CustomRequest,res: express.Response) => {
  const hash = req.params.shareLink;

 const link =  await LinksModel.findOne({
    hash
  });

  if(!link){
    res.status(411).json({
      message: "Sorry Incorrect Input"
    })
    return;
  }
  
  const content = await ContentModel.findOne({
    userId: link.userId
  }) 

  const user = await UserModel.findOne({
    _id: link.userId
  })

  if(!user){
    res.status(411).json({
      message: "User not found, error should ideally not happen"
    })
    return;
  }

  res.json({
    username: user.username,
    content: content
  })

})

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