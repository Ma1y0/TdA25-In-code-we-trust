CREATE TABLE `games` (
	`uuid` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`difficulty` text NOT NULL,
	`game_state` text NOT NULL,
	`board` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_games_name` ON `games` (`name`);