-- University Interaction System: MySQL DDL
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS message_attachments;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS chat_rooms;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS timetables;
DROP TABLE IF EXISTS study_materials;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
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

-- Courses
CREATE TABLE courses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(16) NOT NULL UNIQUE,
  course_name VARCHAR(255) NOT NULL,
  description TEXT,
  lecturer_id BIGINT UNSIGNED NOT NULL,
  year_id TINYINT UNSIGNED NOT NULL,
  semester ENUM('fall','spring','summer') NOT NULL,
  credits TINYINT UNSIGNED NOT NULL DEFAULT 3,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lecturer_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (year_id) REFERENCES years(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_lecturer (lecturer_id),
  INDEX idx_year_semester (year_id, semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enrollments
CREATE TABLE enrollments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('enrolled','dropped','completed') NOT NULL DEFAULT 'enrolled',
  UNIQUE KEY unique_enrollment (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_student (student_id),
  INDEX idx_course (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Assignments
CREATE TABLE assignments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATETIME NOT NULL,
  max_points DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_course_due (course_id, due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Grades
CREATE TABLE grades (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assignment_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  points_earned DECIMAL(5,2) NULL,
  feedback TEXT,
  graded_by BIGINT UNSIGNED NOT NULL,
  graded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_grade (assignment_id, student_id),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_student_assignment (student_id, assignment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attendance
CREATE TABLE attendance (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  status ENUM('present','absent','late','excused') NOT NULL,
  marked_by BIGINT UNSIGNED NOT NULL,
  marked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  UNIQUE KEY unique_attendance (course_id, student_id, date),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_course_date (course_id, date),
  INDEX idx_student_date (student_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Study Materials
CREATE TABLE study_materials (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(1024) NOT NULL,
  file_type VARCHAR(64) NOT NULL,
  uploaded_by BIGINT UNSIGNED NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_course_uploaded (course_id, uploaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Timetables
CREATE TABLE timetables (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT UNSIGNED NOT NULL,
  day_of_week ENUM('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room VARCHAR(64),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_course_day (course_id, day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events
CREATE TABLE events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NULL,
  location VARCHAR(255),
  organizer_id BIGINT UNSIGNED NOT NULL,
  target_year_id TINYINT UNSIGNED NULL, -- NULL = all years
  is_public TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (target_year_id) REFERENCES years(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_date (event_date),
  INDEX idx_organizer (organizer_id),
  INDEX idx_target_year (target_year_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Communities
CREATE TABLE communities (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(64) NOT NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_category (category),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Community Members
CREATE TABLE community_members (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  community_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  role ENUM('member','moderator','admin') NOT NULL DEFAULT 'member',
  UNIQUE KEY unique_membership (community_id, user_id),
  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_community (community_id),
  INDEX idx_user (user_id)
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

-- Sample lecturer user (mock data from app.js)
INSERT INTO users (email, password_hash, first_name, last_name, display_name, role_id, year_id, is_active)
VALUES
  ('alice@uni.edu', 'password', 'Alice', 'Benson', 'Dr. Alice Benson', 2, NULL, 1);

-- Sample student users (mock data from app.js)
INSERT INTO users (email, password_hash, first_name, last_name, display_name, role_id, year_id, is_active)
VALUES
  ('john.1@uni.edu', 'password', 'John', 'Doe', 'John Doe', 1, 1, 1),
  ('jane.2@uni.edu', 'password', 'Jane', 'Smith', 'Jane Smith', 1, 2, 1);

-- Sample course (based on mock timetable)
INSERT INTO courses (course_code, course_name, description, lecturer_id, year_id, semester, credits, is_active)
VALUES
  ('CS101', 'Introduction to Programming', 'Basic programming course', 2, 1, 'fall', 3, 1);

-- Sample timetable (mock data from app.js)
INSERT INTO timetables (course_id, day_of_week, start_time, end_time, room)
VALUES
  (1, 'monday', '09:00:00', '11:00:00', 'Room A1');

-- Sample announcement (mock data from app.js)
INSERT INTO announcements (author_id, title, body, target_year_id, is_pinned)
VALUES
  (2, 'Welcome to Semester', 'Semester starts Monday. Check your timetable.', NULL, 0);

-- Additional sample users (more students, lecturers, admins)
INSERT INTO users (email, password_hash, first_name, last_name, display_name, role_id, year_id, is_active)
VALUES
  ('bob@uni.edu', 'password', 'Bob', 'Johnson', 'Dr. Bob Johnson', 2, NULL, 1),  -- Lecturer
  ('charlie@uni.edu', 'password', 'Charlie', 'Williams', 'Dr. Charlie Williams', 2, NULL, 1),  -- Lecturer
  ('admin2@example.edu', 'password', 'Super', 'Admin', 'Super Admin', 3, NULL, 1),  -- Admin
  ('student1@uni.edu', 'password', 'Alice', 'Brown', 'Alice Brown', 1, 1, 1),  -- Student Year 1
  ('student2@uni.edu', 'password', 'David', 'Lee', 'David Lee', 1, 1, 1),  -- Student Year 1
  ('student3@uni.edu', 'password', 'Emma', 'Garcia', 'Emma Garcia', 1, 2, 1),  -- Student Year 2
  ('student4@uni.edu', 'password', 'Frank', 'Miller', 'Frank Miller', 1, 2, 1),  -- Student Year 2
  ('student5@uni.edu', 'password', 'Grace', 'Davis', 'Grace Davis', 1, 3, 1),  -- Student Year 3
  ('student6@uni.edu', 'password', 'Henry', 'Rodriguez', 'Henry Rodriguez', 1, 3, 1),  -- Student Year 3
  ('student7@uni.edu', 'password', 'Ivy', 'Martinez', 'Ivy Martinez', 1, 4, 1),  -- Student Year 4
  ('student8@uni.edu', 'password', 'Jack', 'Hernandez', 'Jack Hernandez', 1, 4, 1);  -- Student Year 4

-- Additional courses
INSERT INTO courses (course_code, course_name, description, lecturer_id, year_id, semester, credits, is_active)
VALUES
  ('CS102', 'Data Structures', 'Advanced programming concepts', 3, 2, 'fall', 4, 1),  -- Lecturer Bob
  ('MATH101', 'Calculus I', 'Introduction to calculus', 4, 1, 'fall', 3, 1),  -- Lecturer Charlie
  ('ENG201', 'English Literature', 'Study of classic literature', 4, 2, 'spring', 3, 1),  -- Lecturer Charlie
  ('PHY101', 'Physics I', 'Basic physics principles', 3, 1, 'spring', 4, 1),  -- Lecturer Bob
  ('CS201', 'Algorithms', 'Algorithm design and analysis', 3, 3, 'fall', 4, 1),  -- Lecturer Bob
  ('BIO101', 'Biology I', 'Introduction to biology', 4, 1, 'summer', 3, 1),  -- Lecturer Charlie
  ('CHEM101', 'Chemistry I', 'Basic chemistry', 3, 2, 'summer', 4, 1),  -- Lecturer Bob
  ('HIST101', 'World History', 'Overview of world history', 4, 3, 'fall', 3, 1);  -- Lecturer Charlie

-- Enrollments (students in courses based on year)
INSERT INTO enrollments (student_id, course_id, status)
VALUES
  (5, 1, 'enrolled'), (6, 1, 'enrolled'),  -- Year 1 students in CS101
  (7, 2, 'enrolled'), (8, 2, 'enrolled'),  -- Year 2 in CS102
  (9, 3, 'enrolled'), (10, 3, 'enrolled'),  -- Year 3 in MATH101
  (11, 4, 'enrolled'), (12, 4, 'enrolled'),  -- Year 4 in ENG201
  (5, 4, 'enrolled'), (6, 5, 'enrolled'),  -- Cross-enrollments
  (7, 6, 'enrolled'), (8, 7, 'enrolled'),
  (9, 8, 'enrolled'), (10, 9, 'enrolled'),
  (11, 10, 'enrolled'), (12, 11, 'enrolled');

-- Assignments
INSERT INTO assignments (course_id, title, description, due_date, max_points, created_by)
VALUES
  (1, 'Programming Assignment 1', 'Basic loops and arrays', '2023-10-15 23:59:59', 100.00, 2),
  (1, 'Midterm Project', 'Build a simple app', '2023-11-01 23:59:59', 150.00, 2),
  (2, 'Data Structures Quiz', 'Quiz on stacks and queues', '2023-10-20 23:59:59', 50.00, 3),
  (3, 'Calculus Homework 1', 'Derivatives and integrals', '2023-10-10 23:59:59', 75.00, 4),
  (4, 'Literature Essay', 'Essay on Shakespeare', '2023-11-15 23:59:59', 100.00, 4),
  (5, 'Physics Lab Report', 'Mechanics experiment', '2023-10-25 23:59:59', 80.00, 3),
  (6, 'Algorithm Analysis', 'Time complexity problems', '2023-11-05 23:59:59', 120.00, 3),
  (7, 'Biology Presentation', 'Cell structure presentation', '2023-10-30 23:59:59', 90.00, 4),
  (8, 'Chemistry Lab', 'Acid-base reactions', '2023-11-10 23:59:59', 100.00, 3),
  (9, 'History Research Paper', '20th Century Events', '2023-11-20 23:59:59', 150.00, 4);

-- Grades (sample for some assignments)
INSERT INTO grades (assignment_id, student_id, points_earned, feedback, graded_by)
VALUES
  (1, 5, 95.00, 'Good work on loops.', 2),
  (1, 6, 88.00, 'Needs improvement on arrays.', 2),
  (2, 7, 120.00, 'Excellent project.', 3),
  (3, 9, 70.00, 'Solid effort.', 4),
  (4, 11, 85.00, 'Well-written essay.', 4),
  (5, 5, 78.00, 'Good lab work.', 3),
  (6, 9, 110.00, 'Strong analysis.', 3),
  (7, 7, 92.00, 'Informative presentation.', 4),
  (8, 8, 95.00, 'Accurate results.', 3),
  (9, 10, 140.00, 'Thorough research.', 4);

-- Attendance (sample records)
INSERT INTO attendance (course_id, student_id, date, status, marked_by, notes)
VALUES
  (1, 5, '2023-09-01', 'present', 2, NULL),
  (1, 6, '2023-09-01', 'late', 2, 'Arrived 10 min late'),
  (2, 7, '2023-09-02', 'present', 3, NULL),
  (3, 9, '2023-09-03', 'absent', 4, 'Sick leave'),
  (4, 11, '2023-09-04', 'excused', 4, 'Medical appointment'),
  (5, 5, '2023-09-05', 'present', 3, NULL),
  (6, 9, '2023-09-06', 'present', 3, NULL),
  (7, 7, '2023-09-07', 'late', 4, 'Traffic delay'),
  (8, 8, '2023-09-08', 'present', 3, NULL),
  (9, 10, '2023-09-09', 'present', 4, NULL);

-- Study Materials
INSERT INTO study_materials (course_id, title, description, file_url, file_type, uploaded_by)
VALUES
  (1, 'Programming Slides', 'Lecture slides on basics', 'files/cs101/slides1.pdf', 'pdf', 2),
  (2, 'Data Structures Notes', 'Handwritten notes', 'files/cs102/notes.pdf', 'pdf', 3),
  (3, 'Calculus Textbook', 'Chapter 1 excerpt', 'files/math101/text.pdf', 'pdf', 4),
  (4, 'Literature Reading', 'Shakespeare play', 'files/eng201/play.pdf', 'pdf', 4),
  (5, 'Physics Formulas', 'Formula sheet', 'files/phy101/formulas.pdf', 'pdf', 3),
  (6, 'Algorithm Examples', 'Code samples', 'files/cs201/examples.zip', 'zip', 3),
  (7, 'Biology Diagrams', 'Cell diagrams', 'files/bio101/diagrams.jpg', 'jpg', 4),
  (8, 'Chemistry Lab Manual', 'Lab instructions', 'files/chem101/manual.pdf', 'pdf', 3),
  (9, 'History Timeline', 'World events timeline', 'files/hist101/timeline.pdf', 'pdf', 4);

-- Additional Timetables
INSERT INTO timetables (course_id, day_of_week, start_time, end_time, room)
VALUES
  (2, 'tuesday', '10:00:00', '12:00:00', 'Room B1'),
  (3, 'wednesday', '09:00:00', '11:00:00', 'Room C1'),
  (4, 'thursday', '14:00:00', '16:00:00', 'Room D1'),
  (5, 'friday', '13:00:00', '15:00:00', 'Room E1'),
  (6, 'monday', '15:00:00', '17:00:00', 'Room F1'),
  (7, 'tuesday', '16:00:00', '18:00:00', 'Room G1'),
  (8, 'wednesday', '11:00:00', '13:00:00', 'Room H1'),
  (9, 'thursday', '12:00:00', '14:00:00', 'Room I1');

-- Additional Announcements
INSERT INTO announcements (author_id, title, body, target_year_id, is_pinned)
VALUES
  (3, 'Assignment Deadline Extended', 'CS102 assignment due date moved to next week.', 2, 0),
  (4, 'Exam Schedule Released', 'Check the portal for final exam dates.', NULL, 1),  -- Pinned, all years
  (2, 'Guest Lecture Tomorrow', 'Dr. Smith will speak on AI.', 3, 0),
  (3, 'Lab Safety Reminder', 'Wear protective gear in chemistry lab.', 2, 0),
  (4, 'Library Hours Extended', 'Open until midnight during finals.', NULL, 0),
  (2, 'Welcome New Students', 'Orientation on Friday.', 1, 1),  -- Pinned for Year 1
  (3, 'Project Submission', 'Submit group projects by end of week.', 4, 0),
  (4, 'Holiday Notice', 'No classes on Monday.', NULL, 1);  -- Pinned

-- Events
INSERT INTO events (title, description, event_date, start_time, end_time, location, organizer_id, target_year_id, is_public)
VALUES
  ('Orientation Day', 'Welcome event for new students', '2023-09-01', '09:00:00', '17:00:00', 'Auditorium', 2, 1, 1),
  ('Career Fair', 'Meet potential employers', '2023-10-15', '10:00:00', '16:00:00', 'Gym', 3, NULL, 1),  -- All years
  ('Science Fair', 'Showcase student projects', '2023-11-05', '12:00:00', '18:00:00', 'Science Building', 4, 2, 1),
  ('Sports Day', 'Inter-year competitions', '2023-11-20', '08:00:00', '20:00:00', 'Stadium', 2, NULL, 1),
  ('Graduation Ceremony', 'For Year 4 students', '2023-12-15', '14:00:00', '18:00:00', 'Main Hall', 4, 4, 1),
  ('Workshop on Coding', 'Hands-on session', '2023-10-10', '13:00:00', '16:00:00', 'Lab 101', 3, 1, 1),
  ('Art Exhibition', 'Student art display', '2023-11-10', '11:00:00', '15:00:00', 'Art Gallery', 4, NULL, 1),
  ('Mental Health Seminar', 'Stress management talk', '2023-10-25', '15:00:00', '17:00:00', 'Conference Room', 2, NULL, 1);

-- Chat Rooms
INSERT INTO chat_rooms (room_type, name, year_id, created_by)
VALUES
  ('year', '1st Year Channel', 1, 2),
  ('year', '2nd Year Channel', 2, 3),
  ('year', '3rd Year Channel', 3, 4),
  ('year', '4th Year Channel', 4, 2),
  ('private', 'Alice and Bob Chat', NULL, 5),  -- Private between student and lecturer
  ('group', 'Study Group CS101', NULL, 5),
  ('group', 'Project Team Alpha', NULL, 7);

-- Messages
INSERT INTO messages (room_id, sender_id, sender_display, is_anonymous, content, edited_at, is_deleted)
VALUES
  (1, 5, 'Alice Brown', 0, 'Hi everyone, excited for the semester!', NULL, 0),
  (1, 6, 'David Lee', 0, 'Me too! When is the first class?', NULL, 0),
  (2, 7, 'Emma Garcia', 0, 'Anyone up for study group?', NULL, 0),
  (3, 9, 'Grace Davis', 0, 'Assignment is tough, need help.', NULL, 0),
  (4, 11, 'Ivy Martinez', 0, 'Graduation plans?', NULL, 0),
  (5, 5, 'Alice Brown', 0, 'Dr. Johnson, question about assignment.', NULL, 0),
  (5, 3, 'Dr. Bob Johnson', 0, 'Sure, what is it?', NULL, 0),
  (6, 5, 'Alice Brown', 0, 'Let\'s meet tomorrow for CS101.', NULL, 0),
  (7, 7, 'Emma Garcia', 0, 'Project deadline approaching.', NULL, 0),
  (1, NULL, 'Anonymous', 1, 'Campus event info needed.', NULL, 0);  -- Anonymous message

-- Message Attachments
INSERT INTO message_attachments (message_id, filename, file_url)
VALUES
  (1, 'schedule.pdf', 'files/messages/schedule.pdf'),
  (3, 'notes.txt', 'files/messages/notes.txt'),
  (7, 'assignment.pdf', 'files/messages/assignment.pdf');

-- Sample Communities
INSERT INTO communities (name, description, category, created_by, is_active)
VALUES
  ('Computer Science Club', 'A community for computer science students to share knowledge and collaborate on projects.', 'Technical', 2, 1),
  ('Math Study Group', 'Group for mathematics students to discuss problems and study together.', 'Academic', 4, 1),
  ('Art & Design Society', 'Creative community for art and design enthusiasts.', 'Cultural', 4, 1),
  ('Business Leaders Forum', 'Forum for aspiring business leaders to network and learn.', 'Social', 3, 1),
  ('Environmental Club', 'Community focused on environmental awareness and sustainability.', 'Social', 2, 1),
  ('Sports & Fitness Club', 'For students interested in sports and maintaining fitness.', 'Sports', 3, 1),
  ('Music Society', 'Community for music lovers and musicians.', 'Cultural', 4, 1),
  ('Debate Club', 'Platform for intellectual discussions and debate practice.', 'Academic', 2, 1);

-- Community Members (sample memberships)
INSERT INTO community_members (community_id, user_id, role, joined_at)
VALUES
  (1, 5, 'member', '2023-09-01 10:00:00'),  -- Alice in CS Club
  (1, 6, 'member', '2023-09-01 10:00:00'),  -- David in CS Club
  (1, 7, 'moderator', '2023-09-01 10:00:00'),  -- Emma as moderator in CS Club
  (2, 9, 'member', '2023-09-02 10:00:00'),  -- Grace in Math Group
  (2, 10, 'member', '2023-09-02 10:00:00'),  -- Henry in Math Group
  (3, 11, 'member', '2023-09-03 10:00:00'),  -- Ivy in Art Society
  (3, 12, 'member', '2023-09-03 10:00:00'),  -- Jack in Art Society
  (4, 5, 'member', '2023-09-04 10:00:00'),  -- Alice in Business Forum
  (4, 7, 'member', '2023-09-04 10:00:00'),  -- Emma in Business Forum
  (5, 9, 'member', '2023-09-05 10:00:00'),  -- Grace in Environmental Club
  (5, 11, 'moderator', '2023-09-05 10:00:00'),  -- Ivy as moderator in Environmental Club
  (6, 6, 'member', '2023-09-06 10:00:00'),  -- David in Sports Club
  (6, 8, 'member', '2023-09-06 10:00:00'),  -- Frank in Sports Club
  (7, 10, 'member', '2023-09-07 10:00:00'),  -- Henry in Music Society
  (7, 12, 'member', '2023-09-07 10:00:00'),  -- Jack in Music Society
  (8, 5, 'member', '2023-09-08 10:00:00'),  -- Alice in Debate Club
  (8, 7, 'member', '2023-09-08 10:00:00');  -- Emma in Debate Club

-- Audit Logs
INSERT INTO audit_logs (admin_id, action_type, target_type, target_id, notes)
VALUES
  (1, 'user_created', 'user', '5', 'Created student Alice Brown'),
  (1, 'course_added', 'course', '2', 'Added Data Structures course'),
  (13, 'announcement_pinned', 'announcement', '12', 'Pinned exam schedule'),
  (1, 'user_deleted', 'user', '14', 'Removed inactive user'),  -- Assuming ID 14 exists or placeholder
  (13, 'event_created', 'event', '5', 'Created graduation event'),
  (1, 'community_created', 'community', '1', 'Created Computer Science Club'),
  (1, 'community_created', 'community', '2', 'Created Math Study Group'),
  (1, 'community_created', 'community', '3', 'Created Art & Design Society'),
  (1, 'community_created', 'community', '4', 'Created Business Leaders Forum'),
  (1, 'community_created', 'community', '5', 'Created Environmental Club');

