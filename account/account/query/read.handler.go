package query

import (
	"errors"

	"github.com/young-seung/msa-example/account/account/model"
)

func (bus *Bus) handleReadAccountByIDQuery(
	query *ReadAccountByIDQuery,
) (*model.Account, error) {
	entity := bus.repository.FindByID(query.AccountID, false)

	if entity.ID == "" {
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
	entity := bus.repository.FindByEmailAndProvider(
		query.Email, query.Provider, query.Deleted,
	)

	if entity.ID == "" {
		return &model.Account{}, nil
	}

	if err := compareHashAndPassword(
		entity.Password,
		query.Password,
	); err != nil {
		return &model.Account{}, err
	}

	if err := compareHashAndPassword(
		entity.SocialID,
		query.SocialID,
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
	entity := bus.repository.FindByEmail(query.Email, true)
	if entity.ID == "" {
		return &model.Account{}, nil
	}
	model := bus.entityToModel(entity)
	model.CreateAccessToken(
		bus.config.Auth().AccessTokenSecret(),
		bus.config.Auth().AccessTokenExpiration(),
	)
	return model, nil
}
