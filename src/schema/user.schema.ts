import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    })
      .min(3)
      .max(20),
    surname: string({
      required_error: "Surname is required",
    })
      .min(3)
      .max(20),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
    passwordConfirmation: string({
      required_error: "Password Confirmation is required",
    }),
    city: string({ required_error: "City is required" }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const updateUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    surname: string({
      required_error: "Surname is required",
    }),
    city: string({ required_error: "City is required" }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }),
  params: object({
    userId: string({
      required_error: "userId is required",
    }),
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
