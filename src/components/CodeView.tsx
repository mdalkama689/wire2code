"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { Button } from "./ui/button";
import { Code2, Play } from "lucide-react";
import { messageContext } from "@/context/MessageContext";
import { staterCode, tailwindCDN } from "@/helper/prompt";


function CodeView({ roomId }: { roomId: string }) {
  const [isActive, setIsActive] = useState("code");


  
   const context = useContext(messageContext)
  if(!context) return
  
  const { files, setFiles, dependencies, setDependencies} = context

  return (
    <div className="flex h-full flex-col ">
  
      <div className=" p-4 flex gap-2">
        <Button
          variant={isActive === "code" ? "default" : "outline"}
          onClick={() => setIsActive("code")}
          size="sm"
        >
          <Code2 className="mr-2 h-4 w-4" />
          Code
        </Button>
        <Button
          variant={isActive === "preview" ? "default" : "outline"}
          onClick={() => setIsActive("preview")}
          size="sm"
        >
          <Play className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </div>

      {/* Code Editor / Preview */}
      <div className="mr-10">
        <SandpackProvider template="react" theme="auto"
files={files}
     customSetup={{
      dependencies: {
        ...dependencies
      }
     }
     }
     options={{
      externalResources: [tailwindCDN]
     }}
        >
          <SandpackLayout>
            {isActive === "code" && (
              <>
                <SandpackFileExplorer style={{height:'80vh'}}  />
                <SandpackCodeEditor style={{height:'80vh'}}  
                 
                />
              </>
            )}
            {isActive === "preview" && (
              <SandpackPreview showNavigator={true}  style={{height:'80vh'}} />
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
}

export default CodeView;
