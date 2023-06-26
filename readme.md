# Image Conversion Service

A simple service to upload source images to Azure Blob Storage and provide easy
resize capabilities. See the [api specification](./api.yaml) for usage details.

## Setup

Create an Azure Storage Account service with the following initial setup:

- 3 tables:
  - `GroupImages`
  - `SourceImages`
  - `UsedImages`
- 2 containers:
  - `sourceimages` - "Public access level" should be set to "Private"
  - `generatedimages` - "Public access level" should be set to "Blob"

## Development

Create a `.env` file in the root with the following values:

```
AZURE_STORAGE_ACCOUNT_NAME=
AZURE_STORAGE_ACCOUNT_KEY=
```

Optionally, also include a `SECRET_KEY`. Then:

```sh
npm install
npm run dev
```

A few sample powershell scripts:

```pwsh
$file = '/path/to/file.jpg' # If this is not a jpg, adjust the content type below
$secretKey = 'secret-key'
$hash = $(Get-FileHash $file -Algorithm SHA1).Hash.ToLower()

# Upload the given file
Invoke-RestMethod -Uri "http://localhost:7071/api/upload?sha=$hash&format=jpg" -Method Put -InFile $file -ContentType image/jpg -Headers @{ "X-API-Key" = $secretKey }

# Resize it to 400x400 and get the actual URL
Invoke-RestMethod -Uri "http://localhost:7071/api/generate?groupId=local&width=400&height=400&sha=$hash&format=webp" -Method Get -Headers @{ "X-API-Key" = $secretKey }

# Remove resizes associated with "local"
Invoke-RestMethod -Uri http://localhost:7071/api/purge?groupId=local -Method Post -Headers @{ "X-API-Key" = $secretKey }
```

## Build

Set the `.env` file as defined above in the Development section and run either of the following:

```sh
npm install
npm start
```

TODO: finish instructions
