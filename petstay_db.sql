-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 23, 2025 at 03:03 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `petstay_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `service` varchar(100) NOT NULL,
  `dates` text NOT NULL,
  `add_on` varchar(100) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `pet_name` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('Pending','Confirmed','Completed','Cancelled') DEFAULT 'Confirmed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `service`, `dates`, `add_on`, `total`, `quantity`, `pet_name`, `notes`, `status`, `created_at`) VALUES
(1, 5, 'Boarding', '[\"2025-05-24\", \"2025-05-25\"]', 'Special Meal Plan (RM 30)', '94.00', 2, 'Luna', 'Needs extra care.', 'Confirmed', '2025-05-22 07:34:05'),
(7, 5, 'Grooming', '[\"2025-5-27\"]', 'None', '40.00', 1, 'Luna', '', 'Pending', '2025-05-23 02:36:43'),
(8, 5, 'Grooming', '[\"2025-5-29\",\"2025-5-30\"]', 'Nail Trimming (RM 15)', '95.00', 1, 'Luna', '', 'Pending', '2025-05-23 02:53:59'),
(9, 5, 'Grooming', '[\"2025-5-28\"]', 'None', '40.00', 1, 'luna', '', 'Pending', '2025-05-23 03:09:57'),
(10, 7, 'Boarding', '', NULL, '120.00', 2, 'Luna', NULL, 'Completed', '2025-05-25 18:05:01'),
(11, 7, 'Boarding', '[\"2025-5-28\",\"2025-5-29\"]', 'None', '64.00', 1, 'Soya', 'Do not feed too much food.', 'Confirmed', '2025-05-26 03:09:24'),
(12, 7, 'Boarding', '[\"2025-6-19\"]', 'None', '32.00', 1, 'Luna', '', 'Confirmed', '2025-06-16 13:45:50'),
(13, 7, 'Grooming', '[\"2025-6-23\"]', 'None', '40.00', 1, 'Luna', '', 'Confirmed', '2025-06-21 15:05:06'),
(14, 7, 'Grooming', '[\"2025-06-23\"]', 'None', '40.00', 1, 'Luna', '', 'Confirmed', '2025-06-21 15:05:06'),
(15, 7, 'Grooming', '[\"2025-06-28\"]', 'None', '40.00', 1, 'Luna', '', 'Confirmed', '2025-06-21 15:05:06'),
(16, 13, 'Grooming', '[\"2025-06-24\",\"2025-06-25\"]', 'None', '80.00', 1, 'Bobo', '', 'Confirmed', '2025-06-22 06:16:26'),
(17, 7, 'Boarding', '[\"2025-06-25\"]', 'None', '32.00', 1, 'Luna', '', 'Confirmed', '2025-06-22 18:43:35');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `service` varchar(100) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `booking_ids` text NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `submitted_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `user_id`, `booking_ids`, `file_path`, `original_name`, `file_type`, `submitted_at`) VALUES
(1, 7, 'manual_upload', '/uploads/payments/1750525896442-Adrianna Lernty Cassidy Graduates Resume (5).pdf', 'Adrianna Lernty Cassidy Graduates Resume (5).pdf', 'application/pdf', '2025-06-22 01:11:36'),
(2, 7, 'manual_upload', '/uploads/payments/1750526285210-youtube__500x500.png', 'youtube__500x500.png', 'image/png', '2025-06-22 01:18:05'),
(3, 13, 'manual_upload', '/uploads/payments/1750574600496-Adrianna Lernty Cassidy Graduates Resume (2).pdf', 'Adrianna Lernty Cassidy Graduates Resume (2).pdf', 'application/pdf', '2025-06-22 14:43:20'),
(4, 13, 'manual_upload', '/uploads/payments/1750574603841-Adrianna Lernty Cassidy Graduates Resume (2).pdf', 'Adrianna Lernty Cassidy Graduates Resume (2).pdf', 'application/pdf', '2025-06-22 14:43:23'),
(5, 13, 'manual_upload', '/uploads/payments/1750574620207-Adrianna Lernty Cassidy Graduates Resume (4).pdf', 'Adrianna Lernty Cassidy Graduates Resume (4).pdf', 'application/pdf', '2025-06-22 14:43:40'),
(6, 13, 'manual_upload', '/uploads/payments/1750574635472-Adrianna Lernty Cassidy Graduates Resume (4).pdf', 'Adrianna Lernty Cassidy Graduates Resume (4).pdf', 'application/pdf', '2025-06-22 14:43:55'),
(7, 13, 'manual_upload', '/uploads/payments/1750574640986-Adrianna Lernty Cassidy Graduates Resume (4).pdf', 'Adrianna Lernty Cassidy Graduates Resume (4).pdf', 'application/pdf', '2025-06-22 14:44:00'),
(8, 13, 'manual_upload', '/uploads/payments/1750574641386-Adrianna Lernty Cassidy Graduates Resume (4).pdf', 'Adrianna Lernty Cassidy Graduates Resume (4).pdf', 'application/pdf', '2025-06-22 14:44:01'),
(9, 13, 'manual_upload', '/uploads/payments/1750574641610-Adrianna Lernty Cassidy Graduates Resume (4).pdf', 'Adrianna Lernty Cassidy Graduates Resume (4).pdf', 'application/pdf', '2025-06-22 14:44:01'),
(10, 13, 'manual_upload', '/uploads/payments/1750576161620-Adrianna Lernty Cassidy Graduates Resume (4).pdf', 'Adrianna Lernty Cassidy Graduates Resume (4).pdf', 'application/pdf', '2025-06-22 15:09:21'),
(11, 7, 'manual_upload', '/uploads/payments/1750617850116-petstay_test_result_summary.png', 'petstay_test_result_summary.png', 'image/png', '2025-06-23 02:44:10'),
(12, 7, 'manual_upload', '/uploads/payments/1750617853575-petstay_test_result_summary.png', 'petstay_test_result_summary.png', 'image/png', '2025-06-23 02:44:13');

-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

CREATE TABLE `pets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `medical_history` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`id`, `user_id`, `name`, `age`, `breed`, `medical_history`) VALUES
(47, 7, 'Luna', 2, 'Local', 'Vaccinated'),
(48, 7, 'Nini', 3, 'Local', 'Vaccinated'),
(49, 13, 'Bobo', 1, 'Beagle', 'None'),
(50, 6, 'Lily', 2, 'Beagle', 'Vaccinated');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price_min` decimal(10,2) DEFAULT NULL,
  `price_max` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `title`, `description`, `price_min`, `price_max`, `image_url`) VALUES
(1, 'Boarding', 'Safe and secure boarding for your pets with 24/7 supervision.', '32.00', '160.00', 'Pet_Boarding.png'),
(2, 'Grooming', 'Professional grooming services for your petss', '40.00', '90.00', 'Pet_Grooming.png');

-- --------------------------------------------------------

--
-- Table structure for table `service_addons`
--

CREATE TABLE `service_addons` (
  `id` int(11) NOT NULL,
  `service_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `service_addons`
--

INSERT INTO `service_addons` (`id`, `service_id`, `name`, `price`) VALUES
(1, 1, 'Grooming and Bath', '50.00'),
(2, 1, 'Special Meal Plan', '30.00'),
(3, 2, 'Nail Trimming', '15.00'),
(4, 2, 'Fur Styling', '20.00');

-- --------------------------------------------------------

--
-- Table structure for table `service_slots`
--

CREATE TABLE `service_slots` (
  `id` int(11) NOT NULL,
  `service_name` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `available_slots` int(11) NOT NULL DEFAULT 5
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `service_slots`
--

INSERT INTO `service_slots` (`id`, `service_name`, `date`, `available_slots`) VALUES
(1, 'Boarding', '2025-06-21', 5),
(2, 'Grooming', '2025-06-21', 5),
(3, 'Boarding', '2025-06-22', 5),
(4, 'Grooming', '2025-06-22', 5),
(5, 'Boarding', '2025-06-23', 5),
(6, 'Grooming', '2025-06-23', 5),
(7, 'Boarding', '2025-06-24', 5),
(8, 'Grooming', '2025-06-24', 5),
(9, 'Boarding', '2025-06-25', 5),
(10, 'Grooming', '2025-06-25', 5),
(11, 'Boarding', '2025-06-26', 5),
(12, 'Grooming', '2025-06-26', 5),
(13, 'Boarding', '2025-06-27', 5),
(14, 'Grooming', '2025-06-27', 5),
(15, 'Boarding', '2025-06-28', 5),
(16, 'Grooming', '2025-06-28', 5),
(17, 'Boarding', '2025-06-29', 5),
(18, 'Grooming', '2025-06-29', 5),
(19, 'Boarding', '2025-06-30', 5),
(20, 'Grooming', '2025-06-30', 5),
(21, 'Boarding', '2025-07-01', 5),
(22, 'Grooming', '2025-07-01', 5),
(23, 'Boarding', '2025-07-02', 5),
(24, 'Grooming', '2025-07-02', 5),
(25, 'Boarding', '2025-07-03', 5),
(26, 'Grooming', '2025-07-03', 5),
(27, 'Boarding', '2025-07-04', 5),
(28, 'Grooming', '2025-07-04', 5),
(29, 'Boarding', '2025-07-05', 5),
(30, 'Grooming', '2025-07-05', 5),
(31, 'Boarding', '2025-07-06', 5),
(32, 'Grooming', '2025-07-06', 5),
(33, 'Boarding', '2025-07-07', 5),
(34, 'Grooming', '2025-07-07', 5),
(35, 'Boarding', '2025-07-08', 5),
(36, 'Grooming', '2025-07-08', 5),
(37, 'Boarding', '2025-07-09', 5),
(38, 'Grooming', '2025-07-09', 5),
(39, 'Boarding', '2025-07-10', 5),
(40, 'Grooming', '2025-07-10', 5),
(41, 'Boarding', '2025-07-11', 5),
(42, 'Grooming', '2025-07-11', 5),
(43, 'Boarding', '2025-07-12', 5),
(44, 'Grooming', '2025-07-12', 5),
(45, 'Boarding', '2025-07-13', 5),
(46, 'Grooming', '2025-07-13', 5),
(47, 'Boarding', '2025-07-14', 5),
(48, 'Grooming', '2025-07-14', 5),
(49, 'Boarding', '2025-07-15', 5),
(50, 'Grooming', '2025-07-15', 5),
(51, 'Boarding', '2025-07-16', 5),
(52, 'Grooming', '2025-07-16', 5),
(53, 'Boarding', '2025-07-17', 5),
(54, 'Grooming', '2025-07-17', 5),
(55, 'Boarding', '2025-07-18', 5),
(56, 'Grooming', '2025-07-18', 5),
(57, 'Boarding', '2025-07-19', 5),
(58, 'Grooming', '2025-07-19', 5),
(59, 'Boarding', '2025-07-20', 5),
(60, 'Grooming', '2025-07-20', 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `profile_image`) VALUES
(1, 'Admin', 'adriannalernty01@gmail.com', '$2b$10$XsxWu0uesMkILVmH2ItSv.w9hVQ15LN47ni/kvKzjHdzYBVGeR.gK', 'admin', '2025-05-25 23:32:39', NULL),
(2, 'Anna', 'add2001@gmail.com', '$2b$10$O6MgBHjMKfRV1Qvl3QheYeN39SMRTirKbbR9Uki.a8HSM99a6floi', 'user', '2025-05-12 17:42:34', NULL),
(3, 'Lisa', 'lisa@gmail.com', '$2b$10$pRpA10CNKZjGOrUyImj4Ke49uiKcAdRC/6bc8kBNhgqgW9qKYIshS', 'user', '2025-05-18 17:58:52', NULL),
(4, 'Linda', 'Linda@gmail.com', '$2b$10$8UGXD6wcK/SiknUxBgKwNeQkHje1AApaZzCVs23yhppQktx4zI43m', 'user', '2025-05-18 18:24:52', NULL),
(5, 'Nona', 'Nona@gmail.com', '$2b$10$l9X00PGxOIdPWN2vNoKpuuoYAJczBrKzJ5mr/Yb2Hbcg7wAvNVrMK', 'user', '2025-05-18 18:45:43', NULL),
(6, 'Regina', 'Regina@gmail.com', '$2b$10$2pRdkDnyBge0E4OOtrI8HuL3ebiVwxcs5jrnvuvFoM6fdpR6GD/Lq', 'user', '2025-05-22 22:43:30', '/uploads/profile_1750612216760.jpeg'),
(7, 'Lina', 'Lina@gmail.com', '$2b$10$06YvbOxpuGuKVZze5wd6J.e8hBOFw9hx5EagCscViA8Wa8B5XdYtW', 'user', '2025-05-23 18:01:22', '/uploads/profile_1750400976064.png'),
(10, 'June', 'june@gmail.com', '$2b$10$XED7ivvHSWTcRYkuSs/nAe0DCml7JtJsgeTMQi/MScgJhWVrdcfzq', 'user', '2025-05-26 03:15:15', NULL),
(11, '12', 'dina@gmail.com', '$2b$10$ULFe5D.AchBM9vn1qQ.xHeDEgu4j5yENvGMQxkajVVXjeEsKpLl3y', 'user', '2025-05-26 03:52:30', NULL),
(12, 'Adlin Dina', 'nuradlindina1512@gmail.com', '', 'user', '2025-05-27 03:50:21', NULL),
(13, 'Nyamjoonie Nose', 'addmet2014@gmail.com', '', 'user', '2025-06-22 06:15:25', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_addons`
--
ALTER TABLE `service_addons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `service_slots`
--
ALTER TABLE `service_slots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_service_date` (`service_name`,`date`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `pets`
--
ALTER TABLE `pets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `service_addons`
--
ALTER TABLE `service_addons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `service_slots`
--
ALTER TABLE `service_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `pets`
--
ALTER TABLE `pets`
  ADD CONSTRAINT `pets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `service_addons`
--
ALTER TABLE `service_addons`
  ADD CONSTRAINT `service_addons_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
