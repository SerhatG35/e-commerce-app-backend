import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProductModel, {
  ProductDocument,
  ProductInput,
} from "../models/product.model";

export async function createProduct(input: ProductInput) {
  return ProductModel.create(input);
}

export async function checkIfUserReachedProductLimit(
  query: FilterQuery<ProductDocument>
) {
  const count = await ProductModel.find({ user: query.userId })
    .countDocuments()
    .exec();

  return count;
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
    return {
      productsList: await ProductModel.find({
        ...(query.category ? { category: query.category } : {}),
        ...(query.priceRange
          ? {
              price: {
                $gte: query.priceRange[0],
                $lte: query.priceRange[1],
              },
            }
          : {}),
        isItSold: false,
      }).lean(),
      highestPrice: (
        await ProductModel.findOne().sort({ price: -1 }).limit(1).lean()
      )?.price,
    };
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

export async function deleteProduct(productId: string) {
  return ProductModel.findByIdAndDelete(productId);
}
