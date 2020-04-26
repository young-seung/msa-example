package entity

import "time"

// Account account entity for database table
type Account struct {
	ID        string     `json:"_id" bson:"_id"`
	Email     string     `json:"email" bson:"email"`
	Password  string     `json:"password" bson:"password"`
	CreatedAt time.Time  `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt" bson:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt" bson:"deletedAt"`
}
