import { BrainCircuit } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';
import { useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="   ">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 h-16">
          <div  className="flex items-center gap-2 flex-wrap" data-testid="link-logo">
          {
            location.pathname !== "/login" && location.pathname !== "/sign-up" && <SidebarTrigger />
          }
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl" data-testid="text-brand-name">Nexora</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;