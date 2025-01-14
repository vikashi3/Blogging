const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

app.set("view engine", "ejs");

app.use(cors(process.env.FRONTEND_URL));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-image_profile_pic-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT;

const secretkey = process.env.SECRET_KEY;

const createToken = (res, email, userId) => {
  const token = jwt.sign({ email, userId }, secretkey, { expiresIn: "30m" });
  return token;
};

const protectedRoute = (req, res, next) => {
  const token = req.headers.authorization || req.headers.Authorization;
  // console.log(req.headers);
  if (!token) {
    return res.send("token not found");
  }
  try {
    const decode = jwt.verify(token, secretkey);
    if (!decode) {
      return res.status(401).send("Token not valid");
    }
    req.user = decode;
    next();
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error.message);
  }
};

connection();

const userschema = new mongoose.Schema(
  {
    profilePic: {
      type: String,
      default: "https://avatar.iran.liara.run/public",
    },
    name: String,
    email: String,
    password: String,
    contact: String,
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        default: [],
      },
    ],
  },
  { timeStamps: true }
);

const User = mongoose.model("User", userschema);

const blogschema = new mongoose.Schema(
  {
    blogPic: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
    city: String,
    content: String,
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogschema);

app.get("/", (req, res) => {
  res.send("welcome to our homepage");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { name, email, password, contact } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      contact,
      profilePic: req.file.filename.toLowerCase(),
    });

    const token = await createToken(res, email, newUser._id);
    res.status(201).json({ token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not registered");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send("Incorrect password");
    }

    const token = await createToken(res, email, user._id);

    // console.log(token);
    res.send(token);
  } catch (error) {
    res.status(500).send("Internal server error");
    console.log(error);
  }
});

app.get("/allblogs", async (req, res) => {
  const users = await Blog.find({}).populate("author");
  // console.log(users);
  res.send(users);
});

app.post("/createBlog", upload.single("blogFile"), async (req, res) => {
  const { title, city, content } = req.body;
  // console.log(req.body);
  const userId = req.body.userId;

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    let user = await User.findById(userId);
    if (!user) {
      res.send("user not found");
    }
    const newBlog = await Blog.create({
      title,
      author: userId,
      city,
      content,
      blogPic: req.file.filename.toLowerCase(),
    });

    await User.findByIdAndUpdate(userId, { $push: { blogs: newBlog._id } });

    res.status(200).send(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating blog");
  }
});

app.get("/profile/:id", protectedRoute, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("blogs");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
    // console.log("profile data:", user);
  } catch (error) {
    console.log("Error in profile route:", error);
    res.status(500).send("Error in profile route: " + error.message);
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    // console.log("Edit route ID: ", req.params.id);
    const blog = await Blog.findById(req.params.id);
    res.send(blog);
  } catch (error) {
    console.log("Error in edit route:", error);
    res.status(500).send("Error in edit route: " + error.message);
  }
});

app.patch("/update/:id", upload.single("blogFile"), async (req, res) => {
  try {
    // console.log("Update route ID: ", req.params.id);
    const blogId = req.params.id;
    const { title, city, content } = req.body;
    const blogPic = req.file.filename;
    console.log(req.file);

    if (!blogPic && !title && !city && !content) {
      return res.status(400).send("No fields provided for update");
    }

    const updatedBlogFields = {};
    if (blogPic) updatedBlogFields.blogPic = blogPic;
    if (title) updatedBlogFields.title = title;
    if (city) updatedBlogFields.city = city;
    if (content) updatedBlogFields.content = content;
    const updatedblog = await Blog.findByIdAndUpdate(
      blogId,
      {
        ...(blogPic && { blogPic }),
        ...(title && { title }),
        ...(city && { city }),
        ...(content && { content }),
      },
      { new: true }
    );

    if (!updatedblog) {
      return res.status(404).send("User not found");
    }

    res.send(updatedblog);
  } catch (error) {
    console.log("Error in profile route:", error);
    res.status(500).send("Error in profile route");
  }
});

app.get("/profileEdit/:id", async (req, res) => {
  try {
    console.log("profileEdit route ID: ", req.params.id);
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.log("Error in profileEdit route:", error);
    res.status(500).send("Error in profileEdit route: " + error.message);
  }
});

app.patch(
  "/profile/update/:id",
  upload.single("profileFile"),
  async (req, res) => {
    try {
      // console.log("Update route ID: ", req.params.id);
      const userId = req.params.id;
      const { name, email, contact } = req.body;
      const profilePic = req.file.filename;
      console.log(req.file);

      if (!profilePic && !name && !email && !contact) {
        return res.status(400).send("No fields provided for update");
      }

      const updatedprofileFields = {};
      if (profilePic) updatedprofileFields.profilePic = profilePic;
      if (name) updatedprofileFields.name = name;
      if (email) updatedprofileFields.email = email;
      if (contact) updatedprofileFields.contact = contact;
      const updatedprofile = await User.findByIdAndUpdate(
        userId,
        {
          ...(profilePic && { profilePic }),
          ...(name && { name }),
          ...(email && { email }),
          ...(contact && { contact }),
        },
        { new: true }
      );

      if (!updatedprofile) {
        return res.status(404).send("User not found");
      }

      res.send(updatedprofile);
    } catch (error) {
      console.log("Error in profile route:", error);
      res.status(500).send("Error in profile route");
    }
  }
);

app.delete("/delete/:id", async (req, res) => {
  try {
    // console.log("Delete route ID: ", req.params.id);
    const blog = await Blog.findByIdAndDelete(req.params.id);
    res.status(200).send("Blog deleted");
  } catch (error) {
    console.log("Error in profile route:", error);
    res.status(500).send("Error in profile route: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
