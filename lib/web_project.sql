/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50508
Source Host           : 127.0.0.1:3306
Source Database       : web_project

Target Server Type    : MYSQL
Target Server Version : 50508
File Encoding         : 65001

Date: 2025-11-18 17:25:57
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for announcements
-- ----------------------------
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` bigint(20) unsigned NOT NULL,
  `target_audience` enum('all','students','lecturers','year') COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_year_id` tinyint(3) unsigned DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `published_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `idx_author` (`author_id`),
  KEY `idx_audience` (`target_audience`),
  KEY `idx_published` (`is_published`),
  KEY `idx_expires` (`expires_at`),
  KEY `target_year_id` (`target_year_id`),
  CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `announcements_ibfk_2` FOREIGN KEY (`target_year_id`) REFERENCES `years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of announcements
-- ----------------------------

-- ----------------------------
-- Table structure for assignments
-- ----------------------------
DROP TABLE IF EXISTS `assignments`;
CREATE TABLE `assignments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `due_date` datetime NOT NULL,
  `max_score` decimal(5,2) NOT NULL,
  `created_by` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_due_date` (`due_date`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of assignments
-- ----------------------------

-- ----------------------------
-- Table structure for attendance
-- ----------------------------
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint(20) unsigned NOT NULL,
  `course_id` bigint(20) unsigned NOT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('present','absent','late','excused') COLLATE utf8mb4_unicode_ci NOT NULL,
  `recorded_by` bigint(20) unsigned NOT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attendance` (`student_id`,`course_id`,`attendance_date`),
  KEY `idx_student` (`student_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_date` (`attendance_date`),
  KEY `idx_status` (`status`),
  KEY `recorded_by` (`recorded_by`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of attendance
-- ----------------------------

-- ----------------------------
-- Table structure for audit_logs
-- ----------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `table_name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `record_id` bigint(20) unsigned DEFAULT NULL,
  `old_values` text COLLATE utf8mb4_unicode_ci,
  `new_values` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_table` (`table_name`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of audit_logs
-- ----------------------------

-- ----------------------------
-- Table structure for chat_rooms
-- ----------------------------
DROP TABLE IF EXISTS `chat_rooms`;
CREATE TABLE `chat_rooms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `room_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `course_id` bigint(20) unsigned DEFAULT NULL,
  `created_by` bigint(20) unsigned NOT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '1',
  `max_participants` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_public` (`is_public`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `chat_rooms_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chat_rooms_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of chat_rooms
-- ----------------------------

-- ----------------------------
-- Table structure for communities
-- ----------------------------
DROP TABLE IF EXISTS `communities`;
CREATE TABLE `communities` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_category` (`category`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `communities_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of communities
-- ----------------------------
INSERT INTO `communities` VALUES ('1', 'test1', 'test1', 'Academic', '13', '2025-11-16 15:02:35', '2025-11-16 15:01:40', '1');
INSERT INTO `communities` VALUES ('2', 'Test Community 1', 'Test Community 1 desc', 'Academic', '13', '2025-11-18 06:02:16', '2025-11-18 06:02:16', '1');

-- ----------------------------
-- Table structure for community_members
-- ----------------------------
DROP TABLE IF EXISTS `community_members`;
CREATE TABLE `community_members` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `community_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('member','moderator','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'member',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_membership` (`community_id`,`user_id`),
  KEY `idx_community` (`community_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `community_members_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `community_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of community_members
-- ----------------------------

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `credits` tinyint(3) unsigned NOT NULL,
  `year_id` tinyint(3) unsigned NOT NULL,
  `lecturer_id` bigint(20) unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_code` (`course_code`),
  KEY `idx_year` (`year_id`),
  KEY `idx_lecturer` (`lecturer_id`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`year_id`) REFERENCES `years` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`lecturer_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of courses
-- ----------------------------

-- ----------------------------
-- Table structure for enrollments
-- ----------------------------
DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE `enrollments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint(20) unsigned NOT NULL,
  `course_id` bigint(20) unsigned NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','completed','dropped') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_enrollment` (`student_id`,`course_id`),
  KEY `idx_student` (`student_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of enrollments
-- ----------------------------

-- ----------------------------
-- Table structure for events
-- ----------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `event_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time DEFAULT NULL,
  `venue` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_type` enum('academic','social','sports','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` bigint(20) unsigned NOT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `idx_date` (`event_date`),
  KEY `idx_type` (`event_type`),
  KEY `idx_public` (`is_public`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of events
-- ----------------------------

-- ----------------------------
-- Table structure for grades
-- ----------------------------
DROP TABLE IF EXISTS `grades`;
CREATE TABLE `grades` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint(20) unsigned NOT NULL,
  `assignment_id` bigint(20) unsigned NOT NULL,
  `score` decimal(5,2) NOT NULL,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `graded_by` bigint(20) unsigned NOT NULL,
  `graded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_grade` (`student_id`,`assignment_id`),
  KEY `idx_student` (`student_id`),
  KEY `idx_assignment` (`assignment_id`),
  KEY `idx_grader` (`graded_by`),
  CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `grades_ibfk_2` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `grades_ibfk_3` FOREIGN KEY (`graded_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of grades
-- ----------------------------

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `room_id` bigint(20) unsigned NOT NULL,
  `sender_id` bigint(20) unsigned NOT NULL,
  `message_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_type` enum('text','file','system') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `parent_message_id` bigint(20) unsigned DEFAULT NULL,
  `is_edited` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `idx_room` (`room_id`),
  KEY `idx_sender` (`sender_id`),
  KEY `idx_parent` (`parent_message_id`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`parent_message_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of messages
-- ----------------------------

-- ----------------------------
-- Table structure for message_attachments
-- ----------------------------
DROP TABLE IF EXISTS `message_attachments`;
CREATE TABLE `message_attachments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `message_id` bigint(20) unsigned NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int(10) unsigned NOT NULL,
  `file_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_message` (`message_id`),
  CONSTRAINT `message_attachments_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of message_attachments
-- ----------------------------

-- ----------------------------
-- Table structure for study_materials
-- ----------------------------
DROP TABLE IF EXISTS `study_materials`;
CREATE TABLE `study_materials` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int(10) unsigned NOT NULL,
  `file_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_by` bigint(20) unsigned NOT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_uploaded_by` (`uploaded_by`),
  KEY `idx_public` (`is_public`),
  CONSTRAINT `study_materials_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `study_materials_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of study_materials
-- ----------------------------

-- ----------------------------
-- Table structure for timetables
-- ----------------------------
DROP TABLE IF EXISTS `timetables`;
CREATE TABLE `timetables` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint(20) unsigned NOT NULL,
  `day_of_week` tinyint(3) unsigned NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `room` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_day_time` (`day_of_week`,`start_time`),
  KEY `idx_room` (`room`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `timetables_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `timetables_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of timetables
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` tinyint(3) unsigned NOT NULL,
  `year_id` tinyint(3) unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_role` (`role_id`),
  KEY `idx_year` (`year_id`),
  KEY `idx_email` (`email`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`year_id`) REFERENCES `years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('9', 'navindualahakoon3@gmail.com', '25d55ad283aa400af464c76d713c07ad', 'Navindu', 'Alahakoon', 'Navindu Alahakoon', '1', '2', '0', '2025-11-16 10:57:37', '2025-11-16 15:27:31');
INSERT INTO `users` VALUES ('13', 'admin@gmail.com', 'c93ccd78b2076528346216b3b2f701e6', 'Admin', 'Navindu', 'Admin Navindu', '3', '0', '1', '2025-11-16 13:19:28', '2025-11-16 13:19:28');
INSERT INTO `users` VALUES ('17', 'newuser@gmail.com', '25d55ad283aa400af464c76d713c07ad', 'New', 'User', 'New User', '1', '1', '1', '2025-11-16 19:47:36', '2025-11-16 19:47:36');
INSERT INTO `users` VALUES ('18', 'newadmin@gmail.com', 'fc871fd7246118f8ce413948597e2a5d', 'New', 'Admin', 'New Admin', '3', '1', '1', '2025-11-17 07:32:39', '2025-11-17 07:32:39');
INSERT INTO `users` VALUES ('23', 'testuser@gmail.com', '1fe949c554f4121a85301b277b63c55a', 'Test', 'User', 'Test User', '1', '1', '1', '2025-11-17 10:15:49', '2025-11-17 10:15:49');
INSERT INTO `users` VALUES ('24', 'lecturer1@gmail.com', '1eec583133e8014118cbd11c8ccbc4bf', 'Lecturer', '1', 'Lecturer 1', '2', '1', '1', '2025-11-17 10:20:28', '2025-11-17 10:20:28');
INSERT INTO `users` VALUES ('25', 'lecturer2@gmail.com', '54c18dfca005eb5aa7fa7370017bda84', 'Lecturer', '2', 'Lecturer 2', '2', '1', '1', '2025-11-17 10:30:40', '2025-11-17 10:30:40');
INSERT INTO `users` VALUES ('26', 'testinguser@gmail.com', '1abde7c05e94a7455e75cb8fff1f9ea8', 'testing', 'user', 'testing user', '1', '1', '1', '2025-11-18 05:21:10', '2025-11-18 05:21:10');
INSERT INTO `users` VALUES ('27', 'adminnew@gmail.com', 'c257093259de239de712f57d27f723c6', 'Admin', 'new', 'Admin new', '3', '0', '1', '2025-11-18 16:38:35', '2025-11-18 16:38:35');

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `role_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
INSERT INTO `user_roles` VALUES ('1', 'student', 'Student user');
INSERT INTO `user_roles` VALUES ('2', 'lecturer', 'Teaching staff');
INSERT INTO `user_roles` VALUES ('3', 'admin', 'Administrative staff');

-- ----------------------------
-- Table structure for years
-- ----------------------------
DROP TABLE IF EXISTS `years`;
CREATE TABLE `years` (
  `id` tinyint(3) unsigned NOT NULL,
  `label` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `label` (`label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of years
-- ----------------------------
INSERT INTO `years` VALUES ('1', 'First Year');
INSERT INTO `years` VALUES ('4', 'Fourth Year');
INSERT INTO `years` VALUES ('0', 'None');
INSERT INTO `years` VALUES ('2', 'Second Year');
INSERT INTO `years` VALUES ('3', 'Third Year');
DROP TRIGGER IF EXISTS `update_announcements_updated_at`;
DELIMITER ;;
CREATE TRIGGER `update_announcements_updated_at` BEFORE UPDATE ON `announcements` FOR EACH ROW BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `update_assignments_updated_at`;
DELIMITER ;;
CREATE TRIGGER `update_assignments_updated_at` BEFORE UPDATE ON `assignments` FOR EACH ROW BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `update_courses_updated_at`;
DELIMITER ;;
CREATE TRIGGER `update_courses_updated_at` BEFORE UPDATE ON `courses` FOR EACH ROW BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `update_events_updated_at`;
DELIMITER ;;
CREATE TRIGGER `update_events_updated_at` BEFORE UPDATE ON `events` FOR EACH ROW BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `update_messages_updated_at`;
DELIMITER ;;
CREATE TRIGGER `update_messages_updated_at` BEFORE UPDATE ON `messages` FOR EACH ROW BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `update_timetables_updated_at`;
DELIMITER ;;
CREATE TRIGGER `update_timetables_updated_at` BEFORE UPDATE ON `timetables` FOR EACH ROW BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `update_users_updated_at`;
DELIMITER ;;
CREATE TRIGGER `update_users_updated_at` BEFORE UPDATE ON `users` FOR EACH ROW BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END
;;
DELIMITER ;
