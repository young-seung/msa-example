package querybus

import (
	"errors"

	"github.com/young-seung/msa-example/file/config"
	"github.com/young-seung/msa-example/file/entity"
	"github.com/young-seung/msa-example/file/model"
	"github.com/young-seung/msa-example/file/repository"
)

// QueryBus file query bus
type QueryBus struct {
	repository repository.Interface
	config     config.Interface
}

// Interface file query interface
type Interface interface {
	Handle(query interface{}) (interface{}, error)
}

// New create queryBus instance
func New(config config.Interface, repository repository.Interface) Interface {
	return &QueryBus{config: config, repository: repository}
}

// Handle handle given query
func (queryBus *QueryBus) Handle(query interface{}) (interface{}, error) {
	switch query := query.(type) {
	case *FindByAccountIDAndUsageQuery:
		return queryBus.findByAccountIDAndUsage(query)
	default:
		return nil, errors.New("invalid query type")
	}
}

func (queryBus *QueryBus) entityToModel(entity *entity.File) *model.FileModel {
	s3Endpoint := queryBus.config.AWS().S3().Endpoint()
	bucket := queryBus.config.AWS().S3().Bucket()
	imageURL := s3Endpoint + "/" + bucket + "/" + entity.ID

	var fileModel model.FileModel
	fileModel.ID = entity.ID
	fileModel.AccountID = entity.AccountID
	fileModel.Usage = entity.Usage
	fileModel.ImageURL = imageURL
	return &fileModel
}

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}
