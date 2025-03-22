"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import ApiResponse from "@/helper/apiResponse";
import axios, { AxiosError } from "axios";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
function VerifyEmail() {
  const email = useSearchParams().get("email");
  const [isValidOtpLength, setIsValidOtpLength] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post<ApiResponse>("/api/verify-email", {
        email,
        otp,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/signin");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage =
        axiosError.response?.data.message ?? "Error during verifying otp";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Verify OTP</CardTitle>
          <CardDescription>Enter the OTP sent to your email</CardDescription>
        </CardHeader>
        <div className="flex items-center justify-center flex-col gap-3 ">
          <OTPInput setIsValidOtpLength={setIsValidOtpLength} setOtp={setOtp} />
          {isLoading ? (
            <div>
              <Loader className="animate-spin" />
            </div>
          ) : (
            <Button
              disabled={!isValidOtpLength}
              onClick={handleSubmit}
              className={`w-[48%] ${isValidOtpLength ? "cursor-pointer" : ""}`}
            >
              Verify OTP
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default VerifyEmail;

interface IOtp {
  setIsValidOtpLength: (isValidOtpLengt: boolean) => void;
  setOtp: (otp: string) => void;
}

function OTPInput({ setIsValidOtpLength, setOtp }: IOtp) {
  const handleChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      setIsValidOtpLength(true);
    } else {
      setIsValidOtpLength(false);
    }
  };
  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      onChange={handleChange}
    >
      <InputOTPGroup>
        {[...Array(6)].map((_, index) => (
          <InputOTPSlot index={index} key={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
