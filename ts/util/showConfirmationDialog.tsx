// Copyright 2015 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

type ConfirmationDialogViewProps = {
  onTopOfEverything?: boolean;
  dialogName: string;
  cancelText?: string;
  confirmStyle?: 'affirmative' | 'negative';
  message: string;
  okText: string;
  reject?: (error: Error) => void;
  resolve: () => void;
};

let confirmationDialogViewNode: HTMLElement | undefined;
let confirmationDialogPreviousFocus: HTMLElement | undefined;

function removeConfirmationDialog() {
  if (!confirmationDialogViewNode) {
    return;
  }

  unmountComponentAtNode(confirmationDialogViewNode);
  document.body.removeChild(confirmationDialogViewNode);

  if (
    confirmationDialogPreviousFocus &&
    typeof confirmationDialogPreviousFocus.focus === 'function'
  ) {
    confirmationDialogPreviousFocus.focus();
  }
  confirmationDialogViewNode = undefined;
}

export function showConfirmationDialog(
  options: ConfirmationDialogViewProps
): void {
  if (confirmationDialogViewNode) {
    removeConfirmationDialog();
  }

  confirmationDialogViewNode = document.createElement('div');
  document.body.appendChild(confirmationDialogViewNode);

  confirmationDialogPreviousFocus = document.activeElement as HTMLElement;

  render(
    <ConfirmationDialog
      dialogName={options.dialogName}
      onTopOfEverything={options.onTopOfEverything}
      actions={[
        {
          action: () => {
            options.resolve();
          },
          style: options.confirmStyle,
          text: options.okText || window.i18n('ok'),
        },
      ]}
      cancelText={options.cancelText || window.i18n('cancel')}
      i18n={window.i18n}
      onCancel={() => {
        if (options.reject) {
          options.reject(new Error('showConfirmationDialog: onCancel called'));
        }
      }}
      onClose={() => {
        removeConfirmationDialog();
      }}
      title={options.message}
    />,
    confirmationDialogViewNode
  );
}
