"use client";
import { register } from "@/actions";
import { CardContent } from "@/components/ui/card";
import { useFormState } from "react-dom";
import { ZodError } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import SubmitButton from "../SubmitButton";

type InitType = {
  message?: string | null;
  formErrors?: ReturnType<ZodError["flatten"]>;
};
const initialState: InitType = {
  message: null,
};

function RegisterForm() {
  const [state, formAction] = useFormState(register, initialState);

  const fieldErrors = state?.formErrors?.fieldErrors;

  return (
    <CardContent>
      {state?.message && (
        <p className='text-sm pb-1 text-red-400'>{state?.message}</p>
      )}
      <form
        className='flex items-center justify-center flex-col gap-5'
        action={formAction}
      >
        <div className='w-full'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' type='email' placeholder='email' name='email' />
          {fieldErrors?.password && (
            <span className='text-red-400 text-xs'>
              {fieldErrors?.email?.[0] as string}
            </span>
          )}
        </div>
        <div className='w-full'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            placeholder='password'
            name='password'
          />
          {fieldErrors?.password && (
            <span className='text-red-400 text-xs'>
              {fieldErrors?.password?.[0] as string}
            </span>
          )}
        </div>
        <div className='text-end w-full'>
          <Link
            href='/forgot-password'
            className='text-end text-xs hover:underline'
          >
            Forgot Password?
          </Link>
        </div>
        <SubmitButton
          type='submit'
          className='w-full'
          size='lg'
          pendingText='Registering . . .'
        >
          Register
        </SubmitButton>
      </form>
    </CardContent>
  );
}

export default RegisterForm;
