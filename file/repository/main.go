package repository

import (
	"github.com/go-redis/redis"
	"github.com/jinzhu/gorm"
)

// Interface file repository interface
type Interface interface {
}

// Repository repository for query to database
type Repository struct {
	redis      *redis.Client
	connection *gorm.DB
}

// New create repository instance
func New(redis *redis.Client, connection *gorm.DB) Interface {
	return &Repository{redis: redis, connection: connection}
}
