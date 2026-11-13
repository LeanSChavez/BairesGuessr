import { Box } from "@chakra-ui/react"
import { BrowserRouter } from 'react-router-dom'
import { Routing } from "./routes"

export function App() {
  return (
      <Box>
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </Box>
  )
}

export default App