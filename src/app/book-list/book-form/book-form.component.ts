import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../models/book.model';
import { BooksService } from '../../services/books.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {

  bookForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;

  constructor(private formBuilder: FormBuilder, private booksService: BooksService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      synopsis: ''
    });
  }

  onSaveBook() {
    const title = this.bookForm.get('title').value;
    const author = this.bookForm.get('author').value;
    const synopsis = this.bookForm.get('synopsis').value;
    const newBook = new Book(title, author);
    newBook.synopsis = synopsis;
    // Il faut modifier légèrement  onSaveBook()  pour prendre en compte l'URL de la photo si elle existe :
    if(this.fileUrl && this.fileUrl != '') {
      newBook.photo = this.fileUrl;
    }
    this.booksService.createNewBook(newBook);
    this.router.navigate(['/books']);
  }

  // méthode qui déclenchera  uploadFile()  et qui en récupérera l'URL retourné :
  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.booksService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;  
      }
    );
  }

  // Vous utiliserez  fileIsUploading  pour désactiver le bouton  submit  du template pendant le chargement du fichier afin d'éviter toute erreur
  // une fois l'upload terminé, le component enregistre l'URL retournée dans  fileUrl  et modifie l'état du component pour dire que le chargement est terminé.

  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);
  }
  // L'événement est envoyé à cette méthode depuis une nouvelle section du template :
}
