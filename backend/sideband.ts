import { prisma } from "./db";
import WebSocket from "ws";

export async function initSideBand(callId : string , interviewId : string){
    const url = "wss://api.openai.com/v1/realtime?call_id=" + callId;
    const ws = new WebSocket(url, {
        headers: {
            Authorization: "Bearer " + process.env.OPENAI_API_KEY,
        },
    });

    const interview = await prisma.interview.findFirst({
      where: {
        id : interviewId
      }
    })





    ws.on("open", function open() {
        console.log("Connected to server.");
      
        // Send client events over the WebSocket once connected
        ws.send(
          JSON.stringify({
            type: "session.update",
            session: {
              type: "realtime",
              instructions: `You are supposed to interview this user on their computer science intellect . Ask around 2-3 questions based 
                on their experience. Please use english during the interview !
                Here is everything about the users github, will give you a rough idea about what the use does -
                ##Github metadata
                ${interview?.githubMetadata}
              `
            },
          })
        );
    });
      ws.on("message", async function incoming(message) {
         const parsedMessage = JSON.parse(message.toString())
         if (parsedMessage.type === "response.done"){
              let contents : {type : string , transcript : string}[] = []
              // @ts-ignore
              parsedMessage.response.output.map(x => contents = [...contents , ...x.contents])
              const assistantMessage = contents.filter(x => x.type === "output_audio").map(x => x.transcript).join(" ");
              await prisma.message.create({
                data : {
                    interviewId,
                    type: "Assistant",
                    message : assistantMessage
                }
              })
              
         }
      });
}