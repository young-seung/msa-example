package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/young-seung/msa-example/file/querybus"
)

// @Description get file list
// @Tags Files
// @Accept json
// @Produce json
// @Param account_id query string true "file owner's accountId"
// @Param usage query string true "file usage"
// @Success 200 {object} model.FileModelList
// @Router /files [get]
func (controller *Controller) read(context *gin.Context) {
	accountID := context.Query("account_id")
	usage := context.Query("usage")
	if accountID == "" || usage == "" {
		httpError := controller.util.Error.HTTP.BadRequest()
		context.JSON(httpError.Code(), "accountID is empty")
		return
	}

	if usage == "" {
		httpError := controller.util.Error.HTTP.BadRequest()
		context.JSON(httpError.Code(), "accountID is empty")
		return
	}

	query := &querybus.FindByAccountIDAndUsageQuery{
		AccountID: accountID, Usage: usage,
	}
	result, err := controller.queryBus.Handle(query)
	checkError(err)

	context.JSON(http.StatusOK, result)
}
