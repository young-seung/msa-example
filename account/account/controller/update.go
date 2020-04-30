package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/young-seung/msa-example/account/account/command"
	"github.com/young-seung/msa-example/account/account/dto"
)

// @Description update account
// @Tags Account
// @Accept json
// @Produce json
// @Param UpdateAccount body body.UpdateAccount true "Update Account data"
// @Success 200 {object} model.Account
// @Router /accounts [put]
// @Security AccessToken
func (controller *Controller) update(context *gin.Context) {
	accessToken := context.GetHeader("Authorization")
	account, err := controller.getAccountByAccessToken(accessToken)
	if account.ID == "" || err != nil {
		httpError := controller.util.Error.HTTP.Unauthorized()
		context.JSON(httpError.Code(), httpError.Message())
		return
	}

	var data dto.UpdateAccount

	if bindError := context.ShouldBindJSON(&data); bindError != nil {
		httpError := controller.util.Error.HTTP.BadRequest()
		context.JSON(httpError.Code(), httpError.Message())
		return
	}

	id := account.ID
	if id == "" {
		httpError := controller.util.Error.HTTP.BadRequest()
		context.JSON(httpError.Code(), "Account id is not valid.")
		return
	}

	command := &command.UpdateCommand{
		AccountID: id,
		Password:  data.Password,
	}

	updatedAccount, handlingError := controller.commandBus.Handle(command)

	if handlingError != nil {
		httpError := controller.util.Error.HTTP.InternalServerError()
		context.JSON(httpError.Code(), httpError.Message())
		return
	}

	context.JSON(http.StatusOK, updatedAccount)
}
