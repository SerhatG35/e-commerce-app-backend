import { Request, Response, NextFunction } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
console.log(res.locals);

  if (!user) return res.status(403).send("Unauthorized request please login");

  return next();
};

export default requireUser;
