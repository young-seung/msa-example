package command

import (
	"github.com/google/uuid"
	"github.com/young-seung/msa-example/account/account/model"
)

func (bus *Bus) handleCreateCommand(
	command *CreateCommand,
) (*model.Account, error) {
	uuid, _ := uuid.NewRandom()
	hashedPassword := getHashedPassword(command.Password)

	createdAccountEntity, createError := bus.repository.Create(
		uuid.String(),
		command.Email,
		hashedPassword,
	)
	if createError != nil {
		return nil, createError
	}
	bus.email.Send([]string{command.Email}, "Account is created.")
	accountModel := bus.entityToModel(createdAccountEntity)
	accountModel.CreateAccessToken(
		bus.config.Auth().AccessTokenSecret(),
		bus.config.Auth().AccessTokenExpiration(),
	)
	return accountModel, nil
}
