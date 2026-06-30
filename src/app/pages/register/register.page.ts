import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonInput,
         IonItem, IonLabel,
         ToastController, LoadingController } from '@ionic/angular/standalone';

//register page uses the authservice to handle user registration.

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  standalone: true,
  imports: [FormsModule, IonContent, IonButton,
            IonInput, IonItem, IonLabel]
})
export class RegisterPage {

  userEmail: string = '';
  userPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ionViewWillEnter() {
    this.userEmail = '';
    this.userPassword = '';
    this.confirmPassword = '';
  }

  async registerUser() {
    if (!this.userEmail || !this.userPassword || !this.confirmPassword) {
      await this.showToast('Please fill in all fields.');
      return;
    }

    if (this.userPassword !== this.confirmPassword) {
      await this.showToast('Passwords do not match.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creating account...'
    });
    await loading.present();

    this.authService.register(this.userEmail, this.userPassword).subscribe({
      next: async () => {
        await loading.dismiss();
        await this.showToast('Account created! Please log in.');
        this.router.navigate(['/login']);
      },
      error: async () => {
        await loading.dismiss();
        await this.showToast('Registration failed. Email may already be in use.');
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

  goToLogin() {
    this.router.navigate(['/login']);
  }
}