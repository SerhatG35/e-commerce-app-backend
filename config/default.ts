export default {
  port: 3001,
  dbUri:
    "mongodb+srv://serhat-admin:ssOKOieK3j21oRAn@cluster0.5nw5l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  origin: "http://localhost:3000",
  saltWorkFactor: 10,
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  accessTokenPrivateKey: ``,
  accessTokenPublicKey: ``,
  refreshTokenPrivateKey: ``,
  refreshTokenPublicKey: ``,
  domain: process.env.NODE_ENV
};
