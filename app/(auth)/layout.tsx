import { Layers } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to Stack Cloud with your account",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex">
      <section className="bg-froly flex-1">
        <div className="flex items-start justify-center flex-col gap-4 max-w-125 m-auto h-full">
          <div className="flex items-center justify-center gap-3">
            <Layers className="w-10 h-10 text-white" />
            <span className="text-white font-medium text-3xl">Stack Cloud</span>
          </div>

          <div className="flex items-start gap-4 flex-col mt-8">
            <span className="font-bold text-[32px] text-white">
              Build to store, manage, and secure your files over the internet
            </span>
            <span className="text-gray-100">
              Access everywhere, anywhere and sync with{" "}
              <span className="text-white font-bold">your account</span>{" "}
              securely.
            </span>
            <Image
              src="/assets/hero-image.webp"
              alt="hero image"
              width={450}
              height={450}
              className="mt-15"
            />
          </div>
        </div>
      </section>

      <section className="bg-white flex-1">{children}</section>
    </div>
  );
};

export default Layout;
