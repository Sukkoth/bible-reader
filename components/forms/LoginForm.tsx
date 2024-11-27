'use client';
import { login } from '@/actions';
import { CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { ZodError } from 'zod';
import SubmitButton from '../SubmitButton';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type InitType = {
  message?: string | null;
  formErrors?: ReturnType<ZodError['flatten']>;
};
const initialState: InitType = {
  message: null,
};

function LoginForm() {
  const [state, formAction] = useFormState(login, initialState);

  const fieldErrors = state?.formErrors?.fieldErrors;

  return (
    <CardContent>
      {state?.message && <p className="text-sm pb-1 text-red-400">{state?.message}</p>}
      <form className="flex items-center justify-center flex-col gap-5" action={formAction}>
        <div className="w-full">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email" name="email" />
          {fieldErrors?.password && (
            <span className="text-red-400 text-xs">{fieldErrors?.email?.[0] as string}</span>
          )}
        </div>
        <div className="w-full">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="password" name="password" />
          {fieldErrors?.password && (
            <span className="text-red-400 text-xs">{fieldErrors?.password?.[0] as string}</span>
          )}
        </div>
        <div className="text-end w-full">
          <Link href="/forgot-password" className="text-end text-xs hover:underline">
            Forgot Password?
          </Link>
        </div>
        <SubmitButton type="submit" className="w-full" size="lg" pendingText="Loging in . . .">
          Login
        </SubmitButton>
      </form>
    </CardContent>
  );
}

export default LoginForm;
