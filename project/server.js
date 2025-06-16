const express = require("express");
const app = express();

// Optional: Middleware for JSON input
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Grain Export App Backend is Running 🚀");
});

// You can add your own API routes here
// Example: app.post("/calculate", (req, res) => {...});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
