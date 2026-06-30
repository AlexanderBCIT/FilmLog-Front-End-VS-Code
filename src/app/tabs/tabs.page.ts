import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IonTabs, IonTabBar, IonTabButton,
         IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, bookmarkOutline,
         checkmarkCircleOutline, barChartOutline,
         logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class TabsPage {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ searchOutline, bookmarkOutline,
               checkmarkCircleOutline, barChartOutline,
               logOutOutline });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}