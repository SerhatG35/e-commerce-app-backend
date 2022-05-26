import mongoose from "mongoose";

export interface PurchasePayload {
  price: number;
  message: string | undefined;
  productId: string;
  buyerId: string;
  buyerName: string;
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
    buyerId: { type: String, required: true },
    buyerName: { type: String, required: true },
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
