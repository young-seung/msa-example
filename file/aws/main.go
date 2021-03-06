package aws

import (
	sdk "github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/young-seung/msa-example/file/config"
)

// Interface aws service interface
type Interface interface {
	GetAWSSession() *session.Session
}

// AWS aws struct
type AWS struct {
	secretID   string
	secretKey  string
	token      string
	s3Endpoint string
	s3Region   string
}

// New create aws instance
func New(config config.Interface) *AWS {
	secretID := config.AWS().SecretID()
	secretKey := config.AWS().SecretKey()
	token := config.AWS().Token()
	s3Endpoint := config.AWS().S3().Endpoint()
	s3Region := config.AWS().S3().Region()
	return &AWS{secretID: secretID, secretKey: secretKey, token: token, s3Endpoint: s3Endpoint, s3Region: s3Region}
}

func (aws *AWS) endpointResolver(service, region string, optFns ...func(*endpoints.Options)) (endpoints.ResolvedEndpoint, error) {
	if service == endpoints.S3ServiceID {
		endpoint := endpoints.ResolvedEndpoint{URL: aws.s3Endpoint, SigningRegion: aws.s3Region}
		return endpoint, nil
	}
	return endpoints.DefaultResolver().EndpointFor(service, region, optFns...)
}

// GetAWSSession get aws session
func (aws *AWS) GetAWSSession() *session.Session {
	credential := credentials.NewStaticCredentials(aws.secretID, aws.secretKey, aws.token)
	region := endpoints.ApNortheast2RegionID
	endpointResolver := endpoints.ResolverFunc(aws.endpointResolver)
	s3ForcePathStyle := true
	sdkConfig := &sdk.Config{Region: &region, EndpointResolver: endpointResolver, Credentials: credential, S3ForcePathStyle: &s3ForcePathStyle}
	return session.Must(session.NewSession(sdkConfig))
}
