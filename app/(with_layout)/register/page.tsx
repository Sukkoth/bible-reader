import Link from "next/link";
import React from "react";
import RegisterForm from "@/components/forms/RegisterForm";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SocialAuth from "@/components/SocialAuth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bible Reader | Register",
  description: "Register now and embark on your bible reading plan journey.",
};

function Register() {
  return (
    <div className='flex flex-col h-full flex-grow items-center justify-center w-full max-w-[700px] mx-auto'>
      <Card className='mx-5 w-full bg-transparent'>
        <CardHeader>
          <CardTitle className='text-xl xxs:text-2xl xs:text-3xl'>
            Create new account
          </CardTitle>
          <CardDescription>
            Enter your email to create your account
          </CardDescription>
        </CardHeader>
        <RegisterForm />
      </Card>
      <Card className='mx-5 w-full mt-10 bg-transparent'>
        <CardHeader>
          <CardDescription className='text-center'>
            ----------- OR CONTINUE WITH -----------
          </CardDescription>
        </CardHeader>
        <SocialAuth />
      </Card>
      <p className='pt-5 text-sm'>
        Already have an account?{" "}
        <Link href='/login' className='text-primary underline'>
          Login
        </Link>
      </p>
    </div>
  );
}

export default Register;
