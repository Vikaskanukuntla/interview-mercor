"use client"
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import "../../styles/globals.css";
import { useState } from "react";

import { toast } from "sonner"
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { useNavigate } from "react-router";

export function Form() {
    const [loading , setLoading] = useState(false)
    const [github , setGithub] = useState("")
    const navigate  = useNavigate()

    async function Submit(){
        if (!github ){
            toast("Please provide valid github and linkedin urls")
            return;
        }

        setLoading(true);
        const response = await axios.post(`${BACKEND_URL}/api/v1/pre-interview` , { 
            github
        })   
        navigate(`/interview/${response.data.id}`)
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div>
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                Ai Interview kickstart
            </h1>
           
            <div className="p-2"> 
            <Input placeholder="Github profile url" onChange={e => setGithub(e.target.value)} />
            </div>
            <div className="flex justify-center items-center p-4">
                <Button disabled={loading} onClick={Submit}> {loading ? "Starting Interview.." : "Start interview"}</Button>
            </div>
        </div>
  </div>
    )
}