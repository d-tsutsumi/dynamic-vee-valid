import { AnyObject } from "yup/lib/types";
import * as yup from "yup";

interface ValidBaseShema {
  name: yup.StringSchema<string | undefined, AnyObject>;
  confirm_password: yup.StringSchema<string | undefined, AnyObject>;
  email: yup.StringSchema<string | undefined, AnyObject>;
  password: yup.StringSchema<string | undefined, AnyObject>;
}

export interface RegistShema extends ValidBaseShema {
  [key: string]: yup.StringSchema<string | undefined, AnyObject>;
}

export interface AddValid {
  [key: string]:
    | yup.StringSchema<string | undefined, AnyObject>
    | yup.NumberSchema<number | undefined, AnyObject>;
}

type BaseValid = {
  name?: boolean;
  confirm_password?: boolean;
  password?: boolean;
  email?: boolean;
};


let addValid: AddValid = {}
export function getValidationShema(
  { name = true, confirm_password = true, password = true, email = true }: BaseValid,
  dynamicForms?: AddValid
): RegistShema {
  const shema = {
    name: name ? yup.string().required() : yup.string().optional(),
    email: email ? yup.string().email().required() : yup.string().optional(),
    password: password
      ? yup.string().min(6).required()
      : yup.string().optional(),
    confirm_password: confirm_password
      ? yup
          .string()
          .required()
          .oneOf([yup.ref("password")], "Passwords do not match")
      : yup.string().optional(),
  };

  if (!dynamicForms) return shema;

  addValid = {...addValid, ...dynamicForms }
  return { ...shema, ...addValid };
}
