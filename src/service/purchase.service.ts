import { FilterQuery } from "mongoose";
import ProductModel from "../models/product.model";
import PurchaseModel, { PurchaseDocument } from "../models/purchase.model";
import { PurchaseRequestPayloadType } from "../schema/purchase.schema";

export async function sendPurchaseRequest(payload: PurchaseRequestPayloadType) {
  return PurchaseModel.create(payload);
}

export async function checkIfBuyerAlreadyHasRequest(
  query: FilterQuery<PurchaseDocument>
) {
  return PurchaseModel.find({
    buyerId: query.userId,
    productId: query.productId,
  }).ne("status", "Rejected");
}

export async function findUserPurchaseRequests(
  query: FilterQuery<PurchaseDocument>
) {
  return PurchaseModel.find({
    sellerId: query.userId,
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
  await PurchaseModel.updateMany(
    { productId: query.productId },
    {
      status: "Rejected",
    }
  )
    .where()
    .ne("_id", query.purchaseId)
    .exec();

  await ProductModel.findByIdAndUpdate(query.productId, {
    $set: { isItSold: true },
  });

  return PurchaseModel.findByIdAndUpdate(query.purchaseId, {
    $set: { approvedUserId: query.approvedUserId, status: "Approved" },
  });
}

export async function deletePurchaseRequest(id: string) {
  return PurchaseModel.findByIdAndDelete(id);
}
