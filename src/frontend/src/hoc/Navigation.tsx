import React from 'react';
import { useNavigate, useLocation, useSearchParams, NavigateFunction, useParams, Params } from 'react-router-dom';

export interface NavigationProps {
  navigate: NavigateFunction;
  location: Location;
  searchParams: URLSearchParams;
  setSearchParams: Function;
  pathParams: Readonly<Params<string>>;
}

export default function withNavigation(Component: React.ComponentType<any>) {
  const displayName = Component.displayName || Component.name || 'Component';

  const ComponentWithNavigation = (props: any) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const pathParams = useParams();
    const nnProps = {
      navigate: useNavigate(),
      location: useLocation(),
      searchParams,
      setSearchParams,
      pathParams,
    };
    return <Component {...props} navigationProps={nnProps} />;
  };

  ComponentWithNavigation.displayName = `withNavigation(${displayName})`;
  return ComponentWithNavigation;
}