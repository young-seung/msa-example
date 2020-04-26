package account

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
	"github.com/young-seung/msa-example/account/account/aws"
	"github.com/young-seung/msa-example/account/account/command"
	"github.com/young-seung/msa-example/account/account/controller"
	"github.com/young-seung/msa-example/account/account/email"
	"github.com/young-seung/msa-example/account/account/query"
	"github.com/young-seung/msa-example/account/account/repository"
	"github.com/young-seung/msa-example/account/config"
	"github.com/young-seung/msa-example/account/util"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func getMongoDBClient(config config.Interface) *mongo.Collection {
	user := config.Database().User()
	password := config.Database().Password()
	host := config.Database().Host()
	port := config.Database().Port()
	clientOptions := options.Client().ApplyURI(
		"mongodb://" + user + ":" + password + "@" + host + ":" + port,
	)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		panic(err)
	}
	client.Ping(context.TODO(), nil)
	collection := client.Database(
		config.Database().Name(),
	).Collection("accounts")

	return collection
}

func getRedisClient(config config.Interface) *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     config.Redis().Address(),
		Password: config.Redis().Password(),
	})
}

// Initialize initialize account module
func Initialize(
	engine *gin.Engine, config config.Interface, util *util.Util,
) {
	mongoClient := getMongoDBClient(config)
	redisClient := getRedisClient(config)
	repository := repository.New(redisClient, mongoClient)
	email := email.New(config)
	aws := aws.New(config)
	commandBus := command.New(repository, email, aws, config)
	queryBus := query.New(config, repository)
	controller.New(engine, commandBus, queryBus, util, config)
}
