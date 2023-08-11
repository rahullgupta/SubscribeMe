import { NextApiRequest, NextApiResponse } from "next";

import { stripe } from "@/lib/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  try {
    const { price } = req.query;

    const amt = Number(price);
    const intent = await stripe.paymentIntents.create({
      amount: amt,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.json({ client_secret: intent.client_secret });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
