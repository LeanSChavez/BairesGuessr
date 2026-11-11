import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export const useOnInit = (initialCallback: () => void) => {
  useEffect(() => {
    initialCallback()
  }, [])
}



