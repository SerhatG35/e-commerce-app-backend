import { object, number, string, TypeOf } from "zod";

export const purchaseRequestSchema = object({
  body: object({
    productId: string({ required_error: "Product ID is required" }),
    buyerName: string({ required_error: "Buyer name is required" }),
    buyerId: string({ required_error: "Buyer ID is required" }),
    price: number({ required_error: "Price is required" }),
    message: string().optional(),
  }),
});

export type ProductRequestPayloadType = TypeOf<
  typeof purchaseRequestSchema
>["body"];
