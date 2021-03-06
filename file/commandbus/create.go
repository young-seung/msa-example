package commandbus

import (
	"errors"
	"mime/multipart"

	"github.com/young-seung/msa-example/file/model"
)

// CreateFileCommand command for create file
type CreateFileCommand struct {
	AccountID string
	Usage     string
	File      *multipart.FileHeader
}

func (commandBus *CommandBus) createFile(command *CreateFileCommand) (*model.FileModel, error) {
	fileID := commandBus.s3.Upload(command.File)
	if fileID == "" {
		return nil, errors.New("can not generate s3 object key")
	}
	accountID := command.AccountID
	usage := command.Usage

	transaction := commandBus.repository.Start()
	fileEntity, err := commandBus.repository.Create(transaction, fileID, accountID, usage)
	checkError(err)
	transaction.Commit()
	return commandBus.entityToModel(*fileEntity), err
}
