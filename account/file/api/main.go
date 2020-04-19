package api

import (
	"bytes"
	"encoding/json"
	"net/http"

	account "github.com/young-seung/msa-example/account/account/model"
	"github.com/young-seung/msa-example/account/config"
	"github.com/young-seung/msa-example/account/profile/body"
	profile "github.com/young-seung/msa-example/account/profile/model"
)

// Interface api interface
type Interface interface {
	GetAccountByAccessToken(
		accessToken string,
	) (*account.Account, error)
	GetProfileByAccessToken(
		accessToken string,
	) (*profile.Profile, error)
	UpdateProfile(
		accessToken string,
		fileID string,
		interestedField string,
		interestedFieldDetail []string,
	) (*profile.Profile, error)
}

// API api struct
type API struct {
	accountAPIURL string
	profileAPIURL string
}

// New create api instance
func New(config config.Interface) *API {
	return &API{
		accountAPIURL: config.Server().AccountServiceEndPoint(),
		profileAPIURL: config.Server().ProfileServiceEndPoint(),
	}
}

// GetAccountByAccessToken get account data from account service by accesstoken
func (api *API) GetAccountByAccessToken(
	accessToken string,
) (*account.Account, error) {
	accountServiceEndpoint := api.accountAPIURL
	request, createNewReqeustError := http.NewRequest(
		"GET",
		accountServiceEndpoint,
		nil,
	)
	if createNewReqeustError != nil {
		return nil, createNewReqeustError
	}

	request.Header.Add("Authorization", accessToken)

	client := &http.Client{}
	response, httpRequestError := client.Do(request)
	if httpRequestError != nil {
		return nil, httpRequestError
	}
	defer response.Body.Close()

	decoder := json.NewDecoder(response.Body)
	var account *account.Account
	responseBodyDecodeError := decoder.Decode(&account)
	if responseBodyDecodeError != nil {
		return nil, responseBodyDecodeError
	}
	return account, nil
}

// GetProfileByAccessToken get profile data from profileservice
func (api *API) GetProfileByAccessToken(
	accessToken string,
) (*profile.Profile, error) {
	request, err := http.NewRequest(
		"GET",
		api.profileAPIURL,
		nil,
	)
	if err != nil {
		return nil, err
	}
	request.Header.Add("Authorization", accessToken)
	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	decoder := json.NewDecoder(response.Body)
	var profile *profile.Profile
	if err := decoder.Decode(&profile); err != nil {
		return nil, err
	}
	return profile, nil
}

// UpdateProfile update profile data
func (api *API) UpdateProfile(
	accessToken string,
	fileID string,
	interestedField string,
	interestedFieldDetail []string,
) (*profile.Profile, error) {
	requestBody := body.UpdateProfile{
		FileID:                fileID,
		InterestedField:       interestedField,
		InterestedFieldDetail: interestedFieldDetail,
	}
	byteData, err := json.Marshal(requestBody)
	if err != nil {
		return nil, err
	}
	request, err := http.NewRequest(
		"PUT",
		api.profileAPIURL,
		bytes.NewBuffer(byteData),
	)
	if err != nil {
		return nil, err
	}
	request.Header.Add("Authorization", accessToken)
	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	decoder := json.NewDecoder(response.Body)
	var profile *profile.Profile
	if err := decoder.Decode(&profile); err != nil {
		return nil, err
	}
	return profile, nil
}
