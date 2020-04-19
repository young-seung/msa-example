package command

import (
	"github.com/google/uuid"
	"github.com/young-seung/msa-example/account/account/model"
)

func (bus *Bus) handleCreateCommand(
	command *CreateCommand,
) (*model.Account, error) {
	uuid, _ := uuid.NewRandom()
	hashedPassword, hashedSocialID :=
		getHashedPasswordAndSocialID(command.Password, command.SocialID)

	createdAccountEntity, createError := bus.repository.Create(
		uuid.String(),
		command.Email,
		command.Provider,
		hashedSocialID,
		hashedPassword,
		command.FCMToken,
		command.Gender,
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
	profile, err := bus.api.CreateProfile(
		accountModel.AccessToken,
		accountModel.ID,
		command.Email,
		command.Gender,
		command.InterestedField,
		command.InterestedFieldDetail,
	)

	if err != nil || profile == nil {
		panic(err)
	}
	return accountModel, nil
}
