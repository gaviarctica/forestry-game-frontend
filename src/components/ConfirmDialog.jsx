import React, { Component } from 'react';
import Button from './Button';
import './ConfirmDialog.css';
import { LANG } from './lang';

export default function ConfirmDialog(props) {
  return (
    <div className="ConfirmDialog" id={props.id}>
      <div id="confirm-dialog">
        <div className="dialog-text">
          {props.text}
        </div>
        <Button
          id="confirm-dialog-button-secondary"
          text={LANG[props.lang].buttons.no}
          buttonType="default"
          handleClick={() => props.noClicked()} />
        <Button
          id="confirm-dialog-button-primary"
          text={LANG[props.lang].buttons.yes}
          buttonType="primary"
          handleClick={() => props.yesClicked()} />
      </div>
    </div>
    );
}
