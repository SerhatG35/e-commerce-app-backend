import mongoose from "mongoose";

export interface PurchasePayload {
  price: number;
  message: string | undefined;
  productId: string;
  productName: string;
  productCategory: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  isApprovedForSelling: boolean;
  approvedUserId: string | undefined;
  status: "Pending" | "Approved" | "Rejected";
}

export interface PurchaseDocument extends PurchasePayload, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const purchaseProductSchema = new mongoose.Schema(
  {
    message: { type: String },
    price: { type: Number, required: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productCategory: { type: String, required: true },
    buyerId: { type: String, required: true },
    buyerName: { type: String, required: true },
    sellerId: { type: String, required: true },
    sellerName: { type: String, required: true },
    approvedUserId: { type: String, default: undefined },
    status: { type: String, default: "Pending" },
  },
  {
    timestamps: true,
  }
);

const PurchaseModel = mongoose.model<PurchaseDocument>(
  "Purchase Request",
  purchaseProductSchema
);

export default PurchaseModel;
