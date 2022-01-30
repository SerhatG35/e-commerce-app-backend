import { Request, Response } from "express";
import { omit } from "lodash";
import { CreateUserInput, UpdateUserInput } from "../schema/user.schema";
import {
  createUser,
  findAndUpdateUser,
  findUser,
} from "../service/user.service";
import log from "../utils/logger";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    return res.send(user);
  } catch (error: any) {
    log.error(error);
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

  return res.send(updatedUser);
}

export async function getCurrentUser(req: Request, res: Response) {
  return res.send(omit(res.locals.user, "password"));
}
