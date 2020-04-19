package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"time"

	"github.com/young-seung/msa-example/account/config"
)

// CreateProfile dto for create profile
type CreateProfile struct {
	AccountID             string
	Email                 string
	Gender                string
	InterestedField       string
	InterestedFieldDetail []string
}

// Profile profile model
type Profile struct {
	ID                    string    `json:"id" example:"profileId"`
	AccountID             string    `json:"accountId" example:"accountId"`
	ImageURL              string    `json:"imageUrl" example:"profile.image_url.com"`
	Gender                string    `json:"gender" example:"male"`
	InterestedField       string    `json:"interestedField" example:"develop"`
	InterestedFieldDetail []string  `json:"interestedFieldDetail" example:"web,server"`
	CreatedAt             time.Time `json:"createdAt" example:"2019-12-23 12:27:37"`
	UpdatedAt             time.Time `json:"updatedAt" example:"2019-12-23 12:27:37"`
}

// File file struct
type File struct {
	ID        string    `json:"id" example:"389df385-ccaa-49c1-aee2-698ba1191857"`
	AccountID string    `json:"accountId" example:"389df385-ccaa-49c1-aee2-698ba1191857"`
	Usage     string    `json:"usage" example:"profile"`
	ImageURL  string    `json:"imageUrl" example:"profile.image_url.com"`
	CreatedAt time.Time `json:"createdAt" example:"2019-12-23 12:27:37"`
}

// Interface api interace
type Interface interface {
	CreateProfile(
		accessToken string,
		accountID string,
		email string,
		gender string,
		interestedField string,
		interestedFieldDetail []string,
	) (*Profile, error)
	GetFileByID(fileID string) (*File, error)
}

// API api struct
type API struct {
	fileAPIURL    string
	profileAPIURL string
}

// New create api instance
func New(config config.Interface) *API {
	return &API{
		fileAPIURL:    config.Server().FileServiceEndPoint(),
		profileAPIURL: config.Server().ProfileServiceEndPoint(),
	}
}

// CreateProfile request create profile to profile service
func (api *API) CreateProfile(
	accessToken string,
	accountID string,
	email string,
	gender string,
	interestedField string,
	interestedFieldDetail []string,
) (*Profile, error) {
	profileDto := CreateProfile{
		AccountID:             accountID,
		Email:                 email,
		Gender:                gender,
		InterestedField:       interestedField,
		InterestedFieldDetail: interestedFieldDetail,
	}

	byteData, err := json.Marshal(profileDto)
	if err != nil {
		panic(err)
	}

	request, err := http.NewRequest(
		"POST",
		api.profileAPIURL,
		bytes.NewBuffer(byteData),
	)

	if err != nil {
		panic(err)
	}

	request.Header.Add("Authorization", accessToken)
	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		panic(err)
	}

	defer response.Body.Close()

	decoder := json.NewDecoder(response.Body)
	var profile *Profile
	responseBodyDecodeError := decoder.Decode(&profile)
	if responseBodyDecodeError != nil {
		return nil, responseBodyDecodeError
	}
	return profile, nil
}

// GetFileByID get file data from file endpoint using file id
func (api *API) GetFileByID(fileID string) (*File, error) {
	response, httpRequestError := http.Get(api.fileAPIURL + "/" + fileID)
	if httpRequestError != nil {
		return nil, httpRequestError
	}
	defer response.Body.Close()

	decoder := json.NewDecoder(response.Body)
	var file *File
	responseBodyDecodeError := decoder.Decode(&file)
	if responseBodyDecodeError != nil {
		return nil, responseBodyDecodeError
	}
	return file, nil
}
