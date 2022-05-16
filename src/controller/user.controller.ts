import { Request, Response } from "express";
import { omit } from "lodash";
import { CreateUserInput, UpdateUserInput } from "../schema/user.schema";
import { createSession } from "../service/session.service";
import {
  createUser,
  findAndUpdateUser,
  findUser,
  getUserInfo,
} from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    return res.send(user);
  } catch (error: any) {
    return res.status(409).send("This email address is already taken.");
  }
}

export async function updateUserHandler(
  req: Request<UpdateUserInput["params"]>,
  res: Response
) {
  const userId = req.params.userId;
  const update = req.body;
  const user = await findUser({ userId });

  if (!user) return res.sendStatus(404);

  const updatedUser = await findAndUpdateUser(userId, update, {
    new: true,
  });

  const session = await createSession(update._id, req.get("user-agent") || "");

  const accessToken = signJwt(
    { ...update, session: session._id },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") }
  );

  const refreshToken = signJwt(
    { ...update, session: session._id },
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

  return res.send(updatedUser);
}

export async function getCurrentUser(req: Request, res: Response) {
  const userId = req.params.userId;
  try {
    return res.send(omit(await getUserInfo(userId), "password"));
  } catch (error) {
    res.status(404).send("Can't find user with this user id");
  }
}
