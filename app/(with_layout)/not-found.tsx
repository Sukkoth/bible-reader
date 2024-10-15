import BackButton from "@/components/BackButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";

function NotFound() {
  return (
    <div>
      <BackButton />
      <Alert className='mt-5 shadow-md'>
        <ExclamationTriangleIcon className='h-4 w-4 animate-pulse' />
        <AlertTitle className='font-bold'>404!</AlertTitle>
        <AlertDescription>The requested resource is not found</AlertDescription>
      </Alert>
    </div>
  );
}

export default NotFound;
