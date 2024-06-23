"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Link,
    Spacer,
} from "@nextui-org/react";

import { tiers } from "./pricing-tiers";
import ModalDialog from "./ModalDialog"

export default function Component() {

    const [isOpen, setIsOpen] = useState(false)

    const handleEmailClick = (e: any) => {
        setIsOpen(true)
    };

    return (
        <div className="flex max-w-4xl flex-col items-center py-24">
            <div className="flex max-w-xl flex-col text-center">
                <h2 className="font-medium text-indigo-600">Pricing</h2>
                <h1 className="text-4xl font-medium tracking-tight">Get unlimited access.</h1>
                <Spacer y={4} />
            </div>
            <Spacer y={8} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                {tiers.map((tier) => (
                    <Card key={tier.key} className="p-3 bg-[#17171A]" shadow="md">
                        <CardHeader className="flex flex-col items-start gap-2 pb-6">
                            <h2 className="text-large font-medium">{tier.title}</h2>
                            <p className="text-medium text-default-500">{tier.description}</p>
                        </CardHeader>
                        <Divider />
                        <CardBody className="gap-8">
                            <p className="flex items-baseline gap-1 pt-2">
                                <span className="inline bg-gradient-to-br from-foreground to-foreground-600 bg-clip-text text-4xl font-semibold leading-7 tracking-tight ">
                                    {tier.price}
                                </span>
                            </p>
                            <ul className="flex flex-col gap-2">
                                {tier.features?.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Icon className="text-indigo-600" icon="ci:check" width={24} />
                                        <p className="text-default-500">{feature}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                        <CardFooter>
                            <Button
                                fullWidth
                                as={Link}
                                href={tier.href}
                                onClick={(e) => {
                                    if (tier.href == "#") {
                                        handleEmailClick(e)
                                    }
                                }}
                                className="bg-indigo-600 rounded-lg"
                            >
                                {tier.buttonText}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <Spacer y={12} />
            <ModalDialog
                title="Request Pro"
                content="Please send an email to bytegush@hotmail.com with your reason."
                confirm="Go Back"
                open={isOpen}
                onClose={() => {
                    setIsOpen(false)
                }} />
        </div>
    );
}
