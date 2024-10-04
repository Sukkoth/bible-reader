import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import RegisterForm from "@/components/forms/RegisterForm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Register() {
  return (
    <div className='flex flex-col h-full flex-grow items-center justify-center'>
      <Card className='mx-5 w-full bg-transparent'>
        <CardHeader>
          <CardTitle className='text-xl xxs:text-2xl xs:text-3xl'>
            Create your new account
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
        <CardContent>
          <div className='space-y-5'>
            <Button variant={"outline"} className='w-full' size='lg'>
              Google
            </Button>
          </div>
        </CardContent>
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
