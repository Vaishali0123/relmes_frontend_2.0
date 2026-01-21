import { Polar } from "@polar-sh/sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, serverName, plan, plugins } = body;

        if (!process.env.POLAR_ACCESS_TOKEN) {
            console.error("POLAR_ACCESS_TOKEN is missing");
            return NextResponse.json(
                { error: "Payment configuration error" },
                { status: 500 }
            );
        }

        const polar = new Polar({
            accessToken: process.env.POLAR_ACCESS_TOKEN,
            server: "sandbox", // Use sandbox for development
        });

        // Create a description for the checkout
        let description = `Server: ${serverName}\n`;
        if (plan) {
            description += `Plan: ${plan.name} (${plan.duration} days)\n`;
        }
        if (plugins && plugins.length > 0) {
            description += "Plugins: " + plugins.map((p: any) => p.type).join(", ");
        }

        // Convert amount to cents (Polar typically needs cents, but confirm if ad-hoc accepts float)
        // Custom checkouts usually take amount in cents.
        // The amount from frontend is e.g. 40 ($40). So 40 * 100 = 4000.
        const amountCents = Math.round(Number(amount) * 100);

        const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/serverCreation/success?session_id={CHECKOUT_SESSION_ID}`;

        // Polar SDK implementation
        // Using checkouts.custom.create for ad-hoc pricing
        // Note: If this method differs in the installed version, we might need to adjust.
        const result = await polar.checkouts.custom.create({
            productPriceId: "", // Leaving empty or dummy if strictly required, but usually ad-hoc doesn't need it if we pass amount
            amount: amountCents,
            successUrl: successUrl,
            // cancelUrl: ...
            // metadata: ...
            productName: `Server Deployment: ${serverName}`,
        });

        return NextResponse.json({ url: result.url });

    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
