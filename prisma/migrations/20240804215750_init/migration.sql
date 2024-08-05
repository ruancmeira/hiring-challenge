-- CreateTable
CREATE TABLE `BankSlip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `governmentId` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `debtAmount` DECIMAL(65, 30) NOT NULL,
    `debtDueDate` DATETIME(3) NOT NULL,
    `debtId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BankSlip_debtId_key`(`debtId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
