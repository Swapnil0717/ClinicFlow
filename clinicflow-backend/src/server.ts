import dotenv from "dotenv";
dotenv.config(); 

import app from "./app";
import { generateTokens } from "./utils/generateTokens";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log(
  generateTokens({ userId: "123", role: "ADMIN" })
);