// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    },
    {
      id: 46,
      name: "Code the World",
      due_at: "2023-11-15",
      points_possible: 0 // Division by 0 test case
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  },
  {
    learner_id: 162,
    assignment_id: 46,
    submission: {
      submitted_at: "",
      score: 0
    }
  },
];

function calculateGrades(learnerData) {
  try {
    // Check for division by zero case
    if (learnerData.totalPoints === 0) {
      throw new Error("Division by zero");
    }
    const avg = learnerData.totalScore / learnerData.totalPoints;
    const finalGrade = (avg * 100).toFixed(2) + " %";
    return {
      avg: avg,
      finalGrade: finalGrade
    };
  } catch (error) {
    console.log( error);
    return {
      avg: "inc", // Show Inc to users, if there is any calculation errors on instructors end 
      finalGrade: "inc"
    };
  }
}

function Deadline(submitDate, tasks) {
  if (new Date(submitDate) > new Date(tasks.due_at)) {
    return "Late";
  } else {
    return "On time";
  }
}

function Learner(learners, ID) {
  // Add learners to class
  for (let i = 0; i < learners.length; i++) {
    if (learners[i].id === ID) {
      return learners[i]; 
    }
  }
  let newLearner = {
    id: ID,
    totalScore: 0,
    totalPoints: 0,
    submissions: []
  };
  learners.push(newLearner);
  return newLearner;
}

function getLearnerData(course, ag, submissions) {
  // Check if courses match
  if (course.id !== ag.course_id) {
    console.log("Error: Select a course that exists");
    return;
  }

  let assignmentMaxPoints = {};
  // Total points to get in an assignment
  for (let i = 0; i < ag.assignments.length; i++) {
    assignmentMaxPoints[ag.assignments[i].id] = ag.assignments[i].points_possible;
  }
  let learners = [];

  // Iterate over submissions
  for (let i = 0; i < submissions.length; i++) {
    let submission = submissions[i];
    let ID = submission.learner_id;
    let assignmentID = submission.assignment_id;
    let score = submission.submission.score;
    let submitTime = submission.submission.submitted_at;
    let tasks = ag.assignments.find(a => a.id === assignmentID); //stackoverflow for this 
    let status = Deadline(submitTime, tasks);
    let percent = 15;

    if(status === "Late"){
      score -= percent;
      console.log(` Learner ID ${ID}:, Assignment ID: ${assignmentID}, 10 pts lost`)
    }
    let learner = Learner(learners, ID);
  
    //skip over 400
    if(status === 400){
      continue;
    }
    let SubmitAvg = (score / assignmentMaxPoints[assignmentID]).toFixed(2); //Calculations will be like  125/150 b/c of 10 % deduct
    learner.totalScore += score;
    learner.totalPoints += assignmentMaxPoints[assignmentID];

    //Push learner submissions in array 
    learner.submissions.push({
      assignmentID: assignmentID,
      submitTime: submitTime,
      status: status,
      score: score,
      SubmitAvg: SubmitAvg
    });
  }
   //Showcase Output from Learners Arrays
   learners.forEach(learner => {
    let grades = calculateGrades(learner);
    console.log(`Learner ID: ${learner.id}, Avg: ${grades.avg}, Final Grade: ${grades.finalGrade}`);

    learner.submissions.forEach(submission => {
      console.log(`  Assignment ID: ${submission.assignmentID}, Avg: ${submission.SubmitAvg}, Submitted At: ${submission.submitTime}, Status: ${submission.status}, Grade: ${submission.score} %`);
    });

    console.log(" "); // Spacing between output
  });

  return learners;
}
getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

  