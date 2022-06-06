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
  // const approvedPurchaseRequests = await PurchaseModel.find({
  //   sellerId: query.userId,
  // }).exists("approvedUserId", true);

  // const excludedProductIds = approvedPurchaseRequests.map(
  //   (request) => request.productId
  // );

  return PurchaseModel.find({
    sellerId: query.userId,
    status: "Pending",
  });
}

export async function findUserSendedPurchaseRequests(
  query: FilterQuery<PurchaseDocument>
) {
  const allUserSendedPurchaseRequests = await PurchaseModel.find({
    buyerId: query.userId,
    approvedUserId: query.userId,
  }).exec();
  //TODO: BURADAN DEVAM ET NOTLARI OKU
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

export async function rejectPurchaseRequest(
  query: FilterQuery<PurchaseDocument>
) {
  return PurchaseModel.findByIdAndUpdate(query.purchaseId, {
    status: "Rejected",
  });
}

export async function checkIfProductAlreadyApproved(
  query: FilterQuery<PurchaseDocument>
) {
  const productApproveStatus = await PurchaseModel.find({
    productId: query.productId,
  })
    .exists("approvedUserId", true)
    .exec();

  const response = productApproveStatus && productApproveStatus.length !== 0;
  return response;
}

export async function setPurchaseRequestStatusToApproved(
  query: FilterQuery<PurchaseDocument>
) {
  await PurchaseModel.updateMany({
    productId: query.productId,
    status: "Rejected",
  })
    .ne("_id", query.purchaseId)
    .exec();

  return PurchaseModel.findByIdAndUpdate(query.purchaseId, {
    $set: { approvedUserId: query.approvedUserId, status: "Approved" },
  });
}
