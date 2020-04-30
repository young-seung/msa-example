package repository

import (
	"encoding/json"
	"time"

	"github.com/go-redis/redis"
	"github.com/jinzhu/gorm"
	"github.com/young-seung/msa-example/account/account/entity"
	"go.mongodb.org/mongo-driver/mongo"
)

// Interface repository interface
type Interface interface {
	Start() *gorm.DB
	Commit(transaction *gorm.DB)
	RollBack(transaction *gorm.DB)
	Save(transaction *gorm.DB, entity *entity.Account) error
	Delete(transaction *gorm.DB, accountID string) error
	FindByID(transaction *gorm.DB, accountID string, deleted bool) (entity.Account, error)
	FindByEmail(transaction *gorm.DB, email string, deleted bool) (entity.Account, error)
}

// Repository repository for query to database
type Repository struct {
	redis      *redis.Client
	mongo      *mongo.Collection
	connection *gorm.DB
}

// New create repository instance
func New(
	redis *redis.Client,
	mongo *mongo.Collection,
	connection *gorm.DB,
) Interface {
	return &Repository{mongo: mongo, redis: redis, connection: connection}
}

func (repository *Repository) setCache(key string, accountEntity *entity.Account) {
	marshaledEntity, _ := json.Marshal(&accountEntity)
	redisKey := "account:" + key
	redisValue := string(marshaledEntity)
	expiration := time.Second
	repository.redis.Set(redisKey, redisValue, expiration)
}

func (repository *Repository) getCache(key string) (*entity.Account, error) {
	redisKey := "account:" + key
	data, getDataFromRedisError := repository.redis.Get(redisKey).Result()
	if data == "" || getDataFromRedisError != nil {
		return nil, getDataFromRedisError
	}

	entity := &entity.Account{}
	jsonUnmarshalError := json.Unmarshal([]byte(data), entity)
	if entity.ID == "" || jsonUnmarshalError != nil {
		return nil, jsonUnmarshalError
	}

	return entity, nil
}

// Start start database transaction
func (repository *Repository) Start() *gorm.DB {
	return repository.connection.Begin()
}

// Commit commit transation
func (repository *Repository) Commit(transaction *gorm.DB) {
	transaction.Commit()
}

// RollBack rollback transaction
func (repository *Repository) RollBack(transaction *gorm.DB) {
	transaction.Rollback()
}

// Save create or update account
func (repository *Repository) Save(transaction *gorm.DB, entity *entity.Account) error {
	if err := transaction.Save(entity).Error; err != nil {
		return err
	}
	repository.setCache(entity.ID, entity)
	return nil
}

// Delete delete account by accountId
func (repository *Repository) Delete(transaction *gorm.DB, accountID string) error {
	condition := entity.Account{ID: accountID}
	return transaction.Delete(condition).Error
}

// FindByEmail find account by email
func (repository *Repository) FindByEmail(transaction *gorm.DB, email string, deleted bool) (entity.Account, error) {
	var connection *gorm.DB
	if transaction == nil {
		connection = repository.connection
	}
	accountEntity := entity.Account{}
	condition := entity.Account{Email: email}

	if deleted == true {
		err := connection.Unscoped().Where(&condition).Take(&accountEntity).Error
		return accountEntity, err
	}

	cache, err := repository.getCache(email)
	if cache == nil || err != nil {
		return accountEntity, err
	}

	err = connection.Where(condition).Take(&accountEntity).Error
	return accountEntity, err
}

// FindByID find account by accountId
func (repository *Repository) FindByID(transaction *gorm.DB, accountID string, deleted bool) (entity.Account, error) {
	var connection *gorm.DB
	if transaction == nil {
		connection = repository.connection
	}
	accountEntity := entity.Account{}
	condition := entity.Account{ID: accountID}

	if deleted == true {
		err := connection.Unscoped().Where(&condition).Take(&accountEntity).Error
		return accountEntity, err
	}

	cache, err := repository.getCache(accountID)
	if cache == nil || err != nil {
		return accountEntity, err
	}

	err = connection.Where(condition).Take(&accountEntity).Error
	return accountEntity, err
}
