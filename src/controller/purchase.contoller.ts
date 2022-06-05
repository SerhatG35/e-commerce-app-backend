import { Request, Response } from "express";
import { findProduct, sendPurchaseRequest } from "../service/product.service";
import {
  checkIfBuyerAlreadyHasRequest,
  deletePurchaseRequest,
  findPurchaseRequest,
  findUserPurchaseRequests,
  findUserSendedPurchaseRequests,
  isUserAssociatedWithThisProduct,
} from "../service/purchase.service";
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
    productId,
  });

  if (response && response.length > 0) {
    return res
      .status(409)
      .send("You already have a purchase request for this product.");
  }

  await sendPurchaseRequest(payload);

  return res.sendStatus(200);
}

export async function getPurchaseRequestHandler(req: Request, res: Response) {
  const userId = req.params.userId;

  const user = await findUser({ userId });
  if (!user) return res.sendStatus(404);

  Promise.all([
    await findUserPurchaseRequests({ userId }),
    await findUserSendedPurchaseRequests({ userId }),
  ])
    .then((result) => {
      return res.send({
        receivedPurchaseRequests: result[0],
        sendedPurchaseRequests: result[1],
      });
    })
    .catch((error: any) => {
      res.status(404).send(error);
    });
}

export async function rejectPurchaseRequestHandler(
  req: Request,
  res: Response
) {
  const userId = res.locals.user._id;
  const purchaseId = req.params.purchaseId;

  const purchaseRequest = await findPurchaseRequest({ purchaseId });
  if (!purchaseRequest)
    return res.status(404).send("No purchase request was found.");

  const sellersPurchaseRequest = await isUserAssociatedWithThisProduct({
    userId,
  });
  if (!sellersPurchaseRequest)
    return res
      .status(404)
      .send("This purchase request is not associated with this user.");

  const response = await deletePurchaseRequest({ purchaseId });

  if (!response)
    return res
      .status(404)
      .send("Problem occured while rejecting purchase request.");

  return res.send(response);
}
