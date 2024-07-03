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
    description: "For starters and hobbyists that want to try out.",
    features: ["Limited words everyday", "No advanced features", "Request Pro for free"],
    buttonText: "Request Pro",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  {
    key: TiersEnum.Pro,
    title: "Pro",
    description: "For advanced users who want to go further.",
    href: "https://panlover3.gumroad.com/l/wgexm",
    mostPopular: true,
    price: "$4",
    featured: false,
    features: [
      "All modes unlocked",
      "Advanced vocabulary and audio",
      "More sentences and examples",
      "Manage your own word book",
    ],
    buttonText: "Buy License",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
  {
    key: TiersEnum.Edu,
    title: "Edu Pro",
    description: "For student user with edu emails.",
    href: "https://panlover3.gumroad.com/l/wgexm",
    mostPopular: true,
    price: "$2",
    featured: false,
    features: [
      "All modes unlocked",
      "Advanced vocabulary and audio",
      "More sentences and examples",
      "Manage your own word book",
    ],
    buttonText: "Buy License",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
];
