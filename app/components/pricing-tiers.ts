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
    features: ["Limited content and functionality", "Request Pro for free"],
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
      "Advanced vocabulary and audio",
      "Additional audio and example phrases",
      "Import and manage word book and articles",
      "All modes accessble",
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
      "Advanced vocabulary and audio",
      "Additional audio and example phrases",
      "Import and manage word book and articles",
      "All modes accessble",
    ],
    buttonText: "Buy License",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
];
