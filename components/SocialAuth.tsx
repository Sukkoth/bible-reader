import React from "react";
import { CardContent } from "./ui/card";
import SocialAuthItem from "./SocialAuthItem";

function SocialAuth() {
  return (
    <CardContent>
      <div className='space-y-3'>
        <SocialAuthItem provider='google' iconPath='/google-icon.svg' />
        <SocialAuthItem
          provider='github'
          iconPath='/github-icon.svg'
          invertIconColor
        />
      </div>
    </CardContent>
  );
}

export default SocialAuth;
