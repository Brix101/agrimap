import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { findSession, reIssueAccessToken } from "../services/session.service";
import { verifyJwt } from "../utils/jwt.util";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    "",
  );

  const refreshToken = get(req, "cookies.X-Agrimap-Session");

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken, "accessTokenPublicKey");

  if (decoded) {
    const sessionId = decoded?.sub;
    const session = await findSession({ _id: sessionId, valid: true });

    res.locals.user = { ...session?.user, sub: sessionId };
    return next();
  }

  if (expired && refreshToken) {
    const {
      user,
      sub,
      accessToken: newAccessToken,
    } = await reIssueAccessToken({
      refreshToken,
    });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }

    res.locals.user = { ...user, sub };
    return next();
  }

  return next();
};

export default deserializeUser;
