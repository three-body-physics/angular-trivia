import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

import { TriviaApiService } from './../services/trivia-api.service';
import { AnswersService } from './../services/answers.service';
import { RecordService } from './../services/record.service';

@Component({
  selector: 'app-gamescreen',
  templateUrl: './gamescreen.component.html',
  styleUrls: ['./gamescreen.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [TriviaApiService, AnswersService, RecordService]
})

export class GamescreenComponent implements OnInit {

	formats: string[] = ["Time trial", "Marathon"];
	formatName: string;
	selectedFormat: number;
	categories: object[];
	categoryName: string;
  allAnswers: string[];
  gameStarted: boolean = false;
	
	quizes: object[];
	activeQuiz: any;
	quizNumber: number = 0;
	options: any = {};
	gamestage: number = 0;	
	difficulties: string[] = ["easy", "medium", "hard"];
	gameReady: boolean = false;	
	resetOptions: boolean = false;
  correctMessage: string;
  gameover: boolean = false;



  constructor(private trivia: TriviaApiService, private answerServ: AnswersService, private records: RecordService) { }

  ngOnInit() {

  	this.trivia.getCategories().subscribe(data => {
  		
  		this.categories = data.trivia_categories;
  		

  	})
  }

  changeMode(dif: any) {
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
  		this.options.mode = "multiple";
  		this.checkToken();
  
  	}   	

  	this.gamestage++;
  	console.log(this.gamestage);
  }

  checkToken(): void {
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

  getAmount(): number {

  	if (this.selectedFormat === 1) {
  		return 10;
  	} else {
  		return 50;
  	}

  }

  startGame() {

  	this.trivia.getQuizes(this.options).subscribe(data =>{

        console.log(this.quizes);

  			this.checkQuizAmount(data);
  		});

  }

  nextQuestion() {

    if(!this.gameover) {

  	this.activeQuiz = this.quizes[0];
    this.getAnswers();
  	this.quizes.splice(0, 1);
  	this.quizNumber++;
  	console.log(this.quizes.length);
  	this.trackRemainingQuiz();

  } else {
    console.log("game over!");
  }

  }

  checkQuizAmount(num: any) {

  	if (num.response_code !== 0) {

  		this.resetOptions = true;
  		console.log(num);

  	} else {

  		this.resetOptions = false;

      if (!this.gameStarted) {
        console.log("setting");
        this.quizes = num.results;
        this.gameStarted = !this.gameStarted;

      } 

  		console.log(num);

  		if (this.gamestage < 4) {
  		this.gamestage++;
  		}

  		this.nextQuestion();
  	}

  }

  appendMoreQuizes(num: any) { 

    if (num.response_code !== 0) {

      this.gameover = true;
      console.log(num);

    } else {
      this.resetOptions = false;     
      console.log("mapping");
      num.results.map(result =>{
        this.quizes.push(result);
      });

      
    }

  }

  resetGame() {
  	this.gamestage = 0;
  	this.quizNumber = 0;
  	this.resetOptions = false;
  	this.formatName = "";
  	this.categoryName = "";
  	this.options.difficulty = "";
  }

  trackRemainingQuiz() {

  	if (this.quizes.length == 0) {

  		  	this.trivia.getQuizes(this.options).subscribe(data =>{

  			this.appendMoreQuizes(data);
  		});
  	}

  }

  getAnswers(): void {
     this.allAnswers = this.answerServ.getCompoundAnswers(this.activeQuiz.incorrect_answers, this.activeQuiz.correct_answer);
  }

  checkAnswer(answer:string): void {
    this.correctMessage = this.answerServ.checkAnswer(answer, this.nextQuestion.bind(this));
  }

  resetToken() {
    localStorage.removeItem("apiToken");
  }

}
