package controllers

import (
	"encoding/json"
	"byfood_backend/database"
	"byfood_backend/entities"
	"net/http"
	"fmt"

	"github.com/gorilla/mux"
)

func CreateBook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var book entities.Book
	_ = json.NewDecoder(r.Body).Decode(&book)
	fmt.Println("Adding a new book: ", book)
	database.Instance.Create(&book)
	json.NewEncoder(w).Encode(book)
}


func checkIfBookExists(bookID string) bool {
	var book entities.Book
	database.Instance.First(&book, bookID)
	if book.ID == 0 {
		return false
	}
	return true
}

func GetBookById(w http.ResponseWriter, r *http.Request) {
	bookID := mux.Vars(r)["id"]
	fmt.Println("Getting book by id: ", bookID);
	if checkIfBookExists(bookID) == false {
		json.NewEncoder(w).Encode("Book Not Found!")
		return
	}
	var book entities.Book
	database.Instance.First(&book, bookID)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(book)
}

func GetBooks(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Getting all books");
	var books []entities.Book
	database.Instance.Find(&books)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(books)
}

func UpdateBook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	bookID := mux.Vars(r)["id"]
	if checkIfBookExists(bookID) == false {
		json.NewEncoder(w).Encode("Book Not Found!")
		return
	}
	var book entities.Book
	database.Instance.First(&book, bookID)
	_ = json.NewDecoder(r.Body).Decode(&book)
	fmt.Println("Updating book by id: ", bookID, "\n payload:", book);
	database.Instance.Save(&book)
	json.NewEncoder(w).Encode(book)
}

func DeleteBook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	bookID := mux.Vars(r)["id"]
	fmt.Println("Deleting book by id: ", bookID);
	if checkIfBookExists(bookID) == false {
		json.NewEncoder(w).Encode("Book Not Found!")
		return
	}
	var book entities.Book
	database.Instance.First(&book, bookID)
	database.Instance.Delete(&book)
	json.NewEncoder(w).Encode("Book Deleted!")
}