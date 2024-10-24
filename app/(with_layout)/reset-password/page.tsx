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
import { resetPassword } from "./_action";
import { Button } from "@/components/ui/button";

function Page() {
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  function handleReset() {
    if (!password) {
      setError("Password is required");
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await resetPassword(password);
      if (result?.error) {
        setError(result?.error || "Something Went Wrong");
      }
    });
  }
  return (
    <div className=''>
      <BackButton />
      <Card className='mt-5 w-full bg-transparent'>
        <CardHeader>
          <CardTitle className='text-xl xxs:text-2xl xs:text-3xl'>
            Reset Password
          </CardTitle>
          <CardDescription>Enter your new secure password</CardDescription>
        </CardHeader>
        <CardContent>
          {error?.length ? (
            <p className='text-sm pb-1 text-red-400'>{error}</p>
          ) : (
            ""
          )}
          <div className='flex items-center justify-center flex-col gap-5'>
            <div className='w-full'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='password'
                name='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type='button'
              className='w-full'
              size='lg'
              onClick={handleReset}
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Change Password"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
