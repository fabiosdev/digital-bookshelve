import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Book } from '../models/book.model';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[] = [];
  booksSubject = new Subject<Book[]>();

  emitBooks() {
    this.booksSubject.next(this.books);
  }

  // Méthode mise à disposition par firebase pour enregistrer la liste sur un node de la base de données (méthode set)
  // Maintenant que l'on peut enregistrer la liste, on va créer des méthodes pour récupérer la liste entière des livres et pour récupérer un seul livre, en employant les 2 fonctions proposées par firebase

  saveBooks() {
    firebase.database().ref('/books').set(this.books);
  }

  getBooks() {
    firebase.database().ref('/books')
      .on('value', (data: DataSnapshot) => {
          this.books = data.val() ? data.val() : [];
          this.emitBooks();
        }
      );
  }

  // pour getBooks(), on utilise la méthode on(). Le premier argument value demande à firebase d'éxécuter le callback à chaque modif. de valeur enregistrée au endpoint choisi :
  // Cela veut dire que si on modifie quelque chose depuis un appareil, la liste sera automatiquement mise à jour sur tous les appareils connectés

  // La fonction  getSingleBook()  récupère un livre selon son id, qui est simplement ici son index dans l'array enregistré.
  // Vous utilisez  once() , qui ne fait qu'une seule requête de données.  Du coup, elle ne prend pas une fonction callback en argument mais retourne une Promise, permettant l'utilisation de  .then()  pour retourner les données reçues.

  getSingleBook(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  // il ne reste plus qu'à créer les méthodes pour la création d'un nouveau livre et la suppression d'un livre existant :

  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book) {
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if(bookEl === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
  }

  constructor() {
    this.getBooks();
  }
}
