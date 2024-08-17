import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useState,
} from "react";
import { UseFormReturn } from "react-hook-form";
import { ZodObject } from "zod";

export interface MultiStepFormRef {
  handleNext: () => void;
  handleBack: () => void;
  currentStep: number;
}

interface MultiStepFormProps {
  /** The schema to validate the form */
  schema: ZodObject<any>;
  /* The useForm hook return object */
  methods: UseFormReturn<any>;
  /* The steps of the form, where the name of the step matches the one in the schema */
  steps: { name: string; children: ReactNode }[];
  /* The controls for moving forward and backwards */
  controls?: ReactNode;
  /* The function to call when the form is submitted */
  onSubmit: (data: any) => void;
}

const MultiStepForm = forwardRef<MultiStepFormRef, MultiStepFormProps>(
  ({ schema, methods, steps, controls, onSubmit }, ref) => {
    const schemaKeys: string[] = schema.keyof()._def.values;
    const numberOfFields = schemaKeys.length;
    if (numberOfFields !== steps.length)
      throw new Error("Amount of steps and fields in schema do not match");

    const [currentStep, setCurrentStep] = useState(0);
    const isLastStep = currentStep === steps.length - 1;

    const handleBack = () => {
      if (currentStep > 0) {
        setCurrentStep((prevStep) => prevStep - 1);
      }
    };

    const handleNext = () => {
      const parse = schema.safeParse(methods.getValues());
      const error = parse.error?.issues.find(
        (i) => i.path[0] === steps[currentStep].name
      );
      if (!isLastStep && !error) {
        setCurrentStep((prevStep) => prevStep + 1);
      } else {
        methods.handleSubmit(onSubmit)();
      }
    };

    useImperativeHandle(ref, () => {
      return {
        handleNext,
        handleBack,
        currentStep,
      };
    });

    return (
      <div className="w-full">
        {steps.map(
          (step, index) =>
            index === currentStep && <div key={index}>{step.children}</div>
        )}
        <div className="flex flex-row mt-4 w-full justify-between">
          {Array.isArray(controls) &&
            controls.map((control, index) => <div key={index}>{control}</div>)}
        </div>
      </div>
    );
  }
);

MultiStepForm.displayName = "MultiStepForm";

export default MultiStepForm;
