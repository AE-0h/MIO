import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";

export default function Home() {
  const [randoNum, setRandoNum] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(window.ethereum.selectedAddress);
    console.log(user);
    let x = process.env.NEXT_PUBLIC_ALCHEMY_ID;
    console.log(x);
  }, [user]);

  const handleClick = async () => {
    const jsonRES = {
      jsonrpc: "2.0",
      method: "generateSignedIntegers",
      params: {
        apiKey: "1f0e21c6-97ae-4197-905a-af1821f236ed",
        n: 5,
        min: 1,
        max: 1000000000,
        base: 16,
      },
      id: 29700,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(jsonRES),
      headers: { "Content-Type": "application/json" },
    };

    let randoARR = await fetch(
      "https://api.random.org/json-rpc/4/invoke",
      options
    )
      .then((res) => res.json())
      .then((json) => json.result.random.data);

    let randoNum = await Object.values(randoARR).join("");
    setRandoNum(randoNum);
  };

  return (
    <>
      <ConnectButton />
      <button onClick={handleClick}>Click me</button>
      <p>{randoNum}</p>
    </>
  );
}
