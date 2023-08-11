import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Title from "@/components/Title";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";
import moment from "moment";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session: JSON.parse(JSON.stringify(session)) },
  };
}

export default function Home() {
  const { data: currentUser } = useCurrentUser();

  const router = useRouter();
  // const plan = currentUser.subscribed[0];

  const [active, setActive] = useState(true);

  const today = moment().format("MMMM Do YYYY");
  const future = "yearly"
    ? moment().add(1, "years").format("MMMM Do YYYY")
    : moment().add(1, "months").format("MMMM Do YYYY");

  const handleCancel = useCallback(() => {
    setActive((current) => !current);
  }, []);

  return (
    <div className="absolute h-full w-full bg-[#1F4D90]">
      <Title value="Subscribed" />
      <div
        onClick={() => signOut()}
        className="px-3 text-right text-white text-md cursor-pointer"
      >
        Sign out
      </div>
      <div className="managecont">
        <div className="manageholder">
          {active && (
            <div onClick={handleCancel} className="cancelbut">
              Cancel
            </div>
          )}
          <span className="h3">Current Plan Details &nbsp;</span>
          <span className={`status ${active ? "" : "cancelled"}`}>
            {active ? "Active" : "Cancelled"}
          </span>
          {/* <p className="currentname">{det.plan ? det.plan : "Cancelled"}</p> */}
          <p className="currentdevices">Phone+Tablet</p>
          <p className="currentprice">
            &#8377; {/* {plan.price ? plan.price : "Nil"} */}
            1000
            {/* {plan.type === "Yearly" ? "/yr" : "/mo"} */}
            /yr
          </p>
          <button onClick={() => router.push("/plans")} className="changebut">
            {active ? "Change Plan" : "Choose Plan"}
          </button>
          <p className="currentdate">
            Your subscription has started on {today} and will auto renew on{" "}
            {future}
          </p>
        </div>
      </div>
    </div>
  );
}
