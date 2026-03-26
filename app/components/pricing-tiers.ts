import type { Frequency, Tier } from "./pricing-types";
import { TiersEnum } from "./pricing-types";

export const tiers: Array<Tier> = [
  {
    key: TiersEnum.Free,
    title: "Free",
    price: "Free",
    href: "#",
    featured: false,
    mostPopular: false,
    description: "For evaluation and light daily practice.",
    features: ["Daily usage limits", "Core learning modes", "Request Pro access"],
    buttonText: "Request Pro",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  {
    key: TiersEnum.Pro,
    title: "Pro",
    description: "For committed learners who want the full product.",
    href: "https://panlover3.gumroad.com/l/wgexm",
    mostPopular: true,
    price: "$4/year",
    featured: false,
    features: [
      "All learning modes unlocked",
      "Advanced vocabulary and audio support",
      "Richer sentence and example coverage",
      "Full word book management",
    ],
    buttonText: "Buy License",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
  {
    key: TiersEnum.Edu,
    title: "Edu Pro",
    description: "For students with verified educational email access.",
    href: "https://panlover3.gumroad.com/l/wgexm",
    mostPopular: true,
    price: "$2/year",
    featured: false,
    features: [
      "All learning modes unlocked",
      "Advanced vocabulary and audio support",
      "Richer sentence and example coverage",
      "Full word book management",
    ],
    buttonText: "Buy License",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
];
