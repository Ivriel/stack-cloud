"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import CustomInput from "./CustomInput";
import { Mail, UserRoundPen, UserRoundPenIcon } from "lucide-react";
import ButtonWithLoading from "./ButtonWithLoading";
import { isValidEmail } from "@/lib/utils";
import { createAccount, signInUser } from "@/lib/appwrite/user.actions";
import { Span } from "next/dist/trace";
import OTPModal from "./OTPModal";

const Auth = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    registerEmail: "",
  });
  const [email, setEmail] = useState("");
  const [tabValue, setTabValue] = useState("signIn"); // biar waktu halaman ke render , tab sign in yang ditampilkan duluan biar ada tab yang langsung kepilih
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId,setAccountId] = useState("");

  const handleTabValueChange = (value: string) => {
    setTabValue(value);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleContinueClick = async () => {
    const { fullName, registerEmail } = formData || {};

    if (!fullName && tabValue == "signUp") {
      setErrorMessage("Full name is required");
      return;
    }

    if(!isValidEmail(registerEmail) && !isValidEmail(email)) {
      setErrorMessage("Invalid Email")
    }

    try {
      setLoading(true);
      const user = tabValue === 'signIn' ? await signInUser(email) : await createAccount({fullName,email:registerEmail})
      if(user.accountId) {
        setAccountId(user.accountId)
      }
      setErrorMessage(user.message)
    } catch (error) {
      setErrorMessage("Sign in Failed. Please try again in sometime")
      console.error("Sign")
    } finally {
      setLoading(false)
    }
  };

  console.log("print:",{accountId,errorMessage})

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center">
        <span className="font-bold text-3xl">Welcome Back</span>
        <span className="text-gray-500 mt-1">
          Welcome Back, please enter your details
        </span>
        <Tabs
          defaultValue={tabValue}
          className="mt-6"
          onValueChange={handleTabValueChange}
        >
          <TabsList className="w-100 min-h-12.5">
            {/* pemicu */}
            <TabsTrigger value="signIn" className="font-medium cursor-pointer">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signUp" className="font-medium cursor-pointer">
              Sign Up
            </TabsTrigger>
          </TabsList>
          {/* konten yang terpicu*/}
          <TabsContent value="signIn">
            <div className="flex flex-col gap-4 mt-6">
              <CustomInput
                Icon={UserRoundPen}
                labelTitle="Email"
                labelHtmlFor="email"
                value={email}
                onChange={handleEmailChange}
                inputName="email"
              />
            </div>
          </TabsContent>
          <TabsContent value="signUp">
            <div className="flex flex-col gap-4 mt-6">
              <CustomInput
                Icon={UserRoundPenIcon}
                labelTitle="Full Name"
                labelHtmlFor="fullName"
                value={formData.fullName}
                onChange={handleChange}
                inputName="fullName"
              />
              <CustomInput
                Icon={Mail}
                labelTitle="Email"
                labelHtmlFor="registerEmail"
                value={formData.registerEmail}
                onChange={handleChange}
                inputName="registerEmail"
              />
            </div>
          </TabsContent>
        </Tabs>
        <ButtonWithLoading loading={loading} onClick={handleContinueClick} />
        {errorMessage ? <span className="bg-froly/10 font-medium py-4 px-8 text-froly rounded-xl flex w-full items-center justify-center mt-8">*{errorMessage}</span> : null}
      </div>

{/* account id ada = user berhasil sign in/ sign up */}
      {accountId ?
       <OTPModal accountId={accountId} email={tabValue === 'signIn' ? email : formData.registerEmail}/>
         : null} 
    </div>
  );
};

export default Auth;
