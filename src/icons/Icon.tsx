import React from 'react';
import icons from './icons';
import './Icon.scss';

export interface IconProps {
  name:
    | 'cast'
    | 'cross'
    | 'code'
    | 'cubeOutline'
    | 'downloadOutline'
    | 'edit2Outline'
    | 'eye'
    | 'fileTextOutline'
    | 'lock'
    | 'menu2Outline'
    | 'swapOutline'
    | 'unlockOutline'
    | 'iCursor'
    | 'curly';
  className?: string;
}

export default class Icon extends React.PureComponent<IconProps, {}> {
  public render() {
    const Ico = icons[this.props.name] || icons['close'];
    return (
      <span
        className={`slate-dev-tools-icon icon-${this.props.name} ${this.props.className || ''}`}
      >
        <img src={Ico} alt="" />
      </span>
    );
  }
}
