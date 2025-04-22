require('dotenv').config()
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel, ContentModel, LinksModel } from './db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { usermiddleware } from "./middlewares";


const app = express()
app.use(express.json());


app.post("/api/v1/signup",async (req,res) => {

  const { email, password, firstName, lastName } = req.body;

  const requiredObj = z.object({
    email: z.string().email().min(3).max(100),
    password: z.string()
      .min(8)
      .max(20)
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    firstName: z.string().min(3).max(10),
    lastName: z.string().min(1)
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
      firstName,
      lastName
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
      }, process.env.JWT_USER_SECRET as string, { expiresIn: "1h" });

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

app.delete("/api/v1/content",usermiddleware, async (req: CustomRequest,res) => {
  const contentId = req.body.contentId;

 const result = await ContentModel.deleteMany({
    contentId,
    userId: req.userId
  })

  if(result.deletedCount === 0 ){
    res.status(404).json({
      message: "No content found to delete"
    })
  }

  res.json({
    message: "Deleted"
  })
  
})

app.post("/api/v1/brain/share", (req,res) => {

})

app.get("/api/v1/brain/:shareLink", (req,res) => {

})

interface MainApp {
    (app: express.Express): Promise<void>;
}

const main: MainApp = async (app) => {
    await mongoose.connect(process.env.MONGO_URL as string);
    app.listen(2000);
    console.log("Port is listening on 2000");
};

main(app)