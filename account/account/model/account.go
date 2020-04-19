package model

import (
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// Account account model
type Account struct {
	ID          string    `json:"id" example:"accountId"`
	Email       string    `json:"email" example:"test@gmail.com"`
	Provider    string    `json:"provider" exmaple:"gmail"`
	AccessToken string    `json:"accessToken" example:"accesstoken"`
	CreatedAt   time.Time `json:"createdAt" example:"2019-12-23 12:27:37"`
	UpdatedAt   time.Time `json:"updatedAt" example:"2019-12-23 12:27:37"`
}

// CreateAccessToken create access token with jwt
func (account *Account) CreateAccessToken(
	accessTokenSecret string,
	accessTokenExpiration int,
) {
	expirationTime := time.Now().Add(time.Duration(accessTokenExpiration) * time.Minute)
	claims := jwt.StandardClaims{ExpiresAt: expirationTime.Unix(), Issuer: account.ID}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, tokenError := token.SignedString([]byte(accessTokenSecret))

	if tokenError != nil {
		panic(tokenError)
	}
	account.AccessToken = tokenString
}

// GetTokenIssuer get accesstokrn issuer from jwt
func (account *Account) GetTokenIssuer(accessTokenSecret string) (string, error) {
	if account.AccessToken == "" {
		return "", errors.New("token does not exist")
	}
	claims := &jwt.StandardClaims{}
	jwtToken, _ := jwt.ParseWithClaims(
		account.AccessToken,
		claims,
		func(token *jwt.Token) (interface{}, error) {
			return []byte(accessTokenSecret), nil
		})
	if jwtToken.Valid == true && claims.Issuer != "" {
		return claims.Issuer, nil
	}
	return "", errors.New("Token is invalid")
}
