import { container } from 'tsyringe';

import { GenerateImageFormat } from '@/generate/generateImageFormat';
import { UploadImage } from '@/upload/uploadImage';
import { PurgeGroup } from '@/purge/purgeGroup';
import { StorageService } from '@/shared/StorageService';

container.registerSingleton<GenerateImageFormat>(
	'generateImageFormat',
	GenerateImageFormat
);

container.registerSingleton<UploadImage>('uploadImage', UploadImage);

container.registerSingleton<PurgeGroup>('purgeGroup', PurgeGroup);

container.registerSingleton<StorageService>(StorageService, StorageService);
