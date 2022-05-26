import { Request, Response } from "express";
import { findProduct, sendPurchaseRequest } from "../service/product.service";
import { checkIfBuyerAlreadyHasRequest } from "../service/purchase.service";
import { findUser } from "../service/user.service";

export async function purchaseRequestHandler(req: Request, res: Response) {
  const payload = req.body;
  const productId = req.params.productId;

  const product = await findProduct(productId);
  if (!product) return res.sendStatus(404);

  const user = await findUser({ userId: payload.buyerId });
  if (!user) return res.sendStatus(404);

  const response = await checkIfBuyerAlreadyHasRequest({
    userId: payload.buyerId,
  });

  console.log(response);

  if (response && response.length > 0) {
    return res
      .status(409)
      .send("You already have a purchase request for this product.");
  }

  await sendPurchaseRequest(payload);

  return res.sendStatus(200);
}
