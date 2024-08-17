import React, { ReactNode, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ZodObject } from "zod";

interface MultiStepFormProps {
  /** The schema to validate the form */
  schema: ZodObject<any>;
  /* The useForm hook return object */
  methods: UseFormReturn<any>;
  /* The steps of the form, where the name of the step matches the one in the schema */
  steps: { name: string; children: ReactNode }[];
  /* The function to call when the form is submitted */
  onSubmit: (data: any) => void;
}

function MultiStepForm({
  schema,
  methods,
  steps,
  onSubmit,
}: MultiStepFormProps) {
  const schemaKeys: string[] = schema.keyof()._def.values;
  const numberOfFields = schemaKeys.length;
  if (numberOfFields !== steps.length)
    throw new Error("Amount of steps and fields in schema do not match");

  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === steps.length - 1;

  const handleBack = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
    }
  };

  const handleNext = () => {
    const parse = schema.safeParse(methods.getValues());
    const error = parse.error?.issues.find(
      (i) => i.path[0] === steps[currentStep].name
    );
    if (!isLastStep && !error) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
    } else {
      methods.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="w-full">
      {steps.map(
        (step, index) =>
          index === currentStep && <div key={index}>{step.children}</div>
      )}
    </div>
  );
}

export default MultiStepForm;
