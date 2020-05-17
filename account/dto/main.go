package dto

// CreateAccount account dto for create command
type CreateAccount struct {
	Email    string
	Password string
}

func findStringInSlice(slice []string, value string) int {
	for index, item := range slice {
		if item == value {
			return index
		}
	}
	return len(slice)
}

// UpdateAccount account dto for update command
type UpdateAccount struct {
	Password string
}

// ReadAccount account dto for query
type ReadAccount struct {
	Email    string
	Password string
}
