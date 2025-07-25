import { style } from '@angular/animations';
import { Component, Injectable } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';



@Injectable({
  providedIn: 'root'
})

export class NotificationUtilService {
  constructor(private notificationService: NotificationService) {}

  showMessage(message: string) {
    this.notificationService.show({
      content: `${message}.`,
      cssClass: 'button-notification',
      animation: { type: 'fade', duration: 200 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: 'success', icon: true },
      hideAfter: 2000
    });
  }

}














