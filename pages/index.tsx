import Image from "next/image";
import { Inter } from "next/font/google";
import MultiStepForm from "./api/components/MultiStepForm";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  personal: z.object({
    name: z.string(),
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

  return (
    <MultiStepForm
      schema={schema}
      methods={methods}
      steps={[]}
      onSubmit={() => {}}
    />
  );
}
