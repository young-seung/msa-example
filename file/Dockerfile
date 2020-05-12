FROM golang:alpine AS stage
WORKDIR /go/src/github.com/young-seung/msa-example/file
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -ldflags '-s' -o main main.go
RUN pwd
RUN ls -al

FROM scratch
COPY --from=stage /go/src/github.com/young-seung/msa-example/file/main /main
CMD [ "/main" ]
