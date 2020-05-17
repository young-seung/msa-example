package commandbus

import (
	"errors"

	"github.com/young-seung/msa-example/file/config"
	"github.com/young-seung/msa-example/file/entity"
	"github.com/young-seung/msa-example/file/model"
	"github.com/young-seung/msa-example/file/repository"
	"github.com/young-seung/msa-example/file/s3"
)

// CommandBus file command bus
type CommandBus struct {
	repository repository.Interface
	s3         s3.Interface
	config     config.Interface
}

// Interface commandBus interface
type Interface interface {
	Handle(command interface{}) (interface{}, error)
}

// New create commandBus instance
func New(repository repository.Interface, s3 s3.Interface, config config.Interface) Interface {
	return &CommandBus{repository: repository, s3: s3, config: config}
}

// Handle handle given command
func (commandBus *CommandBus) Handle(command interface{}) (interface{}, error) {
	switch command := command.(type) {
	case *CreateFileCommand:
		return commandBus.createFile(command)
	default:
		return nil, errors.New("invalid command type")
	}
}

func (commandBus *CommandBus) entityToModel(entity entity.File) *model.FileModel {
	s3Endpoint := commandBus.config.AWS().S3().Endpoint()
	bucket := commandBus.config.AWS().S3().Bucket()
	imageURL := s3Endpoint + "/" + bucket + "/" + entity.ID

	var fileModel model.FileModel
	fileModel.ID = entity.ID
	fileModel.AccountID = entity.AccountID
	fileModel.Usage = entity.Usage
	fileModel.ImageURL = imageURL
	return &fileModel
}

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}
