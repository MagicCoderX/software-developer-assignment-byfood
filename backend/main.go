package main 

import (
	"fmt"
	"byfood_backend/controllers"
	"byfood_backend/database"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func RegisterBookRoutes(router *mux.Router) {
	router.HandleFunc("/api/books", controllers.GetBooks).Methods("GET")
	router.HandleFunc("/api/books/{id}", controllers.GetBookById).Methods("GET")
	router.HandleFunc("/api/books", controllers.CreateBook).Methods("POST")
	router.HandleFunc("/api/books/{id}", controllers.UpdateBook).Methods("PUT")
	router.HandleFunc("/api/books/{id}", controllers.DeleteBook).Methods("DELETE")
}

func URLServiceRoutes(router *mux.Router) {
	router.HandleFunc("/api/shorten", controllers.ShortenURL).Methods("POST")
}

func main() {
	LoadAppConfig()

	database.Connect(AppConfig.ConnectionString)
	database.Migrate()

	router := mux.NewRouter().StrictSlash(true)

	RegisterBookRoutes(router)
	URLServiceRoutes(router)

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type"},
	})

	handler := c.Handler(router)

	log.Println(fmt.Sprintf("Starting Server on port %s", AppConfig.Port))
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", AppConfig.Port), handler))
}