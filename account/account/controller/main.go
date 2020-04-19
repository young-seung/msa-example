package controller

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/young-seung/msa-example/account/account/api"
	"github.com/young-seung/msa-example/account/account/command"
	"github.com/young-seung/msa-example/account/account/model"
	"github.com/young-seung/msa-example/account/account/query"
	"github.com/young-seung/msa-example/account/config"
	"github.com/young-seung/msa-example/account/util"
)

// Controller account controller struct
type Controller struct {
	route      *gin.Engine
	commandBus *command.Bus
	queryBus   *query.Bus
	util       *util.Util
	config     config.Interface
	api        api.Interface
}

// New create account controller instance
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

// SetupRoutes setup accounts route handler
func (controller *Controller) SetupRoutes() {
	controller.route.POST("accounts", controller.create)
	controller.route.GET("accounts", controller.readAccount)
	controller.route.PUT("accounts", controller.update)
	controller.route.DELETE("accounts", controller.delete)
}

// GetAccountByAccessToken get account data by accesstoken
func (controller *Controller) GetAccountByAccessToken(
	accessToken string,
) (model.Account, error) {
	if accessToken == "" {
		return model.Account{}, errors.New("token is empty")
	}

	account := &model.Account{AccessToken: accessToken}

	accountID, err := account.GetTokenIssuer(
		controller.config.Auth().AccessTokenSecret(),
	)
	if accountID == "" || err != nil {
		return model.Account{}, errors.New("token is invalid")
	}

	query := &query.ReadAccountByIDQuery{AccountID: accountID}
	account, queryError := controller.queryBus.Handle(query)
	if queryError != nil {
		return model.Account{}, errors.New("account query error is occurred")
	}
	return *account, nil
}
