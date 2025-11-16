import { useLocation} from "react-router-dom";

export function useBreadcrumbs() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = pathnames.map((part, index) => {
    const url = "/" + pathnames.slice(0, index + 1).join("/");

    return {
      label: part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      url,
      isLast: index === pathnames.length - 1,
    };
  });

  return breadcrumbs;
}
