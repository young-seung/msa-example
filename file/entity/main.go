package entity

import "time"

// File file entity
type File struct {
	ID        string `gorm:"primary_key"`
	AccountID string `gorm:"not null"`
	Usage     string `gorm:"not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time `sql:"index"`
}
