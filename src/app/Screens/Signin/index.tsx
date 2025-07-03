import ScreenLayout from "../layout";
import { NeynarAuthButton, SIWN_variant } from "@neynar/react";
import Image from "next/image";

const Signin = () => {
  return (
    <ScreenLayout>
      <main className="flex-grow flex flex-col items-center justify-center gap-8">
        <div className="mx-5 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-extralight">Share your achievements with Farcaster</h2>
        </div>
        <NeynarAuthButton variant={SIWN_variant.FARCASTER}  />
        <Image
          src="/cast-example.png"
          alt="Screenshot showing Farcaster cast example"
          width={500}
          height={500}
          className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
          priority
        />
      </main>
    </ScreenLayout>
  );
};

export default Signin;
