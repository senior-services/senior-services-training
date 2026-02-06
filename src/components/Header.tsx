import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
// Using uploaded logo image

interface HeaderProps {
  userRole: 'admin' | 'employee';
  userName: string;
  userEmail: string;
  onLogout: () => void;
}
export const Header = ({
  userRole,
  userName,
  userEmail,
  onLogout
}: HeaderProps) => {
  const subtitle = userRole === 'admin' ? 'Administrator Dashboard' : 'Employee Portal';
  return <header className="bg-background-header border-b border-border-primary shadow-card">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-6 hover:opacity-80 transition-all duration-200">
              <img src="/lovable-uploads/SS_logo_reversed_cropped.png" alt="Senior Services for South Sound" className="h-12 w-auto object-cover py-[5px]" style={{
              objectPosition: 'left center'
            }} />
              <div>
                <h1 className="text-xl text-primary-foreground">
                  <span className="font-bold">Learning Hub</span>{' '}
                  <span className="font-normal">/ {userRole === 'admin' ? 'Admin' : 'Employee'} Dashboard</span>
                  {userRole === 'admin' && (
                    <Badge variant="attention" showIcon className="ml-2 text-xs align-middle">
                      Admin
                    </Badge>
                  )}
                </h1>
              </div>
            </Link>
          </div>

          {/* Right Side - User Info and Logout */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary-foreground flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="hidden sm:inline text-sm font-medium text-primary-foreground">{userName}</span>
            <span className="text-primary-foreground/40" aria-hidden="true">|</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-transparent px-1"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>

      </div>
    </header>;
};