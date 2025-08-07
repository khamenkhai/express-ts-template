import cors from "cors";

const configureCors = () => {
  return cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://your-production-site.com",
      ];

      // Allow requests with no origin (like curl, Postman) or if origin is in the whitelist
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // ✅ Allow request
      } else {
        callback(new Error("Not allowed by CORS!")); // ❌ Reject request
      }
    },

    // Allowed HTTP methods
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    // Allowed headers that client can send in requests
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],

    // Expose specific headers to the browser (optional)
    exposedHeaders: ["Authorization", "Content-Length", "X-Known-Header"],

    // Allow credentials like cookies and Authorization headers
    credentials: true,
    preflightContinue: false,
    // Optional: Cache the CORS preflight response (in 10 minute 60 seconds)
    maxAge: 600,
    optionsSuccessStatus: 204,
  });
};

export default configureCors;
