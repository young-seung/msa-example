package controller

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/young-seung/msa-example/account/account/model"
	"github.com/young-seung/msa-example/account/file/api"
	"github.com/young-seung/msa-example/account/file/command"
	"github.com/young-seung/msa-example/account/file/query"
	"github.com/young-seung/msa-example/account/util"
)

// Controller file controller struct
type Controller struct {
	route      *gin.Engine
	commandBus *command.Bus
	queryBus   *query.Bus
	util       *util.Util
	api        api.Interface
}

// New create file controller instance
func New(
	route *gin.Engine,
	commandBus *command.Bus,
	queryBus *query.Bus,
	util *util.Util,
	api api.Interface,
) *Controller {
	controller := &Controller{
		route:      route,
		commandBus: commandBus,
		queryBus:   queryBus,
		util:       util,
		api:        api,
	}
	controller.SetupRoutes()
	return controller
}

// SetupRoutes setup files route handler
func (controller *Controller) SetupRoutes() {
	controller.route.POST("/files", controller.create)
	controller.route.GET("/files/:id", controller.readFileByID)
}

// GetAccountByAccessToken check http request auth
func (controller *Controller) GetAccountByAccessToken(
	accessToken string,
) (model.Account, error) {
	if accessToken == "" {
		return model.Account{}, errors.New("token is empty")
	}
	account, err := controller.api.GetAccountByAccessToken(
		accessToken,
	)
	if account == nil || err != nil {
		return model.Account{}, errors.New("token is invalid")
	}
	return *account, nil
}
