import Image from "next/image";
import { Inter } from "next/font/google";
import MultiStepForm, {
  MultiStepFormRef,
} from "./api/components/MultiStepForm";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";

const schema = z.object({
  personal: z.object({
    name: z.string().min(4),
    email: z.string().email(),
  }),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
});

type FormValues = z.infer<typeof schema>;

export default function Home() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const multiStepFormRef = useRef<MultiStepFormRef>(null);
  const [step, setStep] = useState(0);

  const steps = [
    {
      name: "personal",
      children: (
        <div className="flex flex-col space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
            <input
              {...methods.register("personal.name")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              {...methods.register("personal.email")}
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </label>
        </div>
      ),
    },
    {
      name: "address",
      children: (
        <div className="flex flex-col space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Street
            <input
              {...methods.register("address.street")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            City
            <input
              {...methods.register("address.city")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            State
            <input
              {...methods.register("address.state")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Zip
            <input
              {...methods.register("address.zip")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </label>
        </div>
      ),
    },
  ];

  const controls = [
    <button
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
      onClick={() => multiStepFormRef.current?.handleBack()}
    >
      Back
    </button>,
    <button
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      onClick={() => multiStepFormRef.current?.handleNext()}
    >
      {step === 1 ? "Submit" : "Next"}
    </button>,
  ];

  const handleSubmit = (data: FormValues) => {
    console.log(data);
  };

  console.log(step);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <MultiStepForm
          schema={schema}
          methods={methods}
          steps={steps}
          controls={controls}
          onSubmit={handleSubmit}
          ref={multiStepFormRef}
          step={step}
          setStep={setStep}
        />
      </div>
    </div>
  );
}
