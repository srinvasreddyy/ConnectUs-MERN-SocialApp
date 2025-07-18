import { useThemeSelector } from "../store/useThemeSelector.js"
import "../index.css"
import { LoaderCircleIcon } from 'lucide-react'
const pageloading = () => {
  const { theme } = useThemeSelector();
  return (
    <div className='min-h-screen flex items-center justify-center ' data-theme={theme}>
        <LoaderCircleIcon className='animate-spin size-20' />
    </div>
  )
}

export default pageloading