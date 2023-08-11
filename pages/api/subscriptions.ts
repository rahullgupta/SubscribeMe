import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    const { name, price, description, type } = req.body;

    const plan = await prismadb.plan.create({
      data: {
        name,
        price,
        description,
        type,
      },
    });

    return res.status(200).json(plan);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
