import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import deserializeUser from "./middlewares/deserializeUser";
import { env } from "./env";
import connect from "./utils/connect";
import { seed } from "./utils/generated";
import route from "./routes/root";

const root_dir = "../..";
export const createServer = (): Express => {
  const app = express();
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(cookieParser());
  app.use(
    cors({
      origin: [
        "http://192.168.254.132:5173",
        "http://localhost:5173",
        "http://192.168.254.126:5000",
        "http://localhost:5000",
      ],
      credentials: true,
      allowedHeaders: ["Content-Disposition"],
    }),
  );
  app.use(express.json()); //bodyparser
  app.use(deserializeUser);
  if (env.NODE_ENV === "production") {
    app.use(
      morgan("common", {
        skip: (req, res) => res.statusCode < 400,
      }),
    );
  } else {
    app.use(morgan("dev"));
  }

  connect();
  seed();
  route(app);

  // Serve static files from the React build folder
  app.use(express.static(path.join(__dirname, root_dir, "client", "dist")));

  // Handle any additional routes and return the React app
  app.get("*", (req, res, next) => {
    if (req.originalUrl.includes("/api")) {
      // Skip the React app handling for routes containing "/api"
      return next();
    }
    res.sendFile(
      path.join(__dirname, root_dir, "client", "dist", "index.html"),
    );
  });

  return app;
};