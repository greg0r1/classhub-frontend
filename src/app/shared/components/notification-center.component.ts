import { Component, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: Date;
  read: boolean;
  actionUrl?: string;
}

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <button
      mat-icon-button
      [matMenuTriggerFor]="notificationMenu"
      [matBadge]="unreadCount()"
      [matBadgeHidden]="unreadCount() === 0"
      matBadgeColor="warn"
      matBadgeSize="small"
    >
      <mat-icon>notifications</mat-icon>
    </button>

    <mat-menu #notificationMenu="matMenu" class="notification-menu" xPosition="before">
      <div class="notification-header">
        <h3>Notifications</h3>
        @if (unreadCount() > 0) {
          <button mat-button (click)="markAllAsRead(); $event.stopPropagation()">
            Tout marquer comme lu
          </button>
        }
      </div>

      <mat-divider />

      <div class="notification-list">
        @if (notifications().length === 0) {
          <div class="empty-state">
            <mat-icon>notifications_none</mat-icon>
            <p>Aucune notification</p>
          </div>
        } @else {
          @for (notification of notifications(); track notification.id) {
            <div
              class="notification-item"
              [class.unread]="!notification.read"
              (click)="handleNotificationClick(notification); $event.stopPropagation()"
            >
              <div class="notification-icon" [class]="'notification-icon-' + notification.type">
                <mat-icon>{{ getNotificationIcon(notification.type) }}</mat-icon>
              </div>
              <div class="notification-content">
                <h4 class="notification-title">{{ notification.title }}</h4>
                <p class="notification-message">{{ notification.message }}</p>
                <span class="notification-time">{{ formatDate(notification.date) }}</span>
              </div>
              @if (!notification.read) {
                <div class="unread-indicator"></div>
              }
            </div>
          }
        }
      </div>

      <mat-divider />

      <div class="notification-footer">
        <button mat-button routerLink="/app/notifications" (click)="$event.stopPropagation()">
          Voir toutes les notifications
        </button>
      </div>
    </mat-menu>
  `,
  styles: [`
    :host ::ng-deep .notification-menu {
      max-width: 400px;
      width: 400px;
    }

    .notification-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
    }

    .notification-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .notification-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      color: rgba(0, 0, 0, 0.38);
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    .notification-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      cursor: pointer;
      transition: background-color 0.2s;
      position: relative;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    .notification-item:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .notification-item.unread {
      background-color: rgba(63, 81, 181, 0.04);
    }

    .notification-item:last-child {
      border-bottom: none;
    }

    .notification-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notification-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .notification-icon-info {
      background-color: rgba(33, 150, 243, 0.1);
      color: #2196f3;
    }

    .notification-icon-success {
      background-color: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }

    .notification-icon-warning {
      background-color: rgba(255, 152, 0, 0.1);
      color: #ff9800;
    }

    .notification-icon-error {
      background-color: rgba(244, 67, 54, 0.1);
      color: #f44336;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      margin: 0 0 4px;
      font-size: 14px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .notification-message {
      margin: 0 0 8px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.6);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .notification-time {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.38);
    }

    .unread-indicator {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #3f51b5;
    }

    .notification-footer {
      padding: 8px;
      text-align: center;
    }

    .notification-footer button {
      width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationCenterComponent implements OnInit {
  readonly notifications = signal<Notification[]>([]);
  readonly unreadCount = signal(0);

  ngOnInit(): void {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    // TODO: Replace with real API call
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Nouveau cours disponible',
        message: 'Un nouveau cours de CrossFit WOD est disponible pour mercredi prochain',
        type: 'info',
        date: new Date(2025, 10, 16, 10, 30),
        read: false,
        actionUrl: '/app/courses'
      },
      {
        id: '2',
        title: 'Inscription confirmée',
        message: 'Votre inscription au cours de Yoga Vinyasa du 19/11 a été confirmée',
        type: 'success',
        date: new Date(2025, 10, 15, 14, 20),
        read: false
      },
      {
        id: '3',
        title: 'Cours complet',
        message: 'Le cours de HIIT du 20/11 est complet. Inscrivez-vous sur liste d\'attente',
        type: 'warning',
        date: new Date(2025, 10, 14, 16, 45),
        read: true
      }
    ];

    this.notifications.set(mockNotifications);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    const count = this.notifications().filter(n => !n.read).length;
    this.unreadCount.set(count);
  }

  markAllAsRead(): void {
    const updated = this.notifications().map(n => ({ ...n, read: true }));
    this.notifications.set(updated);
    this.updateUnreadCount();
    // TODO: Call API to mark all as read
  }

  handleNotificationClick(notification: Notification): void {
    // Mark as read
    const updated = this.notifications().map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    this.notifications.set(updated);
    this.updateUnreadCount();

    // TODO: Call API to mark as read
    // TODO: Navigate to actionUrl if provided
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'info': return 'info';
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'notifications';
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
}
