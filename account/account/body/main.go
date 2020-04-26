package body

// CreateAccount request body for POST /account
type CreateAccount struct {
	Email    string `json:"email" example:"test@gmail.com" binding:"required"`
	Password string `json:"password" example:"password"`
}

// UpdateAccount request body for PUT /account
type UpdateAccount struct {
	Password string `json:"password" example:"password"`
}
