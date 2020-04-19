package dto

// Provider account service provider map
func Provider() map[string]string {
	return map[string]string{
		"email": "email",
		"gmail": "gmail",
	}
}

// Gender user gender map
func Gender() map[string]string {
	return map[string]string{
		"male":   "male",
		"female": "female",
	}
}

// InterestedField part of user InterestedFielded
func InterestedField() map[string][]string {
	return map[string][]string{
		"develop": []string{"web", "server", "mobile", "dataScience", "game", "iot"},
		"design":  []string{"bx", "ux/ui", "video", "3d", "illustration"},
		"plan":    []string{"ga", "ux", "reverse", "marcketing"},
	}
}

// CreateAccount account dto for create command
type CreateAccount struct {
	Email                 string
	Provider              string
	SocialID              string
	Password              string
	FCMToken              string
	Gender                string
	InterestedField       string
	InterestedFieldDetail []string
}

// ValidateAccountGender validation account gender attribute
func (dto *CreateAccount) ValidateAccountGender() bool {
	if Gender()[dto.Gender] == "" {
		return false
	}
	return true
}

// ValidateInterestedField validation account's InterestedField
func (dto *CreateAccount) ValidateInterestedField() bool {
	if len(InterestedField()[dto.InterestedField]) == 0 {
		return false
	}
	return true
}

func findStringInSlice(slice []string, value string) int {
	for index, item := range slice {
		if item == value {
			return index
		}
	}
	return len(slice)
}

// ValidateInterestedFieldDetail validation interestedFieldDetail
func (dto *CreateAccount) ValidateInterestedFieldDetail() bool {
	interestedField := InterestedField()[dto.InterestedField]
	for _, value := range dto.InterestedFieldDetail {
		if findStringInSlice(interestedField, value) == len(interestedField) {
			return false
		}
	}
	return true
}

// SetAccountAttributeByProvider remove socialID or password by provider
func (dto *CreateAccount) SetAccountAttributeByProvider() {
	if dto.Provider == Provider()["email"] {
		dto.SocialID = ""
		return
	}
	dto.Password = ""
	return
}

// ValidateProvider validate provider
func (dto *CreateAccount) ValidateProvider() bool {
	_, validate := Provider()[dto.Provider]
	return validate
}

// ValidateAccountAttributeByProvider validate account attribute by provider
func (dto *CreateAccount) ValidateAccountAttributeByProvider() bool {
	if dto.Provider == Provider()["email"] && dto.Password == "" {
		return false
	}
	if dto.Provider != Provider()["email"] && dto.SocialID == "" {
		return false
	}
	return true
}

// UpdateAccount account dto for update command
type UpdateAccount struct {
	FCMToken string
	Password string
}

// ReadAccount account dto for query
type ReadAccount struct {
	Email    string
	Provider string
	SocialID string
	Password string
}

// ValidateAccountAttributeByProvider validate account attribute by provider
func (dto *ReadAccount) ValidateAccountAttributeByProvider() bool {
	if dto.Provider == Provider()["email"] && dto.Password == "" {
		return false
	}
	if dto.Provider != Provider()["email"] && dto.SocialID == "" {
		return false
	}
	return true
}

// SetAccountAttributeByProvider remove socialID or password by provider
func (dto *ReadAccount) SetAccountAttributeByProvider() {
	if dto.Provider == Provider()["email"] {
		dto.SocialID = ""
		return
	}
	dto.Password = ""
	return
}

// ValidateProvider validate provider
func (dto *ReadAccount) ValidateProvider() bool {
	_, validate := Provider()[dto.Provider]
	return validate
}
