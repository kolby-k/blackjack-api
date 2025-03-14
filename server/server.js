require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 3000; // change to any preferred port

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
