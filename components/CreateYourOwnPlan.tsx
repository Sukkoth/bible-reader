"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CreatePlanSchema,
  CreatePlanSchemaType,
} from "@/lib/schemas/createPlanSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import Image from "next/image";

function CreateYourOwnPlan() {
  const router = useRouter();
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false); //for file

  const supabase = createClient();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<CreatePlanSchemaType>({
    resolver: zodResolver(CreatePlanSchema),
  });

  const handleCreatePlan = useFetch<{ plan: Plan }>("/api/plans", false);

  const onSubmit: SubmitHandler<CreatePlanSchemaType> = async (data) => {
    await handleCreatePlan.fetchData({
      body: JSON.stringify(data),
      method: "post",
    });
  };

  useEffect(() => {
    if (handleCreatePlan.data?.plan.id) {
      console.log("redirect fore", handleCreatePlan.data?.plan.name);
      router.push(`/schedule/${handleCreatePlan.data?.plan.id}`);
    } else {
      console.log("could not redirect", handleCreatePlan.data);
    }
  }, [handleCreatePlan.data, router]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    setUploading(true);

    const { data, error } = await supabase.storage
      .from("bible-reader")
      .upload(
        `temp-avatar/${file.name}${new Date().getTime().toString()}`,
        file,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

    if (!error && data?.fullPath) {
      clearErrors("coverImg");
      setValue(
        "coverImg",
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data?.fullPath}`
      );
      setImage(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data?.fullPath}`
      );
    }
    setUploading(false);
  };

  return (
    <Card className='w-full bg-transparent mt-5'>
      <CardHeader>
        <CardTitle className='text-3xl'>Create your own plan</CardTitle>
        <CardDescription>
          You can create your own reading plan that suits your needs, Let&apos;s
          get started! Make sure you make it nice, so that others can discover
          your plan and use it too.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {handleCreatePlan.error && (
          <p className='text-sm pb-1 text-red-400'>
            {handleCreatePlan.error?.message}
          </p>
        )}
        <form
          className='flex items-center justify-center flex-col gap-5'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='w-full'>
            <Label htmlFor='name'>Plan Name</Label>
            <Input id='name' type='text' {...register("name")} />
            {errors.name && (
              <span className='text-red-400 text-xs'>
                {errors.name.message}
              </span>
            )}
          </div>
          <div className='w-full'>
            <Label htmlFor='description'>Description</Label>

            <Textarea
              placeholder='Type your message here.'
              {...register("description")}
              id='description'
            />
            {errors.description && (
              <span className='text-red-400 text-xs'>
                {errors.description.message}
              </span>
            )}
          </div>
          <div className='w-full'>
            <Label htmlFor='lastName'>Suggested Duration (days)</Label>
            <Input
              id='suggestedDuration'
              type='number'
              {...register("suggestedDuration")}
            />
            {errors.suggestedDuration && (
              <span className='text-red-400 text-xs'>
                {errors.suggestedDuration.message}
              </span>
            )}
          </div>
          {
            <div className='w-full'>
              <div className='flex gap-2 items-center'>
                <Label htmlFor='avatar'>Cover Image </Label>
                {uploading && (
                  <span className='spin-loader'>
                    <Loader />
                  </span>
                )}
              </div>
              <Input
                id='avatar'
                type='file'
                className='py-3'
                disabled={uploading}
                onChange={handleFileChange}
              />
              {errors.coverImg && (
                <span className='text-red-400 text-xs'>
                  {errors.coverImg.message}
                </span>
              )}
            </div>
          }
          {image.length ? (
            <div className='size-24 rounded-full border overflow-hidden absolute'>
              <Image
                src={image}
                alt='cover-img'
                className='absolute object-cover'
                fill
              />
            </div>
          ) : (
            ""
          )}

          <Button
            type='submit'
            className='w-full'
            size='lg'
            disabled={
              handleCreatePlan.isPending || !!handleCreatePlan?.data?.plan?.id
            }
          >
            {handleCreatePlan.isPending ? "Creating . . ." : "Create Plan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default CreateYourOwnPlan;
