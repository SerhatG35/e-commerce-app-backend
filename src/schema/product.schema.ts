import { object, number, string, TypeOf, boolean } from "zod";

const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    })
      .max(30, "Title can't be over 30 characters.")
      .min(3, "Title must be at least 3 characters."),
    category: string({
      required_error: "Category is required.",
    }),
    description: string({
      required_error: "Description is required.",
    })
      .max(500, "Description should be at max 500 characters long.")
      .min(10, "Description must be at least 10 characters long."),
    price: number({
      required_error: "Price is required.",
      invalid_type_error: "Price must be a number.",
    }).min(1),
    image: string({
      required_error: "Image is required.",
    }),
  }),
};

const params = {
  params: object({
    productId: string({
      required_error: "productId is required.",
    }),
  }),
};

export const createProductSchema = object({
  ...payload,
});

export const updateProductSchema = object({
  ...payload,
  ...params,
});

export const deleteProductSchema = object({
  ...params,
});

export const getProductSchema = object({
  ...params,
});

export type CreateProductInput = TypeOf<typeof createProductSchema>;
export type UpdateProductInput = TypeOf<typeof updateProductSchema>;
export type ReadProductInput = TypeOf<typeof getProductSchema>;
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>;
