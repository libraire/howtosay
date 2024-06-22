import type { Frequency, Tier } from "./pricing-types";
import { FrequencyEnum, TiersEnum } from "./pricing-types";

export const frequencies: Array<Frequency> = [
  { key: FrequencyEnum.Yearly, label: "Pay Yearly", priceSuffix: "per year" },
  { key: FrequencyEnum.Quarterly, label: "Pay Quarterly", priceSuffix: "per quarter" },
];

export const tiers: Array<Tier> = [
  {
    key: TiersEnum.Free,
    title: "Free",
    price: "Free",
    href: "#",
    featured: false,
    mostPopular: false,
    description: "For starters and hobbyists that want to try out.",
    features: ["Limited words"],
    buttonText: "Continue with Free",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  {
    key: TiersEnum.Pro,
    title: "Pro",
    description: "For advanced users who want to go further.",
    href: "#",
    mostPopular: true,
    price: {
      yearly: "$4",
      quarterly: "$1",
    },
    featured: false,
    features: [
      "Advanced vocabulary and audio",
      "Additional audio and example phrases",
      "Import and manage word book and articles",
      "All modes accessble",
    ],
    buttonText: "Comming soon",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
  {
    key: TiersEnum.Edu,
    title: "Edu Pro",
    description: "For student user with edu emails.",
    href: "#",
    mostPopular: true,
    price: {
      yearly: "$2",
      quarterly: "$1",
    },
    featured: false,
    features: [
      "Advanced vocabulary and audio",
      "Additional audio and example phrases",
      "Import and manage word book and articles",
      "All modes accessble",
    ],
    buttonText: "Comming soon",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
];
