"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for trying out our platform.",
        features: [
            "Job Postings (3/mo)",
            "Basic AI Screening",
            "Candidate Dashboard",
            "Email Support"
        ],
        buttonText: "Get Started",
        link: "/signup",
        popular: false
    },
    {
        name: "Pro",
        price: "$49",
        description: "For growing teams and startups.",
        features: [
            "Unlimited Job Postings",
            "Advanced AI Matching",
            "Code Assessment Integration",
            "Priority Support",
            "Team Collaboration"
        ],
        buttonText: "Upgrade to Pro",
        link: "/signup?plan=pro",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Scalable solutions for large organizations.",
        features: [
            "Custom AI Models",
            "Dedicated Account Manager",
            "SSO & Advanced Security",
            "API Access",
            "Audit Logs"
        ],
        buttonText: "Contact Sales",
        link: "mailto:sales@hireai.com",
        popular: false
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-gray-50 dark:bg-black/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
                    >
                        Simple, Transparent Pricing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Choose the plan that best fits your hiring needs. No hidden fees.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className={`h-full flex flex-col relative ${plan.popular ? 'border-blue-500 shadow-xl shadow-blue-500/10' : ''}`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-gray-500 ml-2">/month</span>
                                    </div>
                                    <p className="text-gray-500 mt-2">{plan.description}</p>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Link href={plan.link} className="w-full">
                                        <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                                            {plan.buttonText}
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
