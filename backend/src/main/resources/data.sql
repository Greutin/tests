INSERT INTO roles (id, role) VALUES (0, 'ROLE_ADMIN'), (1, 'ROLE_MANAGER'), (2, 'ROLE_PARENT'), (3, 'ROLE_CHILD');

INSERT INTO complexity (id, complexity, complexity_ru, complexity_num)
VALUES (0, 'LOW', 'Легкая', 1000), (1, 'MEDIUM', 'Средняя', 2000), (2, 'HARD', 'Сложная', 3000);

INSERT INTO question_type (id, question_type, question_type_ru)
VALUES (0, 'OPEN', 'Открытый'), (1, 'CLOSED', 'Закрытый');


-- INSERT USERS --------------------------------------------

--Parents
insert into users (first_name, last_name, password, phone_number, username, role_id, id) values ('Parent', 'Parent', '$2a$10$/Sg3ujY7rLOtZ.ZyqQNjXeHGU1k6na/3Zl9hkovs8EQxutKw4Hz0C', '+78005553535', 'parent', 2, 0);
insert into parents (id, email, user_id) values (0, 'email@mail.ru', 0);

--Admins
insert into users (first_name, last_name, password, phone_number, username, role_id, id) values ('Admin', 'Admin', '$2a$10$/Sg3ujY7rLOtZ.ZyqQNjXeHGU1k6na/3Zl9hkovs8EQxutKw4Hz0C', '+78005553535', 'admin', 0, 1);

--Children
insert into users (first_name, last_name, password, phone_number, username, role_id, id) values ('Child', 'Child', '$2a$10$/Sg3ujY7rLOtZ.ZyqQNjXeHGU1k6na/3Zl9hkovs8EQxutKw4Hz0C', '+78005553535', 'child', 3, 2);
insert into children (id, can_use_old_questions, user_id) values (0, false, 2);

insert into children_parents (child_id, parent_id) values (0, 0);

-- END INSERT USERS --------------------------------------------

-- INSERT SUBJECTS --------------------------------------------
insert into subjects (id, subject, class_number) values (0, 'Физика', 5);
-- END INSERT SUBJECTS --------------------------------------------

-- INSERT THEMES --------------------------------------------
insert into themes (id, theme, subject_id) values (0, 'Тема 1', 0);
-- END INSERT THEMES --------------------------------------------