-- CreateTable
CREATE TABLE "DigitalLiteracyProgram" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "programName" TEXT NOT NULL,
    "participants" INTEGER NOT NULL,
    "completionRate" REAL NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "community" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BroadbandConnectivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "region" TEXT NOT NULL,
    "coverageLevel" TEXT NOT NULL,
    "speed" INTEGER NOT NULL,
    "lastUpdated" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DeviceAccess" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "community" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "affordabilityIndex" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "CommunityFeedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "community" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GeographicalData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "region" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "areaType" TEXT NOT NULL
);
