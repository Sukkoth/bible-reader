"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  CompleteProfileSchema,
  CompleteProfileSchemaType,
} from "@/lib/schemas/completeProfileSchema";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { completeProfileAction } from "./_actions";
import Image from "next/image";

type Props = {
  user: User;
  profile?: Profile;
};

export default function CompleteProfile({ user, profile }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [, setGender] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false); //for file
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<CompleteProfileSchemaType>({
    resolver: zodResolver(CompleteProfileSchema),
  });

  const onSubmit: SubmitHandler<CompleteProfileSchemaType> = async (data) => {
    startTransition(async () => {
      const { error, id } = await completeProfileAction(
        user.id,
        data,
        profile?.id
      );
      if (error || !id) {
        setError(error || "Something went wrong");
      } else {
        router.replace("/home");
      }
    });
  };

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
      clearErrors("avatar");
      setValue(
        "avatar",
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data?.fullPath}`
      );
      setImage(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data?.fullPath}`
      );
    }
    setUploading(false);
  };

  const hasCompletedProfile =
    profile?.first_name &&
    profile.last_name &&
    profile.gender &&
    profile.avatar;

  useEffect(() => {
    if (hasCompletedProfile) redirect("/home");
  }, [hasCompletedProfile]);

  useEffect(() => {
    console.log({ user, profile });
    if (user?.user_metadata?.avatar_url) {
      setValue("avatar", user?.user_metadata.avatar_url);
    } else if (user?.user_metadata?.picture) {
      setValue("avatar", user?.user_metadata.picture);
    } else {
      if (profile?.avatar) {
        setValue("avatar", profile.avatar);
      }
    }

    if (!profile?.first_name && user?.user_metadata.full_name) {
      if (user?.user_metadata?.full_name?.includes(" ")) {
        setValue("firstName", user?.user_metadata.full_name.split(" ")[0]);
        setValue("lastName", user?.user_metadata.full_name.split(" ")[1]);
      }
    } else {
      if (profile?.first_name) setValue("firstName", profile?.first_name);
      if (profile?.last_name) setValue("lastName", profile?.last_name);
    }

    if (profile?.gender) {
      setGender(profile.gender === "male" ? "male" : "female");
      setValue("gender", profile.gender === "male" ? "male" : "female");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, profile?.id]);

  return (
    <div className='flex flex-col h-full flex-grow items-center justify-center'>
      <Card className='mx-5 w-full bg-transparent'>
        <CardHeader>
          <CardTitle className='text-3xl'>Complete your profile</CardTitle>
          <CardDescription>
            Some data may be required to bring nice exprience on here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-sm pb-1 text-red-400'>{error}</p>
          <form
            className='flex items-center justify-center flex-col gap-5'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='w-full'>
              <Label htmlFor='firstName'>First Name</Label>
              <Input id='firstName' type='text' {...register("firstName")} />
              {errors.firstName && (
                <span className='text-red-400 text-xs'>
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className='w-full'>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                id='lastName'
                type='text'
                {...register("lastName")}
                defaultValue={undefined}
              />
              {errors.lastName && (
                <span className='text-red-400 text-xs'>
                  {errors.lastName.message}
                </span>
              )}
            </div>
            {!(
              user?.user_metadata?.avatar_url || user?.user_metadata.picture
            ) && (
              <div className='w-full'>
                <div className='flex gap-2 items-center'>
                  <Label htmlFor='avatar'>Profile Image </Label>
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
                {errors.avatar && (
                  <span className='text-red-400 text-xs'>
                    {errors.avatar.message}
                  </span>
                )}
              </div>
            )}
            {image.length ? (
              <div className='rounded-full border overflow-hidden'>
                <Image src={image} alt='avatar-img' width={100} height={100} />
              </div>
            ) : (
              ""
            )}
            <div className='flex justify-around w-full'>
              <div
                className='flex items-center gap-2 border rounded-xl px-6 py-2 hover:bg-secondary cursor-pointer transition-colors duration-300'
                onClick={() => {
                  setGender("male");
                  setValue("gender", "male");
                  clearErrors("gender");
                }}
              >
                <div className='size-4 border rounded-full dark:bg-white bg-secondary flex items-center justify-center'>
                  {getValues("gender") === "male" && (
                    <div className='size-2 bg-primary rounded-full'></div>
                  )}
                </div>
                <p>Male</p>
              </div>
              <div
                className='flex items-center gap-2 border rounded-xl px-6 py-2 hover:bg-secondary cursor-pointer transition-colors duration-300'
                onClick={() => {
                  setGender("female");
                  setValue("gender", "female");
                  clearErrors("gender");
                }}
              >
                <div className='size-4 border rounded-full dark:bg-white bg-secondary flex items-center justify-center'>
                  {getValues("gender") === "female" && (
                    <div className='size-2 bg-primary rounded-full'></div>
                  )}
                </div>
                <p>Female</p>
              </div>
            </div>
            {errors.gender && (
              <span className='text-red-400 text-xs'>
                {errors.gender.message}
              </span>
            )}

            <Button
              type='submit'
              className='w-full'
              size='lg'
              disabled={isPending}
            >
              {isPending ? "Updating . . ." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
