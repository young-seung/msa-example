package querybus

import (
	"github.com/young-seung/msa-example/file/config"
	"github.com/young-seung/msa-example/file/repository"
)

// QueryBus file query bus
type QueryBus struct {
}

// Interface file query interface
type Interface interface {
}

// New create queryBus instance
func New(config config.Interface, repository repository.Interface) Interface {
	return &QueryBus{}
}
