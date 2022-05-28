export default {
  port: 3001,
  dbUri: "",
  origin: [
    "http://localhost:3000",
    "https://www.e-commerce-app.me",
    "https://www.dashboard.e-commerce-app.me",
    "https://dashboard.e-commerce-app.me",
  ],
  saltWorkFactor: 10,
  accessTokenTtl: "1h",
  refreshTokenTtl: "1y",
  accessTokenPrivateKey: "",
  accessTokenPublicKey: "",
  refreshTokenPrivateKey: "",
  refreshTokenPublicKey: "",
  domain:
    process.env.NODE_ENV === "development" ? "localhost" : "e-commerce-app.me",
  secure: process.env.NODE_ENV === "development" ? false : true,
};
