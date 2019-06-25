import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyCbWKBYuzjOKudjEdUWW8HBTIw3Uv1Dee4",
      authDomain: "appli-book.firebaseapp.com",
      databaseURL: "https://appli-book.firebaseio.com",
      projectId: "appli-book",
      storageBucket: "gs://appli-book.appspot.com/",
      messagingSenderId: "834651242204",
      appId: "1:834651242204:web:b7630183913196cd"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
}
