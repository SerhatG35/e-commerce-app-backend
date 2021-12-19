export default {
  port: 3001,
  dbUri: "",
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://e-commerce-app-pink.vercel.app",
  saltWorkFactor: 10,
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  accessTokenPrivateKey: ``,
  accessTokenPublicKey: ``,
  refreshTokenPrivateKey: ``,
  refreshTokenPublicKey: ``,
  domain:
    process.env.NODE_ENV === "development"
      ? "localhost"
      : "e-commerce-app-pink.vercel.app",
  secure: process.env.NODE_ENV === "development" ? false : true,
};
