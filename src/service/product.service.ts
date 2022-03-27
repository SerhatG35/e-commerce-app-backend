import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProductModel, {
  ProductDocument,
  ProductInput,
} from "../models/product.model";

export async function createProduct(input: ProductInput) {
  return await ProductModel.create(input);
}

export async function findProduct(productId: string) {
  try {
    const result = await ProductModel.findOne({ _id: productId });
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function findUserProducts(query: FilterQuery<ProductDocument>) {
  return ProductModel.find({ user: query.userId });
}

export async function findAllProducts(query: {
  category?: string;
  priceRange?: number[];
}) {
  try {
    return ProductModel.find({
      ...(query.category ? { category: query.category } : {}),
      ...(query.priceRange
        ? { price: { $gt: query.priceRange[0], $lte: query.priceRange[1] } }
        : {}),
    }).lean();
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}

export async function findAndUpdateProduct(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions
) {
  return ProductModel.findOneAndUpdate(query, update, options);
}

export async function deleteProduct(query: FilterQuery<ProductDocument>) {
  return ProductModel.deleteOne(query);
}
