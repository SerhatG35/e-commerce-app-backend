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
  return PurchaseModel.find({ sellerId: query.userId });
}

export async function findPurchaseRequest(
  query: FilterQuery<PurchaseDocument>
) {
  return PurchaseModel.findById(query.purchaseId);
}

export async function deletePurchaseRequest(
  query: FilterQuery<PurchaseDocument>
) {
  return PurchaseModel.findByIdAndDelete(query.purchaseId);
}
