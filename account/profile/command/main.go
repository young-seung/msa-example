package command

import (
	"errors"

	"github.com/young-seung/msa-example/account/config"
	"github.com/young-seung/msa-example/account/profile/entity"
	"github.com/young-seung/msa-example/account/profile/model"
	"github.com/young-seung/msa-example/account/profile/repository"
)

// Bus profile command
type Bus struct {
	repository repository.Interface
	config     config.Interface
}

// New create Bus instance
func New(
	repository repository.Interface,
	config config.Interface,
) *Bus {
	return &Bus{repository: repository, config: config}
}

// Handle handle command
func (bus *Bus) Handle(command interface{}) (*model.Profile, error) {
	switch command := command.(type) {
	case *CreateCommand:
		return bus.handleCreateCommand(command)
	case *UpdateProfileCommand:
		return bus.handleUpdateCommand(command)
	default:
		return nil, errors.New("Invalid command type")
	}
}

func (bus *Bus) entityToModel(entity entity.Profile) *model.Profile {
	var profileModel model.Profile
	profileModel.ID = entity.ID
	profileModel.AccountID = entity.AccountID
	profileModel.Gender = entity.Gender
	profileModel.InterestedField = entity.InterestedField
	profileModel.CreatedAt = entity.CreatedAt
	profileModel.UpdatedAt = entity.UpdatedAt
	imageURL := bus.config.AWS().S3().Endpoint() +
		"/" + bus.config.AWS().S3().Bucket() + "/" + entity.FileID
	profileModel.ImageURL = imageURL

	if entity.FileID == "" {
		profileModel.ImageURL = ""
	}
	return &profileModel
}
