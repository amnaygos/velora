import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { StudioDetails } from "@/components/sections/contact/StudioDetails";
import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";

export function ContactForm() {
  return (
    <section className="bg-carbon px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <ArchitecturalRule />
      <div className="mt-14 grid gap-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-24">
        <StudioDetails />
        <EnquiryForm />
      </div>
    </section>
  );
}
