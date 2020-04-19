package command

import (
	"errors"

	"github.com/young-seung/msa-example/account/config"
	"github.com/young-seung/msa-example/account/file/api"
	"github.com/young-seung/msa-example/account/file/aws"
	"github.com/young-seung/msa-example/account/file/entity"
	"github.com/young-seung/msa-example/account/file/model"
	"github.com/young-seung/msa-example/account/file/repository"
)

// Bus file command bus
type Bus struct {
	repository repository.Interface
	api        api.Interface
	aws        aws.Interface
	config     config.Interface
}

// New create bus instance
func New(
	repository repository.Interface,
	api api.Interface,
	aws aws.Interface,
	config config.Interface,
) *Bus {
	return &Bus{
		repository: repository,
		api:        api,
		aws:        aws,
		config:     config,
	}
}

// Handle handle command
func (bus *Bus) Handle(command interface{}) (*model.File, error) {
	switch command := command.(type) {
	case *CreateCommand:
		return bus.handleCreateCommand(command)
	default:
		return nil, errors.New("Command is not handled")
	}
}

func (bus *Bus) entityToModel(entity entity.File) *model.File {
	var fileModel model.File
	fileModel.ID = entity.ID
	fileModel.AccountID = entity.AccountID
	fileModel.Usage = entity.Usage
	fileModel.CreatedAt = entity.CreatedAt
	imageURL := bus.config.AWS().S3().Endpoint() +
		"/" + bus.config.AWS().S3().Bucket() + "/" + entity.ID
	fileModel.ImageURL = imageURL

	return &fileModel
}
