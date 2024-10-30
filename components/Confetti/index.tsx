"use client";
import { useWindowSize } from "react-use";
type Props = {
  planId: string;
  progress: number;
  target: number;
};

import React, { useState, useEffect, useCallback } from "react";
import ReactConfetti from "react-confetti";
import { markPlanAsComplete } from "@/actions";
import { toast } from "@/hooks/use-toast";
import { trackEvent } from "@/utils/trackEvent";

export default function Confetti({ planId, progress, target }: Props) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = useCallback(async () => {
    return await markPlanAsComplete(parseInt(planId, 10));
  }, [planId]);

  useEffect(() => {
    async function complete() {
      if (progress === target) {
        const { success } = await handleComplete();
        if (success) {
          setShowConfetti(true);
          trackEvent("plan-complete", { planId });
        } else {
          toast({
            variant: "destructive",
            title: "Error to update",
            description: "Could not mark the plan as complete on server",
          });
        }
      }
    }
    complete();
  }, [progress, target, planId, handleComplete]);

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          width={width}
          height={height}
          confettiSource={{
            x: width / 2,
            y: height / 2,
            w: 10,
            h: 10,
          }}
          recycle={false}
          numberOfPieces={500}
          colors={[
            "#1f9e4d",
            "#46b868",
            "#73d287",
            "#167a3f",
            "#104f2b",
            "#1f9e7a",
            "#1f9e33",
            "#1fa79e",
            "#1f9e8c",
            "#198c74",
            "#339e1f",
            "#1f7e9e",
            "#73a8d2",
            "#b3e2c7",
            "#e2b3c0",
            "#e2d1b3",
            "#b3e2d1",
            "#8ce2b3",
            "#5fcf8d",
            "#6f9e1f",
          ]}
        />
      )}
    </>
  );
}
