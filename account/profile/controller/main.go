package controller

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/young-seung/msa-example/account/account/model"
	"github.com/young-seung/msa-example/account/config"
	"github.com/young-seung/msa-example/account/profile/api"
	"github.com/young-seung/msa-example/account/profile/command"
	"github.com/young-seung/msa-example/account/profile/query"
	"github.com/young-seung/msa-example/account/util"
)

// Controller profile controller
type Controller struct {
	route      *gin.Engine
	commandBus *command.Bus
	queryBus   *query.Bus
	util       *util.Util
	config     config.Interface
	api        api.Interface
}

// New create profile controller instance
func New(
	route *gin.Engine,
	commandBus *command.Bus,
	queryBus *query.Bus,
	util *util.Util,
	config config.Interface,
	api api.Interface,
) *Controller {
	controller := &Controller{
		route:      route,
		commandBus: commandBus,
		queryBus:   queryBus,
		util:       util,
		config:     config,
		api:        api,
	}
	controller.SetupRoutes()
	return controller
}

// SetupRoutes setup profile router
func (controller *Controller) SetupRoutes() {
	controller.route.POST("profiles", controller.create)
	controller.route.GET("profiles/:id", controller.readByID)
	controller.route.GET("profiles", controller.read)
	controller.route.PUT("profiles", controller.update)
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

// ValidateFileID validate image key
func (controller *Controller) ValidateFileID(accountID string, fileID string) bool {
	if fileID == "" {
		return true
	}
	file, err := controller.api.GetFileByID(fileID)
	if err != nil || file.AccountID != accountID {
		return false
	}
	return true
}
