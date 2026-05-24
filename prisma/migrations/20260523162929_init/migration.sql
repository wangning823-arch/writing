-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'sprout',
    "chineseLevel" INTEGER NOT NULL DEFAULT 1,
    "englishLevel" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "directionScore" INTEGER NOT NULL DEFAULT 0,
    "structureScore" INTEGER NOT NULL DEFAULT 0,
    "vocabScore" INTEGER NOT NULL DEFAULT 0,
    "sentenceScore" INTEGER NOT NULL DEFAULT 0,
    "errorScore" INTEGER NOT NULL DEFAULT 0,
    "stage" TEXT NOT NULL,
    "chineseLevel" INTEGER NOT NULL,
    "englishLevel" INTEGER NOT NULL,
    "answers" TEXT NOT NULL DEFAULT '[]',
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Assessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "year" INTEGER,
    "region" TEXT,
    "subject" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "sampleEssays" TEXT NOT NULL DEFAULT '[]'
);

-- CreateTable
CREATE TABLE "TrainingRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "topicId" TEXT,
    "subject" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "score" INTEGER,
    "dimensionScores" TEXT NOT NULL DEFAULT '{}',
    "feedback" TEXT NOT NULL DEFAULT '{}',
    "isRevision" BOOLEAN NOT NULL DEFAULT false,
    "revisionOf" TEXT,
    "progressScore" INTEGER,
    "suggestions" TEXT NOT NULL DEFAULT '[]',
    "timeSpent" INTEGER,
    "timeLimit" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrainingRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrainingRecord_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AbilityProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "recordId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AbilityProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
