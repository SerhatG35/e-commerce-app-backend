import { object, number, string, TypeOf } from "zod";

export const purchaseRequestSchema = object({
  body: object({
    productId: string({ required_error: "Product ID is required" }),
    productName: string({ required_error: "Product Name is required" }),
    productCategory: string({ required_error: "Product Category is required" }),
    buyerName: string({ required_error: "Buyer name is required" }),
    buyerId: string({ required_error: "Buyer ID is required" }),
    sellerName: string({ required_error: "Seller name is required" }),
    sellerId: string({ required_error: "Seller ID is required" }),
    price: number({ required_error: "Price is required" }),
    message: string().optional(),
  }),
});

export type PurchaseRequestPayloadType = TypeOf<
  typeof purchaseRequestSchema
>["body"];
