import express from "express";
import swagger, { serve } from "swagger-ui-express";
import movieRouter from "./src/features/movie/movie.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import wishlistRouter from "./src/features/wishlist/wishlistItems.routes.js";
import apiDocs from "./swagger.json" with { type: "json" };
const server = express();
const PORT = 8000;
server.use(express.json());
// For all requrests related to movie, redirect to movie routes
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use("/api/movies", jwtAuth, movieRouter);
server.use("/api/wishlistItems", jwtAuth, wishlistRouter);
server.use("/api/users", userRouter);
server.get("/", (req, res) => {
  res.send("Welcome to RDSCinemas !!!");
});
server.listen(PORT, () => {
  console.log("Server is running on http://localhost:8000");
});
