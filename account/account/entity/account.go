package entity

import "time"

// Account account entity for database table
type Account struct {
	ID        string     `json:"_id" bson:"_id"`
	Email     string     `json:"email" bson:"email"`
	SocialID  string     `json:"socialId" bson:"socialId"`
	Password  string     `json:"password" bson:"password"`
	Provider  string     `json:"provider" bson:"provider"`
	FCMToken  string     `json:"fcmToken" bson:"fcmToken"`
	Gender    string     `json:"gender" bson:"gender"`
	CreatedAt time.Time  `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt" bson:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt" bson:"deletedAt"`
}
