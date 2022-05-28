import { Request, Response } from "express";
import config from "config";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";

export async function createUserSessionHandler(req: Request, res: Response) {
  const user = await validatePassword(req.body);

  if (!user) return res.status(401).send("Invalid email or password");

  const session = await createSession(user._id, req.get("user-agent") || "");

  const accessToken = signJwt(
    { ...user, session: session._id },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") }
  );

  const refreshToken = signJwt(
    { ...user, session: session._id },
    "refreshTokenPrivateKey",
    { expiresIn: config.get("refreshTokenTtl") }
  );

  res.cookie("accessToken", accessToken, {
    maxAge: 3600000,
    httpOnly: true,
    domain: config.get("domain"),
    path: "/",
    sameSite: "strict",
    secure: config.get("secure"),
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 3.154e10,
    httpOnly: true,
    domain: config.get("domain"),
    path: "/",
    sameSite: "strict",
    secure: config.get("secure"),
  });

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  res.clearCookie("accessToken", {
    path: "/",
    httpOnly: true,
    domain: config.get("domain"),
    path: "/",
    sameSite: "strict",
    secure: config.get("secure"),
  });
  res.clearCookie("refreshToken", {
    path: "/",
    httpOnly: true,
    domain: config.get("domain"),
    path: "/",
    sameSite: "strict",
    secure: config.get("secure"),
  });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
