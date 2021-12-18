export default {
  port: 3001,
  dbUri: "",
  origin: "http://localhost:3000",
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
      : "e-commerce-app-be.herokuapp",
  secure: process.env.NODE_ENV === "development" ? false : true,
};
