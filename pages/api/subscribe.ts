import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const currentUser = await serverAuth(req, res);

      const { plan } = req.body;

      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          subscribed: [],
        },
      });

      const user = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          subscribed: {
            push: {
              name: plan.name,
              price: plan.price,
              description: plan.description,
              type: plan.type,
              active: true,
              subscribedAt: Date().toString(),
              cancelledAt: "",
            },
          },
        },
      });

      return res.status(200).json(user);
    }

    if (req.method === "DELETE") {
      const currentUser = await serverAuth(req, res);

      const user = await prismadb.user.findUnique({
        where: {
          email: currentUser.email || "",
        },
      });

      const plan = JSON.parse(JSON.stringify(user?.subscribed[0]));

      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          subscribed: {
            set: [
              {
                name: plan.name,
                price: plan.price,
                description: plan.description,
                type: plan.type,
                active: false,
                subscribedAt: "",
                cancelledAt: Date().toString(),
              },
            ],
          },
        },
      });

      return res.status(200).json(updatedUser);
    }

    return res.status(405).end();
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
