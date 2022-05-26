import { Request, Response } from "express";
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
  const userNameAndSurname = `${res.locals.user.name} ${res.locals.user.surname}`;
  const body = req.body;
  try {
    const product = await createProduct({
      ...body,
      user: userId,
      userNameAndSurname,
    });
    return res.send(product);
  } catch (error) {
    res.send(error);
  }
}

export async function updateProductHandler(
  req: Request<UpdateProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const update = req.body;
  const product = await findProduct(productId);
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
  const product = await findProduct(productId);
  if (!product) return res.sendStatus(404);

  return res.send(product);
}

export async function getUserProducts(req: Request, res: Response) {
  const userId = req.params.userId;
  try {
    return res.send(await findUserProducts({ userId }));
  } catch (error) {
    res.status(404).send("There are no product associated with this user id.");
  }
}

export async function getAllProductHandler(req: Request, res: Response) {
  const products = await findAllProducts(req.query);
  return res.send(products);
}

export async function deleteProductHandler(
  req: Request<UpdateProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const product = await findProduct(productId);
  if (!product) return res.sendStatus(404);

  if (String(product.user) !== userId) return res.sendStatus(403);

  await deleteProduct(productId);
  return res.sendStatus(200);
}
