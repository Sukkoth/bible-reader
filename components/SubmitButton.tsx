"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./ui/button";

type Props = {
  children: string;
  pendingText?: string;
};

function SubmitButton({
  children,
  pendingText,
  ...props
}: Props & ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} {...props}>
      {(pending && pendingText) || children}
    </Button>
  );
}

export default SubmitButton;
