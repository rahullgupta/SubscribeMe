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

      const user = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          subscribed: {
            push: plan,
          },
        },
      });

      return res.status(200).json(user);
    }

    // if (req.method === "DELETE") {
    //   const currentUser = await serverAuth(req, res);

    //   const { plan } = req.query;

    //   const newPlan = plan.json()

    //   const updatedFavoriteIds = without(currentUser.subscribed, plan);

    //   const updatedUser = await prismadb.user.update({
    //     where: {
    //       email: currentUser.email || "",
    //     },
    //     data: {
    //       favoriteIds: updatedFavoriteIds,
    //     },
    //   });

    //   return res.status(200).json(updatedUser);
    // }

    return res.status(405).end();
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
