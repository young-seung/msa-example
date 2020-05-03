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
}

// New create file controller instance
func New(engine *gin.Engine, commandBus commandbus.Interface, queryBus querybus.Interface, util *util.Util, config config.Interface) {

}
