import { useLocation } from "react-router-dom";

export const useIsActive = () => {
  const loc = useLocation();

  return (route: string) => loc.pathname === route;
};
