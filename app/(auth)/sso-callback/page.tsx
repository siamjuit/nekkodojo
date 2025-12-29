import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

const page = () => {
  return (
    <>
      <div id="clerk-captcha" className="self-center" />
      <AuthenticateWithRedirectCallback />
    </>
  );
};

export default page;
