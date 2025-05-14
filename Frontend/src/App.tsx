import { Button } from "./components/ui/Button"
import { ShareIcon }  from "./icons/ShareIcon"
import { PlusIcon }  from "./icons/PlusIcon"

const App = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Custom Color Buttons</h2>
      
      <div className="flex flex-wrap gap-3">
        <Button color="lightpurple"><ShareIcon/> Share Button</Button>
        <Button color="primary" ><PlusIcon /> Add Content</Button>
        
      </div>
      
      
      
    </div>

    
  )
}

export default App
