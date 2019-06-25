import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import  { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }
  onSubmit() {
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;

    this.authService.createNewUser(email, password).then(
      () => {
        this.router.navigate(['/books']);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

  // Dans ce compoment , on gère le formulaire selon la méthode réactive,
  // Les 2 champs email et password sont requis
  // Le champ email utilise Validators.pattern pour obliger au moins 6 caractères alplanumériques (min. requis par firebase)
  // On gère la soumission du formulaire, envoyant les valeurs rentrées par l'utilisateur à la méthode createNewUser()
  // Si la création fonctionne on redirige l'utilisateur vers /books
  // Si la creation échoue, on affiche le message d'erreur renvoyé par firebase

}
