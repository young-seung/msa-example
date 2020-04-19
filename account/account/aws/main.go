package aws

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/young-seung/msa-example/account/config"
)

// Interface aws service interface
type Interface interface {
	S3() S3Interface
}

// AWS aws struct
type AWS struct {
	secretID   string
	secretKey  string
	token      string
	s3         *S3
	s3Endpoint string
	s3Region   string
}

// New create AWS instance
func New(config config.Interface) *AWS {
	awsInfra := &AWS{
		s3Endpoint: config.AWS().S3().Endpoint(),
		s3Region:   config.AWS().S3().Region(),
		secretID:   config.AWS().SecretID(),
		secretKey:  config.AWS().SecretKey(),
		token:      config.AWS().Token(),
	}
	awsInfra.s3 = NewS3(config, awsInfra.getAWSSession())
	return awsInfra
}

// S3 get aws s3 interface
func (awsInfra *AWS) S3() S3Interface {
	return awsInfra.s3
}

func (awsInfra *AWS) awsEndpointResolver(
	service,
	region string,
	optFns ...func(*endpoints.Options),
) (endpoints.ResolvedEndpoint, error) {
	if service == endpoints.S3ServiceID {
		return endpoints.ResolvedEndpoint{
			URL:           awsInfra.s3Endpoint,
			SigningRegion: awsInfra.s3Region,
		}, nil
	}

	return endpoints.DefaultResolver().EndpointFor(service, region, optFns...)
}

func (awsInfra *AWS) getAWSSession() *session.Session {
	return session.Must(session.NewSession(&aws.Config{
		Region:           aws.String(endpoints.ApNortheast2RegionID),
		EndpointResolver: endpoints.ResolverFunc(awsInfra.awsEndpointResolver),
		Credentials: credentials.NewStaticCredentials(
			awsInfra.secretID,
			awsInfra.secretKey,
			awsInfra.token,
		),
		S3ForcePathStyle: aws.Bool(true),
	}))
}
