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

  let totalScore = 0;
  let totalPoints = 0;

  for (let i = 0; i < learnerData.submissions.length; i++) {
    let student = learnerData.submissions[i];
    let score = student.score;
    let maxPoints = student.maxPoints;
    totalScore += score;
    totalPoints += maxPoints;
  }
  try {
    if (totalPoints === 0) {
      throw new Error("Division by zero");
    }

    const avg = totalScore / totalPoints;
    const finalGrade = (avg * 100).toFixed(2) + " %";

    return {
      avg: avg,
      finalGrade: finalGrade
    };
  } catch (error) {
    console.log(error);

    return {
      avg: "inc", // Show "inc" to users if there are any calculation errors on the instructor's end
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
    id: ID, //add learner ID  125,132
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
  // Calculates total points possiblr to get in an assignment
  for (let i = 0; i < ag.assignments.length; i++) {
    assignmentMaxPoints[ag.assignments[i].id] = ag.assignments[i].points_possible;
  }
  let learners = [];

  // Iterate over submissions
  for (let i = 0; i < submissions.length; i++) {
    let student = submissions[i];
    let ID = student.learner_id;
    let assignmentID = student.assignment_id;
    let score = student.submission.score;
    let submitTime = student.submission.submitted_at;
    let tasks = ag.assignments.find(a => a.id === assignmentID);
    let status = Deadline(submitTime, tasks);
    let percent = 15;

    // Check if a student is late; if so, deduct points
    if (status === "Late") {
      score -= percent;
      console.log(` Learner ID ${ID}: Assignment ID: ${assignmentID}, 10% deduction from grade` );
    }
    // Skip over score of 400 using a continue statement
    if (score === 400) {
      continue;
    }
    let learner = Learner(learners, ID);
    let maxPoints = assignmentMaxPoints[assignmentID];
    let SubmitAvg = (score / maxPoints) //This will do calculations like (140-15)/150 

    // Push learner submissions into array
    learner.submissions.push({
      assignmentID: assignmentID,
      submitTime: submitTime,
      status: status,
      score: score,
      maxPoints: maxPoints,
      SubmitAvg: SubmitAvg
    });
  }

  // Showcase output from learners array
  learners.forEach(learner => {
    let grades = calculateGrades(learner); // Invoke from grades function
    console.log(`Learner ID: ${learner.id}, Avg: ${grades.avg}, Final Grade: ${grades.finalGrade}`);

    learner.submissions.forEach(Data => {
      console.log(`Assignment ID: ${Data.assignmentID}, Avg: ${Data.SubmitAvg}, Submitted At: ${Data.submitTime}, Status: ${Data.status}, Grade: ${Data.score} %`);
    });

    console.log("       "); // Spacing between outputs to make it more organized
  });
  return learners;
}

getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
