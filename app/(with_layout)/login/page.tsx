import Link from "next/link";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import LoginForm from "@/components/forms/LoginForm";
import SocialAuth from "@/components/SocialAuth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function Login() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!error && data.user.id) {
    return redirect("/home");
  }

  return (
    <div className='flex flex-col h-full flex-grow items-center justify-center'>
      <Card className='mx-5 w-full bg-transparent'>
        <CardHeader>
          <CardTitle className='text-xl xxs:text-2xl xs:text-3xl'>
            Login to your account
          </CardTitle>
          <CardDescription>
            Enter your email to login to your account
          </CardDescription>
        </CardHeader>
        <LoginForm />
      </Card>
      <Card className='mx-5 w-full mt-10 bg-transparent'>
        <CardHeader>
          <CardDescription className='text-center'>
            ----------- OR CONTINUE WITH -----------
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <SocialAuth provider='google' iconPath='/google-icon.svg' />
            <SocialAuth provider='github' iconPath='/github-icon.svg' />
          </div>
        </CardContent>
      </Card>
      <p className='pt-5 text-sm'>
        Don&apos;t have an account?{" "}
        <Link href='/register' className='text-primary underline'>
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;
