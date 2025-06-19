-- CreateTable
CREATE TABLE `CopingStrategy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `strategy` VARCHAR(191) NOT NULL,
    `childProfileId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CopingStrategy` ADD CONSTRAINT `CopingStrategy_childProfileId_fkey` FOREIGN KEY (`childProfileId`) REFERENCES `ChildProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
