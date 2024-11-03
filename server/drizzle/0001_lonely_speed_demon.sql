ALTER TABLE `games` ADD `difficulty` text NOT NULL;--> statement-breakpoint
ALTER TABLE `games` ADD `game_state` text NOT NULL;--> statement-breakpoint
ALTER TABLE `games` ADD `board` text NOT NULL;--> statement-breakpoint
ALTER TABLE `games` ADD `createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `games` ADD `updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_games_name` ON `games` (`name`);