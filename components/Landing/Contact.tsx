"use client";

import React, { useState, useTransition } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { saveContactMessage } from "@/actions";
import { toast } from "@/hooks/use-toast";
import { interFont } from "@/lib/fonts";

function Contact() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (Object.values(formData).some((val) => !val)) {
      return;
    }
    startTransition(async () => {
      const result = await saveContactMessage(formData);
      if (result?.success) {
        toast({
          title: "Success!",
          description: "Your message has been sent. Thank you!",
          duration: 5000,
        });
        setFormData({
          fullName: "",
          email: "",
          message: "",
        });
      } else {
        toast({
          title: "Failed!",
          description: result?.error || "Could not send message.",
          variant: "destructive",
          duration: 5000,
        });
      }
    });
  }
  return (
    <section className='xl:w-2/3 mx-auto h-full mt-40 pt-20' id='contact'>
      <h1
        className={`${interFont.className} text-3xl xs:text-4xl lg:text-7xl font-bold text-white text-center`}
      >
        Contact Us
      </h1>
      <p className='text-center text-stone-300'>
        Got any Questions or feedback? Feel free to contact us
      </p>
      <form
        className='lg:w-1/2 px-5 mx-auto mt-10 space-y-3'
        onSubmit={handleSubmit}
      >
        <div className='space-y-2'>
          <Label className='text-white'>Full Name</Label>
          <Input
            type='text'
            className='border-white/50 text-white bg-landing-card/50'
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
          />
        </div>
        <div className='space-y-2'>
          <Label className='text-white'>Email</Label>
          <Input
            type='email'
            className='border-white/50 text-white bg-landing-card/50'
            required
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div className='space-y-2'>
          <Label className='text-white'>Message</Label>
          <Textarea
            className='border-white/50 text-white bg-landing-card/50'
            rows={10}
            required
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
          />
        </div>
        <div className='w-1/3 mx-auto'>
          <Button
            className='h-12 w-full bg-landing-card/50 border border-white mt-5 hover:bg-stone-500/30 transition-all duration-500'
            size={"lg"}
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Submit"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default Contact;
