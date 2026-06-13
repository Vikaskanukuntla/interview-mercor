import express from "express";
import { PreInterviewBody } from "./types";
import axios from "axios";
import cors from "cors"
import { scrapeGithub } from "./scrapers/github";
import { prisma } from "./db";

const app = express()
app.use(express.json())
app.use(cors())


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

app.listen(3001, () => {
    console.log("Server running on port 3001");
  });