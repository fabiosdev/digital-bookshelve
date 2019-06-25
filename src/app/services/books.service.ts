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

    // On ajoute à removeBook la possibilité de supprimer également l'image dans upload file
    // Puisqu'il faut une référence pour supprimer un fichier avec la méthode  delete() , vous passez l'URL du fichier à  refFromUrl()  pour en récupérer la référence.
    if(book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo removed!');
        },
        (error) => {
          console.log('Could not remove photo! : ' + error);
        }
      );
    }
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if(bookEl === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks()
  }

  uploadFile(file: File) {
    // l'action de télécharger un fichier prend du temps, donc vous créez une méthode asynchrone qui retourne une Promise ;
    // la méthode prend comme argument un fichier de type File ;
    // afin de créer un nom unique pour le fichier (évitant ainsi d'écraser un fichier qui porterait le même nom que celui que 
    // l'utilisateur essaye de charger), vous créez un string à partir de  Date.now() , qui donne le nombre de millisecondes passées depuis le 1er janvier 1970 ;
    // vous créez ensuite une tâche de chargement  upload  :

    // firebase.storage().ref()  vous retourne une référence à la racine de votre bucket Firebase,
    // la méthode  child()  retourne une référence au sous-dossier  images  et à un nouveau fichier dont le nom est l'identifiant unique + le nom original du fichier (permettant de garder le format d'origine également),
    // vous utilisez ensuite la méthode  on()  de la tâche  upload  pour en suivre l'état, en y passant trois fonctions :
    // la première est déclenchée à chaque fois que des données sont envoyées vers le serveur,
    // la deuxième est déclenchée si le serveur renvoie une erreur,
    // la troisième est déclenchée lorsque le chargement est terminé et permet de retourner l'URL unique du fichier chargé.
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.downloadURL);
          }
        );
      }
    );
  }

  constructor() {
    this.getBooks();
  }
}
