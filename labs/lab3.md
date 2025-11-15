USE CASES
====================================================================================================================================
Terminate Program

When the user exits the program when no in any learning state.

Users: all
Preconditions: 
    • User is in any part of the program (e.g. login screen, topic screen, etc.) except tutorial/lesson/test/quiz screen.
Path: 
    1. User clicks x or quit program button.
    2. Program terminates.
Postconditions:
    • Nothing is changed as user has done nothing that needs updating database.

====================================================================================================================================
Terminate Program in Tutorial Session

When the user exits the program during a learning state.

Users: all
Preconditions: 
    • User is in any part of the program that involves learning (e.g. lessons, quiz, tests, etc.).
Path: 
    1. User clicks x or quit program button.
    2. Warn user progress if they are sure they want to exit, progress will be saved.
    3a. If user clicks no, let user continue the session.
    3b. If user clicks yes, save progress then terminate the program.
Postconditions:
    • If user clicks yes, system will save current progress so student can continue where they left off. Then terminate program.

====================================================================================================================================
Check User Progress

Let the use see how much progress/understanding they have on a certain topic/chapter.

Users: all
Preconditions: 
    • User is logged in.
    • User has completed some lessons.
Path: 
    1. User is on home page and clicks progress button.
    2. Software loads progress screen and load data to visually show user their progress from 0-100% for each topic/chapter.
Postconditions:
    • N/A

====================================================================================================================================
User Login

Let user login into their account.

Users: all
Preconditions: 
    • User has the software running and is on the login screen.
    • User has a preexisting account.
Path: 
    1a. User enters in their username and password then hit enter.
    1b. User clicks forget password and taken to forgotten password screen.
    2. User is now logged into their account and can start their lessons.
Postconditions:
    • N/A

====================================================================================================================================
Student Choose a Lesson

User can choose which lesson available to them to learn.

Users: students
Preconditions: 
    • User is logged in.
    • User has completed some lessons.
Path: 
    1. User is on home page and clicks all lessons button.
    2. User is taken to all lessons screen and can choose from available buttons.
    3. Then user clicks a button and is taken to their chosen lesson.
Postconditions:
    • N/A

====================================================================================================================================
Student Completes a Practice Question
Summary: A student answers a Python programming question and receives immediate feedback.
Actors: Student, System
Preconditions: Student is logged in and has selected a learning module.
Path:
1. The student reads a Python programming question presented by the system. 
2. The student enters their answer in a text-box or selects a multiple choice response and submits it. 
3. The system evaluates the answer then displays correct/incorrect, and provides immediate feedback. 
4. The system updates the student's progress and mastery level.
Postcondition: System updates student's progress and mastery level.

====================================================================================================================================
Student Begins a New Learning Module
Summary: A student starts learning a new Python concept
Actors: System, Student
Preconditions: Student is logged in.
Path:
1. The student selects a learning module from their dashboard. 
2. The system presents an introduction to the concept with examples and explanations. 
3. The system breaks down the concept into step-by-step lessons. 
4. The student progresses through each lesson, reading content and viewing code examples. 
5. The system tracks which lessons have been completed and updates the student's progress.
Postcondition: System updates student's progress and mastery level.

====================================================================================================================================
System Adjusts Question Difficulty
Summary: The ML component adapts question difficulty based on student performance.
Actors: System, Student
Preconditions: Student has answered at least 5 questions in the current topic.
Path:
1. The system's ML component analyzes the student's recent performance and tracks which skills have been mastered and which questions have been incorrectly answered most recently. 
2. Based on the mastery model, the system selects the next question at an appropriate difficulty level. 
3. If the student has been answering correctly, the system increases difficulty. 
4. If the student is struggling, the system provides easier questions or reviews prerequisite concepts. 
5. The system presents the adaptively selected question to the student.
Postcondition: System updates student's mastery level.

====================================================================================================================================
Teacher Views Class Progress Dashboard
Summary: A teacher monitors overall class performance and identifies struggling students.
Actors: Teacher, System
Preconditions: Teacher is logged in and has at least one assigned class.
Path: 
1. The teacher navigates to the class dashboard and selects a specific class. 
2. The system displays an overview showing each student's progress, including topics completed, current mastery levels, and recent assessment scores. 
3. The system highlights students who are struggling (falling behind or scoring poorly) in red or with warning indicators. 
4. The teacher clicks on individual students to view detailed performance data. 
5. The system provides this information to help the teacher identify who needs additional support.

====================================================================================================================================
Teacher Creates a New Question
Summary: A teacher adds a new Python programming question to the question bank.
Actors: Teacher, System
Preconditions: Teacher is logged in and has content creation permissions.
Path:
1. The teacher navigates to the question creation interface and selects the question type (multiple choice, short answer, or code submission). 
2. The teacher enters the question text, provides the correct answer, and adds common incorrect answers or mistake patterns. 
3. The teacher tags the question with relevant topics and skill levels. 
4. The teacher submits the question, and the system saves it to the question bank, making it available for assignment to students.
Postcondition: System will update question bank for that teacher.

====================================================================================================================================
Student asks a follow up question
Actors: Student, System
Summary: A student asks a follow up questions after receiving feedback or an explanation to deepen understanding of topic
Preconditions: Student is logged in. Student has completed a question and received feedback.
Path: 
1. The student types a follow up question in the interface (e.g. "Can you explain that in simpler terms"). 
2. The system analyzes the context of the original question and the students question. 
3. The system generates a response such as clarifying the explanation that builds on the previous feedback.
Postconditions: The system logs the student follow up question to refine the model. The student gets a deeper understanding of the concept.

====================================================================================================================================
System displays visual skill metrics
Summary: the system displays a visual breakdown of the students performance across different categories and question types.
Actors: Student, System
Preconditions: Student is logged in. System has data from multiple completed questions.
Path: 
1. The student goes to their dashboard and opens the "Skill Progress" section. 
2. The system displays graphs and charts that show accuracy, mastery level by concepts and error patterns. 
3. The student can filter by question types. The visualization highlights strong areas and weak areas. 
4. The student can click to access related lessons or more practice questions.
Postconditions: The student gains insight into performance trends.



REQUIREMENTS
The <user/system type> must/should <do one thing>

Must: Currently at 65; need 48 total
Should: Currently at 32; need 32 total
Could: Currently at 24; need 24 total
Won't: Currently at 16; need 16 total

Functional:

    Must:
    - The system must save progress
    - The system must resume saved progress
    - The system must provide well-formated feedback
    - The system must provide gramatically clear feedback
    - The system must provide structured feedback that explains mistakes
    - The user must be able to view performance metrics
    - The system must have a learner-specific dashboard
    - The system must offer the user hints
    - The system must offer scaffolded lessons
    - The system must offer the user a graded self-assessment test in order to continue to the next learning module
    - The system must allow students to test their knowledge with non-graded assessments
    - The system must provide the user with visual code snippets
    - The system must allow the user to ask follow-up questions in the interface
    - The system must adapt practice problems to individual students' performance history
    - The system must allow teachers to add new questions to different topics
    - The system must allow teachers to view aggregated performance metrics across classes
    - The system must provide multiple choice questions
    - The system must provide True/False questions
    - The system must provide coding exercises
    - The system must provide short-answer questions
    - The system must provide long-answer questions
    - The system must provide fill-in-the-blank questions
    - The system must provide click-and-match questions
    - The system must allow teachers to monitor student struggles on specific skills
    - The system must adapt question difficulty based on learner performance
    - The system must provide analytics for teachers to identify weak topics
    - The system must allow teachers to see if questions are too difficult based on class performance
    - The system must group related skills together for easier understanding
    - The system must provide metrics by question type (MCQ, T/F, coding, etc.)
    - The system must adapt to special needs students' learning pace
    - The system must highlight students at risk of failure for teacher review
    - The system must provide differentiated content for different student profiles (beginner, intermediate, advanced, etc.)
    - The system must allow teachers to assign topics to classes
    - The system must allow students to view challenges that grow in compelxity
    - The system must allow users to learn Python concepts in order
    - The system must allow parents to access reports of their child's progress
    - The system must offer question banks curated by teachers
    - The system must be able to authenticate users with login/logout capabilities
    - The system must be able to allow users to reset passwords
    - The system must be able to create new records
    - The system must be able to read existing records
    - The system must be able to update records
    - The system must be able to delete records
    - The system must be able to undo a delete action
    - The system must be able to search by keyword
    - The system must be able to filter by category
    - The system must be able to validate input
    - The system must be able to show error messages
    - The system must be able to confirm successful user actions
    - The system must be able to export data in CSV format
    - The system must be able to provide an onboarding tutorial
    - The system must be able to provide an FAQ page

    Should:
    - The system should follow up on lessons
    - The system should have a discussion board
    - The system should offer the user progress reports for each learning module
    - The system should offer a teacher-specific dashboard
    - The user should be able to skip already-mastered topics
    - The user should be able to switch topics at will
    - The system should flag students who are performing statistically below average so that teachers can intervene
    - The system should allow students to pair up with another student for collaborative learning
    - The system should be able to perform advanced searches with multiple filters
    - The system should be able to export data in Excel format
    - The system should be able to bulk upload files
    - The system should be able to bulk update records
    - The system should be able to bulk delete records
    - The system should be able to tag content wiht custom labels
    - The system should be able to send notifications in-app
    - The system should be able to schedule recurring tasks
    - The system should be able to allow dashboard customization
    - The system should be able to allow profile picture upload
    - The system should be able to provide activity logs with export
    - The system should be able to provide enhanced reports with graphs
    - The system should allow students to visually view their skill improvements via graphs
    - The system should allow students to visually view their skill improvements via charts

    Could:
    - The system could have Python integration
    - The system could provide adaptive challenges that adjust in difficulty dynamically
    - The system could support parent/guardian acces to progress reports
    - The system could allow peer discussion/Q&A features beyond the discussion board (chat, mentoring, etc.)
    - The system could provide social sharing links
    - The system could allow commenting on records
    - The system could allow linking content
    - The system could allow disliking content
    - The system could recommend content
    - The system could allow drag-and-drop file uploads
    - The system could suggest tags automatically for content
    - The system could provide a chatbot for FAQs
    - The system could integrate with calendars
    - The system could be able to export reports to PDF
    - The system could allow custom user roles
    - The system could allow admins to compare results across multiple schools

    Won't:
    - The system will not have deadlines for user-learning
    - The system will not have reminders for user-learning
    - The system will not include advanced social networking beyond learning support
    - The system won't be able to provide native mobile apps at launch
    - The system won't be able to provide IoT smart device integration
    - The system won't be able to support built-in video conferencing
    - The system won't support multiple chat modes (assignment mode, concept mode, problem mode)
    - The system won't be able to support learner vs. learner gamification

Non-functional:

    Must:
    - The system must quickly return feedback to the user
    - The system must provide password protection via SQL injection
    - The system must provide 24/7 service
    - The system must offer visual groupings of learning modules
    - The system must protect the user's data privacy/security
    - The system must scale to handle large numbers of simultaneous users
    - The system must be able to provide a responsive layout across devices
    - The system must be able to store passwords securely
    - The system must be bale to automatically logout after inactivity
    - The system must be able to backup data at least once, daily
    - The system must be able to provide secure HTTPS encryption
    - The system must be able to handle at least 50 concurrent users
    - The system must be able to maintain consistent UI style across all screens

    Should:
    - The system should provide visually-impaired users with voice-interaction
    - The system should provide UI that works smoothly across devices
    - The system should maintain at least 99% uptime for availability
    - The system should comply with accessibility standards for special-needs students
    - The system should be able to support multiple role-based permissions (Ex: student, teacher, admin, moderator, etc.)
    - The system should be able to handle 500 concurrent users
    - The system should be able to provide API endpoints for integrations
    - The system should be able to display contextual help tooltips
    - The system should be able to provide search suggestions
    - The system should be able to provide autocomplete


    Could:
    - The system could include gamification
    - The system could offer the user with lifelong learning support
    - The system could integrate with existing LMS for institutional use
    - The system could provide offline access for students in areas with unstable internet
    - The system could offer light/dark themes
    - The system could provide offline access to last-viewed data
    - The system could send push notifications on mobile
    - The system could sync data across devices in real-time

    Won't:
    - The system will not require to run smoothly on lower-end hardware
    - The system will not require deployment in underserved areas
    - The system will not provide multi-language support
    - The system won't be able to provide blockchain-based features
    - The system won't be able to provide AI-powered predictive analytics
    - The system won't be able to scale millions of users in the first release
    - The system won't be able to provide VR features
    - The system won't be able to provide AR features
