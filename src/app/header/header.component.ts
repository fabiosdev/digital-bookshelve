import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;

  constructor(private authService: AuthService) { }

  // ici on utilise onAuthStateChanged() qui permet d'observer l'état de l'authentification de l'utilisateur
  // A chaque changement d'état, la fonction que vous passez en argument est éxécutée
  // Si l'utilisateur est bien authentifié, onAuthStateChanged() reçoit l'objet de type firebase.User correspondant à l'utilisateur
  // On peut ainsi baser la valeur de la variable locale isAuth selon l'etat d'authentification de l'utilisateur et afficher les liens correspondant à cet état
  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if(user) {
          this.isAuth = true;
        }
        else {
          this.isAuth = false;
        }
      }
    );
  }

  onSignOut() {
    this.authService.signOutUser();
  }

}
