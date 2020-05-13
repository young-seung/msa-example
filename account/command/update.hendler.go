package command

import (
	"errors"

	"github.com/young-seung/msa-example/account/model"
)

func (bus *Bus) handleUpdateCommand(
	command *UpdateCommand,
) (*model.Account, error) {
	transaction := bus.repository.Start()
	entity, err := bus.repository.FindByID(transaction, command.AccountID, false)
	if entity.ID == "" || err != nil {
		transaction.Rollback()
		return nil, errors.New("Update target Account data is not found")
	}

	if command.Password != "" {
		entity.Password = getHashedPassword(command.Password)
	}

	err = bus.repository.Save(transaction, &entity)
	if err != nil {
		transaction.Rollback()
	}
	transaction.Commit()

	accountModel := bus.entityToModel(entity)
	accountModel.CreateAccessToken(
		bus.config.Auth().AccessTokenSecret(),
		bus.config.Auth().AccessTokenExpiration(),
	)
	return accountModel, err
}
