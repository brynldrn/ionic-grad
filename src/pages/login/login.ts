import { AuthService } from './../../app/_services/auth.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Headers, Http } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { Storage } from "@ionic/storage";
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private LOGIN_URL: string;
  auth: AuthService;
  authType: string = 'login';

  contentHeader = new Headers({"Content-Type": "application/json"});
  error: string;
  jwtHelper = new JwtHelper();
  user: string;

  constructor(private http: Http, private storage: Storage, public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController) {
    this.auth = AuthService;
    this.LOGIN_URL = 'http://localhost:4000/api/v1/users/auth';
    // storage.ready().then(() => {
    //   storage.get('profile').then(profile => {
    //     this.user = JSON.parse(profile);
    //   }).catch(console.log);
    // });
  }

  authenticate(credentials) {
    this.authType == 'login' ? this.login(credentials) : null;
  }

  login(credentials) {
    this.http.post(this.LOGIN_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => this.verifyAuth(data),
      err => this.errorAlert(err)
      );
  }

  // signup(credentials) {
  //   this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
  //     .map(res => res.json())
  //     .subscribe(
  //     data => this.authSuccess(data.id_token),
  //     err => this.error = err
  //     );
  // }

  logout() {
    this.storage.remove('token');
    this.user = null;
  }

  verifyAuth(data) {
    if (data.token) {
      this.error = null;
      this.storage.set('token', data);
      this.user = this.jwtHelper.decodeToken(JSON.stringify(data)).username;
      this.storage.set('profile', this.user);
      this.navCtrl.setRoot(TabsPage);
    } else {
      this.errorAlert('Please provide a valid username/password');
    }
  }

  errorAlert(err) {
    this.error = err;
    let invalidDetails = this.toastCtrl.create({
      message: 'Please provide a valid username/password',
      duration: 5000,
      position: 'bottom'
    });

    invalidDetails.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
