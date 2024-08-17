import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ZodObject } from "zod";

interface MultiStepFormProps {
  /** The schema to validate the form */
  schema: ZodObject<any>;
  /* The useForm hook return object */
  methods: UseFormReturn<any>;
  /* The function to call when the form is submitted */
  onSubmit: (data: any) => void;
}

function MultiStepForm({ schema, methods, onSubmit }: MultiStepFormProps) {
  return <></>;
}

export default MultiStepForm;
