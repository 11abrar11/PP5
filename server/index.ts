/**
 * main server entry point
 * - Initializes the Express application
 * - Configures middleware and logging
 * - Sets up API and static asset routing
 */
import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

// Initialize express and the native Node HTTP server
const app = express();
const httpServer = createServer(app);

// Extend the Request object type to include a 'rawBody' property
// This is used for webhooks or raw data verification if needed later
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

/**
 * Configure Global Middleware
 */

// JSON body parser with rawBuffer access (stored in req.rawBody)
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

// URL-encoded body parser
app.use(express.urlencoded({ extended: false }));

/**
 * Logging Utility
 * @param message The content to log
 * @param source The origin of the log (defaults to 'express')
 */
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * Request Logging Middleware
 * Intercepts res.json to log the response body and calculates request duration
 */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Decorate res.json to capture the response body
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log on request completion
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

/**
 * Startup Logic
 */
(async () => {
  // 1. Register API Routes
  await registerRoutes(httpServer, app);

  // 2. Global Error Handling Middleware
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // 3. Setup Environment-Specific Routing
  // - In production: Serve pre-built static files
  // - In development: Setup Vite dev server for hot reloading
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    // Dynamically import Vite setup only in dev to keep production builds lean
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // 4. Start the server
  // Listen on the port specified by environment variable or fallback to 5000
  // Required to use '0.0.0.0' for external accessibility (e.g., Render)
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    port,
    "0.0.0.0",
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
