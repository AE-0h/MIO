import { useSigner, useContract } from "wagmi";
import MIOCoreJSON from "../artifacts/contracts/MIOCore.sol/MIOCore.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export function Test() {
  let [user, setUser] = useState(``);
  let [post, setPost] = useState(``);
  let [content, setContent] = useState(``);
  let [media, setMedia] = useState(``);
  const { data: signer, isError, isLoading } = useSigner();
  const signerAddress = signer?.getAddress();
  console.log(signerAddress);

  const contract = useContract({
    address: "0x5a96707090265d624cCd4E2f58D79D484a7C7d3B",
    abi: MIOCoreJSON.abi,
    signerOrProvider: signer,
  });
  const handleClick = async () => {
    let getUser = await contract.getUser(await signerAddress, {
      gasLimit: 1000000,
    });
    let name = await getUser[0];
    let bio = await getUser[1];
    let profilePic = await getUser[2];
    let bannerPic = await getUser[3];
    let k =
      await `USERNAME: ${name}  BIO: ${bio}  PROFILE PIC: ${profilePic}  PROFILE BANNER: ${bannerPic}`;
    setUser(k);

  };
  let a = "amazing project from xp45dy";
  let b = "https://dvqlxo2m2q99q.cloudfront.net/000_clients/1044568/page/1044568GeJc1BKn.jpg"
  const handleClick2 = async () => {
    // _a = a;
    // _b = b;
    // let addPost = await contract.addPost(
    //   a,
    //   b,
    //   {
    //     value: ethers.utils.parseEther("0.01"),
    //     gasLimit: 1000000,
    //   });
    let getPost = await contract.getPost( 9 ,{
      gasLimit: 1000000,
    });
    let x = await getPost[0];
    let y = await getPost[1];
    let z = await `CONTENT: ${x}  MEDIA: ${y}`
    
    setContent(x);
    setMedia(y);
    setPost(z);
  }



  return (
    <div>
      <button onClick={handleClick}>Get User</button>
      <p>{user}</p>
      <button onClick={handleClick2}>Make a post official</button>
      <p>{post}</p>
    </div>
  );
}
