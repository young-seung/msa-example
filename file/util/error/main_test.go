package error_test

import (
	"testing"

	"github.com/young-seung/msa-example/file/util/error"
)

// TestNew test new method in error package
func TestNew(t *testing.T) {
	instance := &error.Error{}
	if instance == nil {
		t.Error("Can not create error instance")
	}
}
