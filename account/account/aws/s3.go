package aws

import (
	"bytes"
	"log"
	"mime/multipart"
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
	"github.com/young-seung/msa-example/account/config"
)

// S3Interface aws s3 service interface
type S3Interface interface {
	Upload(fileHeader *multipart.FileHeader) string
}

// S3 struct
type S3 struct {
	session              *session.Session
	bucket               string
	acl                  string
	contentDisposition   string
	serverSideEncryption string
	storageClass         string
}

// NewS3 create S3 instance
func NewS3(config config.Interface, awsSession *session.Session) *S3 {
	return &S3{
		session:              awsSession,
		bucket:               config.AWS().S3().Bucket(),
		acl:                  config.AWS().S3().ACL(),
		contentDisposition:   config.AWS().S3().ContentDisposition(),
		serverSideEncryption: config.AWS().S3().ServerSideEncryption(),
		storageClass:         config.AWS().S3().StorageClass(),
	}
}

// Upload upload file to aws s3 storage
func (s3Infra *S3) Upload(fileHeader *multipart.FileHeader) string {
	if fileHeader == nil {
		return ""
	}

	var size int64 = fileHeader.Size
	buffer := make([]byte, size)
	file, _ := fileHeader.Open()
	file.Read(buffer)

	s3ObjectKey, s3ObjectKeyError := uuid.NewRandom()
	s3ObjectKeyString := s3ObjectKey.String()
	if s3ObjectKeyError != nil {
		s3ObjectKeyString = ""
		log.Println(s3ObjectKeyError)
	}

	_, s3PutObjectError := s3.New(s3Infra.session).PutObject(&s3.PutObjectInput{
		Bucket:               aws.String(s3Infra.bucket),
		Key:                  aws.String(s3ObjectKeyString),
		ACL:                  aws.String(s3Infra.acl),
		Body:                 bytes.NewReader(buffer),
		ContentLength:        aws.Int64(int64(size)),
		ContentType:          aws.String(http.DetectContentType(buffer)),
		ContentDisposition:   aws.String(s3Infra.contentDisposition),
		ServerSideEncryption: aws.String(s3Infra.serverSideEncryption),
		StorageClass:         aws.String(s3Infra.storageClass),
	})
	if s3PutObjectError != nil {
		s3ObjectKeyString = ""
		log.Println(s3PutObjectError)
	}
	return s3ObjectKeyString
}
