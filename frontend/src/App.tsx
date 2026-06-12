import { Form } from "@/components/form";
import { useState } from "react";
import { Result } from "./components/rersult";
import { Interview } from "./components/interview";
import { Toaster } from "sonner";
export function App() {
  const [page, setPage] = useState<"form" | "interview" | "result">("form");

  return (
    <div>
    {page === "form" && <Form />}
    {page === "interview" && <Interview />}
    {page === "result" && <Result />}
    <Toaster position="bottom-left"/>
  </div>
  )
}

export default App;
