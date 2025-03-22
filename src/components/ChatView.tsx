"use client";

import ApiResponse from "@/helper/apiResponse";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Loader, Loader2, Wand2 } from "lucide-react";
import { PROMPT,} from "@/helper/prompt";
import { messageContext } from "@/context/MessageContext";

import { toast } from "sonner";

interface iRoomData {
  files: any;
  id: number;
  imageUrl: string 
  roomId: string;
  userId: string;
  description: string;
  selectedModel: string;
}

function ChatView({ roomId }: { roomId: string }) {
  const [roomData, setRoomData] = useState<iRoomData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const hasGenerateRef = useRef(false)

  const context = useContext(messageContext);
  if (!context) return;

  const { setFiles, files, setDependencies } = context;

  useEffect(() => {
    roomDetails();
  }, []);

  const roomDetails = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/room-details", {
        roomId,
      });
      setRoomData(response.data.room);

      if (!response.data.success) {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError
        ? axiosError.response?.data.message
        : "Something went wrong durign getting room details!";
      toast.error(errorMessage);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("Please wait, generating code...");
    try {
      if (!roomData?.description) return;
    
      const CODE_PROMPT =roomData?.description  + PROMPT

      const formValue = {
        imageUrl: roomData?.imageUrl,
        CODE_PROMPT,
        modelName: roomData?.selectedModel,
        roomId
      };

      const response = await axios.post<ApiResponse>(
        "/api/generate-code",
        formValue
      );

      if (response.data.success) {
        const paresdResponse = JSON.parse(response.data.result);
        const parsedFiles = paresdResponse.files;
        const parsedDependencies = paresdResponse.dependencies;
        const combinedCode = { ...parsedFiles, ...files };

        setFiles(combinedCode);
        setDependencies(parsedDependencies);
        console.log(response.data.result)
        toast.success("Code has been generated successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error)
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError
        ? axiosError.response?.data.message
        : "Something went wrong durign getting code response!";
      toast.error(errorMessage);
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };



  useEffect(() => {
    if (roomData && !hasGenerateRef.current) {
      hasGenerateRef.current = true 
      handleGenerate();
    }
  }, [roomData]);

  return (
    <div className="flex h-full flex-col px-4  gap-4">
      <h1 className="text-gray-200 text-xl font-semibold text-center mt-6 tracking-wide">
        Wireframe
      </h1>

      {roomData?.imageUrl ? (
        <div className="border border-white rounded">
          <Image
            src={roomData.imageUrl}
            alt="selected-image"
            className="w-full h-64 object-cover rounded-lg"
            height={100}
            width={100}
            unoptimized
            priority
          />
        </div>
      ): (
        <div className="flex items-center justify-center w-full h-64"><Loader2 className="animate-spin"/></div>
      )}

      {/* Text Input & Button */}
      <div className="flex-1 flex flex-col gap-4">
        <p className="w-full h-24 p-4 resize-none bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-20 transition"
        >{roomData?.description}</p>

      </div>
    </div>
  );
}

export default ChatView;
