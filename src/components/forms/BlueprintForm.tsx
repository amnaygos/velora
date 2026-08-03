"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { SelectField } from "@/components/ui/SelectField";
import { site } from "@/content/site";
import {
  buildMailtoHref,
  FORM_ENDPOINTS,
  resolveFormMode,
  submitForm,
} from "@/lib/formSubmission";
import { blueprintSchema, BLUEPRINT_ROLES } from "@/lib/validation";
import type { BlueprintFormValues, FormStatus } from "@/types/forms";

/**
 * Wellness Blueprint lead form. Without an external endpoint it runs in
 * demo mode: validated, animated, and stateless — nothing is stored.
 */
export function BlueprintForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mode = resolveFormMode(FORM_ENDPOINTS.blueprint);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BlueprintFormValues>({
    resolver: zodResolver(blueprintSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("submitting");
    setErrorMessage(null);
    const result = await submitForm(values, FORM_ENDPOINTS.blueprint);
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
        className="border border-white/15 p-8 sm:p-10"
        role="status"
        aria-live="polite"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-olive">
          THE BLUEPRINT
        </p>
        <p className="mt-5 text-lg font-light uppercase tracking-[0.06em] text-white">
          YOUR COPY IS READY.
        </p>
        <p className="mt-4 text-sm font-light leading-[1.7] text-white/60">
          {mode === "demo"
            ? "This site runs in presentation mode — your details were validated locally and were not stored or sent anywhere."
            : "Your request has been submitted."}
        </p>
        <a
          href={site.blueprintPdf}
          download
          className="group mt-8 inline-flex items-center gap-3 border border-white/30 px-6 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-500 hover:bg-white hover:text-carbon"
        >
          <Download size={14} strokeWidth={1.5} aria-hidden="true" />
          DOWNLOAD THE BLUEPRINT
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10">
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
      <SelectField
        label="ROLE"
        options={BLUEPRINT_ROLES}
        error={errors.role?.message}
        {...register("role")}
      />

      {status === "error" && errorMessage ? (
        <p role="alert" className="text-[11px] tracking-[0.08em] text-olive">
          {errorMessage} You can also write to us directly at{" "}
          <a className="underline" href={buildMailtoHref("The VELORA Wellness Blueprint")}>
            {site.email}
          </a>
          .
        </p>
      ) : null}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "ONE MOMENT" : "RECEIVE THE BLUEPRINT"}
      </Button>
    </form>
  );
}
