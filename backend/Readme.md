## 🍽️ ByFood Assessment Backend

This project is the backend of the ByFood application, developed in Go, using a REST architecture for the API.

## 💻 Technologies Used:

- Go
- API REST

## 📂 Project Architecture

### 📄 Root files

- `api.rest`: API definition file - Blueprint
- `byfood_backend.exe`: Executable of the backend application (compiled).
- `config.go`: Application settings in Go.
- `config.json`: Application settings in JSON format.
- `go.mod`, `go.sum`: Go dependency management.
- `main.go` 🚀: Application entry point.

### 📁 controllers/

Contains the API controllers, responsible for handling requests.

- `bookcontroller.go`: Controller for managing books (e.g.: listing, registration).
- `urlcontroller.go`: Controller for managing URLs, which may indicate features such as URL shortening.

### 📁 database/

Handles interaction with the database.

- `client.go`: Database client implementation.

### 📁 entities/

Defines the entities of the application domain.

- `book.go`: Defines the data structure for "book".

I hope this README is helpful! 😄
