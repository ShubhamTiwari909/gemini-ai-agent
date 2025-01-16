import express from "express";
import connectDB, { History, Users } from "./mongodb-connection.mjs";

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.get("/", async (req, res) => {
  const connection = await connectDB();
  if (connection) {
    const users = await Users.find();
    const usersHistory = await Users.aggregate([
      {
        $lookup: {
          from: "histories",
          localField: "userId",
          foreignField: "userId",
          as: "histories",
        },
      },
      {
        $project: {
          name: 1,
          userId: 1,
          histories: 1
        },
      },
    ]);
    console.log(users)
    console.log("User history - ", usersHistory[0].histories);

    const histories = await History.find();
    console.log(histories);
    res.send(`MongoDB Connected with Express! - ${connection}`);
  } else {
    res.send(`MongoDB Connection Failed! - ${connection}`);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
