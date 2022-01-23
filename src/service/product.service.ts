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

export async function findProduct(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) {
  try {
    const result = await ProductModel.findOne(query, {}, options);
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function findAllProducts() {
  try {
    return ProductModel.find();
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
