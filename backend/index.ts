import express from "express";
import { PreInterviewBody } from "./types";
import axios from "axios";
import cors from "cors"
import { scrapeGithub } from "./scrapers/github";
import { prisma } from "./db";
import { initSideBand } from "./sideband";

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.text({ type: ["application/sdp", "text/plain"] }));


app.post("/api/v1/pre-interview" , async (req,res) => {
    const {success , data} = PreInterviewBody.safeParse(req.body)
    if (!success){
        res.json({
            message : "invalid credentials"
        })
        return;
    }


    
    const githubUrl = data.github.endsWith("/") ? data.github.slice(0 , -1) : data.github;
    

    const githubUsername = githubUrl.split("/").pop() || ""
 
    const githubData = await scrapeGithub(githubUsername);

    
    const interview = await prisma.interview.create({
        data: {
            githubMetadata: githubData,
            status: "Pre",
            score: 0,
        }
    })
        res.json({
            id : interview.id
        })
})

app.post("/api/v1/session/:interviewId" , async (req , res) => {

    const sessionConfig = JSON.stringify({
        type: "realtime",
        model: "gpt-realtime-2",
        audio: { output: { voice: "marin" } },
      });


      const fd = new FormData();
      fd.set("sdp", req.body);
      fd.set("session", sessionConfig);
    
      try {
        const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "OpenAI-Safety-Identifier": "hashed-user-id",
          },
          body: fd,
        });
        // Location: /v1/realtime/calls/rtc_123456
        const location = sdpResponse.headers.get("Location");
        const callId = location?.split("/").pop()!;
        console.log(callId);


        // Send back the SDP we received from the OpenAI REST API
        const sdp = await sdpResponse.text();
        res.send(sdp);
        initSideBand(callId , req.params.interviewId)
      } catch (error) {
        console.error("Token generation error:", error);
        res.status(500).json({ error: "Failed to generate token" });
      }
})

app.post("/api/v1/session/user/response/:interviewId" , async (req , res) => {
    const {message} = req.body;
    await prisma.message.create({
      data : {
        interviewId : req.params.interviewId!,
        type : "User",
        message : message
      }
    })
    res.json({message : "Message Saved"})
})


app.listen(3001, () => {
    console.log("Server running on port 3001");
  });