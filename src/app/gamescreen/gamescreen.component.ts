import { Component, OnInit, ViewChildren } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

import { TriviaApiService } from './../services/trivia-api.service';
import { AnswersService } from './../services/answers.service';
import { RecordService } from './../services/record.service';
import { AnswerButtonComponent } from './../answer-button/answer-button.component';


@Component({
  selector: 'app-gamescreen',
  templateUrl: './gamescreen.component.html',
  styleUrls: ['./gamescreen.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [TriviaApiService, AnswersService, RecordService],
  
})

export class GamescreenComponent implements OnInit {

	formats: string[] = ["Time trial", "Marathon"];
	formatName: string;
	selectedFormat: number;
	categories: object[];
	categoryName: string;
  allAnswers: string[];
  gameStarted: boolean = false;
  activeQuestion: string;
	
	quizes: object[];
	activeQuiz: any;
	quizNumber: number = 0;
	options: any = {};
	gamestage: number = 0;	
	difficulties: string[] = ["easy", "medium", "hard"];
	gameReady: boolean = false;	
	resetOptions: boolean = false;
  correctMessage: string;
  correctAnswer: string;
  gameover: boolean = false;
  answered: boolean = false;

  correctCount: number = 0;
  incorrectCount: number = 0;

  answerComponents: AnswerButtonComponent[];
  

  @ViewChildren("answernode") answernode;


  constructor(private trivia: TriviaApiService, private answerServ: AnswersService, private records: RecordService) { }

  ngOnInit() {    

  	this.trivia.getCategories().subscribe(data => {
  		
  		this.categories = data.trivia_categories.slice(0, 9);
  		

  	})
  }



  changeMode(dif: any) { //extract option data from option elements and compose option object

  	if (typeof dif === "object" && this.gamestage === 0){
  		
  		this.options.category = dif.id;
  		this.categoryName = dif.name;


  	} else if (typeof dif === "string" && this.gamestage === 1) {

  		switch(dif) {
  			case "Time trial": {
  				this.selectedFormat = 0;
  				this.formatName = this.formats[this.selectedFormat];
  				break;
  			}
  			case "Marathon": {
  				this.selectedFormat = 1;
  				this.formatName = this.formats[this.selectedFormat];
  				break;
  			}
  		}

  	} else if (typeof dif === "string" && this.gamestage === 2) {
  		this.options.difficulty = dif;
  		this.options.amount = this.getAmount();
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

  getAmount(): number { //might change this method

  	if (this.selectedFormat === 1) {
  		return 15;
  	} else {
  		return 15;
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

  }

  }

  addAnswerTally(answer: string) {

    (this.correctAnswer === answer) ? this.correctCount++ : this.incorrectCount++;

    
  }

  checkQuizAmount(num: any) { //calls after start game

  	if (num.response_code !== 0) {

  		this.resetOptions = true;
  		

  	} else {

  		this.resetOptions = false;

      if (!this.gameStarted) {
        
        this.quizes = num.results;
        this.gameStarted = !this.gameStarted;

      } 

  		if (this.gamestage < 4) {
  		this.gamestage++;
  		}

  		this.nextQuestion();
  	}

  }

  // appendMoreQuizes(num: any) { 

  //   if (num.response_code !== 0) {

  //     this.gameover = true;
      

  //   } else {

  //     this.resetOptions = false;     
      
  //     num.results.map(result =>{
  //       this.quizes.push(result);
  //     });

      
  //   }

  // }

  resetGame() {
  	this.gamestage = 0;
  	this.quizNumber = 0;
  	this.resetOptions = false;
  	this.formatName = "";
  	this.categoryName = "";
  	this.options.difficulty = "";
    this.gameover = false;
    this.gameStarted = false;
    this.allAnswers = [];

  }

  trackRemainingQuiz() {

  	if (this.quizes.length  == 0) {

  		//   	this.trivia.getQuizes(this.options).subscribe(data =>{

  		// 	this.appendMoreQuizes(data);

  		// });

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
      }), 1500);

    this.correctMessage = this.answerServ.checkAnswer(answer, this.nextQuestion.bind(this), event.target, this.answerComponents);
    } else {

      return;

    }

    }
  }

  resetToken() {
    localStorage.removeItem("apiToken");
  }

}
