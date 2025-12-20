import ForgotPassword from "./_components/ForgotPassword";

const Page = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0b0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#2c181030_0%,#0f0b0a_70%)] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="relative z-10 w-full px-4 flex justify-center">
        <ForgotPassword />
      </div>
    </div>
  );
};

export default Page;