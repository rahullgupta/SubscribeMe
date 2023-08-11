import React from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import getStripe from "@/lib/get-stripe";
import { useRouter } from "next/router";
import axios from "axios";

interface paymentProps extends React.InputHTMLAttributes<HTMLInputElement> {
  subscribedPlan: any;
  interval: any;
  client_secret: any;
}

const Payment: React.FC<paymentProps> = ({
  subscribedPlan,
  interval,
  client_secret,
}) => {
  const router = useRouter();
  const elements = useElements();
  const makePay = async () => {
    const stripe = await getStripe();
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (cardElement) {
      stripe
        ?.confirmCardPayment(client_secret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: "Rahul Kumar Gupta",
            },
          },
        })
        .then(async function (result) {
          if (result.paymentIntent) {
            // const interval === "year" ? "Yearly" : "Monthly";
            // const price = year ? selectedplan.yearprice : selectedplan.monthprice;
            // addSubscription(user.uid, selectedplan.name, price, billcycle);
            // setSubscribed(true);
            await axios.post("/api/subscribe", {
              plan: subscribedPlan,
            });
            router.push("/");
          }
        });
    }
  };

  return (
    <div className="absolute h-full w-full bg-[#1F4D90]">
      <div className="paymentcont">
        <div className="paymentleft">
          <h2 className="text-3xl font-bold">Complete Payment</h2>
          <span className="text-md text-gray-600">
            Enter your credit or debit card details below
          </span>
          <div className="cardelement">
            <CardElement id="card" />
          </div>
          <button className="bluebut paybut" onClick={makePay}>
            Confirm Payment
          </button>
        </div>
        <div className="paymentright">
          <h3 className="text-xl font-bold">Order Summary</h3>
          <div className="">
            <ul className="buydetailslist">
              <li className="buydetailsitem border-b border-b-gray-400">
                <span className="text-sm">Plan Name</span>
                <span className="detailsdesc font-semibold">
                  {subscribedPlan.name}
                </span>
              </li>
              <li className="buydetailsitem border-b border-b-gray-400">
                <span className="text-sm">Billing Cycle</span>
                <span className="detailsdesc font-semibold">
                  {interval === "year" ? "Yearly" : "Monthly"}
                </span>
              </li>
              <li className="buydetailsitem border-b border-b-gray-400">
                <span className="text-sm">Plan Price</span>
                <span className="detailsdesc font-semibold">
                  &#8377; {subscribedPlan.price}/
                  {interval === "year" ? "yr" : "mo"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
