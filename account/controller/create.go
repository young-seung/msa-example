package controller

import (
	"net/http"

	"github.com/badoux/checkmail"
	"github.com/young-seung/msa-example/account/command"
	"github.com/young-seung/msa-example/account/dto"
	"github.com/young-seung/msa-example/account/query"

	"github.com/gin-gonic/gin"
)

// @Description create account
// @Tags Account
// @Accept json
// @Produce json
// @Param CreateAccount body body.CreateAccount true "Create Account data"
// @Success 201 {object} model.Account
// @Router /accounts [post]
func (controller *Controller) create(context *gin.Context) {
	var data dto.CreateAccount

	if bindError := context.ShouldBindJSON(&data); bindError != nil {
		httpError := controller.util.Error.HTTP.BadRequest()
		context.JSON(httpError.Code(), httpError.Message())
		return
	}

	emaiFormatlValidationError := checkmail.ValidateFormat(data.Email)
	if emaiFormatlValidationError != nil {
		httpError := controller.util.Error.HTTP.BadRequest()
		context.JSON(httpError.Code(), "Email format is not valid")
		return
	}

	emaiHostlValidationError := checkmail.ValidateHost(data.Email)
	if emaiHostlValidationError != nil {
		httpError := controller.util.Error.HTTP.BadRequest()
		context.JSON(httpError.Code(), "Email host is not existed")
		return
	}

	query := &query.ReadAccountByEmailQuery{Email: data.Email}
	duplicated, _ := controller.queryBus.Handle(query)
	if duplicated.ID != "" {
		httpError := controller.util.Error.HTTP.Conflict()
		context.JSON(httpError.Code(), "Email is duplicated")
		return
	}

	command := &command.CreateCommand{
		Email:    data.Email,
		Password: data.Password,
	}

	createdAccount, handlingError := controller.commandBus.Handle(command)
	if handlingError != nil {
		httpError := controller.util.Error.HTTP.InternalServerError()
		context.JSON(httpError.Code(), httpError.Message())
		return
	}

	context.JSON(http.StatusCreated, createdAccount)
}
