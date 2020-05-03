package command

import (
	"github.com/google/uuid"
	"github.com/young-seung/msa-example/account/account/entity"
	"github.com/young-seung/msa-example/account/account/model"
)

func (bus *Bus) handleCreateCommand(command *CreateCommand) (*model.Account, error) {
	uuid, _ := uuid.NewRandom()
	email := command.Email
	hashedPassword := getHashedPassword(command.Password)

	transaction := bus.repository.Start()
	entity := entity.Account{ID: uuid.String(), Email: email, Password: hashedPassword}
	err := bus.repository.Create(transaction, &entity)
	if err != nil {
		transaction.Rollback()
	}
	transaction.Commit()

	accountModel := bus.entityToModel(entity)
	secret := bus.config.Auth().AccessTokenSecret()
	expiration := bus.config.Auth().AccessTokenExpiration()
	accountModel.CreateAccessToken(secret, expiration)
	return accountModel, err
}
