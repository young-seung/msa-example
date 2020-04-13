package util_test

import (
	"testing"

	"github.com/young-seung/msa-example/account/util"
)

// TestInitialize test InitizlizeUtil method
func TestInitializeUtil(t *testing.T) {
	instance := util.Initialize()
	if instance == nil {
		t.Error("Can not create util instance")
	}
}
