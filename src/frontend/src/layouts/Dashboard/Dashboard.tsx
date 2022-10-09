import { Component, ReactNode } from "react";

interface DashboardProps {
  someProps?: any;
}

interface DashboardState {
  isMounted?: boolean;
}

export default class Dashboard extends Component<DashboardProps, DashboardState> {
  constructor(props: DashboardProps) {
    super(props);

    this.state = {};
  }


  componentDidMount(): void {
    this.setState({ isMounted: true });
  }

  componentDidUpdate(prevProps: Readonly<DashboardProps>, prevState: Readonly<DashboardState>, snapshot?: any): void {
    console.log(prevState, this.state, "compoent did mount");
  }

  render(): ReactNode {
    const { isMounted: isMountedFromState } = this.state;
    return (
      <div>Hello World {`${isMountedFromState}`}</div>
    )
  }
}