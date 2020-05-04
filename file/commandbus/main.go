package commandbus

import (
	"github.com/young-seung/msa-example/file/config"
	"github.com/young-seung/msa-example/file/repository"
)

// CommandBus file command bus
type CommandBus struct{}

// Interface commandBus interface
type Interface interface{}

// New create commandBus instance
func New(repository repository.Interface, config config.Interface) Interface {
	return &CommandBus{}
}
