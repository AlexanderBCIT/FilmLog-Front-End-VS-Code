import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonInput,
         IonItem, IonLabel,
         ToastController, LoadingController } from '@ionic/angular/standalone';
         
//Uses the authservice to handle user login.
//if login is succ, jwt token = saved to ls and user navigated to search bar page.

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  standalone: true,
  imports: [FormsModule, IonContent, IonButton,
            IonInput, IonItem, IonLabel]
})
export class LoginPage {

  userEmail: string = '';
  userPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ionViewWillEnter() {
    this.userEmail = '';
    this.userPassword = '';
  }

  async loginUser() {
    if (!this.userEmail || !this.userPassword) {
      await this.showToast('Please fill in all fields.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Logging in...'
    });
    await loading.present();

    this.authService.login(this.userEmail, this.userPassword).subscribe({
      next: async (res) => {
        this.authService.saveToken(res.token);
        await loading.dismiss();
        await this.showToast('Welcome back!');
        this.router.navigate(['/tabs/search']);
      },
      error: async () => {
        await loading.dismiss();
        await this.showToast('Invalid email or password.');
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    await toast.present();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}