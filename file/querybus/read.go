package querybus

import "github.com/young-seung/msa-example/file/model"

// FindByAccountIDAndUsageQuery query for find file by accountID and usage
type FindByAccountIDAndUsageQuery struct {
	AccountID string
	Usage     string
}

func (queryBus *QueryBus) findByAccountIDAndUsage(query *FindByAccountIDAndUsageQuery) (*[]model.FileModel, error) {
	accountID := query.AccountID
	usage := query.Usage
	list, err := queryBus.repository.FindByAccountIDAndUsage(nil, accountID, usage)
	checkError(err)

	modelList := []model.FileModel{}
	for _, value := range *list {
		modelList = append(modelList, *queryBus.entityToModel(&value))
	}
	return &modelList, err
}
