import Input from "@/components/Input";
import { SetStateAction, useCallback, useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import Title from "@/components/Title";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session: JSON.parse(JSON.stringify(session)) },
  };
}

const Auth = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [variant, setVariant] = useState("login");

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  }, []);

  const login = useCallback(async () => {
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } catch (error) {
      console.log(error);
    }
  }, [email, password]);

  const register = useCallback(async () => {
    try {
      await axios.post("/api/register", {
        email,
        name,
        password,
        subscribed: [],
      });
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/plans",
      });
    } catch (error) {
      console.log(error);
    }
  }, [email, name, password]);

  return (
    <div className="absolute h-full w-full bg-[#1F4D90]">
      <Title value={variant !== "login" ? "Sign Up" : "Login"} />
      <div className="h-screen flex justify-center items-center font-semibold">
        <div className="bg-white px-10 py-10 self-center mt-2 w-2/5 max-w-md rounded-3xl">
          <h2 className="text-black text-xl mb-8 text-center">
            {variant === "login"
              ? "Login to your account"
              : "Create an account"}
          </h2>
          <div className="flex flex-col gap-4">
            {variant === "register" && (
              <Input
                label="Username"
                onChange={(e: {
                  target: { value: SetStateAction<string> };
                }) => {
                  setName(e.target.value);
                }}
                id="name"
                type=""
                value={name}
              />
            )}
            <Input
              label="Email"
              onChange={(e: { target: { value: SetStateAction<string> } }) => {
                setEmail(e.target.value);
              }}
              id="email"
              type="email"
              value={email}
            />
            <Input
              label="Password"
              onChange={(e: { target: { value: SetStateAction<string> } }) => {
                setPassword(e.target.value);
              }}
              id="password"
              type="password"
              value={password}
            />
            <div className="block">
              <label className="inline-flex items-center">
                <input type="checkbox" className="w-4 h-4" />
                <span className="ml-3 text-sm">Remember Me</span>
              </label>
            </div>
          </div>
          <button
            onClick={variant === "login" ? login : register}
            className="bg-[#1F4D90] py-3 text-white rounded-md w-full mt-10 transition"
          >
            {variant === "login" ? "Login" : "Sign Up"}
          </button>
          <p className="text-black mt-12 text-center">
            {variant === "login" ? "New to MyApp?" : "Already have an account?"}
            <span
              onClick={toggleVariant}
              className=" text-[#3966aa] ml-1 hover:underline cursor-pointer"
            >
              {variant === "login" ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
