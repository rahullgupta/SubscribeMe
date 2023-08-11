import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Title from "@/components/Title";
import useCurrentUser from "@/hooks/useCurrentUser";
import moment from "moment";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import prismadb from "@/lib/prismadb";
import axios from "axios";

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  } else {
    if (session.user?.email) {
      const user = await prismadb.user.findUnique({
        where: {
          email: session.user?.email,
        },
      });
      if (user?.subscribed.length == 0) {
        return {
          redirect: {
            destination: "/plans",
            permanent: false,
          },
        };
      }
    }
  }

  return {
    props: { session: JSON.parse(JSON.stringify(session)) },
  };
}

export default function Home() {
  const { data: currentUser } = useCurrentUser();

  const router = useRouter();
  const plan = currentUser ? currentUser.subscribed[0] : [];

  const handleCancel = useCallback(() => {
    axios.delete("/api/subscribe");
  }, []);

  return (
    <div className="absolute h-full w-full bg-[#1F4D90]">
      <Title value="Subscribed" />
      {plan && (
        <>
          <div
            onClick={() => signOut()}
            className="px-3 text-right text-white text-md cursor-pointer"
          >
            Sign out
          </div>
          <div className="managecont">
            <div className="manageholder">
              {plan.active && (
                <div onClick={handleCancel} className="cancelbut">
                  Cancel
                </div>
              )}
              <span className="text-[1.4em] font-medium">
                Current Plan Details &nbsp;
              </span>
              <span className={`status ${plan.active ? "" : "cancelled"}`}>
                {plan.active ? "Active" : "Cancelled"}
              </span>
              <p className="pt-4 text-[1.1em] font-medium">{plan.name}</p>
              <p className="text-[0.8em] text-gray-500">{plan.description}</p>
              <p className="text-3xl font-bold py-2">
                &#8377; {plan.price ? plan.price : ""}
                <span className="text-[0.8em] font-normal">
                  {plan.type === "Yearly" ? "/yr" : "/mo"}
                </span>
              </p>
              <button
                onClick={() => router.push("/plans")}
                className="changebut"
              >
                {plan.active ? "Change Plan" : "Choose Plan"}
              </button>
              <p className="mt-4 p-2 bg-[#F6F5F7]">
                {plan.active
                  ? `Your subscription has started on ${moment(
                      plan.subscribedAt
                    ).format("MMMM Do, YYYY")} and will auto renew on ${
                      plan.type === "yearly"
                        ? moment(plan.subscribedAt)
                            .add(1, "years")
                            .format("MMMM Do, YYYY")
                        : moment(plan.subscribedAt)
                            .add(1, "months")
                            .format("MMMM Do, YYYY")
                    }`
                  : `Your subscription was cancelled on ${moment(
                      plan.cancelledAt
                    ).format(
                      "MMMM Do, YYYY"
                    )} and you will lose access to all services on ${
                      plan.type === "yearly"
                        ? moment(plan.cancelledAt)
                            .add(1, "years")
                            .format("MMMM Do, YYYY")
                        : moment(plan.cancelledAt)
                            .add(1, "months")
                            .format("MMMM Do, YYYY")
                    }`}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
