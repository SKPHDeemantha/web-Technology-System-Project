-- University Interaction System: MySQL DDL
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS message_attachments;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS chat_rooms;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS years;
DROP TABLE IF EXISTS audit_logs;
SET FOREIGN_KEY_CHECKS = 1;

-- Years (1 to 4)
CREATE TABLE years (
  id TINYINT UNSIGNED PRIMARY KEY,
  label VARCHAR(16) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles
CREATE TABLE user_roles (
  id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(32) NOT NULL UNIQUE,  -- 'student','lecturer','admin'
  description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  role_id TINYINT UNSIGNED NOT NULL,
  year_id TINYINT UNSIGNED NULL,  -- applicable for students
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_role (role_id),
  INDEX idx_year (year_id),
  FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (year_id) REFERENCES years(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Announcements: targeted by year (NULL = all years/global)
CREATE TABLE announcements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  author_id BIGINT UNSIGNED NOT NULL, -- lecturer or admin
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  target_year_id TINYINT UNSIGNED NULL,
  is_pinned TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (target_year_id) REFERENCES years(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_target_year (target_year_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chat rooms: could be 'year_channel', 'private', 'group'
CREATE TABLE chat_rooms (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_type ENUM('year','private','group') NOT NULL,
  name VARCHAR(255) NULL, -- optional human-friendly name
  year_id TINYINT UNSIGNED NULL, -- for room_type = 'year'
  created_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (year_id) REFERENCES years(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_room_type (room_type),
  INDEX idx_room_year (year_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Messages
CREATE TABLE messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id BIGINT UNSIGNED NOT NULL,
  sender_id BIGINT UNSIGNED NULL, -- NULL allowed for system messages
  sender_display VARCHAR(120) NOT NULL, -- used for anonymous or display override
  is_anonymous TINYINT(1) NOT NULL DEFAULT 0,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP NULL,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_room_created (room_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Simple attachments table (optional)
CREATE TABLE message_attachments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message_id BIGINT UNSIGNED NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_url VARCHAR(1024) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit logs (admin)
CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id BIGINT UNSIGNED NULL,
  action_type VARCHAR(64) NOT NULL,
  target_type VARCHAR(64) NULL,
  target_id VARCHAR(64) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed basic years and roles
INSERT INTO years (id, label) VALUES (1,'1st Year'), (2,'2nd Year'), (3,'3rd Year'), (4,'4th Year');

INSERT INTO user_roles (role_name, description) VALUES
  ('student','Student user'),
  ('lecturer','Lecturer / Instructor'),
  ('admin','Administrator');

-- Example admin user (PASSWORD MUST be hashed in real system)
-- Replace '<bcrypt-hash>' with the real hash generated by backend (do not store plain text)
INSERT INTO users (email, password_hash, first_name, last_name, display_name, role_id, year_id, is_active)
VALUES
  ('admin@example.edu','<bcrypt-hash>', 'Site','Admin','Admin', 3, NULL, 1);

