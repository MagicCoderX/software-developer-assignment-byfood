package database

import (
	"byfood_backend/entities"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Instance *gorm.DB
var err error

func Connect(connectionString string) {
	Instance, err = gorm.Open(mysql.Open(connectionString), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
		panic("Failed to connect to database")
	}

	log.Println("Connected to database")
}

func Migrate() {
	Instance.AutoMigrate(&entities.Book{})
	log.Println("Database migrated")
}