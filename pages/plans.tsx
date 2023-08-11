import Title from "@/components/Title";
import useCurrentUser from "@/hooks/useCurrentUser";
import usePlanList from "@/hooks/usePlanList";
import getStripe from "@/lib/get-stripe";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { NextPageContext } from "next";
import { getSession, signOut } from "next-auth/react";
import { useCallback, useState } from "react";
import { VscTriangleDown } from "react-icons/vsc";
import Payment from "./payment";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

const stripePromise = getStripe();

const Plans = () => {
  const [plan, setPlan] = useState("Plan1");
  const [monthly, setMonthly] = useState(true);

  const [subscribed, setSubscribed] = useState([]);

  const [cc, setCC] = useState();

  const [pay, setPay] = useState(false);

  const { data: plans = [] } = usePlanList();
  console.log(plans);

  const choosePlan1 = useCallback(() => {
    setPlan("Plan1");
  }, []);

  const choosePlan2 = useCallback(() => {
    setPlan("Plan2");
  }, []);

  const choosePlan3 = useCallback(() => {
    setPlan("Plan3");
  }, []);

  const choosePlan4 = useCallback(() => {
    setPlan("Plan4");
  }, []);

  const toggleMonthly = useCallback(() => {
    setMonthly((current) => !current);
  }, []);

  const createCheckOut = async (subscribedPlan: any) => {
    const stripe = await stripePromise;
    const response = await axios.get(`/api/plans/${subscribedPlan.price}`);
    const { client_secret } = await response.data;
    setCC(client_secret);
    setSubscribed(subscribedPlan);
  };

  const handleSubscription = () => {
    if (plan === "Plan1") {
      if (monthly) createCheckOut(plans[0]);
      else createCheckOut(plans[4]);
    } else if (plan === "Plan2") {
      if (monthly) createCheckOut(plans[1]);
      else createCheckOut(plans[5]);
    } else if (plan === "Plan3") {
      if (monthly) createCheckOut(plans[2]);
      else createCheckOut(plans[6]);
    } else {
      if (monthly) createCheckOut(plans[3]);
      else createCheckOut(plans[7]);
    }
    console.log(subscribed);
    setPay(true);
  };

  return (
    <>
      <div
        onClick={() => signOut()}
        className="px-3 text-right text-white text-md"
      >
        Sign out
      </div>
      <Elements stripe={stripePromise}>
        {pay ? (
          <Payment
            subscribedPlan={subscribed}
            interval={monthly ? "month" : "year"}
            client_secret={cc}
          />
        ) : (
          <div className="absolute h-full w-full">
            <Title value="Plans" />
            <div className="h-screen flex justify-center items-center">
              <div className="bg-white px-10 py-10 self-center mt-2 w-3/5">
                <div className="text-black text-3xl mb-9 text-center font-semibold">
                  <h1>Choose the right plan for you</h1>
                </div>
                <div className="">
                  <table className="flex flex-col border-collapse">
                    <tbody className="flex flex-col align-middle text-gray-500">
                      <tr className="flex text-md">
                        <td className="w-[40%] flex flex-col items-center justify-center">
                          <div className="flex bg-[#1F4D90] py-3 text-white rounded-full w-3/5 transition font-medium ">
                            <span className=" text-white rounded-full w-1/12 text-center"></span>
                            <span
                              className={`${
                                monthly ? "bg-[#fff] text-[#1F4D90]" : ""
                              }  py-3 rounded-full w-5/12 text-center cursor-pointer`}
                              onClick={monthly ? () => {} : toggleMonthly}
                            >
                              Monthly
                            </span>
                            <span
                              className={`${
                                !monthly ? "bg-[#fff] text-[#1F4D90]" : ""
                              }  py-3 rounded-full w-5/12 text-center cursor-pointer`}
                              onClick={monthly ? toggleMonthly : () => {}}
                            >
                              Yearly
                            </span>
                            <span className=" text-white rounded-full w-1/12 text-center"></span>
                          </div>
                        </td>
                        <td className="w-[15%] py-5">
                          <button
                            className={`h-[100px] w-[100px] bg-[#1F4D90] ${
                              plan === "Plan1" ? "" : "opacity-50"
                            } text-white flex flex-col items-center justify-center mx-auto cursor-default`}
                            onClick={choosePlan1}
                          >
                            Mobile
                          </button>
                          {plan === "Plan1" && (
                            <VscTriangleDown
                              className="text-[#1F4D90] flex flex-col items-center justify-center mx-auto -mt-2"
                              size={23}
                            />
                          )}
                        </td>
                        <td className="w-[15%] py-5">
                          <button
                            className={`h-[100px] w-[100px] bg-[#1F4D90] ${
                              plan === "Plan2" ? "" : "opacity-60"
                            } text-white flex flex-col items-center justify-center mx-auto cursor-default`}
                            onClick={choosePlan2}
                          >
                            Basic
                          </button>
                          {plan === "Plan2" && (
                            <VscTriangleDown
                              className="text-[#1F4D90] flex flex-col items-center justify-center mx-auto -mt-2"
                              size={23}
                            />
                          )}
                        </td>
                        <td className="w-[15%] py-5">
                          <button
                            className={`h-[100px] w-[100px] bg-[#1F4D90] ${
                              plan === "Plan3" ? "" : "opacity-60"
                            } text-white flex flex-col items-center justify-center mx-auto cursor-default`}
                            onClick={choosePlan3}
                          >
                            Standard
                          </button>
                          {plan === "Plan3" && (
                            <VscTriangleDown
                              className="text-[#1F4D90] flex flex-col items-center justify-center mx-auto -mt-2"
                              size={23}
                            />
                          )}
                        </td>
                        <td className="w-[15%] py-5">
                          <button
                            className={`h-[100px] w-[100px] bg-[#1F4D90] ${
                              plan === "Plan4" ? "" : "opacity-60"
                            } text-white flex flex-col items-center justify-center mx-auto cursor-default`}
                            onClick={choosePlan4}
                          >
                            Premium
                          </button>
                          {plan === "Plan4" && (
                            <VscTriangleDown
                              className="text-[#1F4D90] flex flex-col items-center justify-center mx-auto -mt-2"
                              size={23}
                            />
                          )}
                        </td>
                      </tr>

                      <tr className="flex border-b min-h-[50px] border-b-neutral-300">
                        <td className="w-[40%] py-[12px] px-[16px]">
                          Monthly price
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan1"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          &#8377; {monthly ? 100 : 1000}
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan2"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          &#8377; {monthly ? 200 : 2000}
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan3"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          &#8377; {monthly ? 500 : 5000}
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan4"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          &#8377; {monthly ? 700 : 7000}
                        </td>
                      </tr>
                      <tr className="flex border-b min-h-[50px] border-b-neutral-300">
                        <td className="w-[40%] py-[12px] px-[16px]">
                          Video quality
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan1"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Good
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan2"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Good
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan3"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Better
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan4"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Best
                        </td>
                      </tr>
                      <tr className="flex border-b min-h-[50px] border-b-neutral-300">
                        <td className="w-[40%] py-[12px] px-[16px]">
                          Resolution
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan1"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          480p
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan2"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          480p
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan3"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          1080p
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan4"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          4K+HDR
                        </td>
                      </tr>
                      <tr className="flex min-h-[50px]">
                        <td className="w-[40%] py-[12px] px-[16px]">
                          Devices you can use to watch
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan1"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Phone
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan2"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Phone
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan3"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Phone
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan4"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Phone
                        </td>
                      </tr>
                      <tr className="flex min-h-[50px]">
                        <td className="w-[40%] py-[12px] px-[16px]"></td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan1"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Tablet
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan2"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Tablet
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan3"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Tablet
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan4"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Tablet
                        </td>
                      </tr>
                      <tr className="flex min-h-[50px]">
                        <td className="w-[40%] py-[12px] px-[16px]"></td>
                        <td className={`w-[15%] py-[12px] px-[16px]`}></td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan2"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Computer
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan3"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Computer
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan4"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          Computer
                        </td>
                      </tr>
                      <tr className="flex min-h-[50px]">
                        <td className="w-[40%] py-[12px] px-[16px]"></td>
                        <td className={`w-[15%] py-[12px] px-[16px]`}></td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan2"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          TV
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan3"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          TV
                        </td>
                        <td
                          className={`w-[15%] py-[12px] px-[16px] text-center ${
                            plan === "Plan4"
                              ? "text-[#1F4D90] font-semibold"
                              : ""
                          }`}
                        >
                          TV
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <button
                    className="bg-[#1F4D90] py-3 text-white rounded-sm w-2/5 text-xl mt-5 transition"
                    onClick={handleSubscription}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Elements>
    </>
  );
};

export default Plans;
