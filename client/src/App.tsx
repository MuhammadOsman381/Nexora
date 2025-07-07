import './App.css'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <div className='p-5'>
      <Outlet />
    </div>
  )
}

export default App
