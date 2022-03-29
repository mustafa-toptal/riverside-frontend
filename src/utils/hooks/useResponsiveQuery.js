import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export const useResponsiveQuery = () => {
  const [isMobile, setIsMobile] = useState(false);
  const bool = useMediaQuery({ query: `(max-width: 760px)` });

  useEffect(() => {
    setIsMobile(bool);
  }, [bool]);

  return isMobile;
};
