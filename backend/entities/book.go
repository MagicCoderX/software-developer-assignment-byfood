package entities

type Book struct {
	ID 			int 	`json:"id"`
	Title 		string 	`json:"title"`
	Type 		string 	`json:"type"`
	Author 		string 	`json:"author"`
	Year 		int 	`json:"year"`
}