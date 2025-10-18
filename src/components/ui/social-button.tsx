import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";

interface SocialButtonProps extends ButtonProps {
  icon: React.ReactNode;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, children, className, ...props }) => {
  return (
    <Button {...props} className={`${className ?? ""} flex items-center justify-center gap-2`}>
      {icon}
      <span>{children}</span>
    </Button>
  );
};

export default SocialButton;
