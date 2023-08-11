import Head from "next/head";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

const Title: React.FC<InputProps> = ({ value }) => {
  return (
    <Head>
      <title>{value}</title>
    </Head>
  );
};

export default Title;
