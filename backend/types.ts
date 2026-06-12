import z from "zod";

export const PreTnterviewBody = z.object({
    linkedin : z.string() ,
    github : z.string()
})