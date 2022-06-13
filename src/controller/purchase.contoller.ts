import { Request, Response } from "express";
import { findProduct } from "../service/product.service";
import {
  checkIfBuyerAlreadyHasRequest,
  checkIfProductAlreadyApproved,
  rejectPurchaseRequest,
  findPurchaseRequest,
  findUserPurchaseRequests,
  findUserSendedPurchaseRequests,
  isUserAssociatedWithThisProduct,
  setPurchaseRequestStatusToApproved,
  sendPurchaseRequest,
  deletePurchaseRequest,
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

export async function deletePurchaseRequestHandler(
  req: Request,
  res: Response
) {
  const purchaseId = req.params.purchaseId;

  const purchaseRequest = await findPurchaseRequest({ purchaseId });
  if (!purchaseRequest)
    return res.status(404).send("No purchase request was found.");

  try {
    const response = await deletePurchaseRequest(purchaseId);
    return res.send(response);
  } catch (error: any) {
    return res.send(error);
  }
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

  const isUserAssociated = await isUserAssociatedWithThisProduct({
    userId,
  });
  if (!isUserAssociated)
    return res
      .status(404)
      .send("This purchase request is not associated with this user.");

  const response = await rejectPurchaseRequest({ purchaseId });

  if (!response)
    return res
      .status(404)
      .send("Problem occured while rejecting purchase request.");

  return res.send(response);
}

export async function approvePurchaseRequestHandler(
  req: Request,
  res: Response
) {
  const userId = res.locals.user._id;
  const purchaseId = req.params.purchaseId;
  const payload = req.body;

  const purchaseRequest = await findPurchaseRequest({ purchaseId });
  if (!purchaseRequest)
    return res.status(404).send("No purchase request was found.");

  const isUserAssociated = await isUserAssociatedWithThisProduct({
    userId,
  });
  if (!isUserAssociated)
    return res
      .status(404)
      .send("This purchase request is not associated with this user.");

  const isProductAlreadyApproved = await checkIfProductAlreadyApproved({
    productId: purchaseRequest.productId,
  });

  if (!!isProductAlreadyApproved)
    return res.status(404).send("This product is already approved for sale.");

  const response = await setPurchaseRequestStatusToApproved({
    purchaseId,
    approvedUserId: payload.approvedUserId,
    productId: purchaseRequest.productId,
  });

  if (!response) return res.status(404);

  return res.send(response);
}
