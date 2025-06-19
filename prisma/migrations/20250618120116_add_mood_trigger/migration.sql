-- CreateTable
CREATE TABLE `MoodTrigger` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trigger` VARCHAR(191) NOT NULL,
    `childProfileId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MoodTrigger` ADD CONSTRAINT `MoodTrigger_childProfileId_fkey` FOREIGN KEY (`childProfileId`) REFERENCES `ChildProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
