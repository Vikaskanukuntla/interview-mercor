"use client"
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import "../../styles/globals.css";
import { useState } from "react";

import { toast } from "sonner"
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

export function Form() {

    const [github , setGithub] = useState("")
    const [linkedin , setLinkedin] = useState("")

    async function Submit(){
        if (!github && !linkedin){
            toast("Please provide valid github and linkedin urls")
            return;
        }

        await axios.post(`${BACKEND_URL}/api/v1/pre-interview` , {
            linkedin,
            github
        })
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div>
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                Ai Interview kickstart
            </h1>
            <div className="p-2"> 
            <Input placeholder="Linkedin profile url" onChange={e => setLinkedin(e.target.value)}/>
            </div>
            <div className="p-2"> 
            <Input placeholder="Github profile url" onChange={e => setGithub(e.target.value)} />
            </div>
            <div className="flex justify-center items-center p-4">
                <Button onClick={Submit}>Start interview</Button>
            </div>
        </div>
  </div>
    )
}