import { SidebarTrigger } from './ui/sidebar';
import { useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();

  return (
    <div className=' border-b border-gray-300 h-16 w-full flex items-center'>
      {
        location.pathname !== "/" && location.pathname !== "/sign-up" && <SidebarTrigger />
      }
      <span className='ml-1 text-slate-700 font-semibold bg-slate-200 border border-slate-300 p-1 px-2 rounded-lg'>
        Nexora
      </span>
    </div>
  );
};

export default NavBar;