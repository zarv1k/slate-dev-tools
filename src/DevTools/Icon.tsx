import React from 'react';
import classNames from 'classnames';
// import './icons.scss';

export interface IconProps {
  name: string;
  size?: 'sm' | 'lg' | 'xlg' | '2x' | '3x' | '4x' | '5x';
  tag?: 'span' | 'i';
  spin?: boolean;
  className?: string;
  // tslint:disable-next-line no-any
  onClick?: (...args: any[]) => void;
  title?: string;
  show?: boolean;
}

export default class Icon extends React.PureComponent<IconProps, {}> {
  public render() {
    if (this.props.show !== undefined && !this.props.show) {
      return null;
    }
    const prefix: string = 'i i-';
    const classes: string = classNames(
      prefix + this.props.name,
      this.props.className,
      {['i-' + this.props.size]: !!this.props.size},
      {'i-spin': this.props.spin}
    );
    let result: JSX.Element;
    switch (this.props.tag) {
      case 'i':
        result = <i className={classes} onClick={this.props.onClick} title={this.props.title} />;
        break;
      default:
        result = <span className={classes} onClick={this.props.onClick} title={this.props.title} />;
        break;
    }
    return result;
  }
}
