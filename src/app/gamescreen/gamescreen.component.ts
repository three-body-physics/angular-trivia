import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

import { TriviaApiService } from './../services/trivia-api.service';
import { Options } from './../types/option';
import { AnswersService } from './../services/answers.service';

@Component({
  selector: 'app-gamescreen',
  templateUrl: './gamescreen.component.html',
  styleUrls: ['./gamescreen.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [TriviaApiService, AnswersService]
})

export class GamescreenComponent implements OnInit {

	formats: string[] = ["Time trial", "Marathon"];
	formatName: string;
	selectedFormat: number;
	categories: object[];
	categoryName: string;
  allAnswers: string[];
	
	quizes: object[];
	activeQuiz: any;
	quizNumber: number = 0;
	options: any = {};
	gamestage: number = 0;	
	difficulties: string[] = ["easy", "medium", "hard"];
	gameReady: boolean = false;	
	resetOptions: boolean = false;
  correctMessage: string;


  constructor(private trivia: TriviaApiService, private answerServ: AnswersService) { }

  ngOnInit() {

  	this.trivia.getCategories().subscribe(data => {
  		
  		this.categories = data.trivia_categories.slice(0, 15);
  		

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
  		console.log(this.options);
  		this.gameReady = true;
  	});
  		} else {
  			this.options.token = token;
  			this.gameReady = true;
  			console.log(this.options);
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

  			this.checkQuizAmount(data);
  		});

  }

  nextQuestion() {

  	this.activeQuiz = this.quizes[0];
    this.getAnswers();
  	this.quizes.splice(0, 1);
  	this.quizNumber++;
  	console.log(this.quizes.length);
  	this.trackRemainingQuiz();

  }

  checkQuizAmount(num: any) {

  	if (num.response_code !== 0) {

  		this.resetOptions = true;
  		console.log(num);

  	} else {

  		this.resetOptions = false;
  		this.quizes = num.results;
  		console.log(num);

  		if (this.gamestage < 4) {
  		this.gamestage++;
  		}

  		this.nextQuestion();
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

  	if (this.quizes.length <= 0) {

  		  	this.trivia.getQuizes(this.options).subscribe(data =>{

  			this.checkQuizAmount(data);
  		});
  	}

  }

  getAnswers(): void {
     this.allAnswers = this.answerServ.getCompoundAnswers(this.activeQuiz.incorrect_answers, this.activeQuiz.correct_answer);
  }

  checkAnswer(answer:string): void {
    this.correctMessage = this.answerServ.checkAnswer(answer, this.nextQuestion.bind(this));
  }

}
