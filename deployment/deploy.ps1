#!/usr/bin/env pwsh

npm ci
if ($global:LASTEXITCODE -eq 0) { throw '"npm ci" did not succeed' }
npm run build
if ($global:LASTEXITCODE -eq 0) { throw '"npm run build" did not succeed' }
npm ci --omit=dev
if ($global:LASTEXITCODE -eq 0) { throw '"npm ci --omit=dev" did not succeed' }

#func pack
func azure functionapp publish ps-image-resize-service --no-build
if ($global:LASTEXITCODE -eq 0) { throw 'Publish failed' }

npm ci
