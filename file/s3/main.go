package s3

import (
	"bytes"
	"mime/multipart"
	"net/http"

	"github.com/aws/aws-sdk-go/aws/session"
	sdk "github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
	"github.com/young-seung/msa-example/file/aws"
	"github.com/young-seung/msa-example/file/config"
)

// Interface aws s3 interface
type Interface interface {
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

// New create s3 instance
func New(config config.Interface, aws aws.Interface) *S3 {
	bucket := config.AWS().S3().Bucket()
	acl := config.AWS().S3().ACL()
	contentDisposition := config.AWS().S3().ContentDisposition()
	serverSideEncryption := config.AWS().S3().ServerSideEncryption()
	storageClass := config.AWS().S3().StorageClass()
	return &S3{
		session:              aws.GetAWSSession(),
		bucket:               bucket,
		acl:                  acl,
		contentDisposition:   contentDisposition,
		serverSideEncryption: serverSideEncryption,
		storageClass:         storageClass,
	}
}

// Upload upload file to aws s3 storage
func (s3 *S3) Upload(fileHeader *multipart.FileHeader) string {
	if fileHeader == nil {
		return ""
	}

	buffer := make([]byte, fileHeader.Size)
	file, err := fileHeader.Open()
	checkError(err)

	file.Read(buffer)

	uuidV4, err := uuid.NewRandom()
	checkError(err)

	s3ObjectKey := uuidV4.String()
	contentType := http.DetectContentType(buffer)

	input := &sdk.PutObjectInput{
		Bucket:               &s3.bucket,
		Key:                  &s3ObjectKey,
		ACL:                  &s3.acl,
		Body:                 bytes.NewReader(buffer),
		ContentLength:        &fileHeader.Size,
		ContentType:          &contentType,
		ContentDisposition:   &s3.contentDisposition,
		ServerSideEncryption: &s3.serverSideEncryption,
		StorageClass:         &s3.storageClass,
	}
	_, err = sdk.New(s3.session).PutObject(input)
	checkError(err)

	return s3ObjectKey
}

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}
