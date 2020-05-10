package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/young-seung/msa-example/file/commandbus"
	"github.com/young-seung/msa-example/file/config"
	"github.com/young-seung/msa-example/file/querybus"
	"github.com/young-seung/msa-example/file/util"
)

// Controller file controller
type Controller struct {
	route      *gin.Engine
	commandBus commandbus.Interface
	queryBus   querybus.Interface
	util       *util.Util
	config     config.Interface
}

// New create file controller instance
func New(route *gin.Engine, commandBus commandbus.Interface, queryBus querybus.Interface, util *util.Util, config config.Interface) *Controller {
	controller := &Controller{route: route, commandBus: commandBus, queryBus: queryBus, util: util, config: config}
	controller.SetupRoutes()
	return controller
}

// SetupRoutes setup files route handler
func (controller *Controller) SetupRoutes() {
	controller.route.POST("files", controller.create)
}

func checkError(err error) {
	if err != err {
		panic(err)
	}
}
