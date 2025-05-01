import { Button, ButtonSecondary } from "./components/ui/button"
import {Plus} from "lucide-react"


const App = () => {
  return (
    
    <div className="flex justify-center items-center w-full h-screen ">
      <Button className="bg-purple-600 hover:bg-purple-700 text-white" size="lg"> <Plus/> Click me</Button>
    </div>

  
  )
}

export default App
