package query

import (
	"errors"

	"github.com/young-seung/msa-example/account/file/model"
)

func (bus *Bus) handleReadFileByIDQuery(
	query *ReadFileByIDQuery,
) (*model.File, error) {
	entity := bus.repository.FindByID(query.FileID)

	if entity.ID == "" {
		return nil, errors.New("File is not found")
	}

	return bus.entityToModel(entity), nil
}
