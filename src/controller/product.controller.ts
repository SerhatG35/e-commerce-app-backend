import { Request, Response } from "express";
import { omit } from "lodash";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../schema/product.schema";
import {
  createProduct,
  deleteProduct,
  findAllProducts,
  findAndUpdateProduct,
  findProduct,
  findUserProducts,
} from "../service/product.service";

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const body = req.body;
  const product = await createProduct({ ...body, user: userId });
  return res.send(product);
}

export async function updateProductHandler(
  req: Request<UpdateProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const update = req.body;
  const product = await findProduct({ productId });
  if (!product) return res.sendStatus(404);

  if (String(product.user) !== userId) return res.sendStatus(403);

  const updatedProduct = await findAndUpdateProduct({ productId }, update, {
    new: true,
  });
  return res.send(updatedProduct);
}

export async function getProductHandler(
  req: Request<UpdateProductInput["params"]>,
  res: Response
) {
  const productId = req.params.productId;
  const product = await findProduct({ productId });
  if (!product) return res.sendStatus(404);

  return res.send(product);
}

export async function getUserProducts(req: Request, res: Response) {
  const userId = req.params.userId;
  const userProducts = await findUserProducts({ userId });

  return res.send(userProducts);
}

export async function getAllProductHandler(req: Request, res: Response) {
  const allProducts = await findAllProducts();
  const omittedProducts = allProducts.map((product) =>
    omit(product, ["__v", "updatedAt"])
  );
  return res.send(omittedProducts);
}

export async function deleteProductHandler(
  req: Request<UpdateProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const product = await findProduct({ productId });
  if (!product) return res.sendStatus(404);

  if (String(product.user) !== userId) return res.sendStatus(403);

  await deleteProduct({ productId });
  return res.sendStatus(200);
}
