package model

import "time"

// FileModel file model
type FileModel struct {
	ID        string    `json:"id" example:"fileId"`
	AccountID string    `json:"accountId" example:"accountId"`
	Usage     string    `json:"usage" example:"profile"`
	ImageURL  string    `json:"imageUrl" example:"profile.image.com"`
	CreatedAt time.Time `json:"createdAt" example:"createdAt"`
}
