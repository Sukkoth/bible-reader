"use client";

import BackButton from "@/components/BackButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { checkEmailAndRequestReset } from "./_action";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

function Page() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  function handleReset() {
    if (!email) {
      setError("Email is required");
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await checkEmailAndRequestReset(email);
      if (result.success) {
        toast({
          title: "Password Reset",
          description:
            "A password reset link has been sent to your account, check it!",
          duration: 6000,
        });
        setEmail("");
      } else {
        toast({
          title: "Failed!",
          description:
            result?.error ||
            "Could not send link to reset password, try later!",
          variant: "destructive",
        });
      }
    });
  }
  return (
    <div className=''>
      <BackButton />
      <Card className='mt-5 w-full bg-transparent'>
        <CardHeader>
          <CardTitle className='text-xl xxs:text-2xl xs:text-3xl'>
            Forgot Password
          </CardTitle>
          <CardDescription>
            Enter your email to recover your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error?.length ? (
            <p className='text-sm pb-1 text-red-400'>{error}</p>
          ) : (
            ""
          )}
          <form className='flex items-center justify-center flex-col gap-5'>
            <div className='w-full'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='email'
                name='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              type='button'
              className='w-full'
              size='lg'
              onClick={handleReset}
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Send reset link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
