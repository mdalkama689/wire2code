"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ApiResponse from "@/helper/apiResponse";
import { aiModel } from "@/helper/prompt";
import axios, { AxiosError } from "axios";
import { Code2, ImageIcon, Upload, Wand2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

function DashBoard() {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();

  const models = aiModel;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSelectModel = (modelName: string) => {
    setSelectedModel(modelName);
  };
  const handleNavigateRoom = async () => {
    const loadingToast = toast.loading("New room is creating...");
    try {
      setIsLoading(true);

      const roomId = uuidv4();
      const formData = new FormData();
      formData.append("roomId", roomId);
      formData.append("selectedFile", selectedFile);
      formData.append("description", description);
      formData.append("selectedModel", selectedModel);
      const response = await axios.post<ApiResponse>(
        "/api/create-room",
        formData
      );
      if (response.data.success) {
        router.push(`/room/${roomId}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage = axiosError
        ? axiosError.response?.data.message
        : "Something went wrong while creating a room";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <Code2 className="w-10 h-10 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Wire2Code
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-blue-400" />
                  Upload Wireframe
                </h2>
                <div className="relative">
                  {selectedImage ? (
                    <div className="relative">
                      <Image
                        src={selectedImage}
                        alt="selected-image"
                        className="w-full h-64 object-cover rounded-lg"
                        height={100}
                        width={100}
                      />
                      <Button
                        onClick={() => setSelectedImage("")}
                        disabled={isLoading}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full cursor-pointer hover:bg-red-600 transition"
                      >
                        X
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 transition">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-gray-400">
                          Click to upload wireframe
                        </span>
                        <Input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                      </Label>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Wand2 className="w-5 h-5 mr-2 text-purple-400" />
                  Select Model
                </h2>
                <div className="space-y-3">
                  <Select onValueChange={handleSelectModel}>
                    <SelectTrigger className=" w-full">
                      <SelectValue placeholder="Select the model" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700">
                      {models.map((model) => (
                        <SelectItem
                          disabled={isLoading}
                          value={model.modelName}
                          key={model.modelName}
                          className="flex items-center p-1 rounded-lg cursor-pointer transition   bg-gray-700 hover:bg-gray-600 "
                        >
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Add Description</h2>
              <Textarea
                rows={10}
                cols={10}
                disabled={isLoading}
                onChange={handleDescription}
                value={description}
                placeholder="Describe the functionality and features you want in your code..."
                className="w-full h-48 p-4 resize-none bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-20 transition"
              />

              <Button
                onClick={handleNavigateRoom}
                disabled={
                  !selectedImage || !description || !selectedModel || isLoading
                }
                className="w-full mt-6 py-6 cursor-pointer rounded-lg font-semibold flex items-center justify-center space-x-2 transition bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Code2 className="w-5 h-5" />
                <span>{isLoading ? "Generate Code..." : "Generate Code"}</span>
              </Button>

              <div className="flex flex-col items-start mt-4  p-1 rounded-lg space-y-1">
                <div className="flex items-center space-x-2">
                  <p
                    className={`h-2 w-2 rounded-full border border-white ${
                      selectedImage && "bg-green-600"
                    }`}
                  ></p>
                  <p className="text-white">Image Uploaded</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p
                    className={`h-2 w-2 rounded-full border border-white ${
                      selectedModel && "bg-green-600"
                    }`}
                  ></p>
                  <p className="text-white">Model Selected</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p
                    className={`h-2 w-2 rounded-full border border-white ${
                      description && "bg-green-600"
                    }`}
                  ></p>
                  <p className="text-white">Description Added</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
