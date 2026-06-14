import { Form } from "@/components/form";
import { useState } from "react";
import { Result } from "./components/rersult";
import { Interview } from "./components/interview";
import { Toaster } from "sonner";
import {BrowserRouter , Routes , Route} from "react-router"
export function App() {
  const [page, setPage] = useState<"form" | "interview" | "result">("form");

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Form/>}/>
          <Route path="/interview/:interviewId" element={<Interview/>}/>
          <Route path="/result/:interviewId" element={<Result/>}/>
        </Routes>
    <Toaster position="bottom-left"/>
  </BrowserRouter>

  )
}

export default App;
