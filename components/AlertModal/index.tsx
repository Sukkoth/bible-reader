"use client";

import { ReactNode, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  onConfirm?: () => Promise<void>;
  onCancel?: () => void;
  children: ReactNode;
  title: string;
  description: ReactNode | string;
  cancelText?: string;
  confirmText?: string;
  useConfirmButton: ReactNode;
  pendingText?: string;
  open?: boolean;
  onOpenChange?: () => void;
};
function AlertModal({
  title,
  description,
  children,
  onConfirm,
  onCancel,
  cancelText = "Cancel",
  confirmText = "Confrim",
  useConfirmButton,
  pendingText,
  open,
  onOpenChange,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    if (onConfirm)
      startTransition(async () => {
        await onConfirm();
      });
  }
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          {useConfirmButton ? (
            <Button
              className='bg-destructive hover:bg-destructive/90 min-w-32'
              onClick={handleConfirm}
            >
              {isPending
                ? pendingText ?? (
                    <span>
                      <Loader2 className='size-5 animate-spin' />
                    </span>
                  )
                : confirmText}
            </Button>
          ) : (
            <AlertDialogAction
              className='bg-destructive hover:bg-destructive/90 min-w-32'
              onClick={handleConfirm}
            >
              {isPending
                ? pendingText ?? (
                    <span>
                      <Loader2 className='size-5 animate-spin' />
                    </span>
                  )
                : confirmText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertModal;
