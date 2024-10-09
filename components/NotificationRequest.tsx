"use client";

import { useNotification } from "@/notifications/useNotification";
import { useEffect } from "react";

/**
 * NotificationRequest component.
 *
 * This component handles the request for push notification subscription.
 * It uses the useNotification hook to get the handleSubscribe function and the isSubscribed state.
 * It calls the handleSubscribe function after a 3-second delay .
 * Why? to give time for notification worker to register subscriptions.
 *
 * @returns {JSX.Element} An empty JSX element.
 */

function NotificationRequest() {
  const { handleSubscribe, isSubscribed } = useNotification();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSubscribed) {
        handleSubscribe();
      }
    }, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubscribed]);
  return <></>;
}

export default NotificationRequest;
