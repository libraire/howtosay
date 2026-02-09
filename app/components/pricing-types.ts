import type {ButtonProps} from "@heroui/react";

export enum TiersEnum {
  Free = "free",
  Pro = "pro",
  Edu = "student",
}

export type Frequency = {
  label: string;
  priceSuffix: string;
};

export type Tier = {
  key: TiersEnum;
  title: string;
  price: string;
  priceSuffix?: string;
  href: string;
  description?: string;
  mostPopular?: boolean;
  featured?: boolean;
  features?: string[];
  buttonText: string;
  buttonColor?: ButtonProps["color"];
  buttonVariant: ButtonProps["variant"];
};
