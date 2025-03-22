'use client'
import { staterCode } from "@/helper/prompt";
import { createContext, useState, } from "react";

const messageContext = createContext<any | null>(null)

function MessageProvider({children}: {children: React.ReactNode}) {
    const [files, setFiles] = useState(staterCode)
    const [dependencies, setDependencies] = useState({})
    
    return(
        <messageContext.Provider value={{files, setFiles, dependencies, setDependencies}}>
            {children} 
        </messageContext.Provider>
    )
}

export {
    messageContext,
    MessageProvider
}