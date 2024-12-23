import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { HookConfig } from "react-paystack/dist/types";
import { SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { usePaystackPayment } from "react-paystack";

const PaymentPage = () => {const schema = z.object({
  fullName: z.string().min(3, { message: "Kindly enter your name." }),
  // lastName: z.string().min(3),
  amount: z.string().min(1, { message: "Please enter a correct amount." }),
  email: z
    .string({ message: "Please provide a valid email." })
    .email({ message: "Please provide a valid email." }),
  phone: z
    .string({ message: "Please enter your phone number." })
    .min(10, { message: "Please provide a valid phone number." })
    .max(15, { message: "Please provide a valid phone number." }),
});

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: {
    fullName: "",
    amount: "",
    email: "",
    phone: "",
  },
});
const config: HookConfig = {
  email: "",
  amount: parseFloat("0"),
  publicKey: "",
  currency: "GHS",
  phone: "",
};
// useEffect(()=>{
//   if(typeof window !== undefined )
//    return setConfig()

// })

const initializePayment = usePaystackPayment(config);

const handlePayment = (userInfo: z.infer<typeof schema>) => {
  if (typeof window == undefined) return;

  config.email = userInfo.email;
  config.amount = parseFloat(userInfo.amount);
  config.phone = userInfo.phone;
  config.metadata = {
    custom_fields: [
      {
        display_name: "Payment from",
        variable_name: "Full Name",
        value: userInfo.fullName,
      },
    ],
  };
  config.publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_TEST_KEY || "";

  const onSuccess = () => {
    console.log("paid");
  };
  initializePayment({ onSuccess });
};

const { setTheme, theme } = useTheme();
return (
  <div className=" bg-neutral-50 dark:bg-neutral-900 min-h-screen w-full flex items-center justify-center">
    <div
      className="fixed bottom-4 right-4 md:bottom-20 md:right-16 bg-neutral-200 dark:bg-slate-800 rounded-full p-2"
      onClick={() => (theme == "dark" ? setTheme("light") : setTheme("dark"))}
    >
      <SunMoonIcon size={40} strokeWidth={1} />
    </div>

    <div className=" py-8 px-4 md:p-8 my-10   items-center rounded-xl shadow-lg shadow-gray-600 dark:bg-transparent w-[90vw] md:w-[60vw] min-h-[500px] ">
      <h3 className="text-3xl md:text-5xl text-center text-emerald-700 dark:text-emerald-500 font-parisFont">
        Techsirl Photography
      </h3>
      <h3 className="mt-2 text-md md:text-xl text-center ">Payment page</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePayment)}
          className="space-y-10 my-6 min-w-[250px]"
        >
          <FormField
            control={form.control}
            name={"fullName"}
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel className="text-lg  md:text-2xl text-neutral-500  dark:text-neutral-100">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input value={value} onChange={onChange} />
                </FormControl>
                {form.formState.errors?.fullName && (
                  <FormMessage className="text-lg" />
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"phone"}
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel className="text-lg md:text-2xl text-neutral-500 dark:text-neutral-100">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input value={value} onChange={onChange} />
                </FormControl>
                {form.formState.errors?.phone && (
                  <FormMessage className="text-lg" />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"email"}
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel className="text-lg md:text-2xl text-neutral-500 dark:text-neutral-100">
                  Email
                </FormLabel>
                <FormControl>
                  <Input value={value} onChange={onChange} />
                </FormControl>
                {form.formState.errors?.email && (
                  <FormMessage className="text-lg" />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"amount"}
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel className="text-lg md:text-2xl text-neutral-500 dark:text-neutral-100">
                  Amount
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    value={value}
                    onChange={onChange}
                  />
                </FormControl>
                {form.formState.errors?.amount && (
                  <FormMessage className="text-lg" />
                )}
              </FormItem>
            )}
          />

          <div className="flex items-center justify-center w-full">
            <FormItem>
              <FormControl>
                <Button
                  className="bg-blue-800 p-6 text-lg font-semibold md:text-2xl md:px-16 md:h-20"
                  type="submit"
                >
                  Process Payment
                </Button>
              </FormControl>
            </FormItem>
          </div>
        </form>
      </Form>
      <div className="flex justify-center items-center">
        <LockClosedIcon className="inline h-6 w-6 mr-2" />
        <h6 className=" text-center text-slate-600 md:text-xl font-semibold">
          Secured by{" "}
          <Link
            href="https://paystack.com/"
            className="text-blue-700 font-semibold"
          >
            Paystack
          </Link>
        </h6>
      </div>
    </div>
  </div>
);
};

export default PaymentPage;
