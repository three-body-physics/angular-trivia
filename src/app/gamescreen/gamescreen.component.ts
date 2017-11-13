import { Component, OnInit, ViewChildren } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

import { TriviaApiService } from './../services/trivia-api.service';
import { AnswersService } from './../services/answers.service';
import { RecordService } from './../services/record.service';
import { AnswerButtonComponent } from './../answer-button/answer-button.component';
import { categories } from './../services/categories';

@Component({
  selector: 'app-gamescreen',
  templateUrl: './gamescreen.component.html',
  styleUrls: ['./gamescreen.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [TriviaApiService, AnswersService, RecordService],
  
})

export class GamescreenComponent implements OnInit {

  // gameoptions
	
	categories: object[];
	categoryName: string;
  activeDifficulty: string;
	options: any = {};
	difficulties: string[] = ["easy", "medium", "hard"];

   // gamestate
  gameReady: boolean = false;  
  gameover: boolean = false;
  answered: boolean = false;
  resetOptions: boolean = false;
  correctMessage: string;
  gamestage: number = 0;  
  gameStarted: boolean = false;

  // quiz variables  
  quizes: object[];    
  activeQuiz: any;
  activeQuestion: string;
  allAnswers: string[];
  correctAnswer: string;
  quizNumber: number = 0;
  correctCount: number = 0;
  incorrectCount: number = 0;
  

  answerComponents: AnswerButtonComponent[];
  

  @ViewChildren("answernode") answernode;


  constructor(private trivia: TriviaApiService, private answerServ: AnswersService, private records: RecordService) { }

  ngOnInit() {    

  	this.categories = categories;
  	
  }

  changeMode(value: any) { //extract data from selection screen and compose option object

  	if (typeof value === "object" && this.gamestage === 0){
  		
  		this.options.category = value.id;
  		this.categoryName = value.name;


  	} else if (typeof value === "string" && this.gamestage === 1) {

      this.activeDifficulty = value;
  		this.options.difficulty = value;
  		this.options.amount = 15;
  		this.options.mode = "any"; 
  		this.checkToken();
  
  	}   	

  	this.gamestage++;
  	
  }

  checkToken(): void { //extract unique token from API that prevents repeated json data

  		const token = localStorage.getItem("apiToken");

  		if (token === null) {

  		  this.trivia.getToken().subscribe(res => {
  	    localStorage.setItem("apiToken", res.token);
  		  this.options.token = res.token;  		  
  		  this.gameReady = true;
  	    });

  		} else {

  			this.options.token = token;
  			this.gameReady = true;
  			
  		}
  }


  startGame() {

  	this.trivia.getQuizes(this.options).subscribe(data =>{

  			this.checkQuizAmount(data);

  		});

  }

  nextQuestion() { 

    this.trackRemainingQuiz();  

    if(this.quizes.length !== 0) {

  	this.activeQuiz = this.quizes[0];

    this.activeQuestion = this.answerServ.cleanUP(this.activeQuiz.question);
    this.correctAnswer = this.answerServ.cleanUP(this.activeQuiz.correct_answer);

    this.getAnswers();
  	this.quizes.splice(0, 1);
  	this.quizNumber++;  	 	  


  } else {

    console.log("game over!"); //game over when quiz runs out
    this.gamestage = 4;

  }

  }

  addAnswerTally(answer: string) {

    if (!this.gameover) {

    (this.correctAnswer === answer) ? this.correctCount++ : this.incorrectCount++;

    }
  }

  checkQuizAmount(data: any) { 

  	if (data.response_code !== 0) {

  		this.resetOptions = true;
  		

  	} else {

  		this.resetOptions = false;

      if (!this.gameStarted) {
        
        this.quizes = data.results;
        this.gameStarted = !this.gameStarted;

      } 

  		if (this.gamestage < 3) {
  		this.gamestage++;

  		}

  		this.nextQuestion();
  	}

  }


  resetGame() {
  	this.gamestage = 0;
  	this.quizNumber = 0;
  	this.resetOptions = false;  	
  	this.categoryName = "";
  	this.options.difficulty = "";
    this.gameover = false;
    this.gameStarted = false;
    this.allAnswers = [];
    this.correctCount = this.incorrectCount = 0;
    this.activeDifficulty = "";

  }

  trackRemainingQuiz() {

  	if (this.quizes.length  == 0) {

      this.gameover = true;

  	}

  }

  getAnswers(): void {

     this.allAnswers = this.answerServ.getCompoundAnswers(this.activeQuiz.incorrect_answers, this.activeQuiz.correct_answer);
     this.answernode.changes.subscribe(c => { this.answerComponents = c.toArray() }); //return updated Child components with answers embedded
  }

  checkAnswer(answer:string, event): void {

    if (!this.gameover)  {

    if (this.answered === false) {

      this.answered = true;      

      setTimeout((() => {
        this.answered = false;
      }), 1000);

    this.correctMessage = this.answerServ.checkAnswer(answer, this.nextQuestion.bind(this), event.target, this.answerComponents);
    } else {

      return;

    }

    }
  }

  resetToken() {
    this.trivia.resetToken();
  }

}
