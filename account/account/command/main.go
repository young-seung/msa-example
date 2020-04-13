package command

import (
	"errors"

	"github.com/young-seung/msa-example/account/account/api"
	"github.com/young-seung/msa-example/account/account/aws"
	"github.com/young-seung/msa-example/account/account/email"
	"github.com/young-seung/msa-example/account/account/entity"
	"github.com/young-seung/msa-example/account/account/model"
	"github.com/young-seung/msa-example/account/account/repository"
	"github.com/young-seung/msa-example/account/config"
	"golang.org/x/crypto/bcrypt"
)

// Bus account command
type Bus struct {
	repository repository.Interface
	email      email.Interface
	aws        aws.Interface
	config     config.Interface
	api        api.Interface
}

// New create Bus instance
func New(
	repository repository.Interface,
	email email.Interface,
	aws aws.Interface,
	config config.Interface,
	api api.Interface,
) *Bus {
	return &Bus{
		repository: repository,
		email:      email,
		aws:        aws,
		config:     config,
		api:        api,
	}
}

// Handle handle command
func (bus *Bus) Handle(command interface{}) (*model.Account, error) {
	switch command := command.(type) {
	case *CreateCommand:
		return bus.handleCreateCommand(command)
	case *UpdateCommand:
		return bus.handleUpdateCommand(command)
	case *DeleteCommand:
		return bus.handleDeleteCommand(command)
	default:
		return nil, errors.New("Command is not handled")
	}
}

func (bus *Bus) entityToModel(entity entity.Account) *model.Account {
	var accountModel model.Account
	accountModel.ID = entity.ID
	accountModel.Email = entity.Email
	accountModel.Provider = entity.Provider
	accountModel.CreatedAt = entity.CreatedAt
	accountModel.UpdatedAt = entity.UpdatedAt

	return &accountModel
}

func getHashedPasswordAndSocialID(password string, socialID string) (string, string) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if err != nil {
		panic(err)
	}

	hashedSocialID, err := bcrypt.GenerateFromPassword([]byte(socialID), bcrypt.MinCost)
	if err != nil {
		panic(err)
	}
	return string(hashedPassword), string(hashedSocialID)
}
