import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

const page = () => {
  return (
    <>
      <AuthenticateWithRedirectCallback />
    </>
  );
};

export default page;
