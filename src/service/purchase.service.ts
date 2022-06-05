import { FilterQuery } from "mongoose";
import PurchaseModel, { PurchaseDocument } from "../models/purchase.model";

export async function checkIfBuyerAlreadyHasRequest(
  query: FilterQuery<PurchaseDocument>
) {
  return PurchaseModel.find({
    buyerId: query.userId,
    productId: query.productId,
  });
}

export async function findUserPurchaseRequests(
  query: FilterQuery<PurchaseDocument>
) {
  const approvedPurchaseRequests = await PurchaseModel.find({
    sellerId: query.userId,
  }).exists("approvedUserId", true);

  const excludedProductIds = approvedPurchaseRequests.map(
    (request) => request.productId
  );

  return PurchaseModel.find({
    sellerId: query.userId,
    productId: { $nin: excludedProductIds },
  });
}

export async function findUserSendedPurchaseRequests(
  query: FilterQuery<PurchaseDocument>
) {
  return PurchaseModel.find({ buyerId: query.userId });
}

export async function findPurchaseRequest(
  query: FilterQuery<PurchaseDocument>
) {
  return PurchaseModel.findById(query.purchaseId);
}

export async function isUserAssociatedWithThisProduct(
  query: FilterQuery<PurchaseDocument>
) {
  return PurchaseModel.findOne({
    $or: [{ sellerId: query.userId }, { buyerId: query.userId }],
  });
}

export async function deletePurchaseRequest(
  query: FilterQuery<PurchaseDocument>
) {
  return PurchaseModel.findByIdAndDelete(query.purchaseId);
}

export async function checkIfProductAlreadyApproved(
  query: FilterQuery<PurchaseDocument>
) {
  return PurchaseModel.find({ productId: query.productId }).exists(
    "approvedUserId",
    true
  );
}

export async function setPurchaseRequestStatusToApproved(
  query: FilterQuery<PurchaseDocument>
) {
  return PurchaseModel.findByIdAndUpdate(query.purchaseId, {
    $set: { approvedUserId: query.approvedUserId },
  });
}
