import React from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

export default function withNavigation(Component: React.ComponentType<any>) {
  const displayName = Component.displayName || Component.name || 'Component';

  const ComponentWithNavigation = (props: any) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const nnProps = {
      navigate: useNavigate(),
      location: useLocation(),
      searchParams,
      setSearchParams,
    };
    return <Component {...props} navigationProps={nnProps} />;
  };

  ComponentWithNavigation.displayName = `withNavigation(${displayName})`;
  return ComponentWithNavigation;
}