package repository

import (
	"encoding/json"
	"time"

	"github.com/go-redis/redis"
	"github.com/jinzhu/gorm"
	"github.com/young-seung/msa-example/account/entity"
)

// Interface repository interface
type Interface interface {
	Start() *gorm.DB
	Create(transaction *gorm.DB, entity *entity.Account) error
	Save(transaction *gorm.DB, entity *entity.Account) error
	Delete(transaction *gorm.DB, accountID string) error
	FindByID(transaction *gorm.DB, accountID string, deleted bool) (entity.Account, error)
	FindByEmail(transaction *gorm.DB, email string, deleted bool) (entity.Account, error)
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

// Create insert the value into database
func (repository *Repository) Create(transaction *gorm.DB, entity *entity.Account) error {
	if err := transaction.Create(entity).Error; err != nil {
		return err
	}
	repository.setCache(entity.ID, entity)
	return nil
}

// Save update value in database, if the value doesn't have primary key, will insert it
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
	connection := transaction
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
	if cache != nil && err == nil {
		return *cache, err
	}

	err = connection.Where(condition).Take(&accountEntity).Error
	return accountEntity, err
}

// FindByID find account by accountId
func (repository *Repository) FindByID(transaction *gorm.DB, accountID string, deleted bool) (entity.Account, error) {
	connection := transaction
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
	if cache != nil && err == nil {
		return *cache, err
	}

	err = connection.Where(condition).Take(&accountEntity).Error
	return accountEntity, err
}
