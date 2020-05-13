package query

import (
	"errors"

	"github.com/young-seung/msa-example/account/model"
)

func (bus *Bus) handleReadAccountByIDQuery(
	query *ReadAccountByIDQuery,
) (*model.Account, error) {
	entity, err := bus.repository.FindByID(nil, query.AccountID, false)

	if entity.ID == "" || err != nil {
		return nil, errors.New("Account is not found")
	}

	model := bus.entityToModel(entity)
	model.CreateAccessToken(
		bus.config.Auth().AccessTokenSecret(),
		bus.config.Auth().AccessTokenExpiration(),
	)
	return model, nil
}

func (bus *Bus) handleReadAccountQuery(
	query *ReadAccountQuery,
) (*model.Account, error) {
	entity, err := bus.repository.FindByEmail(
		nil, query.Email, query.Deleted,
	)

	if entity.ID == "" || err != nil {
		return &model.Account{}, nil
	}

	if err := compareHashAndPassword(
		entity.Password,
		query.Password,
	); err != nil {
		return &model.Account{}, err
	}

	model := bus.entityToModel(entity)
	model.CreateAccessToken(
		bus.config.Auth().AccessTokenSecret(),
		bus.config.Auth().AccessTokenExpiration())
	return model, nil
}

func (bus *Bus) handleReadAccountByEmailquery(
	query *ReadAccountByEmailQuery,
) (*model.Account, error) {
	entity, err := bus.repository.FindByEmail(nil, query.Email, true)
	if entity.ID == "" || err != nil {
		return &model.Account{}, nil
	}
	model := bus.entityToModel(entity)
	model.CreateAccessToken(
		bus.config.Auth().AccessTokenSecret(),
		bus.config.Auth().AccessTokenExpiration(),
	)
	return model, nil
}
