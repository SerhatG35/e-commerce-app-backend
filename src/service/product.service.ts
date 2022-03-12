import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProductModel, {
  ProductDocument,
  ProductInput,
} from "../models/product.model";

export async function createProduct(input: ProductInput) {
  try {
    const result = await ProductModel.create(input);
    return result;
  } catch (e: any) {
    console.error(e);
    throw e;
  }
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
  const x = ProductModel.find({ user: query.userId });
  console.log(x);

  return x;
}

export async function findAllProducts() {
  try {
    return ProductModel.find().lean();
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
