# data-fetcher

This tool can accept data fetch tasks, which require consuming API endpoints in a paginated
manner. Results are uploaded to the given S3 bucket.

This tool provides:

* API Authentication
* Multiple pagination strategies to use
* Error handling & Retries

## Starting the service

```bash
# Build the image
docker build . -t data-fetcher

# Start the service
docker run -p 8080:8080 -d data-fetcher
```

## Example request

Use Postman to send a request to `http://localhost:8080`.

Content should be something like:

```json
{
    "source": {
        "url" : "https://your-api.com/something",
        "rootObject": "courses",
        "authToken": "XXX",
        "pagination": "offset-to-end",
        "requestTimeout": 2000
    },
    "destination": {
        "region": "us-east-1",
        "bucket": "destination-bucket",
        "key": "destination/path/target.json"
    }
}
```
## Input properties

### Source:

| Key | Description |
| --- | --- |
| url | The source URL which should be queries |
| rootObject | The root object in the response's JSON |
| authToken | When provided, it will be appended as a Bearer token |
| pagination | Pagination strategy to use |
| requestTimeout | Timeout for the individual requests |

### Destination:

| Key | Description |
| --- | --- |
| region | Region of the target bucket |
| bucket | Target bucket name |
| key | Target key |
