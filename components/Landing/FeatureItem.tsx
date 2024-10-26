import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { spartanFont } from "@/lib/fonts";

type Props = {
  title: string;
  description: string;
  icon: ReactNode;
};
function FeatureItem({ title, description, icon }: Props) {
  return (
    <Card className='border-white/20 hover:scale-110 transition-all duration-700 bg-landing-card/50 hover:border-white/60'>
      <CardHeader className='flex justify-center'>
        <div className='bg-[#27bc5925] rounded-full size-16 border border-[#27bc5934] text-white center-all mx-auto mb-2'>
          {icon}
        </div>
        <CardTitle className='text-lg text-white'>{title}</CardTitle>
      </CardHeader>
      <CardContent
        className={`${spartanFont.className} text-sm text-stone-400`}
      >
        {description}
      </CardContent>
    </Card>
  );
}

export default FeatureItem;
