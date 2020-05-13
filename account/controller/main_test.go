package controller_test

import (
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/young-seung/msa-example/account/command"
	"github.com/young-seung/msa-example/account/config"
	"github.com/young-seung/msa-example/account/controller"
	"github.com/young-seung/msa-example/account/query"
	"github.com/young-seung/msa-example/account/util"
)

// TestNew test controller's New method
func TestNew(t *testing.T) {
	_, engine := gin.CreateTestContext(httptest.NewRecorder())
	util := &util.Util{}
	commandBus := &command.Bus{}
	queryBus := &query.Bus{}
	config := &config.Config{}
	controllerInstance := controller.New(
		engine, commandBus, queryBus, util, config,
	)
	if controllerInstance == nil {
		t.Error("Can not create controller instance")
	}
}
