import express from "express";
import { PreTnterviewBody } from "./types";

const app = express()
app.use(express.json())


app.post("/api/v1/pre-interview" , (req,res) => {
    const {success , data} = PreTnterviewBody.safeParse(req.body)
    if (!success){
        res.json({
            message : "invalid credentials"
        })
        return;
    }
})


app.listen(3001)