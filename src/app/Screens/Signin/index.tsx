import ScreenLayout from "../layout";
import { NeynarAuthButton, SIWN_variant } from "@neynar/react";

const Signin = () => {
  return (
    <ScreenLayout>
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="mx-5 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-extralight mb-4">Connect with Farcaster for posting</h2>
        </div>
        <NeynarAuthButton variant={SIWN_variant.FARCASTER}  />
      </main>
    </ScreenLayout>
  );
};

export default Signin;
