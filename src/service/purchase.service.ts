import { FilterQuery } from "mongoose";
import PurchaseModel, { PurchaseDocument } from "../models/purchase.model";

export async function checkIfBuyerAlreadyHasRequest(
  query: FilterQuery<PurchaseDocument>
) {
  return PurchaseModel.find({ buyerId: query.userId });
}
