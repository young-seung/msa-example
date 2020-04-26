package controller

import (
	"net/http"

	"github.com/badoux/checkmail"
	"github.com/gin-gonic/gin"
	"github.com/young-seung/msa-example/account/account/dto"
	"github.com/young-seung/msa-example/account/account/query"
)

// @Tags Account
// @Accept json
// @Produce json
// @Success 200 {object} model.Account
// @Router /accounts [get]
// @Param email query string false "account email"
// @Param password query string false "account password"
// @Security AccessToken
func (controller *Controller) readAccount(context *gin.Context) {
	email := context.Query("email")
	password := context.Query("password")

	if email == "" && password == "" {
		accessToken := context.GetHeader("Authorization")
		account, err := controller.GetAccountByAccessToken(accessToken)
		if err != nil {
			httpError := controller.util.Error.HTTP.Unauthorized()
			context.JSON(httpError.Code(), httpError.Message())
			return
		}
		context.JSON(http.StatusOK, account)
		return
	}

	if email == "" {
		httpError := controller.util.Error.HTTP.BadRequest()
		context.JSON(httpError.Code(), httpError.Message())
		return
	}

	emailFormatValidationError := checkmail.ValidateFormat(email)
	if emailFormatValidationError != nil {
		httpError := controller.util.Error.HTTP.BadRequest()
		context.JSON(httpError.Code(), httpError.Message())
		return
	}

	emailHostValidationError := checkmail.ValidateHost(email)
	if emailHostValidationError != nil {
		httpError := controller.util.Error.HTTP.BadRequest()
		context.JSON(httpError.Code(), "Email host is not existed.")
		return
	}

	data := &dto.ReadAccount{
		Email:    email,
		Password: password,
	}

	query := &query.ReadAccountQuery{
		Email:    data.Email,
		Password: data.Password,
		Deleted:  false,
	}
	account, _ := controller.queryBus.Handle(query)
	if account == nil {
		context.JSON(http.StatusOK, account)
		return
	}

	context.JSON(http.StatusOK, account)
}
