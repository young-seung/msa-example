package command

import (
	"errors"

	"github.com/young-seung/msa-example/account/account/model"
)

func (bus *Bus) handleUpdateCommand(
	command *UpdateCommand,
) (*model.Account, error) {
	oldData := bus.repository.FindByID(command.AccountID, false)
	if oldData.ID == "" {
		return nil, errors.New("Update target Account data is not found")
	}
	hashedPassword := getHashedPassword(command.Password)

	if command.Password == "" {
		hashedPassword = oldData.Password
	}

	updatedAccountEntity, updateError := bus.repository.Update(
		oldData.ID,
		hashedPassword,
	)
	if updateError != nil {
		return nil, updateError
	}

	accountModel := bus.entityToModel(updatedAccountEntity)
	accountModel.CreateAccessToken(
		bus.config.Auth().AccessTokenSecret(),
		bus.config.Auth().AccessTokenExpiration(),
	)
	return accountModel, nil
}
