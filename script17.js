var questions = getStoredQuestions() || [
  {
    question: "What is the capital of France?",
    answer: "Paris",
    consecutiveCorrect: 0,
    skipCount: 3
  },
  {
    question: "What is the largest planet in our solar system?",
    answer: "Jupiter",
    consecutiveCorrect: 0,
    skipCount: 3
  },
  {
    question: "Who painted the Mona Lisa?",
    answer: "Leonardo da Vinci",
    consecutiveCorrect: 0,
    skipCount: 3
  }
];

var currentQuestion = 1;
var correctAnswers = 0;
var userAnswers = [];
var deletedQuestion = null;
var attempts = 0;
var quizStarted = true;

function displayQuestion() {
  var questionElement = document.getElementById("question");
  questionElement.textContent = (currentQuestion + 1) + ". " + questions[currentQuestion].question;
  document.getElementById("answer").value = ""; // Clear the answer box
}

function checkAnswer() {
    var userAnswer = document.getElementById("answer").value;
    var resultElement = document.getElementById("result");
  
    if (userAnswer.toLowerCase() === questions[currentQuestion].answer.toLowerCase()) {
      resultElement.textContent = "Correct!";
      resultElement.className = "result correct";
      questions[currentQuestion].consecutiveCorrect++;
      correctAnswers++;
      userAnswers.push({ question: questions[currentQuestion].question, answer: userAnswer, result: "correct", date: new Date() });
  
      // Check if the current question should be skipped
      if (questions[currentQuestion].consecutiveCorrect >= 3) {
        var skipCount = Math.pow(3, questions[currentQuestion].consecutiveCorrect);
        currentQuestion += skipCount;
      }
    } else {
      resultElement.textContent = "Incorrect!";
      resultElement.className = "result incorrect";
      questions[currentQuestion].consecutiveCorrect = 0;
      userAnswers.push({ question: questions[currentQuestion].question, answer: userAnswer, result: "incorrect", date: new Date() });
    }
  
    // Move to the next question or end the quiz
    currentQuestion++;
    if (currentQuestion < questions.length) {
      displayQuestion();
    } else {
      var percentage = (correctAnswers / questions.length) * 100;
      resultElement.innerHTML = "<span class='final-result'>Quiz finished! You scored " + percentage.toFixed(2) + "%</span>";
      resultElement.className = "result final-result";
      document.getElementById("answer").disabled = true;
    }
  }

function startQuiz() {
  quizStarted = true;
  attempts = 1;
  displayQuestion();
  document.getElementById("answer").disabled = false;
  document.getElementById("result").textContent = "";

  // Remove welcome message if it exists
  var welcomeMessage = document.querySelector(".welcome-message");
  if (welcomeMessage) {
    welcomeMessage.parentNode.removeChild(welcomeMessage);
  }
}

function challengeAgain() {
    currentQuestion = currentQuestion + 1;
    correctAnswers = 0;
    userAnswers = [];
  
    questions.forEach(function (question) {
      question.consecutiveCorrect = 0; // Reset consecutive correct count
    });
  
    displayQuestion();
    document.getElementById("answer").disabled = false;
    document.getElementById("result").textContent = "";
    document.getElementById("result").className = "result";
  
    // Show welcome message
    var welcomeMessage = document.createElement("div");
    welcomeMessage.textContent = "Let's start the quiz!";
    welcomeMessage.className = "welcome-message";
    document.body.insertBefore(welcomeMessage, document.getElementById("question"));
  }



function addQuestion() {
  var newQuestion = document.getElementById("newQuestion").value;
  var newAnswer = document.getElementById("newAnswer").value;
  
  if (newQuestion && newAnswer) {
    var newQuizItem = {
      question: newQuestion,
      answer: newAnswer
    };
    
    questions.push(newQuizItem);
    console.log("Question added:", newQuizItem);
    storeQuestions();
    clearInputFields();
  } else {
    console.log("Please enter both question and answer.");
  }
}

function deleteQuestion() {
  var deleteQuestionNumber = this.getAttribute("data-question-number");
  if (deleteQuestionNumber !== "") {
    var questionIndex = parseInt(deleteQuestionNumber) - 1;
    if (questionIndex >= 0 && questionIndex < questions.length) {
      deletedQuestion = questions.splice(questionIndex, 1)[0];
      console.log("Question deleted:", questionIndex + 1);
      storeQuestions();
    } else {
      console.log("Invalid question number.");
    }
  }
  showDeleteQuestionList();
}

function undoDelete() {
  if (deletedQuestion) {
    questions.push(deletedQuestion);
    deletedQuestion = null;
    storeQuestions();
    showDeleteQuestionList();
  }
}

function clearInputFields() {
  document.getElementById("newQuestion").value = "";
  document.getElementById("newAnswer").value = "";
}

function showAnswerList() {
  var answerList = document.getElementById("answerList");
  answerList.innerHTML = "<h3>All Answers:</h3>";

  for (var i = 0; i < userAnswers.length; i++) {
    var question = userAnswers[i].question;
    var answer = userAnswers[i].answer;
    var result = userAnswers[i].result;
    var date = userAnswers[i].date;
    var correctAnswer = getCorrectAnswer(question);
    var listItem = document.createElement("div");
    listItem.innerHTML = "<strong>Question " + (i + 1) + ":</strong> " + question + "<br><strong>Your Answer:</strong> " + answer + "<br><strong>Correct Answer:</strong> " + correctAnswer + "<br><strong>Result:</strong> " + result + " | Date: " + date.toLocaleString() + "<br><br>";
    answerList.appendChild(listItem);
  }
}

function getCorrectAnswer(question) {
  for (var i = 0; i < questions.length; i++) {
    if (questions[i].question === question) {
      return questions[i].answer;
    }
  }
  return "N/A";
}

function challengeAgain() {
  currentQuestion = 0;
  correctAnswers = 0;
  userAnswers = [];
  displayQuestion();
  document.getElementById("answer").disabled = false;
  document.getElementById("result").textContent = "";
  document.getElementById("result").className = "result";
}

function getStoredQuestions() {
  var storedQuestions = localStorage.getItem("questions");
  return JSON.parse(storedQuestions);
}

function storeQuestions() {
  localStorage.setItem("questions", JSON.stringify(questions));
}

function showDeleteQuestionList() {
  var deleteQuestionList = document.getElementById("deleteQuestionList");
  deleteQuestionList.innerHTML = "<h3>Delete Question:</h3>";
  var listElement = document.createElement("ul");
  listElement.id = "questionList";

  for (var i = 0; i < questions.length; i++) {
    var listItem = document.createElement("li");
    var radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.name = "questionRadio";
    radioButton.value = i + 1;
    radioButton.setAttribute("data-question-number", i + 1);
    radioButton.addEventListener("click", function() {
      var deleteButton = document.getElementById("deleteButton");
      deleteButton.setAttribute("data-question-number", this.getAttribute("data-question-number"));
    });
    listItem.appendChild(radioButton);
    listItem.appendChild(document.createTextNode((i + 1) + ". " + questions[i].question));
    listElement.appendChild(listItem);
  }

  var deleteButton = document.createElement("button");
  deleteButton.id = "deleteButton";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", deleteQuestion);
  deleteButton.setAttribute("data-question-number", "");
  deleteQuestionList.appendChild(listElement);
  deleteQuestionList.appendChild(deleteButton);
}

// Start the quiz
displayQuestion();
