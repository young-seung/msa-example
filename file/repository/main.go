package repository

import (
	"encoding/json"
	"errors"
	"time"

	"github.com/go-redis/redis"
	"github.com/jinzhu/gorm"
	"github.com/young-seung/msa-example/file/entity"
)

// Interface file repository interface
type Interface interface {
	Start() *gorm.DB
	Create(transaction *gorm.DB, fileID, accountID, usage string) (*entity.File, error)
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

// Start begins a transaction
func (repository *Repository) Start() *gorm.DB {
	return repository.connection.Begin()
}

// Create insert file entity into database
func (repository *Repository) Create(transaction *gorm.DB, fileID, accountID, usage string) (*entity.File, error) {
	if transaction == nil {
		return nil, errors.New("transaction is nil")
	}
	fileEntity := entity.File{ID: fileID, AccountID: accountID, Usage: usage}
	err := transaction.Create(&fileEntity).Error
	defer transaction.Rollback()
	checkError(err)

	repository.setCache(&fileEntity)
	return &fileEntity, err
}

func (repository *Repository) setCache(fileEntity *entity.File) {
	marshaled, err := json.Marshal(&fileEntity)
	checkError(err)

	key := "file:" + fileEntity.ID
	value := string(marshaled)
	expiration := time.Second

	repository.redis.Set(key, value, expiration)
}

func (repository *Repository) getCache(fileID string) (*entity.File, error) {
	if fileID == "" {
		return nil, errors.New("fileID is empty")
	}

	key := "file:" + fileID
	data, err := repository.redis.Get(key).Result()
	checkError(err)

	fileEntity := &entity.File{}
	err = json.Unmarshal([]byte(data), fileEntity)
	checkError(err)

	return fileEntity, err
}

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}
