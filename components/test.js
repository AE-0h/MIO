import { useSigner, useContract } from "wagmi";
import MIOCoreJSON  from "../artifacts/contracts/MIOCore.sol/MIOCore.json";

export default async function Test() {
  // const { signer, isError, isLoading } = useSigner();
  // let mcAddr = "0x5a96707090265d624cCd4E2f58D79D484a7C7d3B" ;
  // let abi = MIOCoreJSON.abi;

  const { data: signer, isError, isLoading } = useSigner()
 
  const contract = useContract({
    address: "0x5a96707090265d624cCd4E2f58D79D484a7C7d3B",
    abi: MIOCoreJSON.abi,
    signerOrProvider: signer,
  })

  
  return (
    <div>
      <button
        onClick={() => {
          contract
            .getUser(window.ethereum.selectedAddress)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }}
      >
        Get User
      </button>
    </div>
  );
}
