"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { TiersEnum } from "./pricing-types";
import ModalDialog from "./ModalDialog";
import { tiers } from "./pricing-tiers";
import { useAppPreferences } from "@/app/context/AppPreferencesProvider";

export default function PriceComponent() {
    const { copy } = useAppPreferences()
    const [isOpen, setIsOpen] = useState(false)

    const localizedTiers = tiers.map((tier) => {
        if (tier.key === TiersEnum.Free) {
            return {
                ...tier,
                title: copy.pricingTiers.free.title,
                price: copy.pricingTiers.free.price,
                description: copy.pricingTiers.free.description,
                features: copy.pricingTiers.free.features,
                buttonText: copy.pricingTiers.free.buttonText,
            }
        }

        if (tier.key === TiersEnum.Edu) {
            return {
                ...tier,
                title: copy.pricingTiers.edu.title,
                price: copy.pricingTiers.edu.price,
                description: copy.pricingTiers.edu.description,
                features: copy.pricingTiers.edu.features,
                buttonText: copy.pricingTiers.edu.buttonText,
            }
        }

        return {
            ...tier,
            title: copy.pricingTiers.pro.title,
            price: copy.pricingTiers.pro.price,
            description: copy.pricingTiers.pro.description,
            features: copy.pricingTiers.pro.features,
            buttonText: copy.pricingTiers.pro.buttonText,
        }
    })

    return (
        <div className="flex max-w-5xl flex-col items-center px-6 py-24">
            <div className="flex max-w-xl flex-col text-center">
                <p className="theme-faint text-sm uppercase tracking-[0.28em]">{copy.pricing.eyebrow}</p>
                <h1 className="mt-4 text-4xl font-medium tracking-tight">{copy.pricing.title}</h1>
                <p className="theme-muted mt-4 text-sm leading-7">
                    {copy.pricing.intro}
                </p>
            </div>

            <div className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                {localizedTiers.map((tier) => (
                    <div key={tier.key} className="theme-panel rounded-[28px] p-6">
                        <div className="border-b pb-6" style={{ borderColor: "var(--border-soft)" }}>
                            <h2 className="text-2xl font-medium">{tier.title}</h2>
                            <p className="theme-muted mt-2 text-sm leading-6">{tier.description}</p>
                        </div>

                        <div className="mt-6">
                            <p className="text-4xl font-semibold tracking-tight">{tier.price}</p>
                        </div>

                        <ul className="mt-6 flex flex-col gap-3">
                            {tier.features?.map((feature: string) => (
                                <li key={feature} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                    <Icon className="shrink-0" icon="ci:check" width={22} style={{ color: "var(--accent)" }} />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8">
                            <a
                                href={tier.href}
                                onClick={(event) => {
                                    if (tier.href === "#") {
                                        event.preventDefault()
                                        setIsOpen(true)
                                    }
                                }}
                                className={`inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-medium transition ${
                                    tier.href === "#" ? "theme-button-secondary" : "theme-button-primary"
                                }`}
                            >
                                {tier.buttonText}
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <ModalDialog
                title={copy.pricing.requestProTitle}
                content={copy.pricing.requestProContent}
                confirm={copy.pricing.requestProConfirm}
                open={isOpen}
                onClose={() => {
                    setIsOpen(false)
                }}
            />
        </div>
    );
}
