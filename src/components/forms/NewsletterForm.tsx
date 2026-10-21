"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { subscribeToEdit } from "@/app/(public)/actions";
import { newsletterSchema } from "@/lib/validation";
import type { FormStatus, NewsletterFormValues } from "@/types/forms";

/** The Velora Edit subscription, saved to the subscribers list in the admin. */
export function NewsletterForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("submitting");
    setErrorMessage(null);
    const result = await subscribeToEdit(values);
    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(result.error ?? "Something went wrong.");
    }
  });

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" className="border border-white/15 p-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-olive">
          THE EDIT
        </p>
        <p className="mt-4 text-base font-light uppercase text-white">
          YOU ARE ON THE LIST.
        </p>
        <p className="mt-3 text-sm font-light leading-[1.7] text-white/60">
          The next Edit will reach your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <Field
        label="EMAIL"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Field
        label="ROLE (OPTIONAL)"
        error={errors.role?.message}
        {...register("role")}
      />
      {status === "error" && errorMessage ? (
        <p role="alert" className="text-[11px] tracking-[0.08em] text-olive">
          {errorMessage}
        </p>
      ) : null}
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "ONE MOMENT" : "SUBSCRIBE TO THE EDIT"}
      </Button>
    </form>
  );
}
