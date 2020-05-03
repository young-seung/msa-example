package main

import (
	"log"

	"github.com/go-redis/redis"
	"github.com/jinzhu/gorm"
	"github.com/young-seung/msa-example/file/commandbus"
	"github.com/young-seung/msa-example/file/config"
	"github.com/young-seung/msa-example/file/controller"
	"github.com/young-seung/msa-example/file/entity"
	"github.com/young-seung/msa-example/file/querybus"
	"github.com/young-seung/msa-example/file/repository"
	"github.com/young-seung/msa-example/file/util"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func getDatabaseConnection(config config.Interface) *gorm.DB {
	user := config.Database().User()
	password := config.Database().Password()
	host := config.Database().Host()
	port := config.Database().Port()
	name := config.Database().Name()
	dialect := "mysql"
	args := user + ":" + password + "@tcp(" + host + ":" + port + ")/" + name + "?parseTime=true"

	connection, err := gorm.Open(dialect, args)
	if err != nil {
		panic(err)
	}
	connection.LogMode(true)
	connection.AutoMigrate(&entity.FileEntity{})
	return connection
}

func getRedisClient(config config.Interface) *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     config.Redis().Address(),
		Password: config.Redis().Password(),
	})
}

func initialize(engine *gin.Engine, config config.Interface, util *util.Util) {
	dbConnection := getDatabaseConnection(config)
	redisClient := getRedisClient(config)
	repository := repository.New(redisClient, dbConnection)
	commandBus := commandbus.New(repository, config)
	queryBus := querybus.New(config, repository)
	controller.New(engine, commandBus, queryBus, util, config)
}

// @securityDefinitions.apikey AccessToken
// @in header
// @name Authorization

func main() {
	config := config.Initialize()
	util := util.Initialize()
	gin.SetMode(config.Server().Mode())
	route := gin.Default()
	initialize(route, config, util)

	route.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	log.Fatal(route.Run(":" + config.Server().Port()))
}
