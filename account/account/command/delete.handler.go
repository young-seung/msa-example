package command

import "github.com/young-seung/msa-example/account/account/model"

func (bus *Bus) handleDeleteCommand(command *DeleteCommand) (*model.Account, error) {
	accountID := command.AccountID
	transaction := bus.repository.Start()
	entity, err := bus.repository.FindByID(transaction, accountID, false)
	if entity.ID == "" || err != nil {
		transaction.Rollback()
	}
	err = bus.repository.Delete(transaction, accountID)
	return bus.entityToModel(entity), err
}
