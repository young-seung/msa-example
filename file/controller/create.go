package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/young-seung/msa-example/file/commandbus"
)

// @Description crate file
// @Tags Files
// @Accept multipart/form-data
// @Produce json
// @Param accountId formData string true "accountId for file owner"
// @Param usage formData string true "file usage"
// @Param file formData file true "file for upload"
// @Success 201 {object} model.FileModel
// @Router /files [post]
func (controller *Controller) create(context *gin.Context) {
	accountID := context.PostForm("accountId")
	if accountID == "" {
		httpError := controller.util.Error.HTTP.BadRequest()
		context.JSON(httpError.Code(), "accountID is empty")
		return
	}

	usage := context.PostForm("usage")
	if usage == "" {
		httpError := controller.util.Error.HTTP.BadRequest()
		context.JSON(httpError.Code(), "usage is empty")
		return
	}
	file, err := context.FormFile("file")
	checkError(err)
	if file == nil {
		httpError := controller.util.Error.HTTP.BadRequest()
		context.JSON(httpError.Code(), "file is empty")
		return
	}
	command := &commandbus.CreateFileCommand{
		AccountID: accountID,
		Usage:     usage,
		File:      file,
	}
	result, err := controller.commandBus.Handle(command)
	checkError(err)
	context.JSON(http.StatusCreated, result)
}
