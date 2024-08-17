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
  /* The function to call when the step changes */
  onStepChange?: (step: number) => void;
  /* If you want to pass in the step from the parent, useful if you need the step state outside the child component */
  step?: number;
  /* If you want to pass in the setStep from the parent */
  setStep?: (step: number) => void;
  /* The function to call when the form is submitted */
  onSubmit: (data: any) => void;
}

const MultiStepForm = forwardRef<MultiStepFormRef, MultiStepFormProps>(
  (
    { schema, methods, steps, controls, onStepChange, step, setStep, onSubmit },
    ref
  ) => {
    const schemaKeys: string[] = schema.keyof()._def.values;
    const numberOfFields = schemaKeys.length;
    if (numberOfFields !== steps.length)
      throw new Error("Amount of steps and fields in schema do not match");

    if (
      (step !== undefined && setStep === undefined) ||
      (step === undefined && setStep !== undefined)
    )
      throw new Error("You must pass both step and setStep or neither");

    const [localStep, setLocalStep] = useState(0);

    const currentStep = step !== undefined ? step : localStep;
    const isLastStep = currentStep === steps.length - 1;

    const handleBack = () => {
      if (currentStep > 0) {
        const newStep = currentStep - 1;
        setStep ? setStep(newStep) : setLocalStep(newStep);
        onStepChange && onStepChange(newStep);
      }
    };

    const handleNext = () => {
      const parse = schema.safeParse(methods.getValues());
      const error = parse.error?.issues.find(
        (i) => i.path[0] === steps[currentStep].name
      );
      if (!isLastStep && !error) {
        const newStep = currentStep + 1;
        setStep ? setStep(newStep) : setLocalStep(newStep);
        onStepChange && onStepChange(newStep);
      } else {
        // handleSubmit validates the data according to the schema, meaning if it is invalid it won't reach the onSubmit function or in our case, log in the console
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
