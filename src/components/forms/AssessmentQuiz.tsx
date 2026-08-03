"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import {
  assessmentQuestions,
  computeAssessment,
} from "@/content/assessmentRules";
import type { AssessmentResult } from "@/types/content";
import { VELORA_EASE } from "@/lib/gsap";

type Answers = Partial<Record<"projectType" | "vision" | "scale", string>>;

/**
 * Three-question space assessment. Deterministic, local-only: answers
 * are never stored, sent, or profiled — the result is computed in the
 * browser from rules in src/content/assessmentRules.ts.
 */
export function AssessmentQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const question = assessmentQuestions[step];

  const answer = (value: string) => {
    const next: Answers = { ...answers, [question.id]: value };
    setAnswers(next);
    if (step < assessmentQuestions.length - 1) {
      setStep(step + 1);
    } else {
      setResult(
        computeAssessment(
          next.projectType ?? "other",
          next.vision ?? "performance",
          next.scale ?? "100-250",
        ),
      );
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="border border-white/12 p-8 sm:p-12">
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: VELORA_EASE }}
            role="status"
            aria-live="polite"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-olive">
              YOUR RESULT
            </p>
            <h3 className="mt-5 text-lg font-extralight uppercase tracking-[0.07em] text-white">
              {result.headline}
            </h3>
            <p className="mt-5 max-w-xl text-sm font-light leading-[1.7] text-white/65">
              {result.explanation}
            </p>

            <ul className="mt-8 space-y-2">
              {result.disciplines.map((discipline, index) => (
                <li
                  key={discipline}
                  className="flex items-baseline gap-4 text-[12px] uppercase tracking-[0.18em] text-white/75"
                >
                  <span className="text-[10px] text-olive">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {discipline}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-8">
              <ButtonLink href="/contact" transitionLabel="VELORA — CONTACT">
                DISCUSS THIS RESULT
              </ButtonLink>
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white"
              >
                <RotateCcw size={12} strokeWidth={1.5} aria-hidden="true" />
                START AGAIN
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: VELORA_EASE }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.3em] text-olive">
                {question.eyebrow}
              </p>
              <div className="flex gap-1.5" aria-hidden="true">
                {assessmentQuestions.map((q, i) => (
                  <span
                    key={q.id}
                    className={
                      "h-px w-8 " + (i <= step ? "bg-olive" : "bg-white/15")
                    }
                  />
                ))}
              </div>
            </div>
            <h3 className="mt-6 text-lg font-extralight uppercase tracking-[0.07em] text-white">
              {question.title}
            </h3>

            <div className="mt-8 grid gap-px bg-white/10 sm:grid-cols-2">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => answer(option.value)}
                  className="group bg-carbon px-5 py-5 text-left text-[12px] uppercase tracking-[0.16em] text-white/60 transition-colors duration-500 hover:bg-shadow hover:text-white focus-visible:bg-shadow focus-visible:text-white"
                >
                  <span className="flex items-center justify-between gap-4">
                    {option.label}
                    <span
                      aria-hidden="true"
                      className="h-px w-5 bg-olive/0 transition-all duration-500 group-hover:bg-olive"
                    />
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-[10px] tracking-[0.14em] text-white/30">
              NOTHING YOU SELECT IS STORED OR SENT ANYWHERE.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
