"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Field, TextAreaField } from "@/components/ui/Field";
import { SelectField } from "@/components/ui/SelectField";
import { useStudio } from "@/components/providers/StudioProvider";
import {
  BUDGET_RANGES,
  DISCOVERY_SOURCES,
  enquirySchema,
  PROJECT_TYPES,
} from "@/lib/validation";
import type { EnquiryFormValues, FormStatus } from "@/types/forms";
import { submitPublicEnquiry } from "@/app/(public)/actions";

/**
 * The principal enquiry form. No database anywhere: without an external
 * endpoint it validates, plays the designed interaction, and offers the
 * mailto path as the reliable channel. A success state is shown only in
 * explicit presentation (demo) mode or after a genuine endpoint success.
 */
export function EnquiryForm() {
  const studio = useStudio();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Enquiries now persist to the studio's database (Supabase), so the success
  // state is the real "received" copy rather than presentation/demo mode.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnquiryFormValues>({ resolver: zodResolver(enquirySchema) });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("submitting");
    setErrorMessage(null);
    const result = await submitPublicEnquiry(values);
    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(result.error ?? "Something went wrong.");
    }
  });

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-white/15 p-8 sm:p-12"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-olive">
          YOUR ENQUIRY
        </p>
        <p className="mt-5 text-lg font-light uppercase text-white">RECEIVED.</p>
        <p className="mt-4 max-w-md text-sm font-light leading-[1.7] text-white/60">
          A member of our principals team will review your message personally and
          respond within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10">
      <div className="grid gap-10 sm:grid-cols-2">
        <Field
          label="FULL NAME"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Field
          label="EMAIL"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Field
          label="PHONE"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Field
          label="COMPANY OR PROJECT NAME"
          error={errors.company?.message}
          {...register("company")}
        />
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
        <SelectField
          label="PROJECT TYPE"
          options={PROJECT_TYPES}
          error={errors.projectType?.message}
          {...register("projectType")}
        />
        <SelectField
          label="APPROXIMATE BUDGET"
          options={BUDGET_RANGES}
          error={errors.budget?.message}
          {...register("budget")}
        />
      </div>

      <SelectField
        label="HOW DID YOU HEAR ABOUT VELORA?"
        options={DISCOVERY_SOURCES}
        error={errors.source?.message}
        {...register("source")}
      />

      <TextAreaField
        label="TELL US ABOUT YOUR VISION"
        rows={5}
        error={errors.vision?.message}
        {...register("vision")}
      />

      {status === "error" && errorMessage ? (
        <p role="alert" className="text-[11px] tracking-[0.08em] text-olive">
          {errorMessage}
          {studio.email ? (
            <>
              {" "}You can always reach us at{" "}
              <a className="underline" href={`mailto:${studio.email}`}>
                {studio.email}
              </a>
              .
            </>
          ) : null}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-8">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "ONE MOMENT" : "BEGIN THE CONVERSATION"}
        </Button>
        {studio.email ? (
          <a
            href={`mailto:${studio.email}`}
            className="text-[10px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white"
          >
            OR EMAIL {studio.email.toUpperCase()}
          </a>
        ) : null}
      </div>
    </form>
  );
}
